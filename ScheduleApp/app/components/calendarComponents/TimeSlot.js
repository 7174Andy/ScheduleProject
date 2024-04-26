import { View, StyleSheet } from "react-native";

function TimeSlot({ children, style }) {
  return <View style={[styles.timeSlot, style]}>{children}</View>;
}

export default TimeSlot;

const styles = StyleSheet.create({
  timeSlot: {
    height: 60, // Each slot is 60 pixels high
    justifyContent: "center",
    paddingLeft: 5,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
});
