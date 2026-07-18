import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { toDisplayWeight, toStoredWeight, WeightUnit } from "@/utils/helpers";

type Props = {
  storedWeight: number | null;
  unit: WeightUnit;
  onChange: (storedWeight: number | null) => void;
};

export default function WeightInput({ storedWeight, unit, onChange }: Props) {
  const { theme, scale } = useAppTheme();
  const inputRef = useRef<TextInput | null>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState(() =>
    storedWeight ? String(toDisplayWeight(storedWeight, unit)) : "",
  );

  useEffect(() => {
    if (isFocused) return;

    setText(storedWeight ? String(toDisplayWeight(storedWeight, unit)) : "");
  }, [storedWeight, unit, isFocused]);

  const handleChange = (value: string) => {
    // Accept decimal commas from keyboards that use them.
    const normalized = value.replace(",", ".");

    // Allow only numbers and one decimal point.
    if (!/^\d*\.?\d*$/.test(normalized)) return;

    setText(value);

    if (normalized === "" || normalized === ".") {
      onChange(null);
      return;
    }

    const enteredWeight = Number(normalized);

    if (!Number.isFinite(enteredWeight)) return;

    onChange(toStoredWeight(enteredWeight, unit));
  };

  const handleBlur = () => {
    setIsFocused(false);

    const normalized = text.replace(",", ".");
    const enteredWeight = Number(normalized);

    if (!text || !Number.isFinite(enteredWeight)) {
      setText("");
      onChange(null);
      return;
    }

    const storedValue = toStoredWeight(enteredWeight, unit);

    onChange(storedValue);
    setText(String(toDisplayWeight(storedValue, unit)));
  };

  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderRadius: 10 * scale,
          paddingVertical: 8 * scale,
          paddingHorizontal: 10 * scale,
        },
      ]}
      onPress={() => inputRef.current?.focus()}
    >
      <TextInput
        ref={inputRef}
        value={text}
        placeholder="0"
        keyboardType="decimal-pad"
        returnKeyType="done"
        placeholderTextColor={theme.textSecondary}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        onChangeText={handleChange}
        style={[
          styles.input,
          {
            color: theme.text,
            fontSize: 16 * scale,
            minWidth: 32 * scale,
          },
        ]}
      />

      <Text
        style={{
          color: theme.text,
          fontSize: 15 * scale,
          marginLeft: 4 * scale,
        }}
      >
        {unit}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    fontWeight: "600",
    textAlign: "center",
    padding: 0,
  },
});
