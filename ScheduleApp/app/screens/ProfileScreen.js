import {
  SafeAreaView,
  View,
  Text,
  Image,
  Pressable,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";

import colors from "../config/colors";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { getUserData } from "../util/http";
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import placeholder from '../assets/user.png';
import { app } from "../config/firebaseConfig";
import { useNavigation } from '@react-navigation/native';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const config = require('../config/.config.js');

const currentDate = new Date();
const today = currentDate.getDay();
const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayName = dayOfWeek[today];
const storage = getStorage(app);

const TimeSlot = ({ children, style }) => (
  <View style={[styles.timeSlot, style]}>{children}</View>
);

const Event = ({ name, color, top, height, professorName }) => (
  <View style={[styles.event, { backgroundColor: color, top, height }]}>
    <Text style={styles.eventText}>{name}</Text>
    <Text style={styles.eventText}>{professorName}</Text>
  </View>
);

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPicModalVisible, setPicModalVisible] = useState(false);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    college: "",
    majors: [],
    minors: [],
    classLvl: ''
  });
  const [profileImage, setProfileImage] = useState();

  const uploadImage = async (mode) => {
    try{
      let result = {};

      if (mode === 'gallery') {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        // https://stackoverflow.com/questions/25486080/how-to-access-ios-simulator-camera
        // Can't simulate using a camera
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          // cameraType: ImagePicker.cameraType.front,
          allowsEditing: true,
          aspect: [1,1],
          quality: 1,
        });
      }

      if (!result.canceled) {
        await saveImage(result.assets[0].uri)
      }
    } catch (error) {
      console.error(error);
      setPicModalVisible(false);
    }
  };

  const saveImage = async (image) => {
    try {
      setProfileImage(image);
      
      const compressedImage = await manipulateAsync(
        image,
        [],
        { compress: 0.1, format: SaveFormat.JPEG } // Compress the image and set the format to JPEG
      );

      const response = await fetch(compressedImage.uri);
      const blob = await response.blob();

      const userUid = await AsyncStorage.getItem('uid');
      const storageRef = ref(storage, userUid);

      uploadBytes(storageRef, blob).then((snapshot) => {
        console.log('Upload successful');
      }).catch((error) => {
        console.error('Error uploading:', error);
      });

      
      setPicModalVisible(false);

    } catch (error) {
      console.error(error)
    }
  }

  const deleteImage = async () => {
    setProfileImage(null);
    const userId = await AsyncStorage.getItem('uid');
    const storageRef = ref(storage, userId);
    deleteObject(storageRef).then(() => {
      console.log('delete');
    }).catch((error) => {
      console.log(error);
    })
    setPicModalVisible(false);
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataJson = await AsyncStorage.getItem('userData');
        if (userDataJson !== null) {
          const userData = JSON.parse(userDataJson);
          setUser(userData);
        }
        const profilePicUri = await AsyncStorage.getItem('profileUri');
        setProfileImage(profilePicUri);
      } catch (error) {
        console.error('Failed to load user data from storage', error);
      }
    };

    fetchUserData();
  }, [user]);

  const openEditModal = () => {
    if (user) {
      setEditData({
        firstName: user.firstName,
        lastName: user.lastName,
        nickname: user.nickname,
        college: user.college,
        majors: user.majors,
        minors: user.minors,
        classLvl: user.classLvl,
      });
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    const updatedUser = { ...user, ...editData };
    await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setModalVisible(false);
    const userId = await AsyncStorage.getItem("uid");
    const res = await axios.put(
      `${config.BACKEND_URL}/db/${userId}.json`,
      updatedUser
    );
  };

  const handleChange = (name, value) => {
    if (name === "majors" || name === "minors") {
      value = value.split(",").map((v) => v.trim()); // Assuming input is comma-separated
    }
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <SafeAreaView style={styles.ProfileBackground}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => handleChange('firstName', text)}
              value={editData.firstName}
              placeholder="First Name"
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) => handleChange('lastName', text)}
              value={editData.lastName}
              placeholder="Last Name"
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) => handleChange('nickname', text)}
              value={editData.nickname}
              placeholder="Nickname"
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) => handleChange('college', text)}
              value={editData.college}
              placeholder="College"
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) => handleChange('majors', text)}
              value={editData.majors.join(', ')}
              placeholder="Majors (comma separated)"
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) => handleChange('minors', text)}
              value={editData.minors.join(', ')}
              placeholder="Minors (comma separated)"
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) => handleChange('classLvl', text)}
              value={editData.classLvl}
              placeholder="Class Level"
            />
            <Button title="Save Changes" onPress={handleSave} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isPicModalVisible}
        onRequestClose={() => setPicModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.buttonsContainer}>
                <Pressable
                  style={styles.modalButton}
                  onPress={() => uploadImage('gallery')}
                >
                  <FontAwesome name="image" size={24} color="black" />
                </Pressable>
                <Pressable
                  style={styles.modalButton}
                  onPress={() => uploadImage('camera')}
                >
                  <FontAwesome name="camera" size={24} color="black" />
                </Pressable>
                <Pressable
                  style={styles.modalButton}
                  onPress={() => {
                    deleteImage()
                  }}
                >
                  <FontAwesome name="trash" size={24} color="black" />
                </Pressable>
                <Pressable
                  style={styles.modalButton}
                  onPress={() => setPicModalVisible(false)}
                >
                  <FontAwesome name="times" size={24} color="black" />
                </Pressable>
              </View>
          </View>
        </View>
      </Modal>

      <View style={styles.profileContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={[styles.profileImage, { borderRadius: styles.profileImage.width / 2 }]}
            source={profileImage ? { uri: profileImage } : placeholder}
          />
          <Pressable
            style={styles.uploadButton}
            onPress={() => setPicModalVisible(true)}
          >
            <FontAwesome name="camera" size={20} color="white" />
          </Pressable>
        </View>
        <View style={{ alignItems: "flex-start", flexDirection: "column" }}>
          <Text style={styles.profileName}>
            {user ? user.firstName + " " + user.lastName : " "}
          </Text>
          <Text style={styles.profileTag}>@{user ? user.nickname : " "}</Text>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Pressable
              style={styles.myCalendarBtn}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Text
                style={{ fontSize: 15, padding: 7, color: colors.greyBtnText }}
              >
                Edit
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.hashtagContainer}>
        <View style={styles.oneHashTag}>
          <Text style={styles.hashtagText}># {user ? user.college : ""}</Text>
        </View>
        <View style={styles.oneHashTag}>
          <Text style={styles.hashtagText}>
            {user ? user.majors.map((element) => "# " + element).join(" ") : ""}
          </Text>
        </View>
      </View>
      <View style={styles.hashtagContainerSecond}>
        <View style={styles.oneHashTag}>
          <Text style={styles.hashtagText}># {user ? user.classLvl : ""}</Text>
        </View>
        <View style={styles.oneHashTag}>
          <Text style={styles.hashtagText}>
            {user ? user.minors.map((element) => "# " + element).join(" ") : ""}
          </Text>
        </View>
      </View>
      <ScrollView
        style={styles.calendarContainer}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
      >
        {Array.from({ length: 24 }, (_, index) => (
          <TimeSlot key={index}>
            <Text style={{ color: "white" }}>{`${index % 12 || 12} ${
              index < 12 ? "AM" : "PM"
            }`}</Text>
          </TimeSlot>
        ))}
        {user
          ? user.hasOwnProperty(dayName) &&
            user[dayName].map((event, index) => (
              <Event
                key={index}
                name={event.course}
                color={event.color}
                top={event.startTime * 60} // Assuming each hour slot is 60 pixels high
                height={(event.endTime - event.startTime) * 60}
                professorName={event.professor}
              />
            ))
          : ""}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // background: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  profileContainer: {
    padding: 20,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileTag: {
    color: "grey",
  },
  editButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.greyBtn,
    borderRadius: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  background: {
    backgroundColor: colors.backgroundColor,
    flex: 1,
  },
  calendarContainer: {
    flex: 0,
    padding: 15,
    margin: 15,
    borderRadius: 10,
    backgroundColor: colors.backgroundColor,
  },
  hashtagContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    marginLeft: 10,
  },
  hashtagContainerSecond: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
    marginLeft: 10,
  },
  hashtagText: {
    color: colors.hashtagText,
    fontSize: 15,
  },
  myCalendarBtn: {
    marginTop: 10,
    marginLeft: 20,
    backgroundColor: colors.tagColor,
    borderRadius: 6,
  },
  oneHashTag: {
    backgroundColor: colors.hashtag,
    borderRadius: 10,
    padding: 5,
    margin: 5,
    marginRight: 10,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    justifyContent: "center",
  },
  profileContainer: {
    alignItems: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: colors.marginToProfile,
  },
  profileImage: {
    height: 120,
    width: 120,
    marginRight: 15,
  },
  profileName: {
    color: colors.textColor,
    fontSize: 23,
    fontWeight: "bold",
    marginLeft: colors.marginToProfile,
  },
  profileTag: {
    fontSize: 15,
    marginLeft: colors.marginToProfile,
    marginTop: 10,
    color: colors.tagColor,
  },
  timeSlot: {
    height: 60, // Each slot is 60 pixels high
    justifyContent: "center",
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  event: {
    position: "absolute",
    left: "15%",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 5,
  },
  eventText: {
    color: "white",
  },
  uploadButton: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: colors.tagColor,
    borderRadius: 50,
    padding: 6,
  },
  imageContainer: {
    position: 'relative',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  buttonsContainer: {
    flexDirection: 'row', // Align buttons horizontally
    justifyContent: 'center', // Center buttons horizontally
    marginTop: 10,
  },
  modalButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5, // Add some horizontal margin between buttons
  },
});
