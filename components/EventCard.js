import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Pressable } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import React, { useState, useRef } from 'react';

const EventCard = ({ item, onPress }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;
  const lastTap = useRef(0);

  const date = new Date(item.start_time);
  const dayMonth = `${date.getDate()}/${date.getMonth() + 1}`;
  const time = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
      setIsFavorite(!isFavorite);
      
      // Reset heart position to center
      heartPosition.setValue({ x: 0, y: 0 });
      heartOpacity.setValue(1);

      // Animate heart to top right
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(heartPosition, {
          toValue: { x: 120, y: -80 },
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(heartOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        scaleAnim.setValue(1);
      });
    }
    lastTap.current = now;
  };

  return (
    <View style={styles.card}>
      <Pressable onPress={handleDoubleTap}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
          />
          <Animated.View 
            style={[
              styles.heartContainer,
              { 
                transform: [
                  { scale: scaleAnim },
                  { translateX: heartPosition.x },
                  { translateY: heartPosition.y }
                ],
                opacity: heartOpacity
              }
            ]}
          >
            <Ionicons 
              name="heart" 
              size={50} 
              color={COLORS.secondary} 
              style={styles.heartIcon}
            />
          </Animated.View>
          <View style={styles.overlay}>
            <View style={styles.category}>
              <Text style={styles.categoryText}>{item.category.name}</Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={22} 
                color={isFavorite ? COLORS.secondary : "#fff"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>${item.ticket_price}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar" size={14} color={COLORS.primary} />
              <Text style={styles.detailText}>{dayMonth}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time" size={14} color={COLORS.primary} />
              <Text style={styles.detailText}>{time}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location" size={14} color={COLORS.primary} />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.bookmarkButton]}
            onPress={() => {}}
          >
            <Ionicons name="bookmark-outline" size={18} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.shareButton]}
            onPress={() => {}}
          >
            <Ionicons name="share-social-outline" size={18} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={onPress}
          >
            <Text style={styles.joinButtonText}>Join Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.accentLight,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    opacity: 0.9,
  },
  overlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    lineHeight: 22,
  },
  priceContainer: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  priceText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 15,
  },
  detailText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  bookmarkButton: {
    backgroundColor: '#fff',
  },
  shareButton: {
    backgroundColor: '#fff',
  },
  joinButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EventCard;
