import { SafeAreaView, StyleSheet, Text, View, Image } from "react-native";

import colors from "../config/colors";

export default function ProfileScreen() {
    return (
        <View style={styles.background}>
            <SafeAreaView>
                <View style={styles.container}>
                    <Text style={styles.title}>시간표 1</Text>

                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: colors.backgroundColor,
        flex: 1,
    },
    profileImage: {
        height: 100,
        width: 100,
    },
    container: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
    },
});
