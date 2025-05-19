import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import { ImageSliderType } from '../constants/SliderData';
import Animated, { useAnimatedStyle, SharedValue, withTiming, interpolate, Extrapolation } from 'react-native-reanimated';

// type Props = {
//   item: [];
//   paginationIndex: number;
//   scrollX: SharedValue<number>;
// }

const { width } = Dimensions.get('screen');

const Pagination = ({ items, paginationIndex, scrollX }) => {
  return (
    <View style={styles.container}>
      {items.map((_, index) => {
        const pgAnimationStyle = useAnimatedStyle(() => {
          const dotWidth = interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [8, 20, 8],
            Extrapolation.CLAMP,
          );
          return {
            width: dotWidth,
          };
        });
        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              pgAnimationStyle,
              { backgroundColor: paginationIndex === index ? '#222' : '#aaa' },
            ]}></Animated.View>
        );
      })}
    </View>
  )
}

export default Pagination;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  dot: {
    backgroundColor: '#aaa',
    height: 8,
    width: 8,
    marginHorizontal: 4,
    borderRadius: 8,

  }
})
