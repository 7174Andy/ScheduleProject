import { View, Text, StyleSheet, TextInput, Switch } from "react-native";
import React, { useState } from "react";
import { all } from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";

function ManageScheduleScreen() {
  const [allDay, setAllDay] = useState(false);
  const toggleSwitch = () => setAllDay((previousState) => !previousState);

  return (
    <View style={styles.container}>
      <View>
        <TextInput placeholder="Event Name" style={styles.eventNameInput} />
      </View>
      <View>
        <Text>Start Time: </Text>
        <DateTimePicker />
      </View>
      <View>
        <Text>End Time: </Text>
      </View>
    </View>
  );
}

export default ManageScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  eventNameInput: {
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});
