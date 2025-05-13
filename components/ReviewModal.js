import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApis, endpoints } from '../configs/Apis';

const { width, height } = Dimensions.get('window');

const ReviewModal = ({ event_id, visible, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(height));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // const handleSubmit = () => {
  //   if (rating === 0) {
  //     alert('Please select a rating');
  //     return;
  //   }
  //   if (comment.trim() === '') {
  //     alert('Please write a review');
  //     return;
  //   }
  //   onSubmit({ rating, comment });
  //   setRating(0);
  //   setComment('');
  //   onClose();
  // };
  const createReview = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      let form = new FormData();
      // console.log(rating);
      form.append('rating', rating);
      form.append('comment', comment);

      let res = await authApis(token).post(endpoints['create-review'](event_id), form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Review Response:', res.data);

      if (res.status === 201) {
        alert('Review submitted successfully');
        onSubmit({ id: res.data.id || Date.now().toString(), rating, comment });
        setRating(0);
        setComment('');
        onClose();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert('Failed to submit review. Please try again.');
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Animated.View
              style={{
                transform: [
                  {
                    scale: rating === star
                      ? new Animated.Value(1.2)
                      : new Animated.Value(1),
                  },
                ],
              }}
            >
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={32}
                color={star <= rating ? COLORS.secondary : COLORS.secondary}
              />
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Write a Review</Text>
              <Text style={styles.subtitle}>Share your experience</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close-circle" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.ratingSection}>
              <Text style={styles.label}>How was your experience?</Text>
              {renderStars()}
              <Text style={styles.ratingText}>
                {rating === 0
                  ? 'Select a rating'
                  : rating === 1
                    ? 'Poor'
                    : rating === 2
                      ? 'Fair'
                      : rating === 3
                        ? 'Good'
                        : rating === 4
                          ? 'Very Good'
                          : 'Excellent'}
              </Text>
            </View>

            <View style={styles.commentSection}>
              <Text style={styles.label}>Your Review</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                placeholder="Tell us about your experience..."
                placeholderTextColor={COLORS.grey}
                value={comment}
                onChangeText={setComment}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!rating || !comment.trim()) && styles.submitButtonDisabled,
              ]}
              onPress={createReview}
              disabled={!rating || !comment.trim()}
            >
              <Text style={styles.submitButtonText}>Submit Review</Text>
              <Ionicons name="send" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.grey,
  },
  closeButton: {
    padding: 5,
  },
  content: {
    marginBottom: 20,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primaryDark,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  starButton: {
    padding: 8,
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  commentSection: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 15,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    backgroundColor: COLORS.white,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: COLORS.accentLight,
  },
  cancelButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReviewModal;