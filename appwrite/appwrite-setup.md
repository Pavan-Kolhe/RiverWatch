# Appwrite Setup Instructions

## 1. Create Appwrite Cloud Account

- Go to https://cloud.appwrite.io
- Sign up (free tier: 75K MAU, 2GB storage)

## 2. Create Project

- Click "Create Project"
- Name: "Water Level Monitoring"
- Copy Project ID: `YOUR_PROJECT_ID`

## 3. Create Database

- Go to Databases → Create Database
- Name: "water_monitoring"
- Database ID: `water_db`

## 4. Create Collection: "readings"

- Collection ID: `readings`
- Permissions:
  - Create: Users
  - Read: Any
  - Update: Users
  - Delete: Admins only

### Attributes:

| Name             | Type    | Required | Default |
| ---------------- | ------- | -------- | ------- |
| siteId           | string  | Yes      | -       |
| siteName         | string  | Yes      | -       |
| waterLevel       | float   | Yes      | -       |
| latitude         | float   | Yes      | -       |
| longitude        | float   | Yes      | -       |
| photoId          | string  | Yes      | -       |
| submittedBy      | string  | Yes      | -       |
| distanceFromSite | float   | Yes      | -       |
| isVerified       | boolean | Yes      | true    |
| ocrConfidence    | float   | No       | null    |

### Indexes:

- Key: `siteId_index`, Type: key, Attributes: [siteId]
- Key: `timestamp_index`, Type: key, Attributes: [$createdAt]

## 5. Create Storage Bucket

- Go to Storage → Create Bucket
- Name: "gauge-photos"
- Bucket ID: `photos`
- Max file size: 10MB
- Allowed extensions: jpg, jpeg, png
- Permissions: Any (read), Users (create)

## 6. Get API Credentials

- Go to Settings → View API Keys
- Copy:
  - Project ID
  - API Endpoint: `https://cloud.appwrite.io/v1`
