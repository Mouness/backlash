# Firebase Console Setup Guide

Follow these steps to configure your Firebase project directly from the [Firebase Console](https://console.firebase.google.com/).

## 1. Create/Select Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** or select your existing project "Backlash".

## 2. Enable Authentication
1. Go to **Build > Authentication** in the left menu.
2. Click **"Get started"**.
3. Select **"Email/Password"** from the Sign-in method list.
4. Toggle **"Enable"**.
5. Click **"Save"**.
6. (Optional) Go to the **Users** tab and click "Add user" to create your first Admin account manually (e.g., `admin@backlash.com`).

## 3. Enable Firestore Database
1. Go to **Build > Firestore Database**.
2. Click **"Create database"**.
3. Choose a location (e.g., `eur3 (europe-west)` or `nam5 (us-central)`).
4. Start in **Production mode**.
5. Click **"Create"**.

## 4. Apply Security Rules
1. In the Firestore Database section, click the **"Rules"** tab.
2. Delete the default rules.
3. specific: Copy the content from your local file `firestore.rules` (also shown below):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }

    match /countries/{countryId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    match /publications/{publicationId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    match /team/{memberId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
  }
}
```

4. Click **"Publish"**.

## 5. Enable Storage
1. Go to **Build > Storage**.
2. Click **"Get started"**.
3. Start in **Production mode**.
4. Click **"Done"**.
5. Go to the **"Rules"** tab in Storage.
6. Update rules to allow public read but authenticated write:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
7. Click **"Publish"**.

## 6. Configure Indexes (Manual Method)
*Note: Indexes are usually created automatically by clicking links in error messages in the browser console. However, you can create them manually.*

1. Go to **Build > Firestore Database > Indexes**.
2. Click **"Add Index"**.
3. **Collection ID**: `publications`
   - **Field 1**: `date` (Descending)
   - Scope: Collection
4. Click **"Create Index"**.
5. Repeat for `team`:
   - **Collection ID**: `team`
   - **Field 1**: `order` (Ascending)
6. Repeat for `countries`:
   - **Collection ID**: `countries`
   - **Field 1**: `code` (Ascending)

## 7. Connect App
1. Click the **Project Settings** (Gear icon).
2. Scroll to "Your apps".
3. Verify the `firebaseConfig` object in your code (`src/firebase.ts`) matches the one here.

---
**Done!** Your backend is now fully configured and secured.
