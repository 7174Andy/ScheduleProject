import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import colors from '../config/colors';

const kColumnLength = 24; // 한 시간당 두 개의 슬롯으로 변경 (예: 30분 단위)
const kBoxSize = 52; // 각 슬롯의 높이
const week = ['월', '화', '수', '목', '금'];
const startTime = 8; // 시작 시간 (8시)
const endTime = 19; // 종료 시간 (19시)

export default function ProfileScreen() {
    // 요일별 컬럼을 렌더링하는 함수
    const renderDayColumn = (day, index) => {
        return (
            <View key={index} style={styles.dayColumn}>
                <Text style={styles.dayText}>{day}</Text>
                {Array.from({ length: kColumnLength }, (_, idx) => (
                    idx % 2 === 0 ? (
                        <View key={`${day}-${idx}`} style={styles.divider} />
                    ) : (
                        <View key={`${day}-${idx}`} style={styles.timeSlot} />
                    )
                ))}
            </View>
        );
    };

    // 시간을 표시하는 컬럼을 렌더링하는 함수
    const renderTimeColumn = () => {
        const timeSlots = [];

        for (let time = startTime; time <= endTime; time++) {
            timeSlots.push(
                <View key={time} style={styles.timeSlot}>
                    <Text style={styles.timeText}>{`${time}시`}</Text>
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
                    <Text style={styles.title}>시간표 1</Text>
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
        color: '#fff',
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
    verticalDivider: {
        width: 1,
        backgroundColor: 'grey',
    },
    timeText: {
        textAlign: 'center',
    },
});