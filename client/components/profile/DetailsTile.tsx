import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import TileWrapper from "./TileWrapper";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import Feather from "@expo/vector-icons/Feather";

const DETAILS = [
  { label: "Height", value: `5'11"` },
  { label: "Weight", value: "163 lb" },
  { label: "Goal Weight", value: "147 lb" },
  { label: "Experience Level", value: "Advanced" },
];

export default function DetailsTile() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  return (
    <TileWrapper title="Your Details">
      <View style={styles.container}>
        {DETAILS.map((item, index) => (
          <React.Fragment key={item.label}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{item.label}</Text>

              <View style={styles.rowRight}>
                <Text style={styles.rowValue}>{item.value}</Text>
                <Feather
                  style={styles.rowArrow}
                  name="arrow-right"
                  size={18 * scale}
                  color={theme.textMuted}
                />
              </View>
            </View>

            {index !== DETAILS.length - 1 && <View style={styles.separator} />}
          </React.Fragment>
        ))}
      </View>
    </TileWrapper>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: { paddingHorizontal: 12, paddingVertical: 6 },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12 * scale,
    },

    rowRight: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 12 * scale,
    },

    rowLabel: {
      flex: 1,
      fontSize: 15 * scale,
      fontWeight: "500",
      color: theme.text,
    },

    rowValue: {
      fontSize: 15 * scale,
      fontWeight: "400",
      color: theme.textSecondary,
    },

    rowArrow: {
      marginLeft: 8 * scale,
    },

    separator: {
      width: "100%",
      height: 1,
      backgroundColor: theme.border,
      opacity: 0.5,
    },
  });
