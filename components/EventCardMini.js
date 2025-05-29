import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import React, { useEffect, useRef } from 'react';

const EventCardMini = ({ item, onPress, index }) => {
  const date = new Date(item.start_time);
  const dayMonth = `${date.getDate()}/${date.getMonth() + 1}`;
  const time = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[
      styles.card,
      {
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }]
      }
    ]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>{item.category.name}</Text>
            </View>
            <Text style={styles.price}>${item.ticket_price}</Text>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar" size={14} color={COLORS.primary} />
              <Text style={styles.detailText}>{dayMonth}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time" size={14} color={COLORS.primary} />
              <Text style={styles.detailText}>{time}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="location" size={14} color={COLORS.primary} />
              <Text style={styles.detailText} numberOfLines={1}>{item.location}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 48 = padding (16) * 2 + gap between cards (16)

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000', // Màu của bóng
    shadowOffset: { width: 5, height: 7 }, // Độ lệch của bóng (ngang, dọc)
    shadowOpacity: 0.2, // Độ mờ của bóng (0 đến 1)
    shadowRadius: 3, // Độ lan tỏa của bóng
    // Thêm elevation cho Android
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryContainer: {
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryDark,
    marginBottom: 8,
  },
  details: {
    gap: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    flex: 1,
  },
});

export default EventCardMini;