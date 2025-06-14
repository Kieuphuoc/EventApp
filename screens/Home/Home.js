import React, { useContext, useEffect, useRef, useState } from "react";
import { ScrollView, View, Text, FlatList, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import Header from '../../components/Header';
import SearchBox from '../../components/SearchBox';
import SearchBo from '../../components/SearchBo';
import { Ionicons } from "@expo/vector-icons";

import Category from '../../components/Category';
import EventCard from '../../components/EventCard';
import Pagination from "../../components/Pagination";
import SliderItem from "../../components/SliderItem";
import { RefreshControl } from 'react-native';
import COLORS from "../../constants/colors";
import Apis, { authApis, endpoints } from '../../configs/Apis';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../../constants/globalStyles";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyUserContext } from "../../configs/Context";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Alert } from "react-native";


const Home = () => {
  const navigation = useNavigation();

  const [globalLoading, setGlobalLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [trend, setTrend] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);


  // Searching 
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [suggestion, setSuggestion] = useState([]);


  console.log(searchText)
  const user = useContext(MyUserContext);

  const loadCates = async () => {
    let res = await Apis.get(endpoints['category']);
    setCategories(res.data);
  }

  const loadEvents = async (isLoadMore = false) => {
    try {
      if (isLoadMore) setIsLoadingMore(true);

      const url = isLoadMore && nextPageUrl ? nextPageUrl : endpoints['event'];
      if (!url) {
        setHasMoreData(false);
        return;
      }

      let res = await Apis.get(url);
      if (res.data) {
        if (isLoadMore) {
          setEvents(prev => [...prev, ...res.data.results]);
        } else {
          setEvents(res.data.results);
        }
        setNextPageUrl(res.data.next);
        setHasMoreData(!!res.data.next);
      }
    } catch (ex) {
      console.error("Error loading events:", ex);
    } finally {
      if (isLoadMore) setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMoreData && nextPageUrl) {
      loadEvents(true);
    }
  };

  const loadTrend = async () => {
    try {
      setLoading(true);

      let res = await Apis.get(endpoints['trend']);

      if (res.data) {
        setTrend(res.data);
      }
    } catch (ex) {
      console.error("Error loading Trend:", ex);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommend = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      let res = await authApis(token).get(endpoints["recommend"]);
      console.log("Recommend", res.data);
      if (res.data) {
        setRecommend(res.data);
        console.log("Lấy được recommned");
      }
    } catch (ex) {
      console.error("Error loading Recommend:", ex);
    } finally {
      setLoading(false);
    }
  }
const loadAllData = async () => {
  try {
    setGlobalLoading(true);

    const promises = [
      loadCates(),
      loadEvents(),
      loadTrend(),
    ];

    if (user?._j?.role === 'participant') {
      promises.push(loadRecommend());
    }

    await Promise.all(promises);
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
  } finally {
    setGlobalLoading(false);
  }
};


  useEffect(() => {
    loadAllData();
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  const scrollX = useSharedValue(0);
  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

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

  const loadSuggestion = async (keyword) => {
    try {
      setLoading(true);
      let allEvents = [];

      let res = await Apis.get(`${endpoints['event']}?search=${keyword}`);
      if (res.data) {
        allEvents = [...allEvents, ...res.data.results];
      }
      setSuggestion(allEvents);
    } catch (ex) {
      console.error("Error loading all suggestions:", ex);
      setSuggestion([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestion(searchText);
  }, [searchText]);


  return (
    globalLoading ? (
      <View style={[globalStyles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <LottieView
          source={require('../../assets/loading.json')}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>
    ) : (
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2196F3']} />}>
        <View style={{ paddingTop: 40, }}>
          <StatusBar barStyle="dark-content" />
          <View style={[globalStyles.container, globalStyles.mb, { paddingInline: 20 }]}>
            <TextInput
              style={[globalStyles.input, globalStyles.placeholder, {}]}
              placeholder="Search Event.."
              placeholderTextColor={'gray'}
              value={searchText}
              onChangeText={setSearchText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onSubmitEditing={() => navigation.navigate("searchingScreen", { searchText })}
            />
            <TouchableOpacity style={[globalStyles.button]} >
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {(isFocused && searchText.length > 0) && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                scrollEnabled={false}
                data={suggestion}
                style={{ paddingLeft: 20 }}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.suggestionItem} key={`suggestion-${item.id}`}
                    onPress={() => { navigation.navigate('eventDetail', { id: item.id }); }}>
                    <Text style={styles.suggestionTitle}>{item.title}</Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={{ gap: 10 }}
              />
            </View>
          )}

          {/* Trending Events */}
          <Text style={[globalStyles.title, globalStyles.mi]}>Trending Events</Text>
          <View>
            <Animated.FlatList
              data={trend}
              renderItem={({ item, index }) => <SliderItem item={item} key={`trending-${item.id}`}
                index={index} scrollX={scrollX} onPress={() => navigation.navigate('eventDetail', { id: item.id })} />}
              horizontal
              showsHorizontalScrollIndicator={false}
              // pagingEnabled
              onScroll={onScrollHandler} />
            <Pagination items={trend} scrollX={scrollX} />
          </View>

          {/* Categories */}
          <Text style={[globalStyles.title, globalStyles.mi]}>Categories</Text>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Category
                key={`cate-${item.id}`}
                type={item.name}
                iconName={getIconNameByCategory(item.name)}
                onPress={() => navigation.navigate('categoryFilter', { id: item.id })}
              />
            )}
            contentContainerStyle={[globalStyles.container, globalStyles.mb, globalStyles.mi]}
          />

          <View style={globalStyles.mb}></View>

          {/* Recommend Events */}
          {(user?._j?.role === 'participant') && (
            <><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[globalStyles.title, globalStyles.mi]}>Recommend Event</Text>
              <TouchableOpacity onPress={() => navigation.navigate('recommendEvent')} style={globalStyles.mr}>
                <Text style={[{ color: '#2196F3', fontWeight: '600' }]}>View all</Text>
              </TouchableOpacity>
            </View>
              <FlatList
                style={{ paddingInline: 20 }}
                data={recommend}
                renderItem={({item}) => <EventCard
                  key={`recommend-${item.id}`}
                  item={item}
                  onPress={() => navigation.navigate('eventDetail', { id: item.id })}
                  cardWidth={300}
                />}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
                ListEmptyComponent={() => (
                  <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text>No events found</Text>
                  </View>
                )}
                ListFooterComponent={loading && <ActivityIndicator size={30} />}
              />
              <View /></>)}

          {/* Upcoming Events */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[globalStyles.title, globalStyles.mi]}>Upcoming Event</Text>
            <TouchableOpacity onPress={() => navigation.navigate('upcomingEvent')} style={globalStyles.mr}
            ><Text style={{ color: '#2196F3', fontWeight: '600' }}>View all</Text></TouchableOpacity>
          </View>
          <FlatList
            style={{ paddingHorizontal: 20 }}
            data={events}
            renderItem={({ item }) => <EventCard
              key={`upcoming-${item.id}`}
              item={item}
              onPress={() => navigation.navigate('eventDetail', { id: item.id })}
              cardWidth={300}
            />}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
            ListFooterComponent={loading && <ActivityIndicator size={30} />}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={() => (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text>No events found</Text>
              </View>
            )}
          />

          {isLoadingMore && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          )}

          <View />
        </View>
      </ScrollView>)
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLORS.white,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 12,
    left: 12, backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});


export default Home;
