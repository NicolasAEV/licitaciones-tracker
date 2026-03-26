# Diccionario de Datos — Licitaciones (API Mercado Público)

**Fuente:** “Documentación API Mercado Público – Licitaciones (Diccionario de Datos)” (PDF).  
Convertido a Markdown conservando el contenido textual del documento.

---

## 1. Introducción

Api.mercadopublico.cl permite consumir información de **Licitaciones** y **Órdenes de Compra** generadas en la plataforma de compras públicas de ChileCompra (www.mercadopublico.cl).  
Para conocer los datos de una licitación (publicada, cerrada, desierta, adjudicada, revocada, suspendida), se accede al servicio mediante URLs con parámetros **GET**, con los siguientes formatos:

- **XML**  
  `http://api.mercadopublico.cl/servicios/v1/publico/licitaciones.xml?codigo=[Numero de la licitacion]&ticket=[Ticket de Acceso]`
- **JSON**  
  `http://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?codigo=[Numero de la licitacion]&ticket=[Ticket de Acceso]`
- **JSONP**  
  `http://api.mercadopublico.cl/servicios/v1/publico/licitaciones.jsonp?codigo=[Numero de la licitacion]&ticket=[Ticket de Acceso]`

> Por defecto, si no se especifica formato, la respuesta será en **JSON**.

---

## 2. Información de campos disponibles en Licitación

> La tabla siguiente replica los campos listados en el documento (ruta/campo, descripción, tipo y largo cuando aplica).

