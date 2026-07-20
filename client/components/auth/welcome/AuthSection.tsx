import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeInRight,
  FadeOutLeft,
} from "react-native-reanimated";
import Header from "./Header";
import { SectionType } from "@/app/(auth)";
import LoginSection from "./LoginSection";
import ResetSection from "./ResetSection";
import SignUpSection from "./SignUpSection";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = {
  setSection: (section: SectionType) => void;
  onBack: () => void;
  screen: SectionType;
};

export default function AuthSection({
  setSection,
  onBack,
  screen,
}: Props) {
  const { scale } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(scale), [scale]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 28),
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Header onBack={onBack} />

        <Animated.View
          key={screen}
          entering={FadeInRight.duration(250)}
          exiting={FadeOutLeft.duration(200)}
          style={styles.sectionContainer}
        >
          {screen === "login" && (
            <LoginSection setSection={setSection} />
          )}

          {screen === "signUp" && (
            <SignUpSection setSection={setSection} />
          )}

          {screen === "resetPassword" && (
            <ResetSection setSection={setSection} />
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (scale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    contentContainer: {
      flexGrow: 1,
      paddingHorizontal: 24 * scale,
    },

    sectionContainer: {
      flexGrow: 1,
      width: "100%",
      maxWidth: 420,
      alignSelf: "center",
    },
  });