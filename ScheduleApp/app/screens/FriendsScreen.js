import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Button,
  Pressable,
  ScrollView,
} from "react-native";

import colors from "../config/colors";

export default function FriendsScreen() {
  return (
    <SafeAreaView style={styles.background}>
      <Text style={styles.title}>Friends Screen</Text>
      <TextInput style={styles.hashtagInput} 
      placeholder='#hashtag'
      placeholderTextColor= 'white'/>
      <View style={styles.container}>
        <Text style={styles.containerText}>friends</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.containerText}>suggestions</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background:{
    backgroundColor: colors.backgroundColor,
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    margin: 16,
  },
  hashtagInput: {
    margin: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 25,
  },
  container:{
    margin: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: '9',
    height: '35%',
    borderRadius: 25,
  },
  containerText:{
    color: 'black',
  }
});