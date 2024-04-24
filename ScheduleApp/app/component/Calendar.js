import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from "react-native";
import React, { useState, useRef } from "react";
import Swiper from "react-native-swiper";
import moment from "moment";

function Calendar({ weeklyEvents }) {
  // States
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [week, setWeek] = useState(0);
  const [selectedWeekDay, setSelectedWeekDay] = useState(new Date().getDay());

  // Refs
  const swiper = React.useRef();
  const scrollViewRef = useRef(null);

  // Components
  const TimeSlot = ({ children, style }) => (
    <View style={[styles.timeSlot, style]}>{children}</View>
  );

  const Event = ({ name, color, top, height }) => (
    <View style={[styles.event, { backgroundColor: color, top, height }]}>
      <Text style={styles.eventText}>{name}</Text>
    </View>
  );

  // Helper Functions
  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedWeekDay(date.getDay());
    scrollTop();
  };

  const scrollTop = () => {
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
  };

  // Memoized Values
  const weeks = React.useMemo(() => {
    const start = moment(start).add(week, "weeks").startOf("week");
    return [-1, 0, 1].map((adj) => {
      return Array.from({ length: 7 }).map((_, i) => {
        const date = moment(start).add(adj, "weeks").add(i, "days");

        return {
          weekday: date.format("ddd"),
          date: date.toDate(),
        };
      });
    });
  }, [week]);

  return (
    <>
      <View style={styles.picker}>
        <Swiper
          index={1}
          ref={swiper}
          loop={false}
          showsPagination={false}
          onIndexChanged={(ind) => {
            if (ind === 1) {
              return;
            }
            setTimeout(() => {
              const newIndex = ind - 1;
              const newWeek = week + newIndex;
              setWeek(newWeek);
              setSelectedDate(
                moment(selectedDate).add(newIndex, "week").toDate()
              );
              swiper.current.scrollTo(1, false);
            }, 100);
          }}
        >
          {weeks.map((dates, i) => (
            <View style={styles.dateRow} key={i}>
              {dates.map((item, dateIndex) => {
                const isActive =
                  item.date.toDateString() === selectedDate.toDateString();

                return (
                  <TouchableWithoutFeedback
                    key={dateIndex}
                    onPress={() => handleSelectDate(item.date)}
                  >
                    <View
                      style={[styles.date, isActive && styles.isActiveDate]}
                    >
                      <Text
                        style={[
                          styles.dateWeekday,
                          isActive && {
                            color: "black",
                          },
                        ]}
                      >
                        {item.weekday}
                      </Text>
                      <Text
                        style={[
                          styles.dateText,
                          isActive && {
                            color: "black",
                          },
                        ]}
                      >
                        {item.date.getDate()}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
            </View>
          ))}
        </Swiper>
      </View>
      <View style={{ flex: 1, paddingHorizontal: 5 }}>
        <Text style={styles.contentDateText}>
          {selectedDate.toDateString()}
        </Text>
        <ScrollView
          style={styles.eventsContainer}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          ref={scrollViewRef}
        >
          {Array.from({ length: 24 }, (_, index) => (
            <TimeSlot key={index}>
              <Text style={{ color: "white" }}>{`${index % 12 || 12} ${
                index < 12 ? "AM" : "PM"
              }`}</Text>
            </TimeSlot>
          ))}
          {weeklyEvents[selectedWeekDay].map((event, index) => (
            <Event
              key={index}
              name={event.course}
              top={event.startTime * 60} // Assuming each hour slot is 60 pixels high
              height={(event.endTime - event.startTime) * 60}
              color={event.color}
            />
          ))}
        </ScrollView>
      </View>
    </>
  );
}

export default Calendar;

const styles = StyleSheet.create({
  picker: {
    flex: 1,
    maxHeight: 74,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  dateRow: {
    marginButton: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  date: {
    flex: 1,
    alignItems: "center",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  dateWeekday: {
    color: "white",
    fontSize: 10,
  },
  dateText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  isActiveDate: {
    color: "black",
    backgroundColor: "white",
  },
  contentDateText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#999",
    marginBottom: 10,
  },
  eventsContainer: {
    borderWidth: 4,
    borderColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    flex: 1,
    borderStyle: "dashed",
  },
  timeSlot: {
    height: 60, // Each slot is 60 pixels high
    justifyContent: "center",
    paddingLeft: 5,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  event: {
    position: "absolute",
    left: "15%",
    width: "85%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 5,
  },
  eventText: {
    color: "white",
    fontSize: 17,
  },
  contentContainer: {
    paddingBottom: 20,
  },
});
