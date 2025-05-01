import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, FlatList } from 'react-native';
import { styles } from './styles';
import Header from '../../components/Header';
import SearchBox from '../../components/SearchBox';
import EventType from '../../components/EventType';
import EventCard from '../../components/EventCard';
import FeaturedPosts from '../../components/FeaturedPosts';
import { COLORS } from '../../constants/colors';
import Apis, { endpoints } from '../../configs/Apis';
import { Chip } from 'react-native-paper';

const Home = () => {

  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState([false]);

  // const loadEvents = async () => {
  //   let res = await Apis.get(endpoints['event']);
  //   setEvents(res.data);
  // }

  const loadCates = async () => {
    let res = await Apis.get(endpoints['event_type']);
    setCategories(res.data);
  }

  const loadEvents = async () => {
    try {
      setLoading(true);

      let res = await Apis.get(endpoints['event']);
      setEvents(res.data.results);
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
          <EventType type="Football" iconName="football" />
          <EventType type="Library" iconName="library" />
          <EventType type="Camera" iconName="camera" />
          <EventType type="Headset" iconName="headset" />
        </View> */}
        <View style={styles.categoryRow}>
          {categories.map((c) => {
            let icon = "alert"; // mặc định
            if (c.name.includes("Sport")) icon = "football";
            else if (c.name.includes("")) icon = "library";
            else if (c.name.includes("Alo")) icon = "headset";
            return <EventType key={c.id} type={c.name} iconName={icon} />;
          })}

        </View>

        <Text style={styles.sectionTitle}>Upcoming Events</Text>

        <FlatList
        // data={events}
        // keyExtractor={(item) => item.id.toString()}
        // renderItem={renderItem}
        // horizontal
        // showsHorizontalScrollIndicator={false}
        />

        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <EventCard
              title={item.title}
              description={item.description}
              date={item.start_time}
              eventType={item.event_type_id}
              price={item.ticket_price}
              location={item.location}
              image={item.image}
            />
          )}
          horizontal
                  showsHorizontalScrollIndicator={false}

          style={{ height: 400 }}
        />


        <View style={{ flex: 1 }} />

        <Text style={styles.featuredTitle}>🔥 Bài đăng nổi bật</Text>
      </View>

      <FeaturedPosts />
    </ScrollView>
  );
};

export default Home;
