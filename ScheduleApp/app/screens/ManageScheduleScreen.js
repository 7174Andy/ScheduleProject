import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  Platform,
} from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";

import TimeSetter from "../components/ui/TimeSetter";

function ManageScheduleScreen() {
  const [startShow, setStartShow] = useState(false);
  const [endShow, setEndShow] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [twentyfourHour, setTwentyfourHour] = useState(true);

  const moment = require("moment");

  const showStartTime = ({ type }, date) => {
    if (type == "set") {
      setStartShow(!startShow);
      setStartTime(date);
      return;
    }
    setStartShow(!startShow);
  };

  const showEndTime = ({ type }, date) => {
    if (type == "set") {
      setEndShow(!endShow);
      setEndTime(date);
      return;
    }
    setEndShow(!endShow);
  };

  return (
    <View style={styles.container}>
      <View>
        <TextInput placeholder="Event Name" style={styles.eventNameInput} />
      </View>
      <View style={styles.startTimeContainer}>
        <Text style={styles.timeLabel}>Starts: </Text>
        <Pressable style={styles.showBtn} onPress={showStartTime}>
          <Text>{moment(startTime).format("H:mm")}</Text>
        </Pressable>
        <TimeSetter
          time={startTime}
          visibleHandler={showStartTime}
          visiblility={startShow}
          twentyfourHour={twentyfourHour}
        />
      </View>
      <View style={styles.endTimeContainer}>
        <Text style={styles.timeLabel}>Ends: </Text>
        <Pressable style={styles.showBtn} onPress={showEndTime}>
          <Text>{moment(endTime).format("H:mm")}</Text>
        </Pressable>
        <TimeSetter
          time={endTime}
          visibleHandler={showEndTime}
          visiblility={endShow}
          twentyfourHour={twentyfourHour}
        />
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
    fontSize: 20,
  },
  timeLabel: {
    fontSize: 20,
  },
  startTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    padding: 10,
  },
  endTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    padding: 10,
  },
  showBtn: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "grey",
  },
});
