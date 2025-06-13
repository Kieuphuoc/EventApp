import React, { useContext, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderHTML from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyUserContext } from '../configs/Context';
import ReplyModal from './ReplyModal';
import Apis, { authApis, endpoints } from '../configs/Apis';

const ReviewItem = ({ event_id, review, deletePress, deleteReplyPress }) => {
  const { width } = useWindowDimensions();
  const [showReplyModal, setShowReplyModal] = useState(false);
  const user = useContext(MyUserContext);
  const fullName = `${review?.participant?.first_name} ${review?.participant?.last_name}`;
  const d = new Date(review?.created_date);
  const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;


  const source = useMemo(() => ({ html: review?.comment || '' }), [review?.comment]);
  const tagsStyles = useMemo(
    () => ({
      p: {
        color: '#666',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 10,
      },
    }),
    []
  );


  const createReply = async (reply) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      let form = new FormData();
      form.append('response', reply);

      let res = await authApis(token).post(
        endpoints['reply'](review.id),
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.status === 201) {
        Alert.alert('Success', 'Reply submitted successfully');
        setShowReplyModal(false);
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit reply.');
    }
  };

  return (
    <View style={styles.reviewItem}>
      {/* Nút 3 chấm */}
      {user?._j?.role === 'participant' && 
      <TouchableOpacity style={styles.moreIcon} onPress={deletePress}>
        <Ionicons name="ellipsis-horizontal" size={20} color="#999" />
      </TouchableOpacity>}
      <View style={styles.reviewerInfo}>
        <Image source={{ uri: review?.participant?.avatar }} style={styles.reviewerImage} />
        <View style={styles.reviewerDetails}>
          <Text style={styles.reviewerName}>{fullName}</Text>
          <View style={styles.reviewMeta}>
            <View style={styles.starContainer}>
              {[...Array(5)].map((_, index) => (
                <Ionicons
                  key={index}
                  name={index < review?.rating ? 'star' : 'star-outline'}
                  size={16}
                  color="#FFD700"
                />
              ))}
            </View>
            <Text style={styles.reviewDate}>{date}</Text>
          </View>
        </View>
      </View>

      <RenderHTML contentWidth={width} source={source} tagsStyles={tagsStyles} />

      {/* Hiển thị replies */}
      {review?.response !== null && (
        <View style={styles.repliesContainer}>
          {user?._j?.role === 'organizer' && 
          <TouchableOpacity style={styles.moreIcon} onPress={deleteReplyPress}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#999" />
          </TouchableOpacity>}

          <View key={review.response?.id} style={styles.replyItem}>
            <Text style={styles.replyTitle}>Organizer's Reply</Text>
            <Text style={styles.replyContent}>{review?.response?.response}</Text>
          </View>
        </View>
      )}

      <View style={styles.reviewActions}>
        <TouchableOpacity style={styles.reviewActionButton}>
          <Ionicons name="thumbs-up" size={16} color="#666" />
          <Text style={styles.reviewActionText}>Helpful</Text>
        </TouchableOpacity>

        {user?._j?.role === 'organizer' && (
          <TouchableOpacity
            style={styles.reviewActionButton}
            activeOpacity={0.6}
            onPress={() => setShowReplyModal(true)}
          >
            <Ionicons name="chatbubble" size={16} color="#666" />
            <Text style={styles.reviewActionText}>Reply</Text>
          </TouchableOpacity>
        )}
      </View>

      <ReplyModal
        visible={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        onSubmit={createReply}
      />
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
    position: 'relative',
  },
  moreIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 1,
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
  repliesContainer: {
    marginTop: 8,
    marginBottom: 8,
    paddingLeft: 16, // Thụt vào để phân cấp
  },
  replyItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#e0e0e0',
  },
  replyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 4,
  },
  replyContent: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
});