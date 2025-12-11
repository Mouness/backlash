# Firebase Data Schema Documentation

This document outlines the Firestore data structure used in the Backlash application.

## Collections

### 1. `countries`
Stores country analysis data.

**Fields:**
- `code` (string): ISO code or unique identifier (e.g., "CAN", "DEU"). Used for sorting and mapping.
- `name` (map): Localized names.
  - `en` (string)
  - `fr` (string)
  - `de` (string)
- `summary` (map): Localized short summaries.
  - `en` (string)
  - `fr` (string)
  - `de` (string)
- `content` (map): Localized detailed analysis (HTML or basic text).
  - `en` (string)
  - `fr` (string)
  - `de` (string)
- `imageUrl` (string): URL to the cover image.

### 2. `publications`
Stores news, events, and articles.

**Fields:**
- `title` (map): Localized titles.
  - `en`, `fr`, `de`
- `description` (map): Localized descriptions.
  - `en`, `fr`, `de`
- `date` (timestamp): Publication date. Used for sorting (Newest first).
- `category` (string): 'news', 'event', or 'article'.
- `link` (string, optional): External link.
- `imageUrl` (string, optional): Cover image URL.
- `documentUrl` (string, optional): PDF/Doc download URL.

### 3. `team`
Stores team member profiles.

**Fields:**
- `name` (string): Full name.
- `role` (map): Localized job titles.
  - `en`, `fr`, `de`
- `gender` (string): 'male' or 'female'. Used for default avatars.
- `order` (number): Integer for custom sorting order (Ascending).
- `photoUrl` (string, optional): Profile picture URL.

## Indexes
The following compound or specific indexes are required for sorting:

- `publications`: Ordered by `date` (Descending).
- `team`: Ordered by `order` (Ascending).
- `countries`: Ordered by `code` (Ascending).

## Security Rules
- **Read**: Public (allow read: if true)
- **Write**: Authenticated Users Only (allow write: if request.auth != null)