| # | Campo | Descripción | Tipo | Largo |
|---:|---|---|---|---:|
| 1 | `Licitaciones/Cantidad` | Cantidad de Licitaciones consultadas | entero |  |
| 2 | `Licitaciones/FechaCreacion` | Fecha de consulta | datetime |  |
| 3 | `Licitaciones/Version` | Versión del API de Mercado Público | texto |  |
| 4 | `Licitaciones/Listado/Licitacion/CodigoExterno` | Código de la Licitación de Mercado Público | nvarchar | 100 |
| 5 | `Licitaciones/Listado/Licitacion/Nombre` | Nombre de la Licitación | nvarchar | 255 |
| 6 | `Licitaciones/Listado/Licitacion/CodigoEstado` | Código del estado en el que se encuentra la Licitación | entero | 4 |
| 7 | `Licitaciones/Listado/Licitacion/FechaCierre` | Fecha de Cierre de la Licitación | DateTime |  |
| 8 | `Licitaciones/Listado/Licitacion/Descripcion` | Descripción de la Licitación u objeto de la contratación | Nvarchar | max |
| 9 | `Licitaciones/Listado/Licitacion/Estado/` | Estado en el que se encuentra la Licitación | nvarchar | 510 |
| 10 | `Licitaciones/Listado/Licitacion/Comprador/CodigoOrganismo` | Código de la Institución u Organismo Público responsable de la Licitación | nvarchar | 100 |
| 11 | `Licitaciones/Listado/Licitacion/Comprador/NombreOrganismo` | Nombre de la Institución u Organismo Público responsable de la Licitación | nvarchar | 510 |
| 12 | `Licitaciones/Listado/Licitacion/Comprador/RutUnidad` | Rut de la Institución u Organismo Público responsable de la Licitación | nvarchar | 100 |
| 13 | `Licitaciones/Listado/Licitacion/Comprador/CodigoUnidad` | Código de la Institución u Organismo Público responsable de la Licitación | nvarchar | 100 |
| 14 | `Licitaciones/Listado/Licitacion/Comprador/NombreUnidad` | Nombre de la Unidad de Compra perteneciente a la Institución u Organismo Público responsable de la Licitación | nvarchar | 510 |
| 15 | `Licitaciones/Listado/Licitacion/Comprador/DireccionUnidad` | Dirección de la Unidad de Compra perteneciente a la Institución u Organismo Público responsable de la Licitación | nvarchar | 510 |
| 16 | `Licitaciones/Listado/Licitacion/Comprador/ComunaUnidad` | Comuna de la Unidad de Compra perteneciente a la Institución u Organismo Público responsable de la Licitación | nvarchar | 510 |
| 17 | `Licitaciones/Listado/Licitacion/Comprador/RegionUnidad` | Región de la Unidad de Compra perteneciente a la Institución u Organismo Público responsable de la Licitación | nvarchar | 510 |
| 18 | `Licitaciones/Listado/Licitacion/Comprador/RutUsuario` | Rut del usuario responsable de la Licitación | nvarchar | 100 |
| 19 | `Licitaciones/Listado/Licitacion/Comprador/CodigoUsuario` | Código del usuario responsable de la Licitación | nvarchar | 100 |
| 20 | `Licitaciones/Listado/Licitacion/Comprador/NombreUsuario` | Nombre de usuario responsable de la Licitación | texto |  |
| 21 | `Licitaciones/Listado/Licitacion/Comprador/CargoUsuario` | Cargo del usuario responsable de la Licitación | nvarchar | 100 |
| 22 | `Licitaciones/Listado/Licitacion/DiasCierreLicitacion` | Indica la cantidad de días para el cierre de la Licitación | entero |  |
| 23 | `Licitaciones/Listado/Licitacion/Informada` | Indica si la Licitación es Informada (1=Sí, 0=No) | bit | 1 |
| 24 | `Licitaciones/Listado/Licitacion/CodigoTipo` | ID del tipo de Licitación asociada a “Tipo” (1=Pública, 2=Privada) | entero | 4 |
| 25 | `Licitaciones/Listado/Licitacion/Tipo` | ID del tipo de Licitación de Mercado Público (ver 3.1) | nvarchar | 20 |
| 26 | `Licitaciones/Listado/Licitacion/TipoConvocatoria` | Tipo de convocatoria (1=Abierto, 0=Cerrada) | int | 4 |
| 27 | `Licitaciones/Listado/Licitacion/Moneda` | Código de la moneda en la Licitación | nvarchar | 100 |
| 28 | `Licitaciones/Listado/Licitacion/Etapas` | Número de etapas de la licitación (1 o 2 etapas) | int | 4 |
| 29 | `Licitaciones/Listado/Licitacion/EstadoEtapas` | Indica las aperturas realizadas en la licitación [1,2] | int | 4 |
| 30 | `Licitaciones/Listado/Licitacion/TomaRazon` | Toma de Razón por Contraloría (1=con toma de razón, 0=no tiene) | int | 4 |
| 31 | `Licitaciones/Listado/Licitacion/EstadoPublicidadOfertas` | Publicidad oferta técnica (1=Sí muestra, 0=No muestra) | smallint | 2 |
| 32 | `Licitaciones/Listado/Licitacion/JustificacionPublicidad` | Descripción que justifica mostrar la oferta técnica para público conocimiento (Paso 1) | nvarchar | -1 |
| 33 | `Licitaciones/Listado/Licitacion/Contrato` | 1=Contrato requiere subscripción, 2=Contrato formaliza con OC (visible para licitaciones tipo LE) | int | 4 |
| 34 | `Licitaciones/Listado/Licitacion/Obras` | Indica si la licitación es de tipo obra (0=No, 2=Sí) | int | 4 |
| 35 | `Licitaciones/Listado/Licitacion/CantidadReclamos` | Número de reclamos recibidos por el organismo responsable | entero |  |
| 36 | `Licitaciones/Listado/Licitacion/Fechas/FechaCreacion` | Fecha de Creación de la Licitación | DateTime |  |
| 37 | `Licitaciones/Listado/Licitacion/Fechas/FechaCierre` | Fecha de Cierre de la Licitación | DateTime |  |
| 38 | `Licitaciones/Listado/Licitacion/Fechas/FechaInicio` | Fecha de Inicio del foro de la licitación | DateTime |  |
| 39 | `Licitaciones/Listado/Licitacion/Fechas/FechaFinal` | Fecha de cierre del foro de la licitación | DateTime |  |
| 40 | `Licitaciones/Listado/Licitacion/Fechas/FechaPubRespuestas` | Fecha de Publicación de las Respuestas | DateTime |  |
| 41 | `Licitaciones/Listado/Licitacion/Fechas/FechaActoAperturaTecnica` | Fecha del Acto de Apertura Técnica | DateTime |  |
| 42 | `Licitaciones/Listado/Licitacion/Fechas/FechaActoAperturaEconomica` | Fecha del Acto de Apertura Económica | DateTime |  |
| 43 | `Licitaciones/Listado/Licitacion/Fechas/FechaPublicacion` | Fecha de Publicación de la Licitación | DateTime |  |
| 44 | `Licitaciones/Listado/Licitacion/Fechas/FechaAdjudicacion` | Fecha de Adjudicación de la Licitación | DateTime |  |
| 45 | `Licitaciones/Listado/Licitacion/Fechas/FechaEstimadaAdjudicacion` | Fecha Estimada de Adjudicación | DateTime |  |
| 46 | `Licitaciones/Listado/Licitacion/Fechas/FechaSoporteFisico` | Fecha Soporte Físico | DateTime |  |
| 47 | `Licitaciones/Listado/Licitacion/Fechas/FechaTiempoEvaluacion` | Fecha de la Evaluación | DateTime |  |
| 48 | `Licitaciones/Listado/Licitacion/Fechas/FechaEstimadaFirma` | Fecha Estimada de la Firma | DateTime |  |
| 49 | `Licitaciones/Listado/Licitacion/Fechas/FechasUsuario` | Indica si el usuario definió fechas adicionales a la licitación | DateTime |  |
| 50 | `Licitaciones/Listado/Licitacion/Fechas/FechaVisitaTerreno` | Fecha de la visita a terreno | DateTime |  |
| 51 | `Licitaciones/Listado/Licitacion/Fechas/FechaEntregaAntecedentes` | Fecha en que se deben entregar los antecedentes | DateTime |  |
| 52 | `Licitaciones/Listado/Licitacion/UnidadTiempoEvaluacion` | Indica la unidad de tiempo de la evaluación | int | 4 |
| 53 | `Licitaciones/Listado/Licitacion/DireccionVisita` | Dirección de visita | varchar | 500 |
| 54 | `Licitaciones/Listado/Licitacion/DireccionEntrega` | Dirección de entrega | varchar | 500 |
| 55 | `Licitaciones/Listado/Licitacion/Estimacion` | Código de tipo de estimación |  |  |
| 56 | `Licitaciones/Listado/Licitacion/FuenteFinanciamiento` | Indica la fuente de financiamiento | int | 4 |
| 57 | `Licitaciones/Listado/Licitacion/VisibilidadMonto` | Hacer público el monto estimado (1=Sí, 0=No) | bit | 1 |
| 58 | `Licitaciones/Listado/Licitacion/MontoEstimado` | Monto estimado que maneja el organismo para licitar | float | 53 |
| 59 | `Licitaciones/Listado/Licitacion/UnidadTiempo` | Tipo de unidad de tiempo asociada a “TiempoDuracionContrato” | int | 4 |
| 60 | `Licitaciones/Listado/Licitacion/Modalidad` | Modalidad de pago (plazos 30 días, 60 días, etc.) | int | 4 |
| 61 | `Licitaciones/Listado/Licitacion/TipoPago` | Indica el tipo de pago que se realizará | int | 4 |
| 62 | `Licitaciones/Listado/Licitacion/NombreResponsablePago` | Nombre de la persona responsable del pago | nvarchar | 200 |
| 63 | `Licitaciones/Listado/Licitacion/EmailResponsablePago` | Correo electrónico del responsable del pago | nvarchar | 200 |
| 64 | `Licitaciones/Listado/Licitacion/NombreResponsableContrato` | Nombre de la persona responsable del contrato | nvarchar | 200 |
| 65 | `Licitaciones/Listado/Licitacion/EmailResponsableContrato` | Correo electrónico del responsable del contrato | nvarchar | 200 |
| 66 | `Licitaciones/Listado/Licitacion/FonoResponsableContrato` | Teléfono de contacto del responsable del contrato | nvarchar | 200 |
| 67 | `Licitaciones/Listado/Licitacion/ProhibicionContratacion` | Indica si se prohíbe la contratación | nvarchar | 510 |
| 68 | `Licitaciones/Listado/Licitacion/SubContratacion` | Indica si se permite la sub-contratación (1=Sí, 0=No) | bit | 1 |
| 69 | `Licitaciones/Listado/Licitacion/UnidadTiempoDuracionContrato` | Unidad de tiempo del contrato (etiqueta “TiempoDuracionContrato”) | int | 4 |
| 70 | `Licitaciones/Listado/Licitacion/TiempoDuracionContrato` | Duración del contrato (en la unidad definida por el organismo) | int | 4 |
| 71 | `Licitaciones/Listado/Licitacion/TipoDuracionContrato` | Nombre de período de tiempo | nvarchar | 510 |
| 72 | `Licitaciones/Listado/Licitacion/JustificacionMontoEstimado` | Justificación del monto estimado | varchar | 255 |
| 73 | `Licitaciones/Listado/Licitacion/ExtensionPlazo` | Si al cierre hay 2 o menos propuestas, se amplía 2 días hábiles una vez (1=Extiende, 0=No) | smallint | 2 |
| 74 | `Licitaciones/Listado/Licitacion/EsBaseTipo` | Licitación creada a través de licitaciones tipo (1=Sí, 0=No) | bit | 1 |
| 75 | `Licitaciones/Listado/Licitacion/UnidadTiempoContratoLicitacion` | Código de período de tiempo | int | 4 |
| 76 | `Licitaciones/Listado/Licitacion/ValorTiempoRenovacion` | Indica el valor de tiempo | int | 4 |
| 77 | `Licitaciones/Listado/Licitacion/PeriodoTiempoRenovacion` | Nombre del período de tiempo de renovación | nvarchar | 510 |
| 78 | `Licitaciones/Listado/Licitacion/EsRenovable` | Indica si el período de renovación es renovable (1=Sí, 0=No) | bit | 1 |
| 79 | `Licitaciones/Listado/Licitacion/Adjudicacion/Tipo` | Código del tipo de documento que garantiza la adjudicación | int | 4 |
| 80 | `Licitaciones/Listado/Licitacion/Adjudicacion/Fecha` | Fecha del documento administrativo que garantiza la adjudicación (depende de la etiqueta anterior) | datetime |  |
| 81 | `Licitaciones/Listado/Licitacion/Adjudicacion/Numero` | Número del documento administrativo que garantiza la adjudicación (depende de la etiqueta anterior) | nvarchar | 100 |
| 82 | `Licitaciones/Listado/Licitacion/Adjudicacion/NumeroOferentes` | Cantidad de proveedores adjudicados | entero |  |
| 83 | `Licitaciones/Listado/Licitacion/Adjudicacion/UrlActa` | URL del acta de adjudicación en www.mercadopublico.cl y listado completo de proveedores | texto |  |
| 84 | `Licitaciones/Listado/Licitacion/Items/Cantidad` | Número de productos o servicios de la Licitación | entero |  |
| 85 | `Licitaciones/Listado/Licitacion/Items/Listado/item/CodigoEstadoLicitacion` | Código del estado en el que se encuentra la Licitación | entero | 4 |
| 86 | `Licitaciones/Listado/Licitacion/Items/Listado/item/Correlativo` | Correlativo del producto o servicio licitado | entero |  |
| 87 | `Licitaciones/Listado/Licitacion/Items/Listado/item/CodigoProducto` | Código del producto (UNSPSC Versión 7) | entero |  |
| 88 | `Licitaciones/Listado/Licitacion/Items/Listado/item/CodigoCategoria` | Código de la categoría (UNSPSC Versión 7) | nvarchar | 100 |
| 89 | `Licitaciones/Listado/Licitacion/Items/Listado/item/Categoria` | Nombre de la categoría y niveles donde está incluido el producto/servicio | varchar | 400 |
| 90 | `Licitaciones/Listado/Licitacion/Items/Listado/item/NombreProducto` | Nombre del producto o servicio | nvarchar | 510 |
| 91 | `Licitaciones/Listado/Licitacion/Items/Listado/item/Descripcion` | Descripción del producto o servicio | nvarchar | 510 |
| 92 | `Licitaciones/Listado/Licitacion/Items/Listado/item/UnidadMedida` | Unidad de medida del producto o servicio | nvarchar | 510 |
| 93 | `Licitaciones/Listado/Licitacion/Items/Listado/item/Cantidad` | Cantidad del producto o servicio | float | 8 |
| 94 | `Licitaciones/Listado/Licitacion/Items/Listado/item/Adjudicacion/RutProveedor` | Rut del proveedor adjudicado (por línea) | nvarchar | 100 |
| 95 | `Licitaciones/Listado/Licitacion/Items/Listado/item/Adjudicacion/NombreProveedor` | Nombre del proveedor adjudicado (por línea) | nvarchar | 500 |
| 96 | `Licitaciones/Listado/Licitacion/Items/Listado/item/Adjudicacion/CantidadAdjudicada` | Cantidad adjudicada (por línea) | nvarchar | 500 |
| 97 | `Licitaciones/Listado/Licitacion/Items/Listado/item/Adjudicacion/MontoUnitario` | Monto unitario adjudicado (por línea) | float | 8 |

