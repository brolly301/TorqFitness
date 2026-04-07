import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Exercise, ModalProps } from "@/types/Global";
import DetailsTab from "./DetailsTab";
import ChartsTab from "./ChartsTab";
import RecordsTab from "./RecordsTab";
import HistoryTab from "./HistoryTab";
import { capitalizeWords } from "@/utils/helpers";
import ExerciseEditModal from "./ExerciseEditModal";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = ModalProps & {
  exercise: Exercise | null;
  handleAddExercise?: (exerciseId: string) => void;
  showAddButton: boolean;
};

type TabName = "Details" | "Records" | "History" | "Charts";

export default function ExerciseDetailsModal({
  modalVisible,
  setModalVisible,
  exercise,
  handleAddExercise,
  showAddButton,
}: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const [tab, setTab] = useState<TabName>("Details");
  const tabName: TabName[] = ["Details", "History", "Records", "Charts"];

  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);

  const renderTab = () => {
    switch (tab) {
      case "Details":
        return <DetailsTab exercise={exercise} />;
      case "History":
        return <HistoryTab exercise={exercise} />;
      case "Records":
        return <RecordsTab exercise={exercise} />;
      case "Charts":
        return <ChartsTab exercise={exercise} />;
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    if (!exercise) return;

    if (handleAddExercise) {
      handleAddExercise(exercise.id);
    }
    setModalVisible(false);
  };

  return (
    <>
      <ExerciseEditModal
        modalVisible={editModalVisible}
        setModalVisible={setEditModalVisible}
        exercise={exercise}
      />
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.centeredView}>
          <Pressable
            onPress={() => setModalVisible(!modalVisible)}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.modalView}>
            <View style={styles.iconContainer}>
              <EvilIcons
                name="close"
                size={22}
                color={"black"}
                onPress={() => setModalVisible(!modalVisible)}
              />
              {showAddButton && (
                <Pressable style={styles.addButton} onPress={handleSubmit}>
                  <Text style={styles.addButtonText}>Add</Text>
                </Pressable>
              )}
              {exercise?.userCreated && (
                <Pressable
                  style={styles.addButton}
                  onPress={() => {
                    setModalVisible(false);
                    setEditModalVisible(true);
                  }}
                >
                  <Text style={styles.addButtonText}>Edit</Text>
                </Pressable>
              )}
            </View>
            <Text style={styles.exercise}>
              {exercise?.name ? capitalizeWords(exercise?.name) : ""}
            </Text>
            <View style={styles.tabRowContainer}>
              {tabName.map((tab) => {
                return (
                  <Pressable
                    key={tab}
                    style={styles.tab}
                    onPress={() => setTab(tab)}
                  >
                    <Text style={styles.tabLabel}>{tab}</Text>
                  </Pressable>
                );
              })}
            </View>
            <>{renderTab()}</>
          </View>
        </View>
      </Modal>
    </>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    centeredView: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
    },
    modalView: {
      width: "89%",
      height: "60%",
      borderRadius: 12,
      backgroundColor: "white",
      paddingTop: 15,
      paddingHorizontal: 15,
      paddingBottom: 26,
    },
    closeButton: {
      alignSelf: "flex-end",
    },
    exercise: {
      fontSize: 20 * scale,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 15 * scale,
    },
    tabRowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    tab: {
      paddingVertical: 8 * scale,
      paddingHorizontal: 16 * scale,
      borderRadius: 6,
      backgroundColor: theme.focus,
      marginHorizontal: 4 * scale,
    },
    tabLabel: {
      color: theme.textPrimary,

      fontWeight: "700",
    },
    iconContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15 * scale,
    },
    addButton: {
      paddingVertical: 8 * scale,
      paddingHorizontal: 16 * scale,
      borderRadius: 6,
      backgroundColor: theme.focus,
      marginHorizontal: 4 * scale,
    },
    addButtonText: {
      color: theme.textPrimary,
    },
  });
