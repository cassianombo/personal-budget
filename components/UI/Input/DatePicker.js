import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";

import { COLORS } from "../../../constants/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "../Icon";

const DatePicker = ({ value, onChange, maximumDate, minimumDate }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Ensure we have a valid date value
  const getValidDate = () => {
    if (!value) return new Date();
    if (value instanceof Date) return value;
    if (typeof value === "string") return new Date(value);
    return new Date();
  };

  const currentDate = getValidDate();

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      // Always return ISO string to match the validation schema
      onChange(selectedDate.toISOString());
    }
  };

  const formatDate = (date) => {
    try {
      if (!date) return "Select Date";
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return "Select Date";
      return dateObj.toLocaleDateString();
    } catch (error) {
      return "Select Date";
    }
  };

  const formatTime = (date) => {
    try {
      if (!date) return "Select Time";
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return "Select Time";
      return dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Select Time";
    }
  };

  const handleClose = () => {
    setShowDatePicker(false);
  };

  return (
    <>
      <Pressable
        style={styles.container}
        onPress={() => setShowDatePicker(true)}>
        <View style={styles.content}>
          <Text style={styles.dateText}>
            {formatDate(value)} • {formatTime(value)}
          </Text>
          <Icon name="calendar" size={16} color={COLORS.textSecondary} />
        </View>
      </Pressable>

      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Select Date & Time</Text>
              <Pressable onPress={handleClose}>
                <Text style={styles.doneButton}>Done</Text>
              </Pressable>
            </View>

            <DateTimePicker
              value={currentDate}
              mode="datetime"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              maximumDate={maximumDate}
              minimumDate={minimumDate}
              textColor={COLORS.text}
              accentColor={COLORS.primary}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    minHeight: 48,
    height: 48,
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  doneButton: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "500",
  },
});

export default DatePicker;