---

## 3. Información de parámetros en etiquetas de Licitación

### 3.1 Tipo de Licitación

**Ruta:** `<Licitaciones>/<Listado>/<Licitacion>/<Tipo>`  
**Descripción:** ID del tipo de Licitación de Mercado Público

| Valor | Descripción |
|---|---|
| L1 | Licitación Pública menor a 100 UTM |
| LE | Licitación Pública igual o superior a 100 UTM e inferior a 1.000 UTM |
| LP | Licitación Pública igual o superior a 1.000 UTM e inferior a 2.000 UTM |
| LQ | Licitación Pública igual o superior a 2.000 UTM e inferior a 5.000 UTM |
| LR | Licitación Pública igual o superior a 5.000 UTM |
| E2 | Licitación Privada menor a 100 UTM |
| CO | Licitación Privada igual o superior a 100 UTM e inferior a 1000 UTM |
| B2 | Licitación Privada igual o superior a 1000 UTM e inferior a 2000 UTM |
| H2 | Licitación Privada igual o superior a 2000 UTM e inferior a 5000 UTM |
| I2 | Licitación Privada mayor a 5000 UTM |
| LS | Licitación Pública Servicios personales especializados |

### 3.2 Unidad Monetaria

**Ruta:** `<Licitaciones>/<Listado>/<Licitacion>/<Moneda>`  
**Descripción:** Código de la moneda en la Licitación

