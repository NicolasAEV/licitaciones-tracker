import * as cheerio from "cheerio";
import { createHash } from "crypto";
import https from "https";
import { URL } from "url";

const BASE_URL = "https://www.mercadopublico.cl";
const DETAIL_URL = `${BASE_URL}/Procurement/Modules/RFB/DetailsAcquisition.aspx`;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const REQUEST_DELAY_MS = 2000; // 2 seconds delay between requests

// Request counter for debugging
let requestCounter = 0;

// Helper to add delay between requests
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export interface ScrapedDocument {
  fileName: string;
  fileType: string;
  description: string;
  fileSize: number;
  uploadDate: string | null;
  sourceUrl: string;
  rowIndex: number;
}

interface AttachmentPageData {
  documents: ScrapedDocument[];
  viewState: string;
  eventValidation: string;
  pageUrl: string;
}

// --- Helpers ---

function parseFileSize(sizeStr: string): number {
  const match = sizeStr.trim().match(/([\d.,]+)\s*(kb|mb|gb|b)/i);
  if (!match) return 0;
  const value = parseFloat(match[1].replace(",", "."));
  const unit = match[2].toLowerCase();
  if (unit === "gb") return Math.round(value * 1024 * 1024 * 1024);
  if (unit === "mb") return Math.round(value * 1024 * 1024);
  if (unit === "kb") return Math.round(value * 1024);
  return Math.round(value);
}

function guessMimeType(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  const mimeMap: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    zip: "application/zip",
    rar: "application/x-rar-compressed",
    "7z": "application/x-7z-compressed",
    txt: "text/plain",
    csv: "text/csv",
    kmz: "application/vnd.google-earth.kmz",
    dwg: "application/acad",
  };
  return mimeMap[ext] ?? "application/octet-stream";
}

async function fetchPageWithResponse(url: string, cookies?: string): Promise<{ text: string; headers: Map<string, string> }> {
  const headers: Record<string, string> = {
    "User-Agent": USER_AGENT,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "es-CL,es;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Cache-Control": "max-age=0",
  };
  if (cookies) {
    headers.Cookie = cookies;
  }

  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers,
      timeout: 30000,
    };

    requestCounter++;
    console.log(`\n🌐 REQUEST ${requestCounter} (GET)`);
    console.log(`   URL: ${url}`);
    if (cookies) {
      console.log(`   Cookies: ${cookies.substring(0, 50)}...`);
    }

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
          const responseHeaders = new Map<string, string>();
          Object.entries(res.headers).forEach(([key, value]) => {
            if (value) {
              responseHeaders.set(key, Array.isArray(value) ? value.join(', ') : value);
            }
          });
          resolve({ text: data, headers: responseHeaders });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        }
      });
    });

    req.on('error', (error) => {
      const errorMsg = error.message;
      console.error(`[Scraper] Failed to fetch ${url}:`, errorMsg);
      
      // Provide more helpful error messages
      if (errorMsg.includes("ECONNREFUSED")) {
        reject(new Error("No se pudo conectar con Mercado Público. Verifica tu conexión a internet y que el servidor pueda acceder a www.mercadopublico.cl"));
      } else if (errorMsg.includes("ETIMEDOUT") || errorMsg.includes("timeout")) {
        reject(new Error("Tiempo de espera agotado al conectar con Mercado Público. Intenta nuevamente."));
      } else if (errorMsg.includes("certificate") || errorMsg.includes("SSL")) {
        reject(new Error("Error de certificado SSL al conectar con Mercado Público. Esto puede deberse a configuraciones de red o firewall."));
      } else {
        reject(new Error(`Error al obtener la página: ${errorMsg}`));
      }
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error("Tiempo de espera agotado al conectar con Mercado Público. Intenta nuevamente."));
    });

    req.end();
  });
}

async function fetchPage(url: string, cookies?: string): Promise<string> {
  const res = await fetchPageWithResponse(url, cookies);
  return res.text;
}

function extractCookies(headers: Map<string, string>): string {
  const setCookie = headers.get('set-cookie');
  if (!setCookie) return '';
  
  // Parse multiple set-cookie headers
  const cookies = setCookie.split(',').map(c => c.trim().split(';')[0]);
  return cookies.join('; ');
}

// --- Main functions ---

/**
 * Step 1: Get the ViewAttachment URL from the tender detail page
 * Returns both the URL and cookies from the response
 */
