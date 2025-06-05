import React, { useEffect, useState } from 'react';
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

export default function SearchingScreen({ navigation, searchText }) {
  const [q, setQ] = useState(searchText || ""); // khởi tạo q từ searchText props
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   // Khi props searchText thay đổi thì cập nhật q
  //   setQ(searchText || "");
  // }, [searchText]);

  // useEffect(() => {
  //   // Khi q thay đổi thì gọi loadEvents
  //   loadEvents();
  // }, [q]);

  const loadEvent = async () => {
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
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    setQ(searchText);
    loadEvent();
  }, [searchText]);


  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#fff', paddingTop: 60 }}>
      <View style={[globalStyles.container, globalStyles.mb, globalStyles.mi]}>
        <TextInput
          style={[globalStyles.input, globalStyles.placeholder]}
          placeholder="Search Event.."
          placeholderTextColor={'gray'}
          value={q}
          onChangeText={setQ}  // người dùng có thể nhập để thay đổi từ khóa
          onSubmitEditing={loadEvent} // khi bấm enter, load lại events
        />
        <TouchableOpacity style={[globalStyles.button]} onPress={loadEvent}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>SEARCHING RESULT</Text>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : (
        <View style={{ marginHorizontal: 10 }}>
          {events.length === 0 ? (
            <Text style={{ color: '#666' }}>No result matching.</Text>
          ) : (
            <FlatList
              data={events}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <EventCardMini
                  item={item.event || item}
                  onPress={() => navigation.navigate('eventDetail', { id: item.id })}
                  index={index}
                />
              )}
              numColumns={2}
              scrollEnabled={true}
            />
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