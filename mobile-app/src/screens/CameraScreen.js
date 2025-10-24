import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  StatusBar,
  SafeAreaView,
} from "react-native";
import {
  Provider as PaperProvider,
  DefaultTheme,
  Card,
  Title,
  Paragraph,
  TextInput,
  Button,
  Appbar,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// --- App Theme Configuration ---
// A modern, clean theme for the application.
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#0066cc",
    accent: "#4CAF50",
    background: "#f7f9fc",
    surface: "#ffffff",
    text: "#333333",
    placeholder: "#888888",
    success: "#2e7d32",
    error: "#d32f2f",
  },
  roundness: 8,
};

// --- Mock Functions for Standalone Testing ---
// These simulate fetching data and submitting it to a server.
const mockSubmitReading = async (readingData) => {
  console.log("Submitting reading:", readingData);
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay
  if (readingData.waterLevel > 10 || readingData.waterLevel < 0) {
    return { success: false, error: "Reading is outside the normal range." };
  }
  return {
    success: true,
    reading: {
      id: `reading_${Math.random().toString(36).substr(2, 9)}`,
      ...readingData,
    },
  };
};

const mockCalculateDistance = () => 42; // meters
// -------------------------------------------

// --- Main Screen Component ---
function ReadingEntryScreen() {
  // Mock data that would normally come from navigation (route.params)
  const mockData = {
    site: {
      id: "SITE-TGN-042",
      name: "Indrayani River Gauge",
      latitude: 18.73,
      longitude: 73.65,
    },
    location: {
      latitude: 18.7303,
      longitude: 73.6502,
    },
    // A placeholder image for the captured photo.
    photoUri:
      "https://placehold.co/800x600/60a5fa/ffffff?text=River+Gauge+Photo&font=roboto",
  };

  const [waterLevel, setWaterLevel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { site, location, photoUri } = mockData;
  const distanceFromSite = mockCalculateDistance();
  const isLocationVerified = distanceFromSite <= 100;

  const handleSubmit = async () => {
    setError("");
    setIsSuccess(false);

    if (!waterLevel || isNaN(parseFloat(waterLevel))) {
      setError("Please enter a valid number for the water level.");
      return;
    }

    setSubmitting(true);
    const readingData = {
      siteId: site.id,
      siteName: site.name,
      waterLevel: parseFloat(waterLevel),
      latitude: location.latitude,
      longitude: location.longitude,
      submittedBy: "Field Officer (Demo)",
      distanceFromSite: distanceFromSite,
    };

    const result = await mockSubmitReading(readingData);
    setSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      console.log("Submission successful!", result.reading);
      setWaterLevel(""); // Clear input on success
    } else {
      setError(`Submission Failed: ${result.error}`);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Card for displaying the captured photo */}
      <Card style={styles.card}>
        <Card.Cover source={{ uri: photoUri }} style={styles.cardCover} />
        <Card.Title
          title="Captured Gauge Photo"
          subtitle="Talegaon Dabhade, 6:03 PM"
        />
      </Card>

      {/* Card for displaying site and location information */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Site Information</Title>
          <InfoRow icon="map-marker" label="Site Name" value={site.name} />
          <InfoRow icon="identifier" label="Site ID" value={site.id} />
          <InfoRow
            icon="crosshairs-gps"
            label="Your Location"
            value={`${location.latitude.toFixed(
              4
            )}°, ${location.longitude.toFixed(4)}°`}
          />
          <View
            style={[
              styles.verificationBadge,
              isLocationVerified ? styles.verifiedBg : styles.unverifiedBg,
            ]}
          >
            <MaterialCommunityIcons
              name={
                isLocationVerified
                  ? "check-circle-outline"
                  : "alert-circle-outline"
              }
              size={20}
              color="#fff"
            />
            <Text style={styles.verificationText}>
              {isLocationVerified
                ? `Location Verified (${distanceFromSite}m from site)`
                : `Location Not Verified (${distanceFromSite}m from site)`}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Card for water level input */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Enter Water Level</Title>
          <TextInput
            label="Water Level (in meters)"
            value={waterLevel}
            onChangeText={(text) => {
              setWaterLevel(text);
              setError("");
              setIsSuccess(false);
            }}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="ruler" />}
          />
          <Paragraph style={styles.helpText}>
            Enter the reading from the gauge post. Example: 2.45
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Display Success or Error Messages */}
      {isSuccess && (
        <View style={styles.messageContainerSuccess}>
          <MaterialCommunityIcons
            name="check-all"
            size={20}
            color={theme.colors.success}
          />
          <Text style={styles.successText}>
            Reading submitted successfully!
          </Text>
        </View>
      )}
      {error ? (
        <View style={styles.messageContainerError}>
          <MaterialCommunityIcons
            name="alert-octagon-outline"
            size={20}
            color={theme.colors.error}
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Submit Button */}
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
        labelStyle={styles.submitButtonText}
        icon={submitting ? null : "arrow-up-bold-box-outline"}
        disabled={submitting}
        loading={submitting}
      >
        {submitting ? "Submitting..." : "Submit Reading"}
      </Button>
    </ScrollView>
  );
}

// A reusable component for displaying a row of information with an icon
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <MaterialCommunityIcons
      name={icon}
      size={24}
      color={theme.colors.primary}
      style={styles.infoIcon}
    />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

// --- Main App Component (Entry Point) ---
export default function App() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />
      <SafeAreaView style={styles.safeArea}>
        <Appbar.Header>
          <Appbar.Content
            title="Water Level Logger"
            subtitle="Field Data Entry"
          />
        </Appbar.Header>
        <ReadingEntryScreen />
      </SafeAreaView>
    </PaperProvider>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 20,
    elevation: 4,
    borderRadius: theme.roundness,
  },
  cardCover: {
    borderTopLeftRadius: theme.roundness,
    borderTopRightRadius: theme.roundness,
  },
  cardTitle: {
    marginBottom: 12,
    color: theme.colors.primary,
  },
  input: {
    marginTop: 10,
    backgroundColor: "#fff",
  },
  helpText: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginTop: 8,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 30, // Make it a pill shape
    elevation: 2,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: theme.colors.placeholder,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 16,
    color: theme.colors.text,
  },
  verificationBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 30,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  verifiedBg: {
    backgroundColor: theme.colors.success,
  },
  unverifiedBg: {
    backgroundColor: theme.colors.error,
  },
  verificationText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
  },
  messageContainerSuccess: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    padding: 12,
    borderRadius: theme.roundness,
    marginTop: 10,
    borderLeftWidth: 5,
    borderLeftColor: theme.colors.success,
  },
  messageContainerError: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: theme.roundness,
    marginTop: 10,
    borderLeftWidth: 5,
    borderLeftColor: theme.colors.error,
  },
  successText: {
    color: theme.colors.success,
    fontWeight: "bold",
    marginLeft: 10,
  },
  errorText: {
    color: theme.colors.error,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
