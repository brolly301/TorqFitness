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
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.iconButton}
              >
                <AntDesign name="close" size={20 * scale} color={theme.text} />
              </Pressable>
              <Text style={styles.name}>Units</Text>
            </View>
            <View style={[styles.unitContainer]}>
              <Pressable
                onPress={() => onChange("kg")}
                style={[
                  styles.unitTile,
                  {
                    borderColor:
                      settings?.weightLabel === "kg"
                        ? theme.buttonPrimary
                        : theme.inputBorder,
                  },
                ]}
              >
                <Text style={styles.unitText}>KG</Text>
              </Pressable>
              <Pressable
                onPress={() => onChange("lb")}
                style={[
                  styles.unitTile,
                  {
                    borderColor:
                      settings?.weightLabel === "lb"
                        ? theme.buttonPrimary
                        : theme.inputBorder,
                  },
                ]}
              >
                <Text style={styles.unitText}>LB</Text>
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
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      backgroundColor: theme.shadow,
    },
    modalView: {
      width: "89%",
      height: "18%",
      borderRadius: 12,
      backgroundColor: theme.background,
      paddingTop: 15,
      paddingHorizontal: 15,
      paddingBottom: 26,
    },
    container: {
      flex: 1,
    },

    header: {
      height: 44 * scale,
      justifyContent: "center",
      marginBottom: 20 * scale,
      position: "relative",
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
    unitContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    unitTile: {
      width: "48%",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      backgroundColor: theme.card,
      textAlign: "center",
      borderWidth: 1.2,
    },
    unitText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
    },
  });
