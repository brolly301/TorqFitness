import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import AppModal from "@/components/ui/AppModal";
import { ModalProps } from "@/types/Global";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

type Props = ModalProps & {
  title: string;
  description?: string;
  confirmText: string;
  isConfirming?: boolean;
  confirmVariant?: "primary" | "danger";
  onConfirm: () => void;
};

export default function ConfirmationModal({
  modalVisible,
  setModalVisible,
  title,
  description,
  confirmText,
  confirmVariant = "primary",
  isConfirming = false,
  onConfirm,
}: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  return (
    <AppModal
      modalVisible={modalVisible}
      dismissDisabled={isConfirming}
      setModalVisible={setModalVisible}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>

        {!!description && <Text style={styles.description}>{description}</Text>}

        <View style={styles.buttonContainer}>
          <Pressable
            disabled={isConfirming}
            style={[
              styles.confirmButton,
              confirmVariant === "danger"
                ? styles.dangerButton
                : styles.primaryButton,
              isConfirming && { opacity: 0.6 },
            ]}
            onPress={onConfirm}
          >
            <Text
              style={[
                styles.confirmButtonText,
                confirmVariant === "danger"
                  ? styles.dangerButtonText
                  : styles.primaryButtonText,
              ]}
            >
              {isConfirming ? "Saving..." : confirmText}
            </Text>
          </Pressable>

          <Pressable
            style={styles.cancelButton}
            onPress={() => setModalVisible(false)}
            disabled={isConfirming}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </AppModal>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      borderRadius: 18 * scale,
      padding: 20 * scale,
      borderWidth: 1,
      borderColor: theme.border,
    },

    title: {
      fontSize: 20 * scale,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 8 * scale,
    },

    description: {
      fontSize: 15 * scale,
      lineHeight: 21 * scale,
      color: theme.textSecondary,
      marginBottom: 18 * scale,
    },

    buttonContainer: {
      gap: 10 * scale,
    },

    confirmButton: {
      borderRadius: 12 * scale,
      paddingVertical: 12 * scale,
      alignItems: "center",
      justifyContent: "center",
    },

    primaryButton: {
      backgroundColor: theme.buttonPrimary,
    },

    dangerButton: {
      backgroundColor: theme.error ?? "#DC2626",
    },

    confirmButtonText: {
      fontSize: 15 * scale,
      fontWeight: "700",
    },

    primaryButtonText: {
      color: theme.buttonPrimaryText,
    },

    dangerButtonText: {
      color: "#FFFFFF",
    },

    cancelButton: {
      borderRadius: 12 * scale,
      paddingVertical: 12 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.buttonSecondary,
      borderWidth: 1,
      borderColor: theme.border,
    },

    cancelButtonText: {
      fontSize: 15 * scale,
      fontWeight: "600",
      color: theme.buttonSecondaryText ?? theme.text,
    },
  });
