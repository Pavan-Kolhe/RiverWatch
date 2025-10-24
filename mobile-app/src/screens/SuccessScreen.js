import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Card, Title, Paragraph, Button } from "react-native-paper";

export default function SuccessScreen({ navigation, route }) {
  const { reading } = route.params;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.center}>
          <View style={styles.successIcon}>
            <Title style={styles.checkmark}>✓</Title>
          </View>
          <Title style={styles.title}>Reading Submitted Successfully!</Title>
          <Paragraph style={styles.subtitle}>
            Your reading has been saved and synced to the dashboard
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Reading Summary</Title>
          <View style={styles.summaryRow}>
            <Paragraph style={styles.label}>Site:</Paragraph>
            <Paragraph style={styles.value}>{reading.siteName}</Paragraph>
          </View>
          <View style={styles.summaryRow}>
            <Paragraph style={styles.label}>Water Level:</Paragraph>
            <Paragraph style={[styles.value, styles.highlight]}>
              {reading.waterLevel.toFixed(2)} m
            </Paragraph>
          </View>
          <View style={styles.summaryRow}>
            <Paragraph style={styles.label}>Time:</Paragraph>
            <Paragraph style={styles.value}>
              {new Date(reading.$createdAt).toLocaleString()}
            </Paragraph>
          </View>
          <View style={styles.summaryRow}>
            <Paragraph style={styles.label}>Status:</Paragraph>
            {reading.isVerified ? (
              <Paragraph style={styles.verified}>✓ Verified</Paragraph>
            ) : (
              <Paragraph style={styles.unverified}>⚠ Unverified</Paragraph>
            )}
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => navigation.navigate("Home")}
        style={styles.button}
        icon="home"
      >
        Back to Home
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate("Camera", route.params)}
        style={styles.button}
        icon="camera"
      >
        Submit Another Reading
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
    justifyContent: "center",
  },
  card: {
    marginBottom: 16,
  },
  center: {
    alignItems: "center",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#dcfce7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  checkmark: {
    fontSize: 48,
    color: "#16a34a",
    margin: 0,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  label: {
    fontWeight: "600",
    color: "#666",
  },
  value: {
    fontWeight: "400",
  },
  highlight: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563eb",
  },
  verified: {
    color: "#16a34a",
    fontWeight: "bold",
  },
  unverified: {
    color: "#dc2626",
    fontWeight: "bold",
  },
  button: {
    marginVertical: 8,
    paddingVertical: 4,
  },
});
