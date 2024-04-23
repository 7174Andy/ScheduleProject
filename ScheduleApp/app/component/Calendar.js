import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { useState } from "react";
import Swiper from "react-native-swiper";
import moment from "moment";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [week, setWeek] = useState(0);

  const swiper = React.useRef();

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
                    onPress={() => setSelectedDate(item.date)}
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
      <View>
        <Text style={styles.contentDateText}>
          {selectedDate.toDateString()}
        </Text>
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
});
