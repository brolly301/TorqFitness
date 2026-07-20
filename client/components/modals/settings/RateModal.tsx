import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { ModalProps } from "@/types/Global";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { submitRating } from "@/api/settings";
import { useUserContext } from "@/context/UserContext";
import { toggleToast } from "@/utils/toggleToast";

type Props = ModalProps;

export default function RateModal({ modalVisible, setModalVisible }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const [rating, setRating] = useState<number | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDisabled = rating === null || isSubmitting;
  const { authToken } = useUserContext();

  const handleSubmit = async () => {
    if (rating === null || isSubmitting || !authToken.token) return;

    try {
      setIsSubmitting(true);

      await submitRating(rating, authToken.token);

      toggleToast({
        type: "success",
        text1: "Rating submitted",
        text2: "Thanks for your feedback!",
      });

      setRating(null);
      setModalVisible(false);
    } catch (error) {
      toggleToast({
        type: "error",
        text1: "Rating failed",
        text2:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;

    setRating(null);
    setModalVisible(false);
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.centeredView}>
        <Pressable
          onPress={() => handleClose()}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.modalView}>
          <View style={styles.container}>
           <View style={styles.header}>
  <View style={styles.titleContainer}>
    <Text style={styles.name}>Rate App</Text>
    <Text style={styles.subText}>How are you enjoying Torq?</Text>
  </View>

  <Pressable
    onPress={handleClose}
    style={styles.iconButton}
    hitSlop={8}
    accessibilityRole="button"
    accessibilityLabel="Close rating"
  >
    <AntDesign
      name="close"
      size={18 * scale}
      color={theme.text}
    />
  </Pressable>
</View>           <View style={styles.starContainer}>
  {[1, 2, 3, 4, 5].map((stars) => {
    const isSelected = rating !== null && stars <= rating;

    return (
      <Pressable
        key={stars}
        onPress={() => setRating(stars)}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={`${stars} star rating`}
      >
        <FontAwesome
          color={
            isSelected
              ? theme.buttonPrimary
              : theme.textSecondary
          }
          size={32 * scale}
          name={isSelected ? "star" : "star-o"}
        />
      </Pressable>
    );
  })}
</View>
           <Pressable
  onPress={handleSubmit}
  disabled={isDisabled}
  style={({ pressed }) => [
    styles.button,
    isDisabled ? styles.buttonDisabled : styles.buttonEnabled,
    pressed && !isDisabled && styles.buttonPressed,
  ]}
>
  <Text
    style={[
      styles.buttonText,
      isDisabled
        ? styles.buttonDisabledText
        : styles.buttonEnabledText,
    ]}
  >
    {isSubmitting ? "Submitting..." : "Submit Rating"}
  </Text>
</Pressable>
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
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12 * scale,
      marginBottom: 24 * scale,
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

    subText: {
      color: theme.textSecondary,
      fontSize: 14 * scale,
      lineHeight: 20 * scale,
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

    starContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      marginBottom: 26 * scale,
      paddingHorizontal: 6 * scale,
    },

    button: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: 46 * scale,
      paddingHorizontal: 16 * scale,
      borderWidth: 1,
      borderRadius: 12 * scale,
    },

    buttonEnabled: {
      backgroundColor: theme.buttonPrimary + "14",
      borderColor: theme.buttonPrimary + "40",
    },

    buttonDisabled: {
      backgroundColor: theme.buttonDisabled,
      borderColor: theme.border,
    },

    buttonPressed: {
      opacity: 0.7,
    },

    buttonText: {
      fontSize: 15 * scale,
      fontWeight: "700",
    },

    buttonEnabledText: {
      color: theme.buttonPrimary,
    },

    buttonDisabledText: {
      color: theme.buttonDisabledText,
    },
  });