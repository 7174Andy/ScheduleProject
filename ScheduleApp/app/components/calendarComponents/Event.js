import { Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

function Event({ id, name, color, top, height }) {
  const navigation = useNavigation();

  function handleDeleteEvent(id) {
    console.log("Delete", id);
    s;
  }

  function handleEventPress() {
    Alert.alert("Event Pressed", `Event: ${name}`, [
      {
        text: "Delete",
        onPress: handleDeleteEvent(id),
      },
      {
        text: "Edit",
        onPress: () => navigation.navigate("EventDetails", { eventId: id }),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  }

  return (
    <TouchableOpacity
      style={[styles.event, { backgroundColor: color, top, height }]}
      onPress={handleEventPress}
    >
      <Text style={styles.eventText}>{name}</Text>
    </TouchableOpacity>
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
