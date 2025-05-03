import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import RatingBar from './RatingBar';
import ReviewItem from './ReviewItem';
import { FlatList } from 'react-native-gesture-handler';
import Apis, { endpoints } from '../configs/Apis';
import { useRoute } from '@react-navigation/native';

const TabReviews = ({ event_id }) => {
    const route = useRoute();
    const [reviews, setReviews] = useState([]);
    const [showAll, setShowAll] = useState(false);  // Thêm state để kiểm soát việc hiển thị tất cả review

    const loadReviews = async () => {
        try {
            let eventIdInt = parseInt(event_id, 10);

            console.log(event_id);

            if (isNaN(eventIdInt)) {
                console.error('event_id phải là một số nguyên hợp lệ');
                return;
            }

            let res = await Apis.get(endpoints['review'](eventIdInt));
            setReviews(res.data);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };

    const loadMore = () => {
        setShowAll(true);  // Khi nhấn nút "Load More", hiển thị tất cả review
    };

    useEffect(() => {
        loadReviews();
    }, []);

    return (
        <View style={styles.tabContent}>
            <View style={styles.reviewHeader}>
                <View style={styles.ratingSummary}>
                    <View style={styles.ratingCircle}>
                        <Text style={styles.ratingNumber}>4.5</Text>
                        <Text style={styles.ratingLabel}>out of 5</Text>
                    </View>
                    <View style={styles.ratingBars}>
                        <RatingBar rating={5} percent={70} totalReviews={394} />
                        <RatingBar rating={4} percent={20} totalReviews={112} />
                        <RatingBar rating={3} percent={5} totalReviews={28} />
                        <RatingBar rating={2} percent={3} totalReviews={17} />
                        <RatingBar rating={1} percent={2} totalReviews={12} />
                    </View>
                </View>
                <TouchableOpacity style={styles.writeReviewButton}>
                    <Ionicons name="create-outline" size={20} color="#fff" />
                    <Text style={styles.writeReviewText}>Write a Review</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={showAll ? reviews : reviews.slice(0, 3)}  // Hiển thị 3 review đầu tiên hoặc tất cả
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ReviewItem review={item} />
                )}
                showsHorizontalScrollIndicator={false}
            />

            {/* Chỉ hiển thị nút "Load More Reviews" nếu có nhiều hơn 3 review */}
            {reviews.length > 3 && !showAll && (
                <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
                    <Text style={styles.loadMoreText}>Load More Reviews</Text>
                    <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default TabReviews;

const styles = StyleSheet.create({
    tabContent: {
        marginBottom: 30,
    },
    reviewHeader: {
        marginBottom: 20,
    },
    ratingSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    ratingCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    ratingNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    ratingLabel: {
        fontSize: 12,
        color: '#666',
    },
    ratingBars: {
        flex: 1,
    },
    writeReviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        gap: 8,
    },
    writeReviewText: {
        color: '#fff',
        fontWeight: '600',
    },
    loadMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        gap: 5,
    },
    loadMoreText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
});
