import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import Apis, { authApis, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReviewModal from './ReviewModal';
import ReviewItem from './ReviewItem';

const TabReviews = ({ event_id }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const loadReviews = async () => {
    try {
      setLoading(true);
      let res = await Apis.get(endpoints['review'](event_id));
      setReviews(res.data || []);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const createReview = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      let form = new FormData();
      form.append('rating', rating);
      form.append('comment', comment);

      let res = await authApis(token).post(endpoints['review'](event_id), form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Review Response:', res.data);

      if (res.status === 201) {
        Alert.alert('Success', 'Review submitted successfully');
        setRating(0);
        setComment('');
        setShowReviewModal(false);
        loadReviews();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    }
  };

  const deletePress = (reviewId) => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteReview(reviewId),
        },
      ]
    );
  };

  const deleteReplyPress = (replyId) => {
    Alert.alert(
      'Delete Response',
      'Are you sure you want to delete this response?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteReply(replyId),
        },
      ]
    );
  };

  const deleteReply = async (replyId) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await authApis(token).delete(endpoints['edit-reply'](replyId));

      if (response.status === 200 || response.status === 204) {
        console.log('Delete review successfully!');
        loadReviews();
        Alert.alert('Success', 'Review deleted successfully.');
      }
    } catch (error) {
      console.error('Delete Review Error:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });
      Alert.alert('Error', error.response?.data?.message || 'Failed to delete review.');
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await authApis(token).delete(endpoints['edit-review'](reviewId));

      if (response.status === 200 || response.status === 204) {
        console.log('Delete review successfully!');
        loadReviews();
        Alert.alert('Success', 'Review deleted successfully.');
      }
    } catch (error) {
      console.error('Delete Review Error:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });
      Alert.alert('Error', error.response?.data?.message || 'Failed to delete review.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reviews</Text>
        <TouchableOpacity
          style={styles.writeReviewButton}
          onPress={() => setShowReviewModal(true)}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.white} />
          <Text style={styles.writeReviewText}>Write a Review</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ReviewItem
              event_id={event_id}
              review={item}
              deletePress={() => deletePress(item.id)}
              deleteReplyPress={() => deleteReplyPress(item.response.id)}
            />
          )}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reviews yet</Text>
            </View>
          )}
        />
      )}

      <ReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={createReview}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  writeReviewText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.primaryDark,
    opacity: 0.6,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default TabReviews;