import { View, Image, StyleSheet, Dimensions, Text, TouchableOpacity } from "react-native";
import React, { use, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { Extrapolation, interpolate, useAnimatedStyle, SharedValue } from "react-native-reanimated";
import COLORS from "../constants/colors";



const { width } = Dimensions.get('screen')

const SliderItem = ({ item, index, scrollX, onPress }) => {
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
        <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
            <Animated.View style={[styles.container, rnAnimatedStyle]}>
                <Image source={{ uri: item.image }} style={{ width: 280, height: 350, borderRadius: 20 }} />
                <View style={styles.background}>
                    <View style={styles.category}>
                        <Text style={styles.categoryText}>{item.category.name}</Text>
                    </View>
                </View>
                <Text style={styles.title}>{item.title}</Text>
                <View style={{flexDirection:"row", gap: 10}}> 
                    <Ionicons name="star" size={18} color="#FFD700" />
                    <Text style={styles.rating}>{item?.avg_rating.toFixed(1)} / 5</Text>
                </View>
            </Animated.View>
        </TouchableOpacity>

    );
};

export default SliderItem;

const styles = StyleSheet.create({
    category: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        alignSelf: "flex-start",
    },
    categoryText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        padding: 10,
        width: width, shadowColor: "#000",
        shadowOffset: { width: 7, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    background: {
        position: 'absolute',
        width: 280,
        height: 350,
        paddingLeft: 20,
        borderRadius: 20,
        justifyContent: "space-between"
    },
    icon: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 5,
        borderRadius: 30,
    },
    title: {
        color: '#333',
        fontSize: 16,
        fontWeight: '700',
    }

})  