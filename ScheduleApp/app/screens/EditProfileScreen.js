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
  import IconButton from "../components/ui/IconButton";
  import { useState } from "react";


function EditProfileScreen() {


    const [newHashtag, setnewHashtag] = useState(false);

    const addHashtag = () => {
        setnewHashtag(true);
    }

    const [hashtags, setHashtags] = useState(["#hashtag1", "#hashtag2", "#hashtag3"]); 

    const [temporaryHashtag, setTemporaryHashtag] = useState("");

    const addNewHashtag = () => {
        setHashtags([...hashtags, temporaryHashtag]);
        console.log(temporaryHashtag);
        setTemporaryHashtag("");
        setnewHashtag(false);
    }


    return (
        <SafeAreaView style={styles.background}>
            <View style={styles.row}>
                <View style={styles.column}>
                    <View style={styles.category}>
                        <Text style={styles.category}>Name</Text>
                    </View>
                    <View style={styles.category}>
                        <Text style={styles.category}>Username</Text>
                    </View>
                    <View style={styles.category}>
                        <Text style={styles.category}>Password</Text>
                    </View>
                    <View style={styles.category}>
                        <Text style={styles.category}>Hashtag</Text>
                    </View>
                </View>
                <View style={styles.column}>
                         <TextInput
                        style={styles.inputText}
                        placeholder="Enter Name"
                        placeholderTextColor="grey"/>
                        <TextInput
                        style={styles.inputText}
                        placeholder="Enter Username"
                        placeholderTextColor="grey"/>
                        <TextInput
                        style={styles.inputText}
                        placeholder="Enter Password"
                        placeholderTextColor="grey"/>
                        <View style={styles.hashtagContainer}>
                            {hashtags.map((hashtag) => (
                                <View style={styles.oneHashTag}>
                                    <Text style={styles.hashtagText}>{hashtag}</Text>
                                    <IconButton icon="close" color="white" size={20} onPress={()=>{
                                        setHashtags(hashtags.filter((item) => item !== hashtag));
                                    }}/>
                                </View>
                            ))}
                            {!newHashtag
                            ?
                            <IconButton icon="add" color="white" size={20} onPress={()=>{addHashtag(true)}}/>
                            :
                            <View style={styles.row}>
                                <TextInput
                                    value={temporaryHashtag}
                                    style={styles.hashtagText}
                                    placeholder="Enter Hashtag"
                                    placeholderTextColor="grey"
                                    onChangeText={setTemporaryHashtag}/>
                                <IconButton icon="add" color="white" size={20} onPress={addNewHashtag}/>
                            </View>
                            }
                        </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default EditProfileScreen;

const styles = StyleSheet.create({
    background: {
      backgroundColor: colors.backgroundColor,
      flex: 1,
    },
    row: {
      flexDirection: "row",
    },
    column: {
      flexDirection: "column",
    },
    category:{
        color: 'white',
        fontSize: 18,
        margin: 10,
        bold: true,
    },
    inputText: {
      color: 'white',
      fontSize: 16,
      margin: 20,
    },
    hashtagContainer: {
        flex: 0,
        flexDirection: "column",
        justifyContent: "center",
        marginTop: 20,
        marginLeft: 10,
    },
    hashtagText: {
        color: colors.textColor,
        fontSize: 15,
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
        flexDirection: "row",
    },
    hashtagText: {
        color: 'white',
        fontSize: 16,
        margin: 5,
      },
});