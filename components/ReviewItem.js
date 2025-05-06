import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderHTML from 'react-native-render-html';

const ReviewItem = ({ review }) => {

    const { width } = useWindowDimensions(); // Để không bị Warning khi sử dụng RenderHTML

    const fullName = `${review.participant.first_name} ${review.participant.last_name}`; //Lấy đầy đủ tên
    const d = new Date(review.created_date);
    const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

    return (
        <View style={styles.reviewItem}>
            <View style={styles.reviewerInfo}>
                <Image
                    source={{ uri: review.participant.avatar }}
                    style={styles.reviewerImage}
                />
                <View style={styles.reviewerDetails}>
                    <Text style={styles.reviewerName}>{fullName}</Text>
                    <View style={styles.reviewMeta}>
                        <View style={styles.starContainer}>
                            {[...Array(5)].map((_, index) => (
                                <Ionicons
                                    key={index}
                                    name={index < review.rating ? "star" : "star-outline"}
                                    size={16}
                                    color="#FFD700"
                                />
                            ))}
                        </View>
                        <Text style={styles.reviewDate}>{date}</Text>
                    </View>
                </View>
            </View>
            <RenderHTML 
                  contentWidth={width}
                  source={{ html: review.comment }} tagsStyles={{
                p: {
                    color: '#666',
                    fontSize: 14,
                    lineHeight: 20,
                    marginBottom: 10,
                }
            }} />
            <View style={styles.reviewActions}>
                <TouchableOpacity style={styles.reviewActionButton}>
                    <Ionicons name="thumbs-up" size={16} color="#666" />
                    <Text style={styles.reviewActionText}>Helpful</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reviewActionButton}>
                    <Ionicons name="chatbubble" size={16} color="#666" />
                    <Text style={styles.reviewActionText}>Comment</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ReviewItem;

const styles = StyleSheet.create({
    reviewItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginBottom: 10,
    },
    reviewerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    reviewerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    reviewerDetails: {
        marginLeft: 10,
        flex: 1,
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    reviewMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    starContainer: {
        flexDirection: 'row',
        marginRight: 5,
    },
    reviewDate: {
        color: '#666',
        fontSize: 12,
    },
    reviewText: {
        color: '#666',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 10,
    },
    reviewActions: {
        flexDirection: 'row',
        gap: 15,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 10,
        marginTop: 10,
    },
    reviewActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    reviewActionText: {
        color: '#666',
        fontSize: 12,
    },
});
