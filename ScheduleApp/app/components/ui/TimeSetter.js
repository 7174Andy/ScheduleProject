import { Modal, Platform, View, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";

function TimeSetter({ time, visiblility, visibleHandler, twentyfourHour }) {
  return (
    <>
      {Platform.OS === "ios" ? (
        <Modal visible={visiblility} animationType="slide">
          <SafeAreaView style={styles.centeredVdiew}>
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
          </SafeAreaView>
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

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TimeSetter;
