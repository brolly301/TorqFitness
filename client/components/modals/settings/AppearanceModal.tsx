import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { ModalProps } from "@/types/Global";
import { Settings } from "@/types/User";
import { useAppTheme } from "@/hooks/useAppTheme";
import ThemeToggle from "@/components/profile/settings/ThemeToggle";
import { Theme } from "@/types/Theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontToggle from "@/components/profile/settings/FontToggle";

type Props = ModalProps;

export default function AppearanceModal({
  modalVisible,
  setModalVisible,
}: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

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
  <Text style={styles.name}>Appearance</Text>

  <Pressable
    onPress={() => setModalVisible(false)}
    style={styles.iconButton}
    hitSlop={8}
    accessibilityRole="button"
    accessibilityLabel="Close appearance settings"
  >
    <AntDesign
      name="close"
      size={18 * scale}
      color={theme.text}
    />
  </Pressable>
</View>
            <Text style={styles.label}>Theme</Text>
            <ThemeToggle />
            <Text style={styles.label}>Font Size</Text>

            <FontToggle />
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

    container: {},

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12 * scale,
      marginBottom: 20 * scale,
    },

    name: {
      flex: 1,
      color: theme.text,
      fontSize: 22 * scale,
      fontWeight: "700",
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

    label: {
      marginBottom: 10 * scale,
      color: theme.textSecondary,
      fontSize: 14 * scale,
      fontWeight: "600",
    },
  });