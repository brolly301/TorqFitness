import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "./Header";
import { AuthSectionType, SectionType } from "@/app/(auth)";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import LoginSection from "./LoginSection";
import ResetSection from "./ResetSection";
import SignUpSection from "./SignUpSection";

type Props = {
  setSection: (section: SectionType) => void;
  onBack: () => void;
  screen: SectionType;
};

export default function AuthSection({ setSection, onBack, screen }: Props) {
  return (
    <View style={styles.container}>
      <Header onBack={onBack} />
      <Animated.View
        key={screen}
        entering={FadeInRight.duration(250)}
        exiting={FadeOutLeft.duration(200)}
        style={styles.sectionContainer}
      >
        {screen === "login" && <LoginSection setSection={setSection} />}
        {screen === "signUp" && <SignUpSection setSection={setSection} />}
        {screen === "resetPassword" && <ResetSection setSection={setSection} />}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 40, paddingHorizontal: 30 },
  sectionContainer: { flex: 1 },
});
