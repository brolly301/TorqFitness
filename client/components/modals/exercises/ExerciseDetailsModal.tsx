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
  <Text style={styles.exerciseTitle} numberOfLines={2}>
    {exercise?.name ? capitalizeWords(exercise.name) : ""}
  </Text>

  <Pressable
    style={styles.iconButton}
    onPress={handleClose}
    hitSlop={8}
    accessibilityRole="button"
    accessibilityLabel="Close exercise details"
  >
    <AntDesign
      name="close"
      size={18 * scale}
      color={theme.text}
    />
  </Pressable>
</View>

{(showAddButton || exercise?.userCreated) && (
  <View style={styles.headerActions}>
    {showAddButton && (
      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.actionPressed,
        ]}
        onPress={handleSubmit}
      >
        <Text style={styles.primaryButtonText}>Add Exercise</Text>
      </Pressable>
    )}

    {exercise?.userCreated && (
      <Pressable
        style={({ pressed }) => [
          styles.secondaryButton,
          pressed && styles.actionPressed,
        ]}
        onPress={handleEdit}
      >
        <Text style={styles.secondaryButtonText}>Edit Exercise</Text>
      </Pressable>
    )}
  </View>
)}
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
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16 * scale,
      backgroundColor: theme.shadow,
    },

    modalView: {
      width: "100%",
      maxWidth: 420,
      height: "72%",
      paddingTop: 16 * scale,
      paddingHorizontal: 16 * scale,
      paddingBottom: 16 * scale,
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
      marginBottom: 14 * scale,
    },

    exerciseTitle: {
      flex: 1,
      color: theme.text,
      fontSize: 22 * scale,
      fontWeight: "700",
      lineHeight: 28 * scale,
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

    headerActions: {
      flexDirection: "row",
      gap: 8 * scale,
      marginBottom: 14 * scale,
    },

    primaryButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 42 * scale,
      paddingHorizontal: 14 * scale,
      backgroundColor: theme.buttonPrimary + "14",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "40",
      borderRadius: 11 * scale,
    },

    primaryButtonText: {
      color: theme.buttonPrimary,
      fontSize: 14 * scale,
      fontWeight: "700",
    },

    secondaryButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 42 * scale,
      paddingHorizontal: 14 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 11 * scale,
    },

    secondaryButtonText: {
      color: theme.text,
      fontSize: 14 * scale,
      fontWeight: "700",
    },

    actionPressed: {
      opacity: 0.7,
    },

    tabRowContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3 * scale,
      marginBottom: 14 * scale,
      padding: 4 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 13 * scale,
    },

    tab: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 36 * scale,
      paddingHorizontal: 4 * scale,
      borderRadius: 9 * scale,
    },

    activeTab: {
      backgroundColor: theme.buttonPrimary + "18",
    },

    inactiveTab: {
      backgroundColor: "transparent",
    },

    tabLabel: {
      fontSize: 13 * scale,
      fontWeight: "600",
    },

    activeTabLabel: {
      color: theme.buttonPrimary,
    },

    inactiveTabLabel: {
      color: theme.textSecondary,
    },

    contentContainer: {
      flex: 1,
    },
  });