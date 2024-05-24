import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import Calendar from "../components/calendarComponents/Calendar";
import colors from "../config/colors";
import { getUserData } from "../util/http";

export default function FriendScheduleScreen({ route, navigation }) {
  const { friendId } = route.params;
  const [friendData, setFriendData] = useState(null);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserData(friendId);
        setFriendData(data);
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      }
    };

    fetchData();
  }, [friendId]);

  useEffect(() => {
    if (friendData !== null) {
      const tempSchedule = [];
      days.forEach((day) => {
        if (friendData[day] && friendData[day].length > 0) {
          tempSchedule.push(friendData[day]);
        } else {
          tempSchedule.push([]);
        }
      });
      setSchedule(tempSchedule);
    }
  }, [friendData]);

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {friendData ? friendData.nickname + " Weekly Schedule" : ""}
        </Text>
        <View style={styles.calendarContainer}>
          {schedule && <Calendar weeklyEvents={schedule} />}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.backgroundColor,
    flex: 1,
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "white",
  },
  calendarContainer: {
    flex: 1,
    marginTop: 20,
  },
});
