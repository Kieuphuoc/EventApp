import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import Apis, { endpoints } from '../configs/Apis'; // đảm bảo bạn có file Apis.js và endpoints
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import globalStyles from '../constants/globalStyles';
import EventCard from '../components/EventCard';
import EventCardMini from '../components/EventCardMini';

const suggestions = ["esport", "offline event", "Genfest", "meeting"];

// const categories = [
//   { name: 'Cà Phê/Trà', icon: require('../assets/images/mini_logo.png') },
//   { name: 'Trà sữa', icon: require('../assets/images/mini_logo.png') },
// ];

const getIconNameByCategory = (category) => {
  switch (category.toLowerCase()) {
    case 'concert':
      return 'musical-notes';
    case 'meetup':
      return 'people';
    case 'workshop':
      return 'construct';
    case 'conference':
      return 'briefcase';
    case 'festival':
      return 'balloon';
    case 'exhibition':
      return 'images';
    case 'networking':
      return 'chatbox-ellipses';
    case 'competition':
      return 'trophy';
    case 'ceremony':
      return 'ribbon';
    case 'webinar':
      return 'videocam';
    default:
      return 'alert';
  }
};

export default function SearchingScreen({ navigation }) {
  const [q, setQ] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);

  const loadCates = async () => {
    let res = await Apis.get(endpoints['category']);
    setCategories(res.data);
  }


  const loadEvents = async () => {
    try {
      setLoading(true);

      let url = `${endpoints['event']}`;

      if (q) {
        url = `${url}?search=${q}`;
      }

      let res = await Apis.get(url);
      if (res.data) {
        setEvents(res.data);
      }
    } catch (ex) {
      console.error("Error loading events:", ex);
      setEvents([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }


  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#fff', paddingTop: 60 }}>
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Searching any event..."
          value={q}
          onChangeText={setQ}
          autoFocus
        />
        <TouchableOpacity onPress={() => loadEvents()}>
          <Text style={{ color: '#2196F3', fontWeight: '600', marginLeft: 8 }}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Recommend for you */}
      {/* <Text style={styles.sectionTitle}>Recommend for you </Text>
      <View style={styles.suggestionContainer}>
        {suggestions.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => {
              setQuery(item);
              loadEvents(item);
            }}
            style={styles.suggestionTag}
          >
            <Ionicons name="trending-up" size={16} color="#ff7043" style={{ marginRight: 4 }} />
            <Text style={styles.suggestionText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View> */}

      <Text style={styles.sectionTitle}>SEARCHING RESULT</Text>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : (
        <View style={{ marginHorizontal: 20 }}>
          {events.length === 0 ? (
            <Text style={{ color: '#666' }}>No result matching.</Text>
          ) : (
            <><FlatList
              data={events}
              // keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <EventCardMini
                  item={item.event || item}
                  onPress={() => navigation.navigate('eventDetail', { id: item.id })}
                  index={index}
                />
              )}
              // contentContainerStyle={styles.list}
              numColumns={2}
              // columnWrapperStyle={styles.columnWrapper}
              scrollEnabled={true}
              ListFooterComponent={
                <>
                  {loading && <ActivityIndicator size={30} color={COLORS.primary} />}
                  {/* {renderPagination()} */}
                </>
              }
            /></>
          )}
        </View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: COLORS.accentLight,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: COLORS.primaryDark,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  suggestionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  suggestionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryLighter,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionText: {
    color: COLORS.secondary,
    fontWeight: '600',
    fontSize: 14,
  },
  banner: {
    width: 340,
    height: 90,
    borderRadius: 15,
    marginLeft: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  categoryBox: {
    alignItems: 'center',
    marginRight: 24,
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
});
