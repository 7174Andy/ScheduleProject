import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import colors from '../config/colors';

const kColumnLength = 28; // 한 시간당 두 개의 슬롯으로 변경 (예: 30분 단위)
const kBoxSize = 52; // 각 슬롯의 높이
const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const startTime = 8; // 시작 시간 (8시)
const endTime = 22; // 종료 시간 (19시)
const classDetails = { day: 'Tue', slotIndex: 4 };

export default function ProfileScreen() {

    // This shows week
    const renderDayColumn = (day, index) => {
        return (
            <View key={index} style={styles.dayColumn}>
                <Text style={styles.dayText}>{day}</Text>
                {Array.from({ length: kColumnLength }, (_, idx) => {
                    if (day === classDetails.day && idx === classDetails.slotIndex) {
                        return (
                            <View key={`${day}-${idx}`} style={[styles.timeSlot, styles.classBox]}>
                                <Text style={styles.classText}>Class Name</Text>
                            </View>
                        );
                    } else {
                        return (
                            idx % 2 === 0 ? (
                                <View key={`${day}-${idx}`} style={styles.divider} />
                            ) : (
                                <View key={`${day}-${idx}`} style={styles.timeSlot} />
                            )
                        );
                    }
                })}
            </View>
        );
    };

    // This shows times and time slots
    const renderTimeColumn = () => {
        const timeSlots = [];

        for (let time = startTime; time <= endTime; time++) {
            timeSlots.push(
                <View key={time} style={styles.timeSlot}>
                    <Text style={styles.timeText}>{`${time} `}</Text>
                </View>
            );
        }

        return (
            <View style={styles.timeColumnContainer}>
                <View style={styles.timeColumn}>{timeSlots}</View>
                <View style={styles.verticalDivider} />
            </View>
        );
    };

    return (
        <View style={styles.background}>
            <SafeAreaView>
                <View style={styles.container}>
                    <Text style={styles.title}>Time Table</Text>
                    <View style={styles.scheduleContainer}>
                        {renderTimeColumn()}
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            {week.map((day, index) => renderDayColumn(day, index))}
                        </View>
                    </View>
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
    container: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: 'white',
    },
    scheduleContainer: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 12,
        flexDirection: 'row',
        marginTop: 20,
    },
    dayColumn: {
        flex: 1,
        alignItems: 'center',
        borderRightWidth: 1, // 모든 요일 컬럼 사이에 세로선 추가
        borderColor: 'white',
    },
    dayText: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'white',
    },
    divider: {
        height: 1,
        backgroundColor: 'grey',
        width: '100%',
    },
    timeSlot: {
        height: kBoxSize,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeColumnContainer: {
        flexDirection: 'row',
    },
    timeColumn: {
        justifyContent: 'center',

    },
    classBox: {
        backgroundColor: 'blue', // Example color for class box
    },
    classText: {
        color: 'white',
        fontWeight: 'bold',
    },
    verticalDivider: {
        width: 1,
        backgroundColor: 'grey',
    },
    timeText: {
        textAlign: 'center',
        color: 'white',
    },
});