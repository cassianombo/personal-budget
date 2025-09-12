import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { COLORS } from "../../constants/colors";
import Icon from "./Icon";
import React from "react";

const OptionModal = ({
  visible,
  onClose,
  title = "Select Option",
  options = [],
  onSelect,
  selectedValue,
  showIcons = true,
  iconKey = "icon",
  backgroundKey = "background",
  nameKey = "name",
  height = "65%",
}) => {
  const handleSelect = (option) => {
    onSelect(option);
    onClose();
  };

  const renderOption = ({ item }) => {
    const isSelected = item.id === selectedValue;

    return (
      <Pressable
        style={[styles.option, isSelected && styles.selectedOption]}
        onPress={() => handleSelect(item)}>
        <View style={styles.optionContent}>
          {showIcons && item[iconKey] && (
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: item[backgroundKey] || COLORS.primary,
                },
              ]}>
              <Icon name={item[iconKey]} size={16} color="white" />
            </View>
          )}
          <Text
            style={[
              styles.optionText,
              isSelected && styles.selectedOptionText,
            ]}>
            {item[nameKey]}
          </Text>
        </View>
        {isSelected && <Icon name="check" size={16} color={COLORS.primary} />}
      </Pressable>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.overlayTouchable} />
        <Pressable style={[styles.bottomSheet, { height }]} onPress={() => {}}>
          <View style={styles.handle} />
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={renderOption}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Modal overlay
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  overlayTouchable: {
    flex: 1,
  },

  // Bottom sheet
  bottomSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.textSecondary,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
    textAlign: "center",
  },

  // Options
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 56,
  },
  selectedOption: {
    backgroundColor: COLORS.primary + "20",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  optionText: {
    fontSize: 18,
    color: COLORS.text,
    flex: 1,
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
});

export default OptionModal;
