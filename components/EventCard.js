import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Pressable } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import React, { useState, useRef, useEffect, useContext } from 'react';

import { MyUserContext } from '../configs/Context';

const EventCard = ({ item, onPress, cardWidth, isFavorite, onFavoritePress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;
  const lastTap = useRef(0);
  const smallHearts = useRef([]).current;
  const touchPosition = useRef({ x: 0, y: 0 }).current;

  const date = new Date(item.start_time);
  const dayMonth = `${date.getDate()}/${date.getMonth() + 1}`;
  const time = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  const user = useContext(MyUserContext);

  const handleDoubleTap = (event) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
      onFavoritePress();
      
      const { locationX, locationY } = event.nativeEvent;
      touchPosition.x = locationX;
      touchPosition.y = locationY;

      heartPosition.setValue({ x: 0, y: 0 });
      heartOpacity.setValue(1);

      const targetX = 50; 
      const targetY = -50; 

      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(heartPosition, {
          toValue: { x: targetX, y: targetY },
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(heartOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        scaleAnim.setValue(1);
      });
    }
    lastTap.current = now;
  };

  return (
    <View style={[styles.card, { width: cardWidth }]}>
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
                opacity: heartOpacity,
                left: touchPosition.x,
                top: touchPosition.y
              }
            ]}
          >
            <Ionicons
              name="heart"
              size={50}
              color={COLORS.error}
              style={{}}
            />
          </Animated.View>
          {smallHearts.map((heart, index) => (
            <Animated.View
              key={index}
              style={[
                styles.smallHeartContainer,
                {
                  transform: [
                    { translateX: heart.position.x },
                    { translateY: heart.position.y },
                    { scale: heart.scale }
                  ],
                  opacity: heart.opacity,
                  left: touchPosition.x,
                  top: touchPosition.y
                }
              ]}
            >
              <Ionicons
                name="heart"
                size={20}
                color={COLORS.error}
              />
            </Animated.View>
          ))}
          <View style={styles.overlay}>
            <View style={styles.category}>
              <Text style={styles.categoryText}>{item.category.name}</Text>
            </View>
            {user && <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={onFavoritePress}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={22}
                color={isFavorite ? 'red' : "#fff"}
              />
            </TouchableOpacity>}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.priceContainer}>
              <Ionicons
                name="wallet"
                size={20}
                color={COLORS.error}
              />
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
              onPress={() => { }}
            >
              <Ionicons name="bookmark-outline" size={18} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.joinButton}
              onPress={onPress}
            >
              <Text style={styles.joinButtonText}>Join Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: 'gray',  // Màu của bóng
    shadowOffset: { width: 0, height: 2 }, // Độ lệch của bóng (ngang, dọc)
    shadowOpacity: 0.2, // Độ mờ của bóng (0 đến 1)
    shadowRadius: 4, // Độ lan tỏa của bóng
    // Thêm elevation cho Android
    elevation: 3,

  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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

  priceContainer: {
    backgroundColor: '#FFA500' + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  priceText: {
    color: COLORS.error,
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
    gap: 4,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  detailText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  bookmarkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },

  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    lineHeight: 22,
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  heartContainer: {
    position: 'absolute',
    transform: [
      { translateX: -25 },
      { translateY: -25 }
    ],
  },
  smallHeartContainer: {
    position: 'absolute',
    transform: [
      { translateX: -10 },
      { translateY: -10 }
    ],
  },
});

export default EventCard;