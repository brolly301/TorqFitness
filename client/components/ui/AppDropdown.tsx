import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import EvilIcons from "@expo/vector-icons/EvilIcons";

type Props = {
  data: string[];
  selected: string;
  setSelected: (value: string) => void;
  placeholder?: string;
};

export default function AppDropdown({
  data,
  selected,
  setSelected,
  placeholder = "Select an option",
}: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const [active, setActive] = useState(false);

  const handleSelected = (item: string) => {
    setSelected(item);
    setActive(false);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={[
          styles.container,
          {
            borderColor: active ? theme.inputFocusBorder : theme.inputBorder,
          },
        ]}
        onPress={() => setActive((prev) => !prev)}
      >
        <View style={styles.nameIcon}>
          <Text
            style={[styles.valueText, !selected && styles.placeholderText]}
            numberOfLines={1}
          >
            {selected || placeholder}
          </Text>

          <EvilIcons
            name={active ? "chevron-down" : "chevron-right"}
            size={24 * scale}
            color={theme.textSecondary}
          />
        </View>
      </Pressable>

      {active && (
        <View style={styles.dropdown}>
          {data.map((item, index) => {
            const isSelected = item === selected;
            const isLast = index === data.length - 1;

            return (
              <Pressable
                key={item}
                style={[styles.item, !isLast && styles.itemBorder]}
                onPress={() => handleSelected(item)}
              >
                <Text
                  style={[
                    styles.itemText,
                    isSelected && styles.selectedItemText,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    wrapper: {
      marginBottom: 16 * scale,
      position: "relative",
      zIndex: 100,
    },

    container: {
      minHeight: 46 * scale,
      borderRadius: 12 * scale,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      paddingHorizontal: 12 * scale,
      paddingVertical: 12 * scale,
      backgroundColor: theme.buttonSecondary,
      justifyContent: "center",
    },

    nameIcon: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12 * scale,
    },

    valueText: {
      flex: 1,
      fontSize: 15 * scale,
      color: theme.text,
    },

    placeholderText: {
      color: theme.textSecondary,
    },

    dropdown: {
      marginTop: 6 * scale,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      borderRadius: 12 * scale,
      overflow: "hidden",
      backgroundColor: theme.card,
      zIndex: 1000,
      elevation: 8,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },

    item: {
      paddingHorizontal: 12 * scale,
      paddingVertical: 12 * scale,
      backgroundColor: theme.card,
    },

    itemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    itemText: {
      fontSize: 15 * scale,
      color: theme.text,
    },

    selectedItemText: {
      color: theme.buttonPrimary,
      fontWeight: "600",
    },
  });
