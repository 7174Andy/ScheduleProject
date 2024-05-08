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


function EditProfileScreen() {

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
                        <TextInput
                        style={styles.inputText}
                        placeholder="Enter Hashtag"
                        placeholderTextColor="grey"/>
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
      fontSize: 18,
      margin: 20,
      
    },
});