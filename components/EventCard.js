import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Pressable } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import React, { useState, useRef, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApis, endpoints } from '../configs/Apis';
import { MyUserContext } from '../configs/Context';

const EventCard = ({ item, onPress, cardWidth }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;
  const lastTap = useRef(0);
  const smallHearts = useRef([]).current;
  const touchPosition = useRef({ x: 0, y: 0 }).current;

  const date = new Date(item.start_time);
  const dayMonth = `${date.getDate()}/${date.getMonth() + 1}`;
  const time = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;


  const loadFavor = async () => {
    try {
      // setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const res = await authApis(token).get(endpoints['favoriteEvent']);
      if (res.data && Array.isArray(res.data)) {
        const isFav = res.data.some(fav => fav.event_id === item.id || fav.id === item.id);
        setIsFavorite(isFav);
      } else {
        setIsFavorite(false);
      }
    } catch (ex) {
      console.error("Error loading favorite events:", ex);
      console.log('Error details:', ex.response?.data);
      setIsFavorite(false);
      Alert.alert('Error', 'Failed to load favorite status. Please try again.');
    } finally {
      // setLoading(false);
    }
  };
  const user = useContext(MyUserContext);


  useEffect(() => {
    if (user?._j?.role === 'participant') {
      loadFavor();
    }
  }, []);

  const favor = async () => {
    try {
      // setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await authApis(token).post(endpoints['favoriteEvent'], {
        event_id: item.id,
      });

      console.log('Favorite Response:', response.data);

      if (response.status === 201 || response.status === 200) {
        setIsFavorite(true);
      };
    } catch (error) {
      console.error('Favorite Error:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to add to favorites.'
      );
    } finally {
      // setLoading(false);
    }
  };
  const delete_favor = async () => {
    try {
      // setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await authApis(token).delete(endpoints['delete-favor'](item.id));

      if (response.status === 200 || response.status === 204) {
        setIsFavorite(false);
      }
    } catch (error) {
      console.error('Delete Favorite Error:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to remove from favorites.'
      );
    } finally {
      // setLoading(false);
    }
  };

  const getRandomOffset = () => {
    return (Math.random() - 0.5) * 200; // Random value between -100 and 100
  };

  const createSmallHearts = () => {
    const hearts = [];
    for (let i = 0; i < 8; i++) {
      hearts.push({
        position: new Animated.ValueXY({ x: 0, y: 0 }),
        opacity: new Animated.Value(1),
        scale: new Animated.Value(0.5),
      });
    }
    return hearts;
  };

  const animateSmallHearts = () => {
    const hearts = createSmallHearts();
    smallHearts.push(...hearts);

    hearts.forEach((heart) => {
      const randomX = getRandomOffset();
      const randomY = getRandomOffset();

      Animated.parallel([
        Animated.timing(heart.position, {
          toValue: { x: randomX, y: randomY },
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(heart.opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(heart.scale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        const index = smallHearts.indexOf(heart);
        if (index > -1) {
          smallHearts.splice(index, 1);
        }
      });
    });
  };

  const handleDoubleTap = (event) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap.current < DOUBLE_PRESS_DELAY) {

      if (isFavorite === true) {
        delete_favor();
        setIsFavorite(!isFavorite);

      } else {
        setIsFavorite(!isFavorite);
        favor();
      }
      // Get touch position relative to the image container
      const { locationX, locationY } = event.nativeEvent;
      touchPosition.x = locationX;
      touchPosition.y = locationY;

      // Reset heart position to touch position
      heartPosition.setValue({ x: 0, y: 0 });
      heartOpacity.setValue(1);

      // Calculate the position of the favorite button (top right corner)
      const targetX = 50; // Approximate position of favorite button
      const targetY = -50; // Approximate position of favorite button

      // Animate main heart towards the favorite button
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

      // Animate small hearts
      animateSmallHearts();
    }
    lastTap.current = now;
  };

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <Pressable onPress={
        handleDoubleTap}>
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
            {user && <TouchableOpacity style={styles.favoriteButton}
              onPress={() => (isFavorite ? delete_favor() : favor())}            >

              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={22}
                color={isFavorite ? COLORS.error : "#fff"}
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