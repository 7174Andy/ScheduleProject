import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState } from "react";

import TimeSetter from "../components/ui/TimeSetter";
import { Picker } from "@react-native-picker/picker";

function ManageScheduleScreen() {
  const [startShow, setStartShow] = useState(false);
  const [endShow, setEndShow] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [twentyfourHour, setTwentyfourHour] = useState(true);

  const placeholder = {
    label: "Select an option...",
    value: null,
  };

  const moment = require("moment");
  const enrollmentStatusOptions = [
    {
      label: "Enrolled",
      value: "enrolled",
    },
    {
      label: "Waitlisted",
      value: "waitlisted",
    },
    {
      label: "Planned",
      value: "planned",
    },
  ];

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
        <TouchableOpacity style={styles.showBtn} onPress={showStartTime}>
          <Text style={{ fontSize: 18 }} d>
            {moment(startTime).format("H:mm")}
          </Text>
        </TouchableOpacity>
        <TimeSetter
          time={startTime}
          visibleHandler={showStartTime}
          visiblility={startShow}
          twentyfourHour={twentyfourHour}
        />
      </View>
      <View style={styles.endTimeContainer}>
        <Text style={styles.timeLabel}>Ends: </Text>
        <TouchableOpacity style={styles.showBtn} onPress={showEndTime}>
          <Text style={{ fontSize: 18 }}>{moment(endTime).format("H:mm")}</Text>
        </TouchableOpacity>
        <TimeSetter
          time={endTime}
          visibleHandler={showEndTime}
          visiblility={endShow}
          twentyfourHour={twentyfourHour}
        />
      </View>
      <View style={styles.timeTextContainer}>
        <Text style={styles.timeText}>
          {moment(startTime).format("H:mm")} -{moment(endTime).format("H:mm")}{" "}
        </Text>
      </View>
      <View style={styles.textInputContainer}>
        <TextInput placeholder="Location" style={styles.eventNameInput} />
      </View>
      <View style={styles.textInputContainer}>
        <TextInput placeholder="Professor Name" style={styles.eventNameInput} />
      </View>
      <View>
        <Picker placeholder={placeholder} item={enrollmentStatusOptions} />
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
    fontWeight: "bold",
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
    paddingHorizontal: 25,
    borderRadius: 7,
    backgroundColor: "white",
    borderWidth: 1,
  },
  timeTextContainer: {
    padding: 10,
    alignItems: "flex-end",
  },
  timeText: {
    fontSize: 18,
  },
  textInputContainer: {
    marginVertical: 10,
  },
});
