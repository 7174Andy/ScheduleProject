import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const config = require("../config/.config.js");

function EditProfileScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickname, setNickname] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  const handleSave = async () => {
    // Save the user's profile information
    user.firstName = firstName;
    user.lastName = lastName;
    user.nickname = nickname;

    await AsyncStorage.setItem("userData", JSON.stringify(user));
    setUser(user);
    const userId = await AsyncStorage.getItem("uid");
    const res = await axios.put(
      `${config.BACKEND_URL}/db/${userId}.json`,
      user
    );
    navigation.navigate("ProfileMain");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataJson = await AsyncStorage.getItem("userData");
        if (userDataJson !== null) {
          const userData = JSON.parse(userDataJson);
          setUser(userData);
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setNickname(userData.nickname);
        }
      } catch (error) {
        console.error("Failed to load user data from storage", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nickname"
        value={nickname}
        onChangeText={setNickname}
      />
      <TextInput
        style={styles.input}
        placeholder="Hashtag #"
        value={hashtag}
        onChangeText={setHashtag}
      />
      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </Pressable>
    </View>
  );
}

export default EditProfileScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "black",
  },
  input: {
    height: 40,
    backgroundColor: "white",
    marginBottom: 16,
    padding: 8,
    color: "7B7D7D",
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: "#B3C8CF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