| Valor | Descripción |
|---|---|
| CLP | Peso Chileno |
| CLF | Unidad de Fomento |
| USD | Dólar Americano |
| UTM | Unidad Tributaria Mensual |
| EUR | Euro |

### 3.3 Monto estimado

**Ruta:** `<Licitaciones>/<Listado>/<Licitacion>/<Estimacion>`  
**Descripción:** Asociación del monto estimado

| Valor | Descripción |
|---:|---|
| 1 | Presupuesto Disponible |
| 2 | Precio Referencial |
| 3 | Monto no es posible de estimar |

### 3.4 Modalidad de Pago

**Ruta:** `<Licitaciones>/<Listado>/<Licitacion>/<Modalidad>`  
**Descripción:** Modalidad de pago

| Valor | Descripción |
|---:|---|
| 1 | Pago a 30 días |
| 2 | Pago a 30, 60 y 90 días |
| 3 | Pago al día |
| 4 | Pago Anual |
| 5 | Pago Bimensual |
| 6 | Pago Contra Entrega Conforme |
| 7 | Pagos Mensuales |
| 8 | Pago Por Estado de Avance |
| 9 | Pago Trimestral |
| 10 | Pago a 60 días |

### 3.5 Unidad de Tiempo de Evaluación

**Ruta:** `<Licitaciones>/<Listado>/<Licitacion>/<UnidadTiempo>`  
**Descripción:** Unidad de tiempo de la evaluación

