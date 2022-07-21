import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Image,
  Text,
  View,
  TouchableWithoutFeedback,
} from "react-native";

const width = Dimensions.get("window").width - 20;
let currentSlideIndex = 0;
let intervalId;

export default function Slider({ data, title, onSlidePress }) {
  const [dataToRender, setDataToRender] = useState([]);
  const [visibleSlideIndex, setVisibleSlideIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    currentSlideIndex = viewableItems[0]?.index || 0;
    setVisibleSlideIndex(currentSlideIndex);
  });

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const flatList = useRef();

  const handleScrollTo = (index) => {
    flatList.current.scrollToIndex({ animated: false, index });
  };

  const startSlider = () => {
    if (currentSlideIndex <= dataToRender.length - 2) {
      intervalId = setInterval(() => {
        flatList.current.scrollToIndex({
          animated: true,
          index: currentSlideIndex + 1,
        });
      }, 4000);
    } else {
      pauseSlider();
    }
  };

  const pauseSlider = () => {
    clearInterval(intervalId);
  };

  useEffect(() => {
    if (dataToRender.length && flatList.current) {
      startSlider();
    }
    return () => {
      pauseSlider();
    };
  }, [dataToRender.length]);

  useEffect(() => {
    const newData = [[...data].pop(), ...data, [...data].shift()];
    setDataToRender([...newData]);
  }, [data.length]);

  useEffect(() => {
    const length = dataToRender.length;

    //reset slide to first
    if (visibleSlideIndex === dataToRender.length - 1 && length)
      handleScrollTo(1);

    //reset slide to last
    if (visibleSlideIndex === 0 && length) handleScrollTo(length - 2);

    const lastSlide = currentSlideIndex === length - 1;
    const firstSlide = currentSlideIndex === 0;

    if (lastSlide && length) setActiveSlideIndex(0);
    else if (firstSlide && length) setActiveSlideIndex(length - 2);
    else setActiveSlideIndex(currentSlideIndex - 1);
  }, [visibleSlideIndex]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 5,
        }}
      >
        <Text style={{ fontWeight: "700", color: "#383838", fontSize: 22 }}>
          {title}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {data.map((item, index) => {
            return (
              <View
                key={item.id}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  borderWidth: 2,
                  marginLeft: 5,
                  backgroundColor:
                    activeSlideIndex === index ? "#383838" : "transparent",
                }}
              />
            );
          })}
        </View>
      </View>
      <FlatList
        ref={flatList}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={dataToRender}
        keyExtractor={(item, index) => item.id + index}
        initialScrollIndex={1}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onScrollBeginDrag={pauseSlider}
        onScrollEndDrag={startSlider}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        renderItem={({ item }) => {
          return (
            <TouchableWithoutFeedback onPress={() => onSlidePress(item)}>
              <View>
                <Image
                  source={{ uri: item.thumbnail }}
                  style={{ width, height: width / 1.7, borderRadius: 7 }}
                />

                <View style={{ width }}>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontWeight: "700",
                      color: "#383838",
                      fontSize: 22,
                    }}
                  >
                    {item.title}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width,
  },
});
