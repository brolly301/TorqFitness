import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import TileWrapper from "./TileWrapper";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";


const PROGRESS_ITEMS = [
  {
    label: "Weight Trend",
    icon: "trending-up" as const,
    iconType: "feather" as const,
  },
  {
    label: "Workout Frequency",
    icon: "calendar" as const,
    iconType: "feather" as const,
  },
  {
    label: "Volume Lifted",
    icon: "weight-kilogram" as const,
    iconType: "material" as const,
  },
];

export default function ProgressTile() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  return (
    <TileWrapper title="Progress">
      <View style={styles.container}>
        {PROGRESS_ITEMS.map((item, index) => (
        <React.Fragment key={item.label}>
  <View style={styles.row}>
    <View style={styles.rowLeft}>
      <View style={styles.rowIcon}>
        {item.iconType === "feather" ? (
          <Feather
            name={item.icon}
            size={19 * scale}
            color={theme.buttonPrimary}
          />
        ) : (
          <MaterialCommunityIcons
            name={item.icon}
            size={21 * scale}
            color={theme.buttonPrimary}
          />
        )}
      </View>

      <Text style={styles.rowLabel}>{item.label}</Text>
    </View>

    <View style={styles.statusPill}>
      <Text style={styles.statusText}>Coming later</Text>
    </View>
  </View>

  {index !== PROGRESS_ITEMS.length - 1 && (
    <View style={styles.separator} />
  )}
</React.Fragment>
        ))}
      </View>
    </TileWrapper>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 12 * scale,
      paddingVertical: 5 * scale,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 11 * scale,
    },

    rowLeft: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      marginRight: 10 * scale,
    },

    rowIcon: {
      width: 38 * scale,
      height: 38 * scale,
      marginRight: 10 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.buttonPrimary + "12",
      borderRadius: 11 * scale,
    },

    rowLabel: {
      flex: 1,
      color: theme.text,
      fontSize: 15 * scale,
      fontWeight: "500",
    },

    statusPill: {
      paddingHorizontal: 8 * scale,
      paddingVertical: 5 * scale,
      backgroundColor: theme.text + "08",
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 9 * scale,
    },

    statusText: {
      color: theme.textSecondary,
      fontSize: 11 * scale,
      fontWeight: "600",
    },

    separator: {
      width: "100%",
      height: 1,
      backgroundColor: theme.border,
    },
  });