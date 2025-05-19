import { View, Image, StyleSheet, Dimensions, Text, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { Extrapolation, interpolate, useAnimatedStyle, SharedValue } from "react-native-reanimated";
import COLORS from "../constants/colors";


const { width } = Dimensions.get('screen')

const SliderItem = ({ item, index, scrollX }) => {
    const rnAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        scrollX.value,
                        [(index - 1) * width, index * width, (index + 1) * width],
                        [-width * 0.3, 0, width * 0.3],
                        Extrapolation.CLAMP,
                    ),
                },
                {
                    scale: interpolate(
                        scrollX.value,
                        [(index - 1) * width, index * width, (index + 1) * width],
                        [0.8, 1, 0.8],
                        Extrapolation.CLAMP
                    ),
                }
            ],
        };
    });
    return (
        <Animated.View style={[styles.container, rnAnimatedStyle]}>
            <Image source={{ uri: item.image }} style={{ width: 280, height: 350, borderRadius: 20 }} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.2)']} style={styles.background}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={styles.category}>
                        <Text style={styles.categoryText}>{item.category.name}</Text>
                    </View>
                    <TouchableOpacity style={styles.icon}>
                        <Ionicons name='heart-outline' size={25} color={'white'} ></Ionicons>
                    </TouchableOpacity>

                </View>
                <View>
                    <Text style={styles.title}>{item.title}</Text>
                </View>
                
            </LinearGradient>
        </Animated.View>
    );
};

export default SliderItem;

const styles = StyleSheet.create({
    category: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    categoryText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        padding: 10,
        width: width, shadowColor: '#000', // Màu của bóng
        shadowOffset: { width: 5, height: 7 }, // Độ lệch của bóng (ngang, dọc)
        shadowOpacity: 0.2, // Độ mờ của bóng (0 đến 1)
        shadowRadius: 3, // Độ lan tỏa của bóng
        // Thêm elevation cho Android
        elevation: 3,
    },
    background: {
        position: 'absolute',
        width: 280,
        height: 350,
        padding: 20,
        borderRadius: 20,
        justifyContent: "space-between"
    },
    icon: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 5,
        borderRadius: 30,
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    }

})  