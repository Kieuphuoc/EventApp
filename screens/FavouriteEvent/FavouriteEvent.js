import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, SafeAreaView, Alert, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { ActivityIndicator } from 'react-native-paper';
import { authApis, endpoints } from '../../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventCardMini from '../../components/EventCardMini';
import Header from '../../components/Header';

const ITEMS_PER_PAGE = 6;

const FavouriteEvent = ({ navigation }) => {

  const [loading, setLoading] = useState(false);
  const [favouriteEvent, setFavoriteEvent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollY = new Animated.Value(0);

  const loadFavoriteEvent = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      let res = await authApis(token).get(endpoints['favorite-event']);
      if (res.data) {
        setFavoriteEvent(res.data);
      }
    } catch (ex) {
      console.error("Error loading events:", ex);
      console.log('Error details:', ex.response?.data);
      setFavoriteEvent([]);
      Alert.alert('Error', 'Failed to load favorite events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavoriteEvent();
  }, []);

  const totalPages = Math.ceil(favouriteEvent.length / ITEMS_PER_PAGE);
  const paginatedData = favouriteEvent.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
          onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? COLORS.grey : COLORS.primary} />
        </TouchableOpacity>

        <Text style={styles.pageText}>
          Page {currentPage} of {totalPages}
        </Text>

        <TouchableOpacity
          style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
          onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? COLORS.grey : COLORS.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <Header  title={"Your Favorite Events"} subtitle={"You saved events"} onPress={loadFavoriteEvent}/>
      <FlatList
        data={paginatedData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <EventCardMini
            item={item.event || item}
            onPress={() => navigation.navigate('eventDetail', { id: item.event.id })}
            index={index}
          />
        )}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        scrollEnabled={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No events found</Text>
          </View>
        )}
        ListFooterComponent={
          <>
            {loading && <ActivityIndicator size={30} color={COLORS.primary} />}
            {renderPagination()}
          </>
        }
      />
    </View>
  );
};

export default FavouriteEvent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
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
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 15,
  },
  pageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageButtonDisabled: {
    opacity: 0.5,
  },
  pageText: {
    fontSize: 14,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
});