import React from 'react'
import { Animated, Dimensions, useAnimatedValue } from 'react-native';
interface TabAnimationProps {
    items: string[];

}
const screenWidth = Dimensions.get("window").width;

export default function useTabAnimation({ items }: TabAnimationProps) {

    const indicatorAnim = useAnimatedValue(0);
    const tabWidth = (screenWidth * 0.8) / items.length - 7.5;
    const translateX = indicatorAnim.interpolate({
        inputRange: [0, items.length - 1],
        outputRange: [4, tabWidth * (items.length - 1) + 4], // Added margin offset
    });
    const startAnimation = (index: number, duration: number) => {
        Animated.timing(indicatorAnim, {
            toValue: index,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }
    return { translateX, tabWidth, startAnimation }
}