| Valor | Descripción |
|---:|---|
| 1 | Horas |
| 2 | Días |
| 3 | Semanas |
| 4 | Meses |
| 5 | Años |

### 3.6 Unidad de Tiempo duración del contrato

**Ruta:** `<Licitaciones>/<Listado>/<Licitacion>/<UnidadTiempo>`  
**Descripción:** Unidad de tiempo asociada a “TiempoDuracionContrato”

| Valor | Descripción |
|---:|---|
| 1 | Horas |
| 2 | Días |
| 3 | Semanas |
| 4 | Meses |
| 5 | Años |

### 3.7 Tipo de Acto Administrativo que adjudica o aprueba el contrato

> Este tipo de documento se despliega sólo cuando la licitación se encuentra en estado “Adjudicada”.

**Ruta:** `<Licitaciones>/<Listado>/<Licitacion>/<Adjudicacion>/<Tipo>`  
**Descripción:** Código del tipo de documento que garantiza la adjudicación

| Valor | Descripción |
|---:|---|
| 1 | Autorización |
| 2 | Resolución |
| 3 | Acuerdo |
| 4 | Decreto |
| 5 | Otros |

---
## Información General de Órdenes de Compras
  Servicio Web
Los archivos de los recursos a los que se accede a través de api.mercadopublico.cl, utilizan las siguientes estructuras:

