import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import Icon from "../UI/Icon";
import React from "react";

const TypeSelector = ({ types, selected, onSelect, responsive }) => {
  return (
    <View style={[styles.typeSection, { marginBottom: responsive.spacing }]}>
      <Text style={styles.fieldLabel}>Wallet Type</Text>
      <View style={styles.typeContainer}>
        {types.map((type) => (
          <Pressable
            key={type.id || type}
            style={[
              styles.typeOption,
              selected === (type.id || type) && styles.typeOptionSelected,
            ]}
            onPress={() => onSelect(type.id || type)}>
            <Icon
              name={type.icon}
              size={20}
              color={
                selected === (type.id || type)
                  ? COLORS.text
                  : COLORS.textSecondary
              }
            />
            <Text
              style={[
                styles.typeLabel,
                selected === (type.id || type) && styles.typeLabelSelected,
              ]}>
              {type.name || type.label || type}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  typeSection: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 4,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  typeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.input,
    borderWidth: 2,
    borderColor: "transparent",
  },
  typeOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  typeLabelSelected: {
    color: COLORS.text,
    fontWeight: "600",
  },
});

export default TypeSelector;
