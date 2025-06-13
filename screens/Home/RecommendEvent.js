import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, SafeAreaView, Alert, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';
import Apis, { authApis, endpoints } from '../../configs/Apis';
import COLORS from '../../constants/colors';
import EventCardMini from '../../components/EventCardMini';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';

const ITEMS_PER_PAGE = 6;

const RecommendEvent = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [recommend, setRecommend] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollY = new Animated.Value(0);


 const loadRecommend = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      let res = await authApis(token).get(endpoints["recommend"]);
      // console.log("Recommend", res.data);
      if (res.data) {
        setRecommend(res.data);
      }
    } catch (ex) {
      console.error("Error loading Recommend:", ex);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecommend();
  },[]);
  

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <Header title={"Recommend Event"} navigation={true} />
      <FlatList
        data={recommend}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <EventCardMini
            item={item.event || item}
            onPress={() => navigation.navigate('eventDetail', { id: item.event?.id || item.id })}
            index={index}
          />
        )}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        scrollEnabled={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        ListFooterComponent={
          <>
            {loading && <ActivityIndicator size={30} color={COLORS.primary} />}
          </>
        }
      />
    </View>
  );
};

export default RecommendEvent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  list: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.primaryDark,
    opacity: 0.6,
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 15,
  },
  pageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageButtonDisabled: {
    opacity: 0.5,
  },
  pageText: {
    fontSize: 14,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
});