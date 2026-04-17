import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import TileWrapper from "../TileWrapper";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { SettingsItem } from "./SettingsList";

type SectionProps = {
  title: string;
  items: SettingsItem[];
};

export default function SettingsSection({ title, items }: SectionProps) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const renderIcon = (item: SettingsItem) => {
    const iconColor = item.danger ? theme.error : theme.buttonPrimary;
    const iconSize = 20 * scale;

    switch (item.iconType) {
      case "feather":
        return (
          <Feather
            name={item.icon as React.ComponentProps<typeof Feather>["name"]}
            size={iconSize}
            color={iconColor}
          />
        );

      case "material":
        return (
          <MaterialIcons
            name={
              item.icon as React.ComponentProps<typeof MaterialIcons>["name"]
            }
            size={22 * scale}
            color={iconColor}
          />
        );

      case "materialCommunity":
        return (
          <MaterialCommunityIcons
            name={
              item.icon as React.ComponentProps<
                typeof MaterialCommunityIcons
              >["name"]
            }
            size={22 * scale}
            color={iconColor}
          />
        );

      case "entypo":
        return (
          <Entypo
            name={item.icon as React.ComponentProps<typeof Entypo>["name"]}
            size={20 * scale}
            color={iconColor}
          />
        );

      default:
        return null;
    }
  };

  return (
    <TileWrapper title={title}>
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          <Pressable
            style={styles.row}
            onPress={item.onPress}
            android_ripple={{ color: theme.press }}
          >
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>{renderIcon(item)}</View>

              <Text style={[styles.rowLabel, item.danger && styles.dangerText]}>
                {item.label}
              </Text>
            </View>

            <View style={styles.rowRight}>
              <Feather
                style={styles.rowArrow}
                name="chevron-right"
                size={18 * scale}
                color={theme.textMuted}
              />
            </View>
          </Pressable>

          {index !== items.length - 1 && <View style={styles.separator} />}
        </React.Fragment>
      ))}
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
      width: 28 * scale,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14 * scale,
    },

    rowLabel: {
      fontSize: 16 * scale,
      fontWeight: "500",
      color: theme.text,
    },

    dangerText: {
      color: theme.error,
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
