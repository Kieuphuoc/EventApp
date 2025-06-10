import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  StatusBar,
  Platform,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { authApis, endpoints } from '../../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const DEFAULT_EVENT_IMAGE = 'https://via.placeholder.com/300x200.png?text=Event+Image';

const MyEvent = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Authentication Error', 'You are not logged in.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
        return;
      }

      let res = await authApis(token).get(endpoints['my-event']);
      if (res.data && Array.isArray(res.data)) {
        setEvents(res.data);
      } else {
        setEvents([]);
        console.warn('Unexpected response format for my-events:', res.data);
      }
    } catch (error) {
      console.error('Error loading events:', error.response?.data || error.message);
      setEvents([]);
      Alert.alert('Error', 'Could not fetch your events. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteEvent = async (eventId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const token = await AsyncStorage.getItem('token');
              if (!token) {
                throw new Error('No token found');
              }

              const res = await authApis(token).delete(endpoints['delete-event'](eventId));
              if (res.status === 204 || res.status === 200) {
                Alert.alert('Success', 'Event deleted successfully!');
                await loadEvents();
              } else {
                throw new Error(`Unexpected response status: ${res.status}`);
              }
            } catch (error) {
              console.error(`Error deleting event ${eventId}:`, error);
              Alert.alert('Error', 'Failed to delete event. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadEvents();
      return () => {
      };
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadEvents();
  }, []);

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    const day = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
    const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    return `${day} - ${time}`;
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const startTime = new Date(event.start_time);
    const endTime = new Date(event.end_time);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return { text: 'Invalid', color: COLORS.danger };
    }
    if (now < startTime) return { text: 'Upcoming', color: COLORS.info || '#3498DB' };
    if (now >= startTime && now <= endTime) return { text: 'Ongoing', color: COLORS.primary+'99' };
    if (now > endTime) return { text: 'Past', color: COLORS.secondary+'99' };
    return { text: 'Scheduled', color: COLORS.primary };
  };

  const renderEventItem = ({ item }) => {
    const status = getEventStatus(item);
    return (
      <View style={styles.eventCard}>
        <Image
          source={{ uri: item.image || DEFAULT_EVENT_IMAGE }}
          style={styles.eventImage}
          resizeMode="cover"
        />
        {status && (
          <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
            <Text style={styles.statusBadgeText}>{status.text}</Text>
          </View>
        )}
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle} numberOfLines={2}>{item.title || 'Untitled Event'}</Text>
          <View style={styles.eventDetailRow}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
            <Text style={styles.eventDetailText}>{formatDate(item.start_time)}</Text>
          </View>
          <View style={styles.eventDetailRow}>
            <Ionicons name="location-outline" size={16} color={COLORS.primary} />
            <Text style={styles.eventDetailText} numberOfLines={1}>{item.location || 'No location'}</Text>
          </View>
          <View style={styles.eventDetailRow}>
            <Ionicons name="ticket-outline" size={16} color={COLORS.secondary} />
            <Text style={styles.eventDetailText}>
              Price: {item.ticket_price ? `${Number(item.ticket_price).toLocaleString()}₫` : 'Free'}
            </Text>
          </View>
        </View>
        <View style={styles.eventActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.navigate('editEvent', { event: item })}
          >
            <Ionicons name="pencil-outline" size={18} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => deleteEvent(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading Your Events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Events</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('createEvent')}
        >
          <Ionicons name="add-circle-outline" size={28} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {events.length === 0 && !loading ? (
        <ScrollView
          contentContainerStyle={styles.noEventsContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        >
          <Ionicons name="calendar-outline" size={80} color={COLORS.mediumGrey} />
          <Text style={styles.noEventsText}>No Events Yet!</Text>
          <Text style={styles.noEventsSubText}>Tap the '+' button to create your first event.</Text>
          <TouchableOpacity
            style={styles.createLargeButton}
            onPress={() => navigation.navigate('createEvent')}
          >
            <Ionicons name="add" size={20} color={COLORS.white} />
            <Text style={styles.createLargeButtonText}>Create New Event</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight || '#F4F6F8',
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'android' ? 25 : 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 7,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  createButton: {
    padding: 8,
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight || '#F4F6F8',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.grey,
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  eventCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 180,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  eventContent: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 8,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  eventDetailText: {
    fontSize: 13,
    color: COLORS.darkGrey,
    flexShrink: 1,
  },
  eventActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.accentLight || '#F0F0F0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    gap: 6,
  },
  editButton: {
    backgroundColor: COLORS.info || '#3498DB',
  },
  deleteButton: {
    backgroundColor: COLORS.danger || '#E74C3C',
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  noEventsContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  noEventsText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.darkGrey,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  noEventsSubText: {
    fontSize: 15,
    color: COLORS.mediumGrey,
    textAlign: 'center',
    marginBottom: 25,
  },
  createLargeButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  createLargeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyEvent;