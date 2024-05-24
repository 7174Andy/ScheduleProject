import { Modal, Platform, View, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";

function TimeSetter({ time, visiblility, visibleHandler, twentyfourHour }) {
  return (
    <>
      {Platform.OS === "ios" ? (
        <Modal visible={visiblility} animationType="slide" transparent={true}>
          <SafeAreaView style={styles.centeredVdiew}>
            <View style={styles.modalView}>
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
            </View>
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
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default TimeSetter;
