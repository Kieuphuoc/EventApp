import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const RatingBar = ({ rating, percent, totalReviews }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.ratingLabel}>{rating} stars</Text>
            <View style={styles.barContainer}>
                <View style={[styles.barFill, { width: `${percent}%` }]} />
            </View>
            <Text style={styles.reviewCount}>{totalReviews}</Text>
        </View>
    );
};

export default RatingBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingLabel: {
        width: 60,
        color: '#666',
        fontSize: 12,
    },
    barContainer: {
        flex: 1,
        height: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 3,
        marginHorizontal: 10,
    },
    barFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 3,
    },
    reviewCount: {
        width: 30,
        color: '#666',
        fontSize: 12,
        textAlign: 'right',
    },
});

