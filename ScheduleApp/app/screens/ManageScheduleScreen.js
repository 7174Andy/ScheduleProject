import { View, Text, StyleSheet, TextInput, Switch } from "react-native";
import React, { useState } from "react";
import { all } from "axios";

function ManageScheduleScreen() {
  const [allDay, setAllDay] = useState(false);
  const toggleSwitch = () => setAllDay((previousState) => !previousState);

  return (
    <View style={styles.container}>
      <View style={styles.courseNameContainer}>
        <TextInput placeholder="Enter a task" autoComplete="off" />
      </View>
      <View>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            inputMode="numeric"
            keyboardType="phone-pad"
            maxLength={2}
          />
          <Text>:</Text>
          <TextInput
            inputMode="numeric"
            keyboardType="phone-pad"
            maxLength={2}
          />
        </View>
      </View>
      <View>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            inputMode="numeric"
            keyboardType="phone-pad"
            maxLength={2}
          />
          <Text>:</Text>
          <TextInput
            inputMode="numeric"
            keyboardType="phone-pad"
            maxLength={2}
          />
        </View>
      </View>
      <Text>Day</Text>
      <View style={{ flexDirection: "row" }}>
        <Text>All Day</Text>
        <Switch onValueChange={toggleSwitch} value={allDay} />
      </View>
      <Text>Professor</Text>
    </View>
  );
}

export default ManageScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  courseNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});
