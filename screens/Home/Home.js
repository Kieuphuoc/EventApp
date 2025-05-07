
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
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../../constants/globalStyles";

const Home = () => {
  const navigation = useNavigation();


  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
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

  useEffect(() => {
    loadCates();
  }, []);

  useEffect(() => {
    loadEvents();
  }, [q]);  


  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Header />
        <SearchBox q={q} setQ={setQ}/>
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

        <Text style={globalStyles.title}>Upcoming Events</Text>

        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <EventCard 
              item={item}
              onPress={() => navigation.navigate('eventDetail', { id: item.id })}
            />
          )}
          // horizontal
          scrollEnabled={false}
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
