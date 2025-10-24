import { Client, Databases, Storage, Query } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("68ee9c6b0037dd111b21"); // Replace with your Project ID

export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = "68ee9cb3000ee8678e3e";
export const READINGS_COLLECTION_ID = "readings";
export const PHOTOS_BUCKET_ID = "68ee9fd8003b154b1b02";

// Helper functions
export async function getAllReadings(limit = 100, siteId = null) {
  const queries = [Query.orderDesc("$createdAt"), Query.limit(limit)];

  if (siteId) {
    queries.push(Query.equal("siteId", siteId));
  }

  const response = await databases.listDocuments(
    DATABASE_ID,
    READINGS_COLLECTION_ID,
    queries
  );

  return response.documents;
}

export async function getReadingsBySite(siteId, days = 7) {
  const response = await databases.listDocuments(
    DATABASE_ID,
    READINGS_COLLECTION_ID,
    [
      Query.equal("siteId", siteId),
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ]
  );

  return response.documents;
}

export function getPhotoUrl(photoId) {
  return storage.getFileView(PHOTOS_BUCKET_ID, photoId);
}

export async function getAlerts() {
  const response = await databases.listDocuments(
    DATABASE_ID,
    READINGS_COLLECTION_ID,
    [Query.equal("isVerified", false), Query.orderDesc("$createdAt")]
  );

  return response.documents;
}
