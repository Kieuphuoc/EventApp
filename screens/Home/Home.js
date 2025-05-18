import React, { useContext, useEffect, useRef, useState } from "react";
import { ScrollView, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { styles } from './styles';
import Header from '../../components/Header';
import SearchBox from '../../components/SearchBox';
import Category from '../../components/Category';
import EventCard from '../../components/EventCard';
import Pagination from "../../components/Pagination";
import SliderItem from "../../components/SliderItem";
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
import { Touchable } from "react-native";
import { center } from "@shopify/react-native-skia";

const Home = () => {
  const navigation = useNavigation();


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

  const loadRating = async () => {
    try {
      let res = await Apis.get(endpoints['stats_rating'](events));
      setRating(res.data || {}); // Kiểm tra res.data
    } catch (error) {
      console.error('Lỗi gọi API:', error);
    }
  };

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

      let url = `${endpoints['trend']}`;

      let res = await Apis.get(url);
      if (res.data) {
        setTrend(res.data);
      }
    } catch (ex) {
      console.error("Error loading Trend:", ex);
      setTrend([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }

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
  const loadDiscount = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const res = await authApis(token).get(endpoints['my-discount']);
      if (res.data) {
        setDiscount(res.data);
      } else {
        setDiscount([]);
      }
    } catch (error) {
      console.error('Error loading discounts:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });
      setDiscount([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadRecommend();
  }, []);
  useEffect(() => {
    loadRating();
  }, []);

  useEffect(() => {
    loadTrend();

  }, []);
  useEffect(() => {
    loadDiscount();

  }, []);
  useEffect(() => {
    loadCates();
  }, []);

  useEffect(() => {
    loadEvents();
  }, [q]);

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




  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Header />
        <SearchBox q={q} setQ={setQ} />
        <Text style={globalStyles.title}>Categories</Text>

        <View style={[globalStyles.container, globalStyles.mb]}>
          {categories.map((c) => {
            let icon = "alert"; // mặc định
            if (c.name.includes("Sport")) icon = "football";
            else if (c.name.includes("")) icon = "library";
            else if (c.name.includes("Alo")) icon = "headset";
            return <Category key={c.id} type={c.name} iconName={icon} />;
          })}
        </View>
        <Text style={globalStyles.title}>Trending Events</Text>


        <View style={{ marginBottom: 18 }}>
          <Animated.FlatList
            data={trend}
            renderItem={({ item, index }) => <SliderItem item={item} index={index} scrollX={scrollX} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onScroll={onScrollHandler}
            viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
            keyExtractor={(item, idx) => item.id?.toString() || idx.toString()}
            style={{ minHeight: 440 }}
          />
        </View>

        <Text style={{ fontWeight: 'bold', fontSize: 22, color: '#222', marginBottom: 10 }}>Recommend Events</Text>
        
<FlatList
          data={recommend}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <EventCard
              item={item}
              onPress={() => navigation.navigate('eventDetail', { id: item.id })}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          ListEmptyComponent={() => (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text>No events found</Text>
            </View>
          )}
          ListFooterComponent={loading && <ActivityIndicator size={30} />}
        />
        {user && (<><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#222' }}>Discount for you</Text>
          <TouchableOpacity><Text style={{ color: '#2196F3', fontWeight: '600' }}>View all</Text></TouchableOpacity>
        </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
            <View style={{ backgroundColor: '#e6f7ed', borderRadius: 14, padding: 14, marginRight: 12, minWidth: 220 }}>
              <Text style={{ color: '#43a047', fontWeight: 'bold', fontSize: 16 }}>{discount.discount_percent}</Text>
              <Text style={{ color: '#2196F3', fontSize: 13, marginBottom: 2 }}>Tự động áp dụng khi thanh toán{discount.discount_code}</Text>
              <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 15 }}>BHD: Ưu đãi đồng giá 95K/vé 2D</Text>
              <Text style={{ color: '#666', fontSize: 12 }}>Khi mua vé 2D từ Thứ 6 đến Chủ Nhật</Text>
            </View>
          </ScrollView></>)}

        {/* 
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#222' }}>Rạp đề xuất</Text>
          <TouchableOpacity><Text style={{ color: '#2196F3', fontWeight: '600' }}>Xem tất cả</Text></TouchableOpacity>
        </View>
        <View style={{ backgroundColor: '#e3f2fd', borderRadius: 14, padding: 16, marginBottom: 24 }}>
          <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 15, marginBottom: 2 }}>Gần đây có rạp nào nhỉ?</Text>
          <Text style={{ color: '#666', fontSize: 13, marginBottom: 2 }}>Chia sẻ vị trí của bạn với MoMo để biết các rạp phim và suất chiếu gần bạn nhất nha.</Text>
        </View> */}


        {/* </View> */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#222' }}>Upcoming Events</Text>
          <TouchableOpacity onPress={() => navigation.navigate('upcomingEvent')}
          ><Text style={{ color: '#2196F3', fontWeight: '600' }}>View all</Text></TouchableOpacity>
        </View>
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <EventCard
              item={item}
              onPress={() => navigation.navigate('eventDetail', { id: item.id })}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          ListEmptyComponent={() => (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text>No events found</Text>
            </View>
          )}
          ListFooterComponent={loading && <ActivityIndicator size={30} />}
        />


        <View style={{ flex: 1 }} />

        <Text style={globalStyles.title}>🔥 Bài đăng nổi bật</Text>
      </View>

      <FeaturedPosts />
    </ScrollView>
  );
};

export default Home;