Formato JSON:
https://api.mercadopublico.cl/servicios/v1/publico/ordenesdecompra.json?fecha=02022014&ticket=F8537A18-6766-4DEF-9E59-426B4FEE2844

Formato JSONP:
https://api.mercadopublico.cl/servicios/v1/publico/ordenesdecompra.jsonp?fecha=02022014&callback=respuesta&ticket=F8537A18-6766-4DEF-9E59-426B4FEE2844

Formato XML:
https://api.mercadopublico.cl/servicios/v1/publico/ordenesdecompra.xml?fecha=02022014&ticket=F8537A18-6766-4DEF-9E59-426B4FEE2844


Notas sobre la información solicitada
Los estados de las órdenes de compra consultadas serán mostrados por código, descritos de la siguiente forma:

Enviada a Proveedor = "4"
En proceso = "5"
Aceptada = "6"
Cancelada = "9"
Recepción Conforme = "12"
Pendiente de Recepcionar = "13"
Recepcionada Parcialmente = "14"
Recepcion Conforme Incompleta = "15"

Tipos de Consulta
Por {código} de orden de compra:

Ejemplo de {codigo} = 2097-241-SE14

https://api.mercadopublico.cl/servicios/v1/publico/ordenesdecompra.json?codigo=2097-241-SE14&ticket=F8537A18-6766-4DEF-9E59-426B4FEE2844

Por todos los estados del día actual:

https://api.mercadopublico.cl/servicios/v1/publico/ordenesdecompra.json?estado=todos&ticket=F8537A18-6766-4DEF-9E59-426B4FEE2844

Por todos los estados de una {fecha} específica:

Ejemplo de {fecha} = 02022014

https://api.mercadopublico.cl/servicios/v1/publico/ordenesdecompra.json?fecha=02022014&ticket=F8537A18-6766-4DEF-9E59-426B4FEE2844

Por {estado} del día actual:

Ejemplo de {estado} = ACEPTADA

{estados} de las órdenes de compra y su nomenclatura:

Enviada a Proveedor = "enviadaproveedor"
Aceptada = "aceptada"
Cancelada = "cancelada"
Recepción Conforme = "recepcionconforme"
Pendiente de Recepcionar = "pendienterecepcion"
Recepcionada Parcialmente = "recepcionaceptadacialmente"
Recepcion Conforme Incompleta = "recepecionconformeincompleta"
todos = "todos" (muestra todos los estados posibles antes señalados)


https://api.mercadopublico.cl/servicios/v1/publico/ordenesdecompra.json?fecha=02022014&estado={estado}&ticket=F8537A18-6766-4DEF-9E59-426B4FEE2844

https://api.mercadopublico.cl/servicios/v1/publico/ordenesdecompra.json?fecha=02022014&estado=aceptada&ticket=F8537A18-6766-4DEF-9E59-426B4FEE2844

Por {código} de Organismo Público:

Ejemplo de {CódigoOrganismo} = 694

https://api.mercadopublico.cl/servicios/v1/publico/ordenesdecompra.json?fecha={fecha}&CodigoOrganismo={CódigoOrganismo}&ticket=F8537A18-6766-4DEF-9E59-426B4FEE2844

