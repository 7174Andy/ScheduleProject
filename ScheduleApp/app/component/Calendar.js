import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { useState } from "react";
import moment from "moment";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dates = [
    {
      weekday: "Mon",
      date: new Date(),
    },
    {
      weekday: "Tue",
      date: new Date(),
    },
    {
      weekday: "Wed",
      date: new Date(),
    },
    {
      weekday: "Thu",
      date: new Date(),
    },
    {
      weekday: "Sat",
      date: new Date(),
    },
    {
      weekday: "Sun",
      date: new Date(),
    },
  ];

  return (
    <View style={styles.dateRow}>
      {dates.map((item, dateIndex) => {
        const isActive =
          item.date.toDateString() === selectedDate.toDateString();

        return (
          <TouchableWithoutFeedback onPress={() => setSelectedDate(item.date)}>
            <View style={[styles.date, isActive && styles.isActiveDate]}>
              <Text
                style={[
                  styles.dateWeekday,
                  isActive && {
                    color: "black",
                  },
                ]}
              >
                {item.weekday}
              </Text>
              <Text
                style={[
                  styles.dateText,
                  isActive && {
                    color: "black",
                  },
                ]}
              >
                {item.date.getDate()}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
}

export default Calendar;

const styles = StyleSheet.create({
  dateRow: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: -4,
  },
  date: {
    flex: 1,
    alignItems: "center",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  dateWeekday: {
    color: "white",
    fontSize: 13,
  },
  dateText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  isActiveDate: {
    color: "black",
    backgroundColor: "white",
  },
});
