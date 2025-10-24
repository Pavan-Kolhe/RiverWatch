import { Client, Databases, Storage, ID } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("68ee9c6b0037dd111b21"); // Replace with your Project ID

export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = "68ee9cb3000ee8678e3e";
export const READINGS_COLLECTION_ID = "readings";
export const PHOTOS_BUCKET_ID = "68ee9fd8003b154b1b02";

// Submit reading with photo
export async function submitReading(data, photoUri) {
  try {
    // 1. Upload photo
    const photoFile = {
      name: `gauge_${Date.now()}.jpg`,
      type: "image/jpeg",
      uri: photoUri,
    };

    const uploadedPhoto = await storage.createFile(
      PHOTOS_BUCKET_ID,
      ID.unique(),
      photoFile
    );

    // 2. Create reading document
    const reading = await databases.createDocument(
      DATABASE_ID,
      READINGS_COLLECTION_ID,
      ID.unique(),
      {
        siteId: data.siteId,
        siteName: data.siteName,
        waterLevel: data.waterLevel,
        latitude: data.latitude,
        longitude: data.longitude,
        photoId: uploadedPhoto.$id,
        submittedBy: data.submittedBy,
        distanceFromSite: data.distanceFromSite,
        isVerified: data.distanceFromSite <= 100,
        ocrConfidence: data.ocrConfidence || null,
      }
    );

    return { success: true, reading };
  } catch (error) {
    console.error("Error submitting reading:", error);
    return { success: false, error: error.message };
  }
}

// Get readings for offline mode
export async function getReadings(limit = 20) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      READINGS_COLLECTION_ID,
      [Query.limit(limit), Query.orderDesc("$createdAt")]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching readings:", error);
    return [];
  }
}
