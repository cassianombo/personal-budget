import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

import { COLORS } from "../../../constants/colors";
import Icon from "../Icon";
import OptionModal from "../OptionModal";

const SelectInput = ({
  placeholder = "Select an option",
  value,
  onSelect,
  options = [],
  style,
  showIcons = true,
  iconKey = "icon",
  backgroundKey = "background",
  nameKey = "name",
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find((option) => option.id === value);

  const handleSelect = (option) => {
    onSelect(option.id);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <>
      <Pressable
        style={[styles.container, style]}
        onPress={() => setIsVisible(true)}
        {...props}>
        <View style={styles.selectedContent}>
          {showIcons && selectedOption?.[iconKey] && (
            <View
              style={[
                styles.selectedIconContainer,
                {
                  backgroundColor:
                    selectedOption[backgroundKey] || COLORS.primary,
                },
              ]}>
              <Icon name={selectedOption[iconKey]} size={14} color="white" />
            </View>
          )}
          <Text style={[styles.text, !selectedOption && styles.placeholder]}>
            {selectedOption ? selectedOption[nameKey] : placeholder}
          </Text>
        </View>
        <Icon name="down" size={16} color={COLORS.textSecondary} />
      </Pressable>

      <OptionModal
        visible={isVisible}
        onClose={handleClose}
        title="Select Option"
        options={options}
        onSelect={handleSelect}
        selectedValue={value}
        showIcons={showIcons}
        iconKey={iconKey}
        backgroundKey={backgroundKey}
        nameKey={nameKey}
      />
    </>
  );
};

const styles = StyleSheet.create({
  // Main container
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    minHeight: 48,
    height: 48,
  },

  // Selected content
  selectedContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  selectedIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  placeholder: {
    color: COLORS.textSecondary,
  },
});
export default SelectInput;
