import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

type Props = {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export default function AppSeaechBar({ setSearch }: Props) {
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

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 20,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: "100%",
    marginLeft: 10,
  },
});
