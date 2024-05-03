import {
  SafeAreaView, 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Button, 
  Pressable, 
  ScrollView,
  TextInput,
} from "react-native";

import colors from "../config/colors";


export default function FriendsScreen() {
  function searchInputHandler(inputText) {
    console.log(inputText);
  }

  function onPressFunction() {
    console.log("unfollowed");
  }

  return (
    <SafeAreaView style={styles.background}>
      <ScrollView showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      >
        <View style ={styles.searchContainer}>
        <TextInput
        style={styles.textInput}
        placeholder='#hashtag'
        onChangeText={searchInputHandler}
       />
       <Button title='Search' />
      </View>
      
      <View
        style={styles.boxContainer}>
        <View 
          style={styles.friendContainer}>
          <Text>My Friends</Text>

            <View style={styles.friendListContainer}>
              <View style={styles.friendListInfo}>
                <View style={styles.friendsUserContainer}>
                  <Image
                    style={styles.userImage}
                    source={require("../assets/user.png")}
                  />
                  <View style={styles.userNameID}>
                    <Text style={styles.userName}>First Last</Text>
                    <Text style={styles.userTag}>@username</Text>
                  </View>

                  <Pressable 
                  style={styles.unfollowBtn}
                  onPress={onPressFunction}>
                    <Text
                      style={{fontSize: 12, color: colors.textColor, paddingHorizontal: 5}}
                    >unfollow</Text>
                  </Pressable>
                  
                </View>
              </View>
            </View>

            <View style={styles.friendListContainer}>
              <View style={styles.friendListInfo}>
                <Text>Friend 1</Text>

              </View>
            </View>

            <View style={styles.friendListContainer}>
              <View style={styles.friendListInfo}>
                <Text>Friend 1</Text>
                
              </View>
            </View>

            <View style={styles.friendListContainer}>
              <View style={styles.friendListInfo}>
                <Text>Friend 1</Text>
                
              </View>
            </View>

            
        </View>
        <View 
          style={styles.suggestionContainer}>
          <Text>Suggestions</Text>
          <View style={styles.suggestionListContainer}>
            <Text>Suggestion 1</Text>
          </View>
          <View style={styles.suggestionListContainer}>
            <Text>Suggestion 1</Text>
          </View>
          <View style={styles.suggestionListContainer}>
            <Text>Suggestion 1</Text>
          </View>
          <View style={styles.suggestionListContainer}>
            <Text>Suggestion 1</Text>
          </View>
        </View>
      </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.backgroundColor,
    flex: 1,
  },

  searchContainer: {
    backgroundColor: '#ffffff',
    color: '#fff',
    margin: 15,
    padding: 5,
    borderRadius: 10,
    fontSize: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    textAlign: 'left',
    margin: 5,
  },



  boxContainer: {
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'space-around',
    gap: 10,
    alignItems: 'center',
  },
  friendContainer:{
    backgroundColor: '#ffffff',
    padding: 15,
    flexDirection: 'column',
    width: '100%',
    height: 320,
    alignItems: 'left',
    borderRadius: 10,
  },
  friendListContainer:{
    backgroundColor: '#ffffff',
    width: '100%',
    height: 60,
    justifyContent: 'space-around',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  friendListInfo:{
    color: '#000000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 15,
  },
  
  suggestionContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    flexDirection: 'column',
    width: '100%',
    height: 320,
    alignItems: 'left',
    borderRadius: 10,
  },
  suggestionListContainer: {
    backgroundColor: '#EAEAEA',
    width: '100%',
    height: 60,
    justifyContent: 'space-around',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },

  friendsUserContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    justifyContent: 'auto',
  },


  
  userImage: {
    height: 45,
    width: 45,
    alignItems: 'left',
    padding: 5,
    marginRight: 10,
  },

  userName: {
    color: '#6B6B6B',
    fontSize: 18,
    fontWeight: 'bold',
  },

  userNameID: {
    flexDirection: 'column',
  },

  userTag: {
    color: '#B6B6B6',
    fontSize: 13,
  },

  unfollowBtn:{
    borderRadius: 15,
    backgroundColor: '#B6B6B6',
    padding: 7,
    justifyContent: 'center',
    marginLeft: 80,

  },


});