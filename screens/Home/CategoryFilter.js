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
import { ActivityIndicator } from 'react-native-paper';
import Apis, { endpoints } from '../../configs/Apis';
import EventCardMini from '../../components/EventCardMini';
import COLORS from '../../constants/colors';
import Header from '../../components/Header';

const CategoryFilter = ({ route, navigation }) => {
    const { id } = route.params;
    console.log(id);

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);


    const loadEvent = async () => {
        try {
            setLoading(true);
            let allEvents = [];

            let url = `${endpoints['event']}?category_id=${id}`;

            let res = await Apis.get(url);
            if (res.data) {
                allEvents = [...allEvents, ...res.data.results];
            }
            setEvents(allEvents);

        } catch (ex) {
            console.error("Error loading events:", ex);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadEvent();
    }, []);


    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Header title={"Filter By Category"} navigation={true} />
            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
            ) : (
                <><FlatList
                    style={{ padding: 10 }}
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

                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No events found</Text>
                        </View>
                    )}
                    ListFooterComponent={
                        <>
                            {loading && <ActivityIndicator size={30} color={COLORS.primary} />}
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
});

export default CategoryFilter;