https://api.mercadopublico.cl/servicios/v1/publico/ordenesdecompra.json?fecha=02022014&CodigoOrganismo=6945&ticket=F8537A18-6766-4DEF-9E59-426B4FEE2844

Por {código} de Proveedor:

Ejemplo de {CódigoProveedor} = 17793

https://api.mercadopublico.cl/servicios/v1/publico/ordenesdecompra.json?fecha=02022014&CodigoProveedor={CódigoProveedor}&ticket=F8537A18-6766-4DEF-9E59-426B4FEE2844

https://api.mercadopublico.cl/servicios/v1/publico/ordenesdecompra.json?fecha=02022014&CodigoProveedor=17793&ticket=F8537A18-6766-4DEF-9E59-426B4FEE2844

Los resultados de las búsquedas son realizadas en base a los números de Órdenes de Compra enviadas en el día. Los resultados entregados son con información básica de las Órdenes de Compra.

En el caso de la búsqueda por código no importa la fecha, siempre obtendrá la Orden de Compra solicitada. El resultado entregado posee información detallada de la O.C.

El formato de la fecha es ddmmaaaa, ejemplo: 12062014, obtendrá las Órdenes de Compra del día 12 del mes de junio del año 2014.


## Documentación de Orden de Compra
Cantidad	Cantidad de Órdenes de compra encontradas
FechaCreacion	Fecha de consulta
Version	Código de la Orden de compra de Mercado Publico
Listado	Listado de Ordenes de Compra
Listado	Listado de Ordenes de Compra
Codigo	Código de la Orden de compra de Mercado Publico
Nombre	Nombre de la Orden de Compra
CodigoEstado	Código del estado en el que se encuentra la Orden de compra
CodigoLicitacion	Código de la Licitación asociada a la Orden de Compra
Descripcion	Descripción de la Orden de Compra
CodigoTipo	Código del tipo de Orden de Compra
Tipo	Tipo de Orden de compra. Ver Anexo
TipoMoneda	Tipo Moneda de la Orden de Compra. Ver Anexo
CodigoEstadoProveedor	Código estado del Proveedor
EstadoProveedor	Estado del Proveedor
Fechas	
FechaCreacion	Fecha de creación de la Orden de compra
FechaEnvio	Fecha de envió de la Orden de compra
FechaAceptacion	Fecha de aceptación Orden de compra
FechaCancelacion	Fecha cancelación de orden de compra
FechaUltimaModificacion	Fecha de Ultima Modificación de la Orden de compra
TieneItems	Indica si tiene Items. 1 = SI, 0 = NO
PromedioCalificacion	Promedio de calificación del proveedor
CantidadEvaluacion	Evaluación del proveedor
Descuentos	Descuento aplicado a la Orden de compra
Cargos	Cargos aplicados a la Orden de compra
TotalNeto	Total neto de la Orden de compra
PorcentajeIva	Porcentaje del IVA aplicado a la Orden de compra
Impuestos	Impuesto aplicado a la Orden de compra
Total	Total de la Orden de compra
Financiamiento	Fuente de Financiamiento
Pais	País al que pertenece la Orden de compra
TipoDespacho	Código que identifica el Tipo de Despacho. Ver Anexo
FormaPago	Código que identifica la forma de pago. Ver Anexo
Comprador	
CodigoOrganismo	Código que identifica al organismo comprador
NombreOrganismo	Nombre del organismo del comprador
RutUnidad	Rut de la Unidad
CodigoUnidad	Código de Unidad
NombreUnidad	Nombre de Unidad
Actividad	Actividad del Comprador
DireccionUnidad	Dirección de la unidad compradora
ComunaUnidad	Comuna de la unidad compradora
RegionUnidad	Región de la unidad compradora
Pais	País de la unidad compradora
NombreContacto	Nombre contacto
CargoContacto	Cargo del contacto
FonoContacto	Teléfono del Contacto
MailContacto	E-Mail del contacto
Proveedor	
Codigo	Código del proveedor
Nombre	Nombre del proveedor
Actividad	Actividad del Proveedor
CodigoSucursal	Código de la sucursal del proveedor
NombreSucursal	Nombre de la sucursal del proveedor
RutSucursal	Rut del Proveedor
Direccion	Dirección del proveedor
Comuna	Comuna del proveedor
Region	Región del proveedor
Pais	País del proveedor
NombreContacto	Nombre contacto del proveedor
CargoContacto	Cargo del contacto del proveedor
FonoContacto	Teléfono del contacto del proveedor
MailContacto	E Mail del contacto del proveedor
Items	
Cantidad	Cantidad de Items (Productos) de la orden de compra
Listado	Listado de Items
Correlativo	Correlativo de Items
CodigoCategoria	Código de categoría a la que pertenece el producto
Categoria	Categoría a la que pertenece el producto
CodigoProducto	Codigo del producto
EspecificacionComprador	Especificaciones del producto que necesita el comprador
EspecificacionProveedor	Especificaciones del producto proveído por el proveedor
Cantidad	Cantidad de productos
Moneda	Tipo de moneda del producto. Ver Anexo
PrecioNeto	Precio neto o precio unitario del producto
TotalCargos	Total cargos asociados a la multiplicación del Precioneto * Cantidad
TotalDescuentos	Total Descuentos asociados a la multiplicación del Precioneto * Cantidad
TotalImpuestos	Total de impuesto asociados a la multiplicación del Precioneto * Cantidad
Total	Total final de precios de los productos



Anexos
Tipo Orden de compra
Codigo	Abreviación	Descripción
1	OC	Automatica
2	D1	Trato directo que genera Orden de Compra por proveedor único
3	C1	Trato directo que genera Orden de Compra por emergencia, urgencia e imprevisto
4	F3	Trato directo que genera Orden de Compra por confidencialidad
5	G1	Trato directo que genera Orden de Compra por naturaleza de negociación
6	R1	Orden de compra menor a 3UTM
7	CA	Orden de compra sin resolución.
8	SE	Sin emisión automática
9	CM	Convenio Marco
10	FG	Trato Directo (Art. 8 letras f y g - Ley 19.886)
11	TL	Convenio Marco – Tienda de Libros (Obsoleto)
12	MC	Microcompra
13	AG	Compra Ágil
14	CC	Compra Coordinada
Unidad Monetaria
Valor	Descripción
CLP	Peso Chileno
CLF	Unidad de Fomento
USD	Dólar Americano
UTM	Unidad Tributaria Mensual
EUR	Euro
Tipo de despacho
Valor	Descripción
7	Despachar a Dirección de envío
9	Despachar según programa adjuntado
12	Otra Forma de Despacho, Ver Instruc
14	Retiramos de su bodega
20	Despacho por courier o encomienda aérea
21	Despacho por courier o encomienda terrestre
22	A convenir
Tipo de Pago
Valor	Descripción
1	15 días contra la recepción de la factura
2	30 días contra la recepción de la factura
39	Otra forma de pago
46	50 días contra la recepción de la factura
47	60 días contra la recepción de la factura
48	A 45 días
49	A más de 30 días
¡¡¡ Participa !!!
FaceBook Twitter Mail api@chilecompra.cl
Importante



# Códigos de Organismos Públicos y Proveedores
Para obtener el código de un Proveedor debe consumir el siguiente método indicando el rut de la empresa a buscar (debe incluir puntos, guión y dígito verificador):

https://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarProveedor?rutempresaproveedor=70.017.820-k&ticket=F8537A18-6766-4DEF-9E59-426B4FEE2844

Donde:
Código Empresa: Código de la empresa Proveedor. Ejemplo de {CódigoEmpresa} = 17793
Nombre Empresa: Nombre de la empresa Proveedor. Ejemplo de {NombreEmpresa} = "Cámara de Comercio de Santiago A.G. (CCS)".

Para obtener el código de un Organismo Público debe consumir el siguiente método, el cual devuelve un listado de todos los Orgranismos Públicos de la plataforma Mercado Público:

https://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarComprador?ticket=F8537A18-6766-4DEF-9E59-426B4FEE2844

Donde:
Código Empresa: Código del organismo público. Ejemplo de {CódigoEmpresa} = 6945
Nombre Empresa: Nombre del organismo público. Ejemplo de {NombreEmpresa} = "Dirección de Compras y Contratación Pública".