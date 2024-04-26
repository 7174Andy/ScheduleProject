import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Pressable,
  ScrollView,
} from "react-native";

import colors from "../config/colors";
import { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from "react";
import { getUserData } from "../util/http";

const currentDate = new Date();
const today = currentDate.getDay();
const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayName = dayOfWeek[today];

//const events = user[dayName]
// const events = [
//   {
//     course: "ECE 109",
//     startTime: 9, // Start at 9 AM
//     endTime: 10,
//     color: "orange",
//     enrollmentStatus: "enrolled",
//     professor: "p1",
//   },
//   {
//     course: "Math 154 Midterm",
//     startTime: 18, // Start at 6 PM
//     endTime: 20,
//     color: "green",
//     enrollmentStatus: "enrolled",
//     professor: "p1",
//   },
//   // ... more events
// ];

const TimeSlot = ({ children, style }) => (
  <View style={[styles.timeSlot, style]}>{children}</View>
);

const Event = ({ name, color, top, height }) => (
  <View style={[styles.event, { backgroundColor: color, top, height }]}>
    <Text style={styles.eventText}>{name}</Text>
  </View>
);

export default function ProfileScreen() {
  const [user, setUser] = useState(null);  // State to hold user data

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataJson = await AsyncStorage.getItem('userData');
        if (userDataJson !== null) {
          const userData = JSON.parse(userDataJson);
          setUser(userData);
          console.log(userData[dayName]);
        }
      } catch (error) {
        console.error('Failed to load user data from storage', error);
      }
    };

    fetchUserData();
  }, []);


  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={require("../assets/user.png")}
        />
        <View style={{ alignItems: "flex-start", flexDirection: "column" }}>
          <Text style={styles.profileName}>{user ? user.firstName + " " + user.lastName : " "}</Text>
          <Text style={styles.profileTag}>@{user ? user.nickname : " "}</Text>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Pressable
              style={styles.myCalendarBtn}
              onPress={async () => {
                try {
                  const uid = await AsyncStorage.getItem('uid');
                  if (uid !== null) {
                    console.log('UID:', uid);
                  } else {
                    console.log('No UID found');
                  }
                } catch (error) {
                  console.error('Failed to fetch UID from AsyncStorage:', error);
                }
              }}
            >
              <Text
                style={{ fontSize: 15, padding: 7, color: colors.textColor }}
              >
                Edit
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.hashtagContainer}>
        <View style={styles.oneHashTag}>
          <Text style={styles.hashtagText}>{user ? user.college : ""}</Text>
        </View>
        <View style={styles.oneHashTag}>
          <Text style={styles.hashtagText}>{user ? user.majors.map(element => '# ' + element).join(' ') : ""}</Text>
        </View>
      </View>
      <View style={styles.hashtagContainerSecond}>
        <View style={styles.oneHashTag}>
          <Text style={styles.hashtagText}># {user ? user.classLvl : ""}</Text>
        </View>
        <View style={styles.oneHashTag}>
          <Text style={styles.hashtagText}>{user ? user.minors.map(element => '# ' + element).join(' ') : ""}</Text>
        </View>
      </View>
      <ScrollView
        style={styles.calendarContainer}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
      >
        {Array.from({ length: 24 }, (_, index) => (
          <TimeSlot key={index}>
            <Text style={{ color: "white" }}>{`${index % 12 || 12} ${
              index < 12 ? "AM" : "PM"
            }`}</Text>
          </TimeSlot>
        ))}
        {user ? user[dayName].map((event, index) => (
          <Event  // Render each event as a colored box
            key={index}
            name={event.course}
            color={event.color}
            top={event.startTime * 60} // Assuming each hour slot is 60 pixels high
            height={(event.endTime - event.startTime) * 60}
          />
        )) : ""}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.backgroundColor,
    flex: 1,
  },
  calendarContainer: {
    flex: 0,
    padding: 15,
    margin: 15,
    borderRadius: 10,
    backgroundColor: colors.backgroundColor,
  },
  hashtagContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    marginLeft: 10,
  },
  hashtagContainerSecond: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
    marginLeft: 10,
  },
  hashtagText: {
    color: colors.textColor,
    fontSize: 15,
  },
  myCalendarBtn: {
    marginTop: 10,
    marginLeft: 15,
    backgroundColor: colors.tagColor,
    borderRadius: 6,
  },
  oneHashTag: {
    backgroundColor: colors.hashtag,
    borderRadius: 10,
    padding: 5,
    margin: 5,
    marginRight: 10,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    justifyContent: "center",
  },
  profileContainer: {
    alignItems: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: colors.marginToProfile,
  },
  profileImage: {
    height: 120,
    width: 120,
    marginRight: 15,
  },
  profileName: {
    color: colors.textColor,
    fontSize: 23,
    fontWeight: "bold",
    marginLeft: colors.marginToProfile,
  },
  profileTag: {
    fontSize: 15,
    marginLeft: colors.marginToProfile,
    marginTop: 10,
    color: colors.tagColor,
  },
  timeSlot: {
    height: 60, // Each slot is 60 pixels high
    justifyContent: "center",
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  event: {
    position: "absolute",
    left: "15%",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 5,
  },
  eventText: {
    color: "white",
  },
});
