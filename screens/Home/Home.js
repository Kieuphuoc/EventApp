import React, { useContext, useEffect, useRef, useState } from "react";
import { ScrollView, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { styles } from './styles';
import Header from '../../components/Header';
import SearchBox from '../../components/SearchBox';
import Category from '../../components/Category';
import EventCard from '../../components/EventCard';
import Pagination from "../../components/Pagination";
import SliderItem from "../../components/SliderItem";
import { RefreshControl} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";


import FeaturedPosts from '../../components/FeaturedPosts';
import Apis, { authApis, endpoints } from '../../configs/Apis';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../../constants/globalStyles";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyUserContext } from "../../configs/Context";
import LottieView from "lottie-react-native";

const Home = () => {
  const navigation = useNavigation();

  const [globalLoading, setGlobalLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [trend, setTrend] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [discount, setDiscount] = useState([]);

  const [rating, setRating] = useState({});

  const user = useContext(MyUserContext);



  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

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

  const loadTrend = async () => {
    try {
      setLoading(true);

      let res = await Apis.get(endpoints['trend']);

      if (res.data && res.data.length > 0) {
        setTrend(res.data);

        // Lấy rating cho từng sự kiện
        const ratings = {};
        for (let event of res.data) {
          try {
            let resRating = await Apis.get(endpoints['stats_rating'](event.id));
            ratings[event.id] = resRating.data || {};
          } catch (err) {
            console.error(`Lỗi khi lấy rating của event ${event.id}:`, err);
          }
        }

        setRating(ratings); // setRating là object chứa rating theo id
      } else {
        setTrend([]);
      }
    } catch (ex) {
      console.error("Error loading Trend:", ex);
      setTrend([]);
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
      }
    } catch (ex) {
      console.error("Error loading Recommend:", ex);
      setRecommend([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }


  // useEffect(() => {
  //   if (user?._j?.role === 'participant') {
  //     loadRecommend();
  //   }
  // }, []);

  // useEffect(() => {
  //   loadTrend();
  // }, []);

  // useEffect(() => {
  //   loadCates();
  // }, []);

  // useEffect(() => {
  //   loadEvents();
  // }, [q]);

  const loadAllData = async () => {
    try {
      setGlobalLoading(true);

      await Promise.all([
        loadCates(),
        loadEvents(),
        loadTrend(),
        // user?._j?.role === 'participant' &&
        loadRecommend()
      ]);
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
    await loadAllData(); // Hàm bạn đã định nghĩa để tải dữ liệu
    setRefreshing(false);
  };

  const scrollX = useSharedValue(0);
  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
    // Dùng cho auto Scroll
    // onMomentumEnd: (e) => {
    //   scrollX.value = e.contentOffset.x;
    //   },
  });
  const [paginationIndex, setPaginationIndex] = useState(0);
  // const ref = useAnimatedRef<Animated.FlatList<any>>();
  // const [isAutoPlay, setIsAutoPlay] = useState(true);
  // const interval = useRef<NodeJS.Timeout>();
  // const offset = useSharedValue(0);

  // useEffect(() => {
  //   if(isAutoPlay== true){
  //     interval.current = setInterval(() => {
  //       offset.value += width;
  //       ref.current?.scrollToOffset({offset: offset.value, animated: true});
  //     }, 2000);
  //   } else {
  //     clearInterval(interval.current);
  //   }
  //   return () => clearInterval(interval.current);
  // },[isAutoPlay, offset, width]);

  // useDerivedValue(() => {
  //   scrollTo(ref, offset.value, 0 , true);
  // });

  const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      const index = viewableItems[0].index % trend.length; // Đảm bảo quay vòng
      setPaginationIndex(index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  }

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);


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
      <ScrollView style={styles.scrollView} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2196F3']} />
      }>
        <View style={styles.container}>
          <Header />
          <TouchableOpacity onPress={() => navigation.navigate('searchingScreen')}>
            <SearchBox q={q} setQ={setQ} />
          </TouchableOpacity>

          {/* Trending Events */}
          <Text style={[globalStyles.title, globalStyles.mi]}>Trending Events</Text>
          <View style={{}}>
            <Animated.FlatList
              data={trend}
              renderItem={({ item, index }) => <SliderItem item={item} index={index} scrollX={scrollX} onPress={() => navigation.navigate('eventDetail', { id: item.id })} />}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              onScroll={onScrollHandler}
              viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
              keyExtractor={(item, idx) => item.id?.toString() || idx.toString()}
              style={{}}
            />
            <Pagination
              items={trend}
              paginationIndex={paginationIndex}
              scrollX={scrollX}
            />
          </View>

          {/* Categories */}
          <Text style={[globalStyles.title, globalStyles.mi]}>Categories</Text>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Category
                type={item.name}
                iconName={getIconNameByCategory(item.name)}
              />
            )}
            contentContainerStyle={[globalStyles.container, globalStyles.mb, globalStyles.mi]}
          />

          <View style={globalStyles.mb}></View>

          {/* Recommend Events */}
          {(user?._j?.role === 'participant' && recommend.length > 0) && (
            <><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[globalStyles.title, globalStyles.mi]}>Recommend Event</Text>
              <TouchableOpacity onPress={() => navigation.navigate('upcomingEvent')} style={globalStyles.mr}>
                <Text style={[{ color: '#2196F3', fontWeight: '600' }]}>View all</Text>
              </TouchableOpacity>
            </View>
              <FlatList
                style={{ paddingInline: 20 }}
                data={recommend}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                  <EventCard
                    item={item}
                    key={index}
                    onPress={() => navigation.navigate('eventDetail', { id: item.id })}
                    cardWidth={300}

                  />
                )}
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
            style={{ paddingInline: 20 }}
            data={events}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <EventCard
                item={item}
                key={index}
                onPress={() => navigation.navigate('eventDetail', { id: item.id })}
                cardWidth={300}
              />
            )}
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
          <View />
        </View>
        {/* <FeaturedPosts /> */}
      </ScrollView>)
  );
};

export default Home;
