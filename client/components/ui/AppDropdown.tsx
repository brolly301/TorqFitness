import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

type Props = {
  data: string[];
  selected: string;
  setSelected: (value: string) => void;
  placeholder?: string;
};

export default function AppDropdown({
  data,
  selected,
  setSelected,
  placeholder = "Select an option",
}: Props) {
  const [active, setActive] = useState<boolean>(false);

  const handleSelected = (item: string) => {
    setSelected(item);
    setActive(false);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.container}
        onPress={() => setActive((prev) => !prev)}
      >
        <Text>{selected || placeholder}</Text>
      </Pressable>

      {active && (
        <View style={styles.dropdown}>
          {data.map((item) => (
            <Pressable
              key={item}
              style={styles.item}
              onPress={() => handleSelected(item)}
            >
              <Text>{item}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  container: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    backgroundColor: "white",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    marginTop: 4,
    overflow: "hidden",
    backgroundColor: "white",
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
