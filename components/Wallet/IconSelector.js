import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import { IconButton } from "../UI";
import React from "react";

const IconSelector = ({ icons, selected, onSelect, responsive }) => {
  return (
    <View style={[styles.iconSection, { marginBottom: responsive.spacing }]}>
      <Text style={styles.fieldLabel}>Choose Icon</Text>
      <View
        style={[styles.iconGrid, { paddingHorizontal: responsive.padding }]}>
        {icons.map((iconName) => (
          <IconButton
            key={iconName}
            icon={iconName}
            onPress={() => onSelect(iconName)}
            style={[
              styles.iconOption,
              {
                width: responsive.itemSize,
                height: responsive.itemSize,
                borderRadius: responsive.itemSize / 4,
              },
              selected === iconName && styles.iconOptionSelected,
            ]}
            iconColor={
              selected === iconName ? COLORS.text : COLORS.textSecondary
            }
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconSection: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 4,
  },
  iconGrid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  iconOption: {
    backgroundColor: COLORS.input,
    borderWidth: 2,
    borderColor: "transparent",
  },
  iconOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
  },
});

export default IconSelector;
