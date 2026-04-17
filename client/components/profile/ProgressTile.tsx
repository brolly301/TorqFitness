import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import TileWrapper from "./TileWrapper";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
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
                      size={20 * scale}
                      color={theme.buttonPrimary}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={22 * scale}
                      color={theme.buttonPrimary}
                    />
                  )}
                </View>

                <Text style={styles.rowLabel}>{item.label}</Text>
              </View>

              <View style={styles.rowRight}>
                <Entypo
                  name="area-graph"
                  size={20 * scale}
                  color={theme.buttonPrimary}
                />
                <Feather
                  style={styles.rowArrow}
                  name="arrow-right"
                  size={18 * scale}
                  color={theme.textMuted}
                />
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
    container: {},

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12 * scale,
    },

    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      marginRight: 12 * scale,
    },

    rowRight: {
      flexDirection: "row",
      alignItems: "center",
    },

    rowIcon: {
      width: 40 * scale,
      height: 40 * scale,
      borderRadius: 12 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      marginRight: 10 * scale,
    },

    rowLabel: {
      fontSize: 16 * scale,
      fontWeight: "500",
      color: theme.text,
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
