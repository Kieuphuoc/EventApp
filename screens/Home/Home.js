import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, FlatList } from 'react-native';
import { styles } from './styles';
import Header from '../../components/Header';
import SearchBox from '../../components/SearchBox';
import Category from '../../components/Category';
import EventCard from '../../components/EventCard';
import FeaturedPosts from '../../components/FeaturedPosts';
import { COLORS } from '../../constants/colors';
import Apis, { endpoints } from '../../configs/Apis';
import { Chip } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const navigation = useNavigation();

  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState([false]);

  // const loadEvents = async () => {
  //   let res = await Apis.get(endpoints['event']);
  //   setEvents(res.data);
  // }

  const loadCates = async () => {
    let res = await Apis.get(endpoints['category']);
    setCategories(res.data);
  }

  const loadEvents = async () => {
    try {
      setLoading(true);

      let res = await Apis.get(endpoints['event']);
      console.log("Dữ liệu trả về:", res.data); 
      setEvents(res.data);
    } catch (ex) {
      console.error(ex);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCates();
  }, []);

  useEffect(() => {
    loadEvents();
  }, []);


  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Header />
        <SearchBox />

        <Text style={styles.sectionTitle}>Categories</Text>

        {/* <View style={styles.categoryRow}>
          <Category type="Football" iconName="football" />
          <Category type="Library" iconName="library" />
          <Category type="Camera" iconName="camera" />
          <Category type="Headset" iconName="headset" />
        </View> */}
        <View style={styles.categoryRow}>
          {categories.map((c) => {
            let icon = "alert"; // mặc định
            if (c.name.includes("Sport")) icon = "football";
            else if (c.name.includes("")) icon = "library";
            else if (c.name.includes("Alo")) icon = "headset";
            return <Category key={c.id} type={c.name} iconName={icon} />;
          })}
        </View>

        <Text style={styles.sectionTitle}>Upcoming Events</Text>

        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <EventCard 
            item={item}
            onPress={() => navigation.navigate('eventDetail', { item })}
            />
          )}
          showsHorizontalScrollIndicator={false}
        />


        <View style={{ flex: 1 }} />

        <Text style={styles.featuredTitle}>🔥 Bài đăng nổi bật</Text>
      </View>

      <FeaturedPosts />
    </ScrollView>
  );
};

export default Home;
