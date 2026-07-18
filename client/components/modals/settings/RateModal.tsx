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
              <Pressable
                onPress={() => handleClose()}
                style={styles.iconButton}
              >
                <AntDesign name="close" size={20 * scale} color={theme.text} />
              </Pressable>
              <Text style={styles.name}>Rate App</Text>
            </View>
            <Text style={styles.subText}>How are you enjoying Torq?</Text>
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((stars) => {
                return (
                  <Pressable onPress={() => setRating(stars)} key={stars}>
                    <FontAwesome
                      color={theme.buttonPrimary}
                      size={40}
                      name={
                        rating !== null && stars <= rating ? "star" : "star-o"
                      }
                    />
                  </Pressable>
                );
              })}
            </View>
            <Pressable
              onPress={handleSubmit}
              disabled={isDisabled}
              style={[
                styles.button,
                {
                  backgroundColor: isDisabled
                    ? theme.buttonDisabled
                    : theme.buttonPrimary,
                },
              ]}
            >
              <Text style={styles.buttonText}>
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
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      backgroundColor: theme.shadow,
    },
    modalView: {
      width: "89%",
      maxHeight: "50%",
      borderRadius: 12,
      backgroundColor: theme.background,
      paddingTop: 15,
      paddingHorizontal: 15,
      paddingBottom: 26,
    },
    container: {},
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
      position: "relative",
      marginBottom: 20 * scale,
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
    starContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 30,
    },
    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12 * scale,
      paddingVertical: 12 * scale,
      marginTop: 10 * scale,
      backgroundColor: theme.buttonPrimary,
    },

    buttonText: {
      fontSize: 15 * scale,
      fontWeight: "700",
      color: theme.buttonPrimaryText,
    },
    subText: {
      fontSize: 18 * scale,
      color: theme.textSecondary,
      fontWeight: "500",
    },
  });
