import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { ModalProps } from "@/types/Global";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { submitRating } from "@/api/settings";
import { useUserContext } from "@/context/UserContext";

type Props = ModalProps;

export default function RateModal({ modalVisible, setModalVisible }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const [rating, setRating] = useState<number | null>(null);
  const { authToken } = useUserContext();

  const handleSubmit = async () => {
    if (!rating) return;
    await submitRating(rating, authToken.token);
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
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.iconButton}
              >
                <AntDesign name="close" size={20 * scale} color={theme.text} />
              </Pressable>
              <Text style={styles.name}>Rate App</Text>
            </View>
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((stars) => {
                return (
                  <Pressable onPress={() => setRating(stars)}>
                    <FontAwesome
                      size={50}
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
              // disabled={isDisabled}
              style={[styles.button]}
            >
              <Text style={[styles.buttonText]}>Submit Rating</Text>
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
    starContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12 * scale,
      paddingVertical: 12 * scale,
      marginTop: 10 * scale,
    },

    buttonText: {
      fontSize: 15 * scale,
      fontWeight: "700",
    },
  });
