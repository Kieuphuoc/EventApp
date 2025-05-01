import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import RatingBar from './RatingBar';
import ReviewItem from './ReviewItem';

const TabReviews = () => {
    const reviews = [
        {
            reviewerName: 'Kieu Phuoc',
            reviewerImage: 'https://scontent.fsgn5-5.fna.fbcdn.net/v/t39.30808-1/475956704_1685629878975007_6583137161822352104_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=100&ccb=1-7&_nc_sid=e99d92&_nc_ohc=0HhZTOoFeX0Q7kNvwH9MA1T&_nc_oc=AdmH6lpVyqVVPSK20JwwEPIxn--3Gg_zkrA-aL3iBEE-cquWljxNgq179LRbYBuxpNglLNlBb0PuvWrqFkl-HJPh&_nc_zt=24&_nc_ht=scontent.fsgn5-5.fna&_nc_gid=v-tC03AAndyF2BfnNQ605w&oh=00_AfHlQcufmgNPmxZ_zFdM1_dLOpylpD_ZFUKxKde-FbHYrA&oe=67FC69DE',
            rating: 5,
            reviewDate: '2 days ago',
            reviewText: 'Amazing event! The organization was perfect and the atmosphere was incredible. Would definitely recommend to anyone interested in this type of event.'
        },
        {
            reviewerName: 'Duc Tri',
            reviewerImage: 'https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-6/483923150_1709516066586388_4735012284407839614_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=fe5ecc&_nc_ohc=2hflF4UzDH4Q7kNvwHdZUZp&_nc_oc=Adn9W5dIAaI06SYo6LVx63ZQ4fMJWWeCqVnlVHcxtkm81RZ8gkW9kse0jve2tVAO5kvXyEmEvigjN9z4ZdP4P4Zi&_nc_zt=23&_nc_ht=scontent.fsgn5-12.fna&_nc_gid=McFONR-W5KTPdabnzf636g&oh=00_AfEu9CsGGDkV1TF3Y5398cK-eWJv5NETDMMarZVXut-7qw&oe=67FC72F2',
            rating: 4,
            reviewDate: '1 week ago',
            reviewText: 'Had a great time at the event. The speakers were knowledgeable and the networking opportunities were valuable.'
        }
    ];

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

            <View style={styles.reviewList}>
                {reviews.map((review, index) => (
                    <ReviewItem
                        key={index}
                        reviewerName={review.reviewerName}
                        reviewerImage={review.reviewerImage}
                        rating={review.rating}
                        reviewDate={review.reviewDate}
                        reviewText={review.reviewText}
                    />
                ))}
            </View>

            <TouchableOpacity style={styles.loadMoreButton}>
                <Text style={styles.loadMoreText}>Load More Reviews</Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
            </TouchableOpacity>
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
    reviewList: {
        gap: 20,
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