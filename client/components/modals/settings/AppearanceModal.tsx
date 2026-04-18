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
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.iconButton}
              >
                <AntDesign name="close" size={20 * scale} color={theme.text} />
              </Pressable>
              <Text style={styles.name}>Appearance</Text>
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
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      backgroundColor: theme.shadow,
    },
    modalView: {
      width: "89%",
      height: "30%",
      borderRadius: 12,
      backgroundColor: theme.background,
      paddingTop: 15,
      paddingHorizontal: 15,
      paddingBottom: 26,
    },
    container: {
      flex: 1,
    },
    name: {
      position: "absolute",
      left: 60 * scale,
      right: 60 * scale,
      fontSize: 22 * scale,
      fontWeight: "700",
      textAlign: "center",
      color: theme.text,
    },

    header: {
      height: 44 * scale,
      justifyContent: "center",
      marginBottom: 20 * scale,
      position: "relative",
    },
    label: {
      fontSize: 18 * scale,
      color: theme.textSecondary,
      marginBottom: 10 * scale,
    },
    iconButton: {
      position: "absolute",
      left: 0,
      width: 36 * scale,
      height: 36 * scale,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
  });
