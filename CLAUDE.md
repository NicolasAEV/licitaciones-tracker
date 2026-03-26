# CLAUDE.md

## Project Goal

This project is a web application to:

- Search tenders  
- View tender details  
- Track tenders over time  
- Display important information  
- Show and download documents  

The system must remain **simple, readable, and easy to maintain**.

---

## Tech Stack

Frontend:
- Next.js (App Router)
- TypeScript
- TailwindCSS

Backend:
- External REST API

The frontend must assume all business logic and data persistence happen in the backend.

---

## Recommended Project Structure

Keep the structure simple:

src/
app/
components/
services/
types/
lib/

### app/
Routing and pages only.

Pages should:
- call services
- render components
- avoid heavy logic

---

### components/
Reusable UI components.

Rules:
- small components
- no API calls inside components
- avoid business logic

---

### services/
All API communication.

Rules:
- all fetch calls go here
- pages and components must use services
- use environment variables for base URLs

Example:
process.env.NEXT_PUBLIC_API_URL

---

### types/
TypeScript interfaces and types only.

No logic inside this folder.

---

### lib/
Utility functions and helpers.

Examples:
- date formatting
- string utilities

---

## Coding Rules

Claude must:

- Prefer simple solutions
- Use strict typing
- Keep functions small
- Avoid duplicated code
- Keep naming consistent

Naming:
- camelCase → variables/functions  
- PascalCase → components  
- kebab-case → folders  

---

## UI Guidelines

The interface should be:

- clean  
- modern  
- minimal  
- readable  
- responsive  

Prefer:
- cards  
- tables  
- clear spacing  

Avoid:
- heavy animations  
- unnecessary libraries  

---

## Data Model (Frontend)

A tender should contain:

- id
- title
- organization
- status
- closingDate

A tender detail may include:

- description
- summary
- documents
- history

Keep models simple and clear.

---

## Documents

Documents are:

- stored in backend or object storage
- accessed through URLs
- displayed as metadata in frontend

Frontend must not implement file storage logic.

---

## Tracking

Tracking is event-based.

Possible events:

- STATUS_CHANGED
- DATE_UPDATED
- NEW_DOCUMENT

Events are displayed as a timeline.

Frontend only renders this data.

---

## Feature Implementation Order

When adding a feature:

1. Create or update types  
2. Create or update service  
3. Create component  
4. Connect to page  

Always follow this order.

---

## Refactoring Rules

When improving code:

- do not break existing behavior
- improve readability
- reduce duplication
- keep file structure consistent

---

## Performance Guidelines

Prefer:

- server components when possible
- pagination for lists
- simple state management

Avoid premature optimization.

---

## General Principle

Always prefer:

- simple over complex
- clear over clever
- maintainable over abstract

---

## Expected Behavior From Claude

When generating code:

- produce working examples
- keep implementations realistic
- avoid placeholders when possible
- keep the structure consistent with this document

---

## End of File
