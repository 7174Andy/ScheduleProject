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
import RNPickerSelect from "react-native-picker-select";
import { ColorPicker } from "react-native-color-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';

import TimeSetter from "../components/ui/TimeSetter";
import {app} from '../config/firebaseConfig';
import { getDatabase, ref, get, update } from "firebase/database";

const db = getDatabase(app);

function ManageScheduleScreen({ navigation }) {
  const [startShow, setStartShow] = useState(false);
  const [endShow, setEndShow] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [twentyfourHour, setTwentyfourHour] = useState(true); // TODO: Later implementation: add options for 24 representation
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [location, setLocation] = useState('');
  const [professorName, setProfessorName] = useState('');
  const [eventName, setEventName] = useState('');

  const placeholderDay = {
    label: "Select Day...",
    value: null,
  };

  const dayOptions = [
    {
      label: "Monday",
      value: "Mon",
    },
    {
      label: "Tuesday",
      value: "Tue",
    },
    {
      label: "Wednesday",
      value: "Wed",
    },
    {
      label: "Thursday",
      value: "Thu",
    },
    {
      label: "Friday",
      value: "Fri",
    },
    {
      label: "Saturday",
      value: "Sat",
    },
    {
      label: "Sunday",
      value: "Sun",
    },
  ];

  const placeholder = {
    label: "Enrollment Status...",
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

  const changeUtcToPct = (time) => {
    const utcDate = new Date(time);
    const options = { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', hour12: false };
    const pacificTime = utcDate.toLocaleTimeString('en-US', options);
    const [hour, minute] = pacificTime.split(':').map(Number);
    const fractionalMinute = minute / 60;
    const convertedTime = hour + fractionalMinute;
    return convertedTime;
  }

  const handleSubmit = async() => {
    
    const currentUserUid = await AsyncStorage.getItem("uid");

    const dateRequestsRef = ref(db, `db/${currentUserUid}/${selectedDay}`);

    // Check if the current user's UID already exists in the clicked user's friendRequests list
    const dateRequestsSnapshot = await get(dateRequestsRef);
    const dateRequests = dateRequestsSnapshot.val() || [];
    
    let maxEid = 0;
    for (let i =0; i < dateRequests.length; i++) {
      if (dateRequests[i].eid >= maxEid) {
        maxEid = dateRequests[i].eid;
      }
    }

    // loop로 돌리면서 max eid 구하고

    const schedule = {
      color: "blue",
      course: eventName,
      endTime: changeUtcToPct(endTime),
      enrollmentStatus: enrollmentStatus,
      location: location,
      professor: professorName,
      startTime: changeUtcToPct(startTime),
      eid: maxEid + 1,
    }
    // If the current user's UID is not already in the clicked user's friendRequests list,
    // add it to the list
    dateRequests.push(schedule);

    // Update the friendRequests list in the database using the update method
    const userRef = ref(db, `db/${currentUserUid}`);
    const updates = {};
    updates[selectedDay] = dateRequests;

    await update(userRef, updates);

    // AsyncStorage도 변경

    navigation.navigate("ScheduleOverview");
    // console.log("Date request sent to the database:", dateRequests);
  };

  return (
    <View style={styles.container}>
      <View>
        <TextInput placeholder="Event Name"
                   style={styles.eventNameInput}
                   value={eventName}
                   textColor="grey"
                   onChangeText={setEventName}
                   />
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
      <View style={styles.endTimeContainer}>
        <Text style={styles.timeLabel}>Day: </Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedDay(value)}
          items={dayOptions}
          placeholder={placeholderDay}
          style={{
            inputIOS: {
              fontSize: 18,
              paddingVertical: 10,
              paddingHorizontal: 17,
              borderWidth: 1,
              borderColor: "black",
              borderRadius: 7,
              color: "black",
              marginVertical: 10,
              backgroundColor: "white",
            },
            inputAndroid: {
              fontSize: 18,
              paddingVertical: 10,
              paddingHorizontal: 17,
              borderWidth: 1,
              borderColor: "black",
              borderRadius: 7,
              color: "black",
              paddingRight: 30,
            },
          }}
        />
      </View>
      <View style={styles.timeTextContainer}>
        <Text style={styles.timeText}>
          {moment(startTime).format("H:mm")} - {moment(endTime).format("H:mm")}{" "}
          {selectedDay}
        </Text>
      </View>
      <View style={styles.textInputContainer}>
        <TextInput style={styles.eventNameInput}
                   value={location}
                   placeholder="Location"
                   textColor="grey"
                   onChangeText={setLocation}/>
      </View>
      <View style={styles.textInputContainer}>
        <TextInput style = {styles.eventNameInput}
                   value = {professorName}
                   placeholder="Professor Name"
                   textColor = "grey"
                   onChangeText={setProfessorName}/>
      </View>
      <View>
        <RNPickerSelect
          onValueChange={(value) => setEnrollmentStatus(value)}
          items={enrollmentStatusOptions}
          placeholder={placeholder}
          style={{
            inputIOS: {
              fontSize: 20,
              paddingVertical: 12,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: "grey",
              borderRadius: 7,
              color: "black",
              paddingRight: 30,
              marginVertical: 10,
            },
            inputAndroid: {
              fontSize: 20,
              paddingVertical: 12,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: "grey",
              borderRadius: 7,
              color: "black",
              paddingRight: 30,
            },
          }}
        />
      </View>
      <Pressable
        style={[styles.pressableBtn, styles.saveBtn]}
        onPress={handleSubmit}
      >
        <Text style={styles.btnLabel}>Save</Text>
      </Pressable>
      <Pressable
        style={[styles.pressableBtn, styles.cancelBtn]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.btnLabel}>Cancel</Text>
      </Pressable>
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
  showDayBtn: {
    padding: 10,
    paddingHorizontal: 15,
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
  saveBtn: {
    backgroundColor: "lightgreen",
  },
  pressableBtn: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  btnLabel: {
    fontSize: 20,
  },
  cancelBtn: {
    backgroundColor: "lightcoral",
  },
});