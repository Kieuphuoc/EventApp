import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import EventCard from '../components/EventCard'; // bạn thay bằng component hiển thị sự kiện của bạn
import { ActivityIndicator } from 'react-native-paper';
import Apis, { endpoints } from '../configs/Apis';
import EventCardMini from '../components/EventCardMini';

const CategoryFilter = ({ route, navigation }) => {
    const { id } = route.params;
    console.log(id);

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    // const loadEventsByCategory = async () => {
    //     try {
    //         setLoading(true);
    //         let url = `${endpoints['event']}?category_id=${categoryId}`;
    //         const res = await Apis.get(url);

    //         if (res.data) {
    //             setEvents(res.data);
    //         }
    //     } catch (ex) {
    //         console.error('Error loading events by category:', ex);
    //         setEvents([]);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const loadEvent = async () => {
        try {
            setLoading(true);

            let url = `${endpoints['event']}`;

            if (id) {
                url = `${url}?category_id=${id}`;
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
        loadEvent();
    }, []);


    // useEffect(() => {
    //     loadEventsByCategory();
    // }, []);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.primaryDark} barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Events by Category</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
            ) : (
               
            <><FlatList
        data={events}
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
        // onScroll={Animated.event(
        //   [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        //   { useNativeDriver: false }
        // )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No events found</Text>
          </View>
        )}
        ListFooterComponent={
          <>
            {loading && <ActivityIndicator size={30} color={COLORS.primary} />}
            {/* {renderPagination()} */}
          </>
        }
      /></>)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 12,
    },
});

export default CategoryFilter;
