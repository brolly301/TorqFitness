import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useMemo } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

type Props = {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export default function AppSearchBar({ setSearch }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  return (
    <View style={styles.container}>
      <FontAwesome6 name="magnifying-glass" size={14} color="black" />
      <TextInput
        style={styles.input}
        placeholder="Search exercises..."
        placeholderTextColor={"black"}
        onChangeText={(text) => setSearch(text)}
      />
    </View>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      borderWidth: 1 * scale,
      borderColor: theme.inputBorder,
      borderRadius: 20 * scale,
      backgroundColor: theme.buttonSecondary,
      padding: 10 * scale,
      flexDirection: "row",
      alignItems: "center",
    },
    input: {
      width: "100%",
      marginLeft: 10 * scale,
    },
  });
