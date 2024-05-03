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
import IconButton from "../components/ui/IconButton";

export default function FriendsScreen() {
  return (
    <SafeAreaView style={styles.background}>
      {/* <Text style={styles.title}>Friends Screen</Text> */}
      <View style={styles.inputContainer}>
      <TextInput style={styles.hashtagInput} 
      placeholder='#hashtag'
      placeholderTextColor= 'white'/>
      <Pressable style={styles.searchButton}>
      <IconButton
                icon="search"
                color='white'
                size={20}/>
      </Pressable>
      </View>
    <View style={styles.containerContainer}>
      <View style={styles.container}>
        <Text style={styles.containerTitle}>Friends</Text>
        <View style={styles.containerLine}/>
        </View>
      <View style={styles.container}>
        <Text style={styles.containerTitle}>Requests</Text>
        <View style={styles.containerLine}/>
      </View>
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
    fontWeight: '700',
    margin: 16,
    paddingBottom:0,
  },
  inputContainer:{
    flexDirection: 'row',
  },
  hashtagInput: {
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 25,
    color: 'white',
    flex: 7,
  },
  containerContainer:{
    flexDirection: 'column',
    width: '100%',
    height: '85%',
  },
  container:{
    margin: 10,
    backgroundColor: 'white',
    width: '5',
    height: '40%',
    paddingTop: 10,
    paddingHorizontal: 5,
    borderRadius: 15,
    flex: 1,
  },
  containerTitle:{
    color: 'black',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
    marginLeft: 12,
  },
  containerLine:{
    marginHorizontal: 10,
    marginVertical: 5,
    height: 1,
    backgroundColor: 'grey',
    width: '92%',
  },
  friendContainer:{
    marginHorizontal: 10,
    marginVertical: 5,
  },
  friendName:{
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
  },
  searchButton:{
    marginBottom: 10,
    marginRight: 12,
    marginLeft: 2,
    marginTop: 20,
    padding: 0,
    flex: 1,
  },
});
