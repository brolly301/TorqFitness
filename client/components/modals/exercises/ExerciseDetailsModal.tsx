import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Exercise, ModalProps } from "@/types/Global";
import DetailsTab from "./DetailsTab";
import ChartsTab from "./ChartsTab";
import RecordsTab from "./RecordsTab";
import HistoryTab from "./HistoryTab";
import { capitalizeWords } from "@/utils/helpers";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import ExerciseEditForm from "@/components/exercises/ExerciseEditForm";

type Props = ModalProps & {
  exercise: Exercise | null;
  handleAddExercise?: (exerciseId: string) => void;
  showAddButton: boolean;
};

type TabName = "Details" | "History" | "Records" | "Charts";

const TAB_NAMES: TabName[] = ["Details", "History", "Records", "Charts"];

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
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    if (modalVisible) {
      setTab("Details");
    }
  }, [modalVisible, exercise?.id]);

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleSubmit = () => {
    if (!exercise || !handleAddExercise) return;

    handleAddExercise(exercise.id);
    handleClose();
  };

  const handleEdit = () => {
    setEditModalVisible(true);
  };

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

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      {editModalVisible ? (
        <ExerciseEditForm
          setModalVisible={setModalVisible}
          setEditModalVisible={setEditModalVisible}
          exercise={exercise}
        />
      ) : (
        <View style={styles.overlay}>
          <Pressable onPress={handleClose} style={StyleSheet.absoluteFill} />

          <View style={styles.modalView}>
            <View style={styles.header}>
              <Pressable
                style={styles.iconButton}
                onPress={handleClose}
                hitSlop={8}
              >
                <AntDesign name="close" size={18 * scale} color={theme.text} />
              </Pressable>

              <View style={styles.headerActions}>
                {showAddButton && (
                  <Pressable
                    style={styles.primaryButton}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.primaryButtonText}>Add</Text>
                  </Pressable>
                )}

                {exercise?.userCreated && (
                  <Pressable
                    style={[
                      styles.secondaryButton,
                      showAddButton && styles.secondaryButtonWithGap,
                    ]}
                    onPress={handleEdit}
                  >
                    <Text style={styles.secondaryButtonText}>Edit</Text>
                  </Pressable>
                )}
              </View>
            </View>

            <Text style={styles.exerciseTitle} numberOfLines={2}>
              {exercise?.name ? capitalizeWords(exercise.name) : ""}
            </Text>

            <View style={styles.tabRowContainer}>
              {TAB_NAMES.map((tabName) => {
                const isActive = tab === tabName;

                return (
                  <Pressable
                    key={tabName}
                    style={[
                      styles.tab,
                      isActive ? styles.activeTab : styles.inactiveTab,
                    ]}
                    onPress={() => setTab(tabName)}
                  >
                    <Text
                      style={[
                        styles.tabLabel,
                        isActive
                          ? styles.activeTabLabel
                          : styles.inactiveTabLabel,
                      ]}
                    >
                      {tabName}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.contentContainer}>{renderTab()}</View>
          </View>
        </View>
      )}
    </Modal>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.55)",
      paddingHorizontal: 16 * scale,
    },

    modalView: {
      width: "100%",
      maxWidth: 420,
      height: "72%",
      borderRadius: 20 * scale,
      backgroundColor: theme.background,
      paddingTop: 16 * scale,
      paddingHorizontal: 16 * scale,
      paddingBottom: 16 * scale,
      borderWidth: 1,
      borderColor: theme.border,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14 * scale,
    },

    iconButton: {
      width: 36 * scale,
      height: 36 * scale,
      borderRadius: 10 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },

    headerActions: {
      flexDirection: "row",
      alignItems: "center",
    },

    primaryButton: {
      paddingVertical: 9 * scale,
      paddingHorizontal: 14 * scale,
      borderRadius: 10 * scale,
      backgroundColor: theme.buttonPrimary,
    },

    primaryButtonText: {
      color: theme.buttonPrimaryText,
      fontSize: 14 * scale,
      fontWeight: "700",
    },

    secondaryButton: {
      paddingVertical: 9 * scale,
      paddingHorizontal: 14 * scale,
      borderRadius: 10 * scale,
      backgroundColor: `${theme.buttonPrimary}15`,
      borderWidth: 1,
      borderColor: `${theme.buttonPrimary}30`,
    },

    secondaryButtonWithGap: {
      marginLeft: 8 * scale,
    },

    secondaryButtonText: {
      color: theme.buttonPrimary,
      fontSize: 14 * scale,
      fontWeight: "700",
    },

    exerciseTitle: {
      fontSize: 22 * scale,
      fontWeight: "700",
      textAlign: "center",
      color: theme.text,
      marginBottom: 14 * scale,
    },

    tabRowContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14 * scale,
      gap: 8 * scale,
    },

    tab: {
      flex: 1,
      paddingVertical: 10 * scale,
      borderRadius: 12 * scale,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
    },

    activeTab: {
      backgroundColor: theme.buttonPrimary,
      borderColor: theme.buttonPrimary,
    },

    inactiveTab: {
      backgroundColor: theme.card,
      borderColor: theme.border,
    },

    tabLabel: {
      fontSize: 14 * scale,
      fontWeight: "600",
    },

    activeTabLabel: {
      color: theme.buttonPrimaryText,
    },

    inactiveTabLabel: {
      color: theme.text,
    },

    contentContainer: {
      flex: 1,
    },
  });
