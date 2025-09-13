import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import Icon from "../UI/Icon";
import React from "react";

const ColorSelector = ({ colors, selected, onSelect, responsive }) => {
  return (
    <View style={[styles.colorSection, { marginBottom: responsive.spacing }]}>
      <Text style={styles.fieldLabel}>Choose Color</Text>
      <View
        style={[styles.colorGrid, { paddingHorizontal: responsive.padding }]}>
        {colors.map((color) => (
          <Pressable
            key={color}
            style={[
              styles.colorOption,
              {
                backgroundColor: color,
                width: responsive.itemSize,
                height: responsive.itemSize,
                borderRadius: responsive.itemSize / 4,
              },
              selected === color && styles.colorOptionSelected,
            ]}
            onPress={() => onSelect(color)}>
            {selected === color && (
              <Icon
                name="check"
                size={responsive.itemSize < 46 ? 14 : 16}
                color={COLORS.text}
              />
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  colorSection: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 4,
  },
  colorGrid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  colorOption: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorOptionSelected: {
    borderColor: COLORS.text,
    borderWidth: 3,
  },
});

export default ColorSelector;
