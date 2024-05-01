import { View, Text, StyleSheet, TextInput, Switch } from "react-native";
import React, { useState } from "react";
import { all } from "axios";

function ManageScheduleScreen() {
  const [allDay, setAllDay] = useState(false);
  const toggleSwitch = () => setAllDay((previousState) => !previousState);

  return (
    <View style={styles.container}>
      <View style={styles.courseNameContainer}>
        <TextInput
          placeholder="Event Name"
          autoComplete="off"
          style={styles.courseNameInput}
        />
      </View>
      <View style={styles.dateInputsContainer}>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            inputMode="numeric"
            keyboardType="phone-pad"
            maxLength={2}
            style={styles.timeInput}
          />
          <Text style={[styles.text]}>:</Text>
          <TextInput
            inputMode="numeric"
            keyboardType="phone-pad"
            maxLength={2}
            style={styles.timeInput}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.timeInputsContainer}>
            <TextInput
              inputMode="numeric"
              keyboardType="phone-pad"
              maxLength={2}
              style={styles.timeInput}
            />
            <Text style={[styles.text]}>:</Text>
            <TextInput
              inputMode="numeric"
              keyboardType="phone-pad"
              maxLength={2}
              style={styles.timeInput}
            />
          </View>

          <View style={styles.allDayContainer}>
            <Text>All Day</Text>
            <Switch onValueChange={toggleSwitch} value={allDay} />
          </View>
        </View>
      </View>
      <Text style={[styles.text]}>Day</Text>
      <Text>Professor</Text>
    </View>
  );
}

export default ManageScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  courseNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  courseNameInput: {
    fontSize: 20,
  },
  timeInput: {
    fontSize: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  text: {
    fontSize: 20,
  },
  dateInputsContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  timeInputsContainer: {
    flexDirection: "row",
    marginRight: 20,
    flex: 2,
  },
  allDayContainer: {
    alignItems: "center",
    flex: 2,
  },
});
