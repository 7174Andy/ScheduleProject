import { View } from "react-native";

function Calendar() {
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

  return <View>Calendar</View>;
}

export default Calendar;