async function getAttachmentUrl(tenderCode: string): Promise<{ url: string; cookies: string } | null> {
  try {
    const detailUrl = `${DETAIL_URL}?idlicitacion=${encodeURIComponent(tenderCode)}`;
    console.log(`[Scraper] Fetching tender detail page: ${detailUrl}`);
    
    const response = await fetchPageWithResponse(detailUrl);
    const cookies = extractCookies(response.headers);
    const html = response.text;
    const $ = cheerio.load(html);

    // Helper to resolve relative URLs
    const resolveUrl = (href: string): string => {
      if (href.startsWith("http://") || href.startsWith("https://")) {
        return href;
      }
      
      // Handle relative paths like "../Attachment/..."
      if (href.startsWith("../")) {
        // Remove the "../" and construct from base
        const cleanPath = href.replace(/^\.\.\//, "");
        return `${BASE_URL}/${cleanPath}`;
      }
      
      // Handle absolute paths like "/Attachment/..."
      if (href.startsWith("/")) {
        return `${BASE_URL}${href}`;
      }
      
      // Handle relative paths without leading slash
      return `${BASE_URL}/${href}`;
    };

    // Debug: Save HTML snippet to see what we're getting
    console.log(`[Scraper] DEBUG - HTML length: ${html.length} chars`);
    console.log(`[Scraper] DEBUG - Searching for imgAdjuntos in HTML...`);
    console.log(`[Scraper] DEBUG - HTML contains "imgAdjuntos": ${html.includes('imgAdjuntos')}`);
    console.log(`[Scraper] DEBUG - HTML contains "ViewAttachment": ${html.includes('ViewAttachment')}`);
    
    // Look for it in raw HTML first
    if (html.includes('imgAdjuntos')) {
      const imgMatch = html.match(/id="imgAdjuntos"[^>]*onclick="([^"]*)"/);
      if (imgMatch && imgMatch[1]) {
        console.log(`[Scraper] DEBUG - Found imgAdjuntos in raw HTML`);
        console.log(`[Scraper] DEBUG - onclick content: ${imgMatch[1]}`);
        // Extract URL from onclick="open('URL', ...)"
        const urlMatch = imgMatch[1].match(/open\s*\(\s*['"]([^'"]+)['"]/);
        if (urlMatch && urlMatch[1]) {
          console.log(`[Scraper] DEBUG - Extracted URL: ${urlMatch[1]}`);
          const resolvedUrl = resolveUrl(urlMatch[1]);
          console.log(`[Scraper] Found attachment link via imgAdjuntos (raw HTML): ${resolvedUrl}`);
          return { url: resolvedUrl, cookies };
        } else {
          console.log(`[Scraper] DEBUG - Could not extract URL from onclick`);
        }
      }
    }

    // Look for the "Ver Adjuntos" button (input type="image" with onclick)
    const imgAdjuntos = $("#imgAdjuntos, input[name='imgAdjuntos']");
    console.log(`[Scraper] DEBUG - Found imgAdjuntos elements: ${imgAdjuntos.length}`);
    
    const onclickAttr = imgAdjuntos.attr("onclick");
    console.log(`[Scraper] DEBUG - onclick attribute: ${onclickAttr ? onclickAttr.substring(0, 100) + '...' : 'NOT FOUND'}`);
    
    if (onclickAttr) {
      // Extract URL from onclick="open('../Attachment/ViewAttachment.aspx?enc=...', ...)"
      const urlMatch = onclickAttr.match(/open\s*\(\s*['"]([^'"]+)['"]/);
      if (urlMatch && urlMatch[1]) {
        const resolvedUrl = resolveUrl(urlMatch[1]);
        console.log(`[Scraper] Found attachment link via imgAdjuntos onclick: ${resolvedUrl}`);
        return { url: resolvedUrl, cookies };
      }
    }

    // Fallback 1: Look for the fancyAdjunto element
    const adjuntoLink = $(".fancyAdjunto").attr("href");
    console.log(`[Scraper] DEBUG - fancyAdjunto href: ${adjuntoLink || 'NOT FOUND'}`);
    
    if (adjuntoLink) {
      const resolvedUrl = resolveUrl(adjuntoLink);
      console.log(`[Scraper] Found attachment link via .fancyAdjunto: ${resolvedUrl}`);
      return { url: resolvedUrl, cookies };
    }

    // Fallback 2: look for any link containing ViewAttachment
    let fallbackUrl: string | null = null;
    const viewAttachmentLinks = $("a[href*='ViewAttachment']");
    console.log(`[Scraper] DEBUG - Found ${viewAttachmentLinks.length} links with ViewAttachment`);
    
    viewAttachmentLinks.each((_, el) => {
      const href = $(el).attr("href");
      console.log(`[Scraper] DEBUG - ViewAttachment link: ${href}`);
      if (href && !fallbackUrl) {
        fallbackUrl = resolveUrl(href);
      }
    });

    if (fallbackUrl) {
      console.log(`[Scraper] Found attachment link via ViewAttachment: ${fallbackUrl}`);
      return { url: fallbackUrl, cookies };
    }
    
    // Debug: Show what input elements exist
    console.log(`[Scraper] DEBUG - All input[type="image"] elements:`);
    $("input[type='image']").each((_, el) => {
      const name = $(el).attr("name");
      const id = $(el).attr("id");
      const onclick = $(el).attr("onclick");
      console.log(`[Scraper] DEBUG -   name="${name}" id="${id}" onclick="${onclick ? onclick.substring(0, 60) + '...' : 'none'}"`);
    });
    
    return null;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[Scraper] Error getting attachment URL for ${tenderCode}:`, errorMsg);
    throw error;
  }
}


/**
 * Step 2: Scrape the ViewAttachment page for document metadata
 */
async function scrapeAttachmentPage(
  attachmentUrl: string,
  cookies?: string
): Promise<AttachmentPageData> {
  console.log(`[Scraper] 📄 Attempting to scrape attachment page: ${attachmentUrl}`);
  if (cookies) {
    console.log(`[Scraper] 🍪 Using cookies from previous request`);
  }
  
  const html = await fetchPage(attachmentUrl, cookies);
  const $ = cheerio.load(html);

  const documents: ScrapedDocument[] = [];

  // Extract ASP.NET form tokens
  const viewState = $("input[name='__VIEWSTATE']").val() as string ?? "";
  const eventValidation = $("input[name='__EVENTVALIDATION']").val() as string ?? "";

  // Parse the document grid - try common patterns
  // The grid typically has rows with: checkbox, name, type, description, size, date, actions
  const rows = $("table[id*='grd'] tr, table.GridClass tr, #ctl00_ContentPlaceHolder1_rgAdjuntos_ctl00 tr");

  let rowIndex = 0;
  rows.each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 3) return; // Skip header or empty rows

    // Try to extract document info from cells
    const texts: string[] = [];
    cells.each((__, cell) => {
      texts.push($(cell).text().trim());
    });

    // Find the file name - usually the longest text or has a file extension
    let fileName = "";
    let fileType = "";
    let description = "";
    let sizeStr = "";
    let dateStr = "";

    // Common layout: [checkbox] [name] [type] [description] [size] [date] [actions]
    // The first cell with substantial text that looks like a filename
    for (const text of texts) {
      if (!text) continue;

      // Check if it looks like a file name (has extension)
      if (!fileName && /\.\w{2,5}$/i.test(text)) {
        fileName = text;
        continue;
      }

      // Check if it looks like a file size
      if (!sizeStr && /^\d+[\s,.]?\d*\s*(kb|mb|gb|b)$/i.test(text)) {
        sizeStr = text;
        continue;
      }

      // Check if it looks like a date
      if (!dateStr && /^\d{2}-\d{2}-\d{4}$/.test(text)) {
        dateStr = text;
        continue;
      }

      // Known file types
      const knownTypes = [
        "Anexos Administrativos",
        "Anexos Técnicos",
        "Anexos Económicos",
        "Comisión Evaluadora",
        "Otros Anexos",
        "Resolución",
        "Bases",
      ];
      if (!fileType && knownTypes.some((t) => text.includes(t))) {
        fileType = text;
        continue;
      }

      // Remaining text is likely description
      if (fileName && !description && text.length > 2) {
        description = text;
      }
    }

    // If we couldn't find a filename with extension, use any substantial text
    if (!fileName) {
      for (const text of texts) {
        if (text && text.length > 3 && !/^\d/.test(text)) {
          fileName = text;
          break;
        }
      }
    }

    if (fileName) {
      // Parse date from DD-MM-YYYY to ISO
      let uploadDate: string | null = null;
      if (dateStr) {
        const [day, month, year] = dateStr.split("-");
        uploadDate = `${year}-${month}-${day}`;
      }

      documents.push({
        fileName,
        fileType,
        description,
        fileSize: parseFileSize(sizeStr),
        uploadDate,
        sourceUrl: attachmentUrl,
        rowIndex: rowIndex++,
      });
    }
  });

  return {
    documents,
    viewState,
    eventValidation,
    pageUrl: attachmentUrl,
  };
}

/**
 * Full discovery: tender code → list of documents with metadata
 */
export async function discoverDocuments(
  tenderCode: string
): Promise<ScrapedDocument[]> {
  try {
    // Reset counter for each discovery session
    requestCounter = 0;
    
    console.log(`\n========================================`);
    console.log(`[Scraper] 🚀 Starting document discovery for tender: ${tenderCode}`);
    console.log(`========================================`);
    
    // Step 1: Find the attachment page URL
    const result = await getAttachmentUrl(tenderCode);
    if (!result) {
      console.log(`[Scraper] No attachment URL found for tender: ${tenderCode}`);
      return [];
    }

    const { url: attachmentUrl, cookies } = result;
    console.log(`[Scraper] Found attachment URL: ${attachmentUrl}`);
    
    // Step 2: Add delay before second request
    console.log(`[Scraper] ⏱️  Waiting ${REQUEST_DELAY_MS}ms before next request...`);
    await delay(REQUEST_DELAY_MS);
    
    // Step 3: Scrape document metadata with cookies
    const { documents } = await scrapeAttachmentPage(attachmentUrl, cookies);
    
    console.log(`[Scraper] Discovered ${documents.length} documents`);
    return documents;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[Scraper] Error discovering documents for ${tenderCode}:`, errorMsg);
    throw error;
  }
}

/**
 * Download a single document from the attachment page via ASP.NET postback
 */
export async function downloadDocument(
  attachmentUrl: string,
  rowIndex: number
): Promise<{ content: Buffer; hash: string } | null> {
  try {
    // Step 1: GET the page to obtain tokens
    const response = await fetchPageWithResponse(attachmentUrl);
    const cookies = extractCookies(response.headers);
    const html = response.text;
    const $ = cheerio.load(html);

    const viewState = $("input[name='__VIEWSTATE']").val() as string ?? "";
    const eventValidation = $("input[name='__EVENTVALIDATION']").val() as string ?? "";
    const viewStateGenerator = $("input[name='__VIEWSTATEGENERATOR']").val() as string ?? "";

    // Step 2: Build postback to trigger download for the specific row
    // ASP.NET grid row buttons follow pattern: ctl00$...grd...ctl{XX}$btnDownload
    // The DWNL prefix seen in the page suggests the download control name
    const paddedIndex = String(rowIndex + 2).padStart(2, "0");
    const eventTarget = `DWNL$ctl${paddedIndex}`;

    const formData = new URLSearchParams();
    formData.set("__VIEWSTATE", viewState);
    formData.set("__EVENTVALIDATION", eventValidation);
    formData.set("__VIEWSTATEGENERATOR", viewStateGenerator);
    formData.set("__EVENTTARGET", eventTarget);
    formData.set("__EVENTARGUMENT", "");

    // Step 3: POST to trigger download
    const postData = formData.toString();
    const parsedUrl = new URL(attachmentUrl);
    
    const options: https.RequestOptions = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'User-Agent': USER_AGENT,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'Accept': '*/*',
        'Accept-Language': 'es-CL,es;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cookie': cookies,
        'Referer': attachmentUrl,
        'Origin': 'https://www.mercadopublico.cl',
        'Connection': 'keep-alive',
      },
      timeout: 60000, // 60 seconds for file download
    };

    requestCounter++;
    console.log(`\n🌐 REQUEST ${requestCounter} (POST - Download)`);
    console.log(`   URL: ${attachmentUrl}`);
    console.log(`   EventTarget: ${eventTarget}`);

    const downloadResult = await new Promise<{ data: Buffer; contentType: string }>((resolve, reject) => {
      const req = https.request(options, (res) => {
        const chunks: Buffer[] = [];
        
        res.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });
        
        res.on('end', () => {
          const data = Buffer.concat(chunks);
          const contentType = res.headers['content-type'] ?? '';
          resolve({ data, contentType });
        });
        
        res.on('error', reject);
      });
      
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      req.write(postData);
      req.end();
    });

    // Check if we got a file (not HTML page back)
    if (downloadResult.contentType.includes("text/html")) {
      // Got HTML back — likely CAPTCHA or error
      return null;
    }

    const content = downloadResult.data;

    if (content.length === 0) return null;

    const hash = createHash("sha256").update(content).digest("hex");
    return { content, hash };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[Scraper] Error downloading document at row ${rowIndex}:`, errorMsg);
    return null;
  }
}

export { guessMimeType };
