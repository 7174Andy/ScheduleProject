import { Text, View, StyleSheet } from "react-native";

function Event({ name, color, top, height }) {
  return (
    <View style={[styles.event, { backgroundColor: color, top, height }]}>
      <Text style={styles.eventText}>{name}</Text>
    </View>
  );
}

export default Event;

const styles = StyleSheet.create({
  event: {
    position: "absolute",
    left: "15%",
    width: "85%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 5,
  },
  eventText: {
    color: "white",
    fontSize: 17,
  },
});
