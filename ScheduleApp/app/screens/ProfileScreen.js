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


const events = [
  {
    name: "ECE 109",
    startTime: 9, // Start at 9 AM
    duration: 1, // Duration of 1 hour
    color: "orange",
  },
  {
    name: "Math 154 Midterm",
    startTime: 18, // Start at 6 PM
    duration: 2, // Duration of 2 hours
    color: "green",
  },
  // ... more events
];

const TimeSlot = ({ children, style }) => (
  <View style={[styles.timeSlot, style]}>{children}</View>
);

const Event = ({ name, color, top, height }) => (
  <View style={[styles.event, { backgroundColor: color, top, height }]}>
    <Text style={styles.eventText}>{name}</Text>
  </View>
);

export default function ProfileScreen() {

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={require("../assets/user.png")}
        />
        <View style={{ alignItems: "flex-start", flexDirection: "column" }}>
          <Text style={styles.profileName}>Nathan Chang</Text>
          <Text style={styles.profileTag}>@Jiwoong</Text>
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
                My Calendar
              </Text>
            </Pressable>
            <Pressable
              style={styles.myCalendarBtn}
              onPress={() => console.log('Vibe')}
            >
              <Text
                style={{ fontSize: 15, padding: 7, color: colors.textColor }}
              >
                Vibe
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.hashtagContainer}>
        <View style={styles.oneHashTag}>
          <Text style={styles.hashtagText}># Sixth College</Text>
        </View>
        <View style={styles.oneHashTag}>
          <Text style={styles.hashtagText}># Bioinformatics Major</Text>
        </View>
      </View>
      <View style={styles.hashtagContainerSecond}>
        <View style={styles.oneHashTag}>
          <Text style={styles.hashtagText}># Sophomore</Text>
        </View>
        <View style={styles.oneHashTag}>
          <Text style={styles.hashtagText}># Data Science Minor</Text>
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
        {events.map((event, index) => (
          <Event
            key={index}
            name={event.name}
            color={event.color}
            top={event.startTime * 60} // Assuming each hour slot is 60 pixels high
            height={event.duration * 60}
          />
        ))}
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
