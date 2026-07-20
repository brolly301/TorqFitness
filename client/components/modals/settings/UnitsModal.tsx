import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ModalProps } from "@/types/Global";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Theme } from "@/types/Theme";
import { useSettingsContext, WeightLabelType } from "@/context/SettingsContext";
type Props = ModalProps;

export default function UnitsModal({ modalVisible, setModalVisible }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { settings, updateSetting } = useSettingsContext();

  const onChange = (value: WeightLabelType) => {
    if (settings?.weightLabel === value) return;

    updateSetting("weightLabel", value);
  };

  return (
    <Modal visible={modalVisible} transparent animationType="fade">
      <View style={styles.centeredView}>
        <Pressable
          onPress={() => setModalVisible(!modalVisible)}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.modalView}>
          <View style={styles.container}>
          <View style={styles.header}>
  <View style={styles.titleContainer}>
    <Text style={styles.name}>Units</Text>
    <Text style={styles.description}>
      Choose how weight is displayed throughout the app
    </Text>
  </View>

  <Pressable
    onPress={() => setModalVisible(false)}
    style={styles.iconButton}
    hitSlop={8}
    accessibilityRole="button"
    accessibilityLabel="Close unit settings"
  >
    <AntDesign
      name="close"
      size={18 * scale}
      color={theme.text}
    />
  </Pressable>
</View>

<View style={styles.unitContainer}>
  <Pressable
    onPress={() => onChange("kg")}
    style={({ pressed }) => [
      styles.unitTile,
      settings?.weightLabel === "kg"
        ? styles.selectedUnit
        : styles.unselectedUnit,
      pressed && styles.unitPressed,
    ]}
  >
    <Text
      style={[
        styles.unitValue,
        settings?.weightLabel === "kg" && styles.selectedUnitText,
      ]}
    >
      KG
    </Text>

    <Text style={styles.unitLabel}>Kilograms</Text>
  </Pressable>

  <Pressable
    onPress={() => onChange("lb")}
    style={({ pressed }) => [
      styles.unitTile,
      settings?.weightLabel === "lb"
        ? styles.selectedUnit
        : styles.unselectedUnit,
      pressed && styles.unitPressed,
    ]}
  >
    <Text
      style={[
        styles.unitValue,
        settings?.weightLabel === "lb" && styles.selectedUnitText,
      ]}
    >
      LB
    </Text>

    <Text style={styles.unitLabel}>Pounds</Text>
  </Pressable>
</View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16 * scale,
      backgroundColor: theme.shadow,
    },

    modalView: {
      width: "100%",
      maxWidth: 420,
      padding: 16 * scale,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 20 * scale,
    },

    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12 * scale,
      marginBottom: 20 * scale,
    },

    titleContainer: {
      flex: 1,
    },

    name: {
      marginBottom: 4 * scale,
      color: theme.text,
      fontSize: 22 * scale,
      fontWeight: "700",
    },

    description: {
      color: theme.textSecondary,
      fontSize: 13 * scale,
      lineHeight: 18 * scale,
    },

    iconButton: {
      width: 36 * scale,
      height: 36 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10 * scale,
    },

    unitContainer: {
      flexDirection: "row",
      gap: 10 * scale,
    },

    unitTile: {
      flex: 1,
      minHeight: 88 * scale,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderRadius: 13 * scale,
    },

    selectedUnit: {
      backgroundColor: theme.buttonPrimary + "14",
      borderColor: theme.buttonPrimary + "40",
    },

    unselectedUnit: {
      backgroundColor: theme.card,
      borderColor: theme.border,
    },

    unitPressed: {
      opacity: 0.7,
    },

    unitValue: {
      marginBottom: 5 * scale,
      color: theme.text,
      fontSize: 18 * scale,
      fontWeight: "700",
    },

    selectedUnitText: {
      color: theme.buttonPrimary,
    },

    unitLabel: {
      color: theme.textSecondary,
      fontSize: 12 * scale,
      fontWeight: "500",
    },
  });