import { View, Image, StyleSheet, Dimensions, Text, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { ImageSliderType, ImageSlider } from "../constants/SliderData";
import Animated, { Extrapolation, interpolate, useAnimatedStyle, SharedValue } from "react-native-reanimated";
import COLORS from "../constants/colors";

type Props = {
    item: ImageSliderType;
    index: number;
    scrollX: SharedValue<number>;
};

const { width } = Dimensions.get('screen')

const SliderItem = ({ item, index, scrollX }: Props) => {
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
                        [0.75, 1, 0.75],
                        Extrapolation.CLAMP
                    ),
                }
            ],
        };
    });
    return (
        <Animated.View style={[styles.container, rnAnimatedStyle]}>
            <View style={styles.imageWrapper}>
                <Image source={{ uri: item.image }} style={styles.image} />
                {/* Badge tuổi */}
                <View style={styles.overlay}>

                    <Text style={styles.categoryText}>{item.category.name}</Text>
                </View>
                {/* Số thứ tự */}
                <View style={styles.indexBadge}>
                    <Text style={styles.indexText}>{index + 1}</Text>
                </View>
                {/* Overlay gradient đậm phía dưới */}
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.gradientOverlay} />
            </View>
            {/* Thông tin phim dưới ảnh */}
            <View style={styles.infoBox}>
                <View style={styles.row}>
                    <Ionicons name="star" size={16} color="#FFA726" style={{ marginRight: 4 }} />
                    <Text style={styles.rating}>{item.rating || '9.9'}/10</Text>
                    <Text style={styles.voteCount}>({item.votes || '2.1K'} đánh giá)</Text>
                </View>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.genres} numberOfLines={1}>{item.genres || item.category?.name}</Text>
            </View>
        </Animated.View>
    );
};

export default SliderItem;

const styles = StyleSheet.create({
    categoryText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    overlay: {
        position: 'absolute',
        top: 12,
        left: 12, backgroundColor: 'rgba(0, 0, 0, 0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        width: width,
        backgroundColor: 'transparent',
    },
    imageWrapper: {
        width: 320,
        height: 420,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 8,
        marginBottom: 16,
        position: 'relative',
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradientOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 120,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    ageBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#2196F3',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
        zIndex: 2,
    },
    ageText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    indexBadge: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        backgroundColor: '#000a',
        borderRadius: '50%',
        paddingHorizontal: 8,
        paddingVertical: 2,
        zIndex: 2,
    },
    indexText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
    },
    infoBox: {
        alignItems: 'flex-start',
        width: 320,
        paddingHorizontal: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    rating: {
        color: '#FFA726',
        fontWeight: 'bold',
        fontSize: 15,
        marginRight: 4,
    },
    voteCount: {
        color: '#888',
        fontSize: 13,
    },
    title: {
        color: '#222',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
        marginTop: 2,
    },
    genres: {
        color: '#666',
        fontSize: 14,
        marginBottom: 2,
    },
});  