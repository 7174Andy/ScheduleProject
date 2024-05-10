import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  Platform,
} from "react-native";
import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";

function TimeSetter({ time, visiblility, visibleHandler, twentyfourHour }) {
  return (
    <>
      {Platform.OS === "ios" ? (
        <Modal visible={visiblility} animationType="slide">
          <MaterialIcons name="close" size={24} onPress={visibleHandler} />
          <DateTimePicker
            testID="dateTimePicker"
            value={time}
            mode="time"
            is24Hour={twentyfourHour}
            minuteInterval={10}
            display="spinner"
            onChange={visibleHandler}
          />
        </Modal>
      ) : (
        visiblility && (
          <DateTimePicker
            testID="dateTimePicker"
            value={time}
            mode="time"
            is24Hour={twentyfourHour}
            minuteInterval={10}
            display="spinner"
            onChange={visibleHandler}
          />
        )
      )}
    </>
  );
}

export default TimeSetter;
