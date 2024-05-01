import { View, Text, StyleSheet } from "react-native";

function ManageScheduleScreen() {
  return (
    <View style={styles.container}>
      <Text>Manage Schedule Screen</Text>
    </View>
  );
}

export default ManageScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
