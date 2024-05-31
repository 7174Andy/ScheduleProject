import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Calendar from "../components/calendarComponents/Calendar";

export default function Schedule({ route }) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [events, setEvents] = useState([[], [], [], [], [], [], []]);

  useEffect(() => {
    const fetchData = async () => {
      let attempts = 0;
      const maxAttempts = 10; // Maximum number of attempts
  
      while (attempts < maxAttempts) {
        try {
          let data;
          if (route.params) {
            print(route.params.user);
            data = route.params.user;
            const updatedEvents = events.map((event, index) => {
              const day = days[index];
              return data[day] !== undefined ? data[day] : event;
            });
            setEvents(updatedEvents);
            return;
          } else {
            value = await AsyncStorage.getItem("userData");

            if (value !== null) {
              const data = JSON.parse(value);
              const updatedEvents = events.map((event, index) => {
                const day = days[index];
                return data[day] !== undefined ? data[day] : event;
              });
              setEvents(updatedEvents);
              return; // Exit the loop if data is retrieved successfully
            } else {
                attempts++; // Increment attempts if value is null
                console.log(`Attempt ${attempts}: Value is null, retrying...`);
            }
          }
        
        } catch (error) {
          console.error("Failed to fetch data from AsyncStorage", error);
        }
  
        // Delay 1 second before next attempt
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
  
      // If maxAttempts is reached without retrieving data, handle the error here
      console.error(`Failed to retrieve data after ${maxAttempts} attempts`);
    };
  
    fetchData();
  }, [events]);


  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Weekly Schedule</Text>
        <View style={styles.calendarContainer}>
          <Calendar weeklyEvents={events} isSelf={true} />
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
