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
            <StatusBar backgroundColor={COLORS.primaryDark} barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Filter by category</Text>
            </View>
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
        backgroundColor: COLORS.primary,
        padding: 20,
        paddingTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    backButton: {
        marginRight: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 8,
        borderRadius: '50%',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default CategoryFilter;
