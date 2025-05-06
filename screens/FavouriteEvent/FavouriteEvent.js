import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { ActivityIndicator } from 'react-native-paper';
import { authApis, endpoints } from '../../configs/Apis'; // Sử dụng authApis
import AsyncStorage from '@react-native-async-storage/async-storage';

// Component EventCard để hiển thị từng sự kiện
const EventCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{item.event?.category?.name || 'No Category'}</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <Image source={{ uri: item.event?.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{item.event?.title || 'No Title'}</Text>
          <Text style={styles.price}>${item.event?.ticket_price || 0}</Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={16} color="#666" />
            <Text style={styles.text}>{item.event?.start_time || 'Unknown Date'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.text}>{item.event?.location || 'Unknown Location'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewButton}>
          <Ionicons name="eye" size={16} color="#fff" />
          <Text style={styles.viewButtonText}>View Event</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FavouriteEvent = () => {
  const [loading, setLoading] = useState(false);
  const [favouriteEvent, setFavoriteEvent] = useState([]);

  const loadFavoriteEvent = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken'); // Lấy token từ AsyncStorage
      if (!token) {
        console.error('No token found, please login first');
        return;
      }
      const api = authApis(token); // Tạo instance Axios với token
      let url = endpoints['favoriteEvent'];
      let res = await api.get(url);
      if (res.data) {
        setFavoriteEvent(res.data);
      }
    } catch (ex) {
      console.error("Error loading events:", ex);
      console.log('Error details:', ex.response?.data);
      setFavoriteEvent([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavoriteEvent();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Favourite Events</Text>
          <Text style={styles.headerSubtitle}>Your saved events</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={favouriteEvent}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <EventCard item={item} />}
        contentContainerStyle={styles.list}
        ListFooterComponent={loading && <ActivityIndicator size={30} />}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No favourite events found.</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default FavouriteEvent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    color: '#333',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#666',
    fontSize: 14,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 0,
  },
  categoryContainer: {
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  category: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 180,
    width: '100%',
  },
  cardContent: {
    padding: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  price: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#666',
    marginLeft: 5,
    fontSize: 14,
  },
  viewButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});