import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import WelcomeSection from "@/components/auth/welcome/WelcomeSection";
import AuthSection from "@/components/auth/welcome/AuthSection";

export type AuthSectionType = "login" | "signUp" | "resetPassword";

export type SectionType = "welcome" | AuthSectionType;

export default function WelcomeScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const [section, setSection] = useState<SectionType>("welcome");
  const [previousSection, setPreviousSection] = useState<SectionType | null>(
    null,
  );

  const changeSection = (next: SectionType) => {
    setPreviousSection(section);
    setSection(next);
  };

  const handleBack = () => {
    if (section === "resetPassword") {
      setSection("login");
    }

    if (previousSection && previousSection !== section) {
      setSection(previousSection);
      setPreviousSection(null);
      return;
    }

    setSection("welcome");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/welcomeBG.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {section === "welcome" ? (
          <Animated.View
            key={section}
            entering={FadeInRight.duration(250)}
            exiting={FadeOutLeft.duration(200)}
            style={styles.sectionContainer}
          >
            <WelcomeSection setSection={setSection} />
          </Animated.View>
        ) : (
          <AuthSection
            screen={section}
            onBack={handleBack}
            setSection={changeSection}
          />
        )}
      </View>
    </ImageBackground>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    background: {
      flex: 1,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(10, 5, 20, 0.6)",
    },
    sectionContainer: { flex: 1 },
    image: {
      width: 150,
      height: 150,
    },
  });
