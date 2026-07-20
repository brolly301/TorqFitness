import { StyleSheet, Switch, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Theme, ThemeType } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import AppDropdown from "@/components/ui/AppDropdown";
import { FontSizeType, useSettingsContext } from "@/context/SettingsContext";
import { capitalizeWords } from "@/utils/helpers";

const fontOptions = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
];

export default function FontToggle() {
  const { theme, scale } = useAppTheme();
  const { settings, updateSetting } = useSettingsContext();

  const [selectedFont, setSelectedFont] = useState<FontSizeType>(
    settings?.fontSize ?? "medium",
  );

  return (
    <View>
      <AppDropdown
        data={fontOptions.map((font) => font.label)}
        selected={capitalizeWords(selectedFont)}
        setSelected={(selected) => {
          const font = selected.toLowerCase() as FontSizeType;
          setSelectedFont(font);
          updateSetting("fontSize", font);
        }}
        placeholder="Font size"
      />
    </View>
  );
}