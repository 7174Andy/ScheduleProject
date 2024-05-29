import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Calendar from "../components/calendarComponents/Calendar";

export default function Schedule() {
  // Dummy Data
  const events = [
    [],
    [
      {
        id: 1,
        course: "CSE 102",
        startTime: 8,
        endTime: 8.5,
        enrollmentStatus: "enrolled",
        professor: "Prof. Smith",
        color: "purple",
      },
      {
        id: 2,
        course: "Math 154 Midterm",
        startTime: 18,
        endTime: 20,
        enrollmentStatus: "enrolled",
        professor: "Prof. Johnson",
        color: "orange",
      },
    ],
    [
      {
        id: 3,
        course: "Math 154",
        startTime: 14,
        endTime: 15,
        enrollmentStatus: "enrolled",
        professor: "Prof. Johnson",
        color: "orange",
      },
    ],
    [
      {
        id: 4,
        course: "CSE 102",
        startTime: 8,
        endTime: 9.5,
        enrollmentStatus: "enrolled",
        professor: "Prof. Smith",
        color: "purple",
      },
    ],
    [
      {
        id: 5,
        course: "ECE 109",
        startTime: 9,
        endTime: 10,
        enrollmentStatus: "enrolled",
        professor: "Prof. Smith",
        color: "blue",
      },
      {
        id: 6,
        course: "Math 154",
        startTime: 14,
        endTime: 15,
        enrollmentStatus: "enrolled",
        professor: "Prof. Johnson",
        color: "orange",
      },
    ],
    [],
    [],
  ];

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Weekly Schedule</Text>
        <View style={styles.calendarContainer}>
          <Calendar weeklyEvents={events} />
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
