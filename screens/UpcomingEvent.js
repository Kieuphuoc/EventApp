import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Apis, { endpoints } from '../configs/Apis';
import COLORS from '../constants/colors';
import { useNavigation } from '@react-navigation/native';

export default function UpcommingEvent() {
      const navigation = useNavigation();
    
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    

    const loadEvents = async () => {
        try {
            setLoading(true);

            let url = `${endpoints['event']}`;

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
        loadEvents();
    }, []);

    const EventCard = ({ event }) => (
        <View style={styles.card}>
            <Image source={{ uri: event.image }} style={styles.image} />
            <View style={styles.info}>
                <View style={styles.row}>
                    <Text style={styles.age}>{event.age}</Text>
                    <Text style={styles.rating}>★ {event.rating}/10 ({event.votes} đánh giá)</Text>
                </View>
                <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
                <Text style={styles.genres}>{event.genres}</Text>
                <View style={styles.row}>
                    <Text style={styles.meta}>⏱ {event.duration}'</Text>
                    <Text style={styles.meta}>📅 {event.date}</Text>
                </View>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.detailBtn}>
                        <Text style={styles.detailText}>Join</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buyBtn}  onPress={() => navigation.navigate('booking', { event: events })}>
                        <Text style={styles.buyText}>Booking</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Phim sắp chiếu</Text>
            <FlatList
                data={events}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <EventCard event={item} />}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={loading && <ActivityIndicator size={30} />}

            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#333' },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        padding: 10,
    },
    image: { width: 100, height: 130, borderRadius: 8, marginRight: 12 },
    info: { flex: 1, justifyContent: 'space-between' },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    age: {
        backgroundColor: '#f8b400',
        color: '#fff',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        fontWeight: 'bold',
        marginRight: 8,
        fontSize: 12,
    },
    rating: { color: '#f39c12', fontWeight: 'bold', fontSize: 12 },
    title: { fontWeight: 'bold', fontSize: 16, color: '#222', marginBottom: 2 },
    genres: { color: '#888', fontSize: 13, marginBottom: 4 },
    meta: { color: '#555', fontSize: 12, marginRight: 12 },
    buttonRow: { flexDirection: 'row', marginTop: 8 },
    detailBtn: {
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 18,
        marginRight: 10,
    },
    detailText: { color: COLORS.primary, fontWeight: 'bold' },
    buyBtn: {
        backgroundColor:  COLORS.primary + '30',
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderColor:  COLORS.primary,
    },
    buyText: { color:  COLORS.primary, fontWeight: 'bold' },
});
