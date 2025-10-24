import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Provider as PaperProvider,
} from "react-native-paper";

// --- Mock Functions for Testing ---
// In a real app, these would be imported from your library files.
const mockSubmitReading = async (readingData, photoUri) => {
  console.log("Submitting reading:", { readingData, photoUri });
  // Simulate a network delay of 1.5 seconds
  await new Promise((resolve) => setTimeout(resolve, 1500));
  // Simulate a success or failure based on the input
  if (readingData.waterLevel > 10) {
    return {
      success: false,
      error: "Water level is dangerously high. Please re-verify.",
    };
  }
  return { success: true, reading: { id: "reading_123", ...readingData } };
};

const mockCalculateDistance = () => {
  // Return a mock distance in meters
  return 95;
};
// ------------------------------------

// This is the component you were working on.
// It no longer needs `navigation` or `route` props because we are providing the data directly.
function ReadingEntryScreen() {
  // Mock data that would normally come from navigation props
  const mockParams = {
    site: {
      id: "SITE-001",
      name: "Talegaon Dabhade River Gauge",
      latitude: 18.73,
      longitude: 73.65,
    },
    location: { latitude: 18.7305, longitude: 73.6505 },
    photoUri: "https://placehold.co/600x400/a3e635/1e1e1e?text=Gauge+Photo",
  };

  const { site, location, photoUri } = mockParams;
  const [waterLevel, setWaterLevel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(""); // State for on-screen error messages

  const distanceFromSite = mockCalculateDistance(
    location.latitude,
    location.longitude,
    site.latitude,
    site.longitude
  );

  const handleSubmit = async () => {
    setError(""); // Clear previous errors

    if (!waterLevel || isNaN(parseFloat(waterLevel))) {
      setError("Invalid Input: Please enter a valid water level.");
      return;
    }

    setSubmitting(true);

    const readingData = {
      siteId: site.id,
      siteName: site.name,
      waterLevel: parseFloat(waterLevel),
      latitude: location.latitude,
      longitude: location.longitude,
      submittedBy: "Field Officer",
      distanceFromSite: distanceFromSite,
      ocrConfidence: null,
    };

    const result = await mockSubmitReading(readingData, photoUri);

    setSubmitting(false);

    if (result.success) {
      console.log("Submission successful!", result.reading);
      // In a real app, you would navigate to a success screen here.
    } else {
      setError(`Submission Failed: ${result.error}`);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title>Captured Photo</Title>
          <Image source={{ uri: photoUri }} style={styles.photo} />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Site Information</Title>
          <Paragraph>
            <Text style={styles.boldText}>Site: </Text>
            {site.name}
          </Paragraph>
          <Paragraph>
            <Text style={styles.boldText}>ID: </Text>
            {site.id}
          </Paragraph>
          <Paragraph>
            <Text style={styles.boldText}>Location: </Text>
            {location.latitude.toFixed(6)}°, {location.longitude.toFixed(6)}°
          </Paragraph>
          <Paragraph>
            <Text style={styles.boldText}>Distance from site: </Text>
            {Math.round(distanceFromSite)}m
          </Paragraph>
          {distanceFromSite <= 100 ? (
            <Paragraph style={styles.verified}>✓ Location Verified</Paragraph>
          ) : (
            <Paragraph style={styles.unverified}>
              ⚠ Location Not Verified
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Water Level Reading</Title>
          <TextInput
            label="Water Level (meters)"
            value={waterLevel}
            onChangeText={setWaterLevel}
            keyboardType="decimal-pad"
            mode="outlined"
            placeholder="e.g., 2.45"
            style={{ marginTop: 10 }}
          />
          <Paragraph style={styles.helpText}>
            Enter the water level reading from the gauge post in meters.
          </Paragraph>
        </Card.Content>
      </Card>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
        disabled={submitting}
        loading={submitting}
      >
        {submitting ? "Submitting..." : "Submit Reading"}
      </Button>
    </ScrollView>
  );
}

// This is the main App component for your Expo project.
// It sets up the providers and renders your screen.
export default function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <ReadingEntryScreen />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  photo: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginTop: 10,
    resizeMode: "cover",
  },
  boldText: {
    fontWeight: "bold",
    color: "#333",
  },
  verified: {
    color: "#16a34a",
    fontWeight: "bold",
    marginTop: 5,
  },
  unverified: {
    color: "#dc2626",
    fontWeight: "bold",
    marginTop: 5,
  },
  helpText: {
    marginTop: 10,
    fontSize: 12,
    color: "#666",
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
  errorText: {
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
});
