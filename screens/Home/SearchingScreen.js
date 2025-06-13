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
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import EventCardMini from '../../components/EventCardMini';
import COLORS from '../../constants/colors';
import Apis, { endpoints } from '../../configs/Apis';
import Header from '../../components/Header';

export default function SearchingScreen({ navigation, route }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { searchText } = route.params;
  const loadEvent = async (searchText) => {
    try {
      setLoading(true);
      console.log("Chay ham nay");
      // console.log(searchText);

      let allEvents = [];
      let res = await Apis.get(`${endpoints['event']}?search=${searchText}`);
      if (res.data) {
        allEvents = [...allEvents, ...res.data.results];
      }
      setEvents(allEvents);
      console.log(res.data.results);

    } catch (ex) {
      console.error("Error loading events:", ex);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent(searchText);
  }, [searchText]);


  return (
    <GestureHandlerRootView>
      <Header title={"Searching Results"} navigation={true} />

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : (
        <View style={{ marginHorizontal: 10 }}>
          {events.length === 0 ? (
            <Text style={{ color: '#666' }}>No result matching.</Text>
          ) : (
            <FlatList
              data={events}
              showsVerticalScrollIndicator={false}
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