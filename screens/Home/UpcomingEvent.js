import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, SafeAreaView, Alert, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';
import Apis, { endpoints } from '../../configs/Apis';
import COLORS from '../../constants/colors';
import EventCardMini from '../../components/EventCardMini';
import Header from '../../components/Header';

const ITEMS_PER_PAGE = 6;

const UpcomingEvent = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollY = new Animated.Value(0);

  const [count, setCount] = useState();


  const loadEvents = async (page = 1) => {
    try {
      setLoading(true);
      let url = `${endpoints['event']}?page=${page}`;

      let res = await Apis.get(url);
      if (res.data) {
        setEvents(res.data.results);
        setCount(res.data.count);
      }
    } catch (ex) {
      console.error("Error loading events:", ex);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  const pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
          onPress={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? COLORS.grey : COLORS.primary} />
        </TouchableOpacity>

        <Text style={styles.pageText}>
          Page {currentPage} of {totalPages}
        </Text>

        <TouchableOpacity
          style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
          onPress={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
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
      <Header title={"Upcoming Event"} navigation={true} />
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <EventCardMini
            item={item.event || item}
            onPress={() => navigation.navigate('eventDetail', { id: item.event?.id || item.id })}
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
        ListFooterComponent={
          <>
            {loading && <ActivityIndicator size={30} color={COLORS.primary} />}
            {pagination()}
          </>
        }
      />
    </View>
  );
};

export default UpcomingEvent;

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