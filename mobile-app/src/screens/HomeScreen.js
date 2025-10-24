import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Card, Title, Paragraph, Button, List, Chip } from "react-native-paper";
import * as Location from "expo-location";
import { SITES, findNearestSite } from "../lib/siteData";

export default function HomeScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [nearestSite, setNearestSite] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Location permission is required for site verification."
      );
      return;
    }
    getCurrentLocation();
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc);

      const nearest = findNearestSite(
        loc.coords.latitude,
        loc.coords.longitude
      );
      setNearestSite(nearest);
    } catch (error) {
      Alert.alert("Error", "Could not get location");
    } finally {
      setLoading(false);
    }
  };

  const handleCaptureReading = () => {
    if (!location) {
      Alert.alert("Error", "Please wait for location to be detected");
      return;
    }

    if (!nearestSite || nearestSite.distance > 100) {
      Alert.alert(
        "Too Far from Site",
        `You are ${Math.round(
          nearestSite?.distance || 0
        )}m away from the nearest site. Please move closer (within 100m).`,
        [{ text: "OK" }]
      );
      return;
    }

    navigation.navigate("Camera", {
      site: nearestSite,
      location: location.coords,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Welcome, Field Officer</Title>
          <Paragraph>
            Capture water level readings with GPS verification
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Location Status */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Current Location</Title>
          {loading ? (
            <Paragraph>Detecting location...</Paragraph>
          ) : location ? (
            <>
              <Paragraph>
                📍 Lat: {location.coords.latitude.toFixed(6)}°
              </Paragraph>
              <Paragraph>
                📍 Long: {location.coords.longitude.toFixed(6)}°
              </Paragraph>
              <Paragraph>
                ±{location.coords.accuracy?.toFixed(0)}m accuracy
              </Paragraph>
            </>
          ) : (
            <Paragraph>Location not available</Paragraph>
          )}
          <Button
            mode="outlined"
            onPress={getCurrentLocation}
            style={{ marginTop: 10 }}
          >
            Refresh Location
          </Button>
        </Card.Content>
      </Card>

      {/* Nearest Site */}
      {nearestSite && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Nearest Site</Title>
            <Paragraph style={styles.siteName}>{nearestSite.name}</Paragraph>
            <Paragraph>ID: {nearestSite.id}</Paragraph>
            <View style={{ marginTop: 10 }}>
              {nearestSite.distance <= 100 ? (
                <Chip icon="check-circle" style={styles.chipGreen}>
                  Within Range ({Math.round(nearestSite.distance)}m)
                </Chip>
              ) : (
                <Chip icon="alert-circle" style={styles.chipRed}>
                  Too Far ({Math.round(nearestSite.distance)}m)
                </Chip>
              )}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* All Sites */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Assigned Sites</Title>
          {SITES.map((site) => (
            <List.Item
              key={site.id}
              title={site.name}
              description={`ID: ${site.id}`}
              left={(props) => <List.Icon {...props} icon="map-marker" />}
            />
          ))}
        </Card.Content>
      </Card>

      {/* Capture Button */}
      <Button
        mode="contained"
        icon="camera"
        onPress={handleCaptureReading}
        style={styles.captureButton}
        disabled={!location || loading}
      >
        Capture Reading
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  siteName: {
    fontWeight: "bold",
    fontSize: 18,
  },
  chipGreen: {
    backgroundColor: "#dcfce7",
  },
  chipRed: {
    backgroundColor: "#fee2e2",
  },
  captureButton: {
    marginVertical: 20,
    paddingVertical: 8,
  },
});
