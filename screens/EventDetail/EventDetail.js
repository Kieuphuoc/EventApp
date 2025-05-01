import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import COLORS from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import EventCard from '../../components/EventCard';
import TabReviews from '../../components/TabReviews';
// import TabLocation from '../../components/TabLocation';
import TabAbout from '../../components/TabAbout';

const EventDetail = ({ route }) => {

    const { item } = route.params;

    const [events, setEvents] = useState([]);

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
        loadEvents();
    }, []);

    const [tabItem, moveTab] = useState(1);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <TouchableOpacity style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.favoriteButton}>
                        <Ionicons name="heart-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.eventTypeContainer}>
                            <Text style={styles.eventType}>{item.category_id}</Text>
                        </View>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={18} color="#FFD700" />
                            <Text style={styles.rating}>4.5</Text>
                            <Text style={styles.reviewCount}>(563 reviews)</Text>
                        </View>
                    </View>

                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location" size={16} color={COLORS.primary} />
                        <Text style={styles.location}>{item.location}</Text>
                    </View>

                    {/* 3 Tab */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, tabItem === 1 && styles.activeTab]}
                            onPress={() => moveTab(1)}
                        >
                            <Text style={[styles.tabText, tabItem === 1 && styles.activeTabText]}>About</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, tabItem === 2 && styles.activeTab]}
                            onPress={() => moveTab(2)}
                        >
                            <Text style={[styles.tabText, tabItem === 2 && styles.activeTabText]}>Location</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, tabItem === 3 && styles.activeTab]}
                            onPress={() => moveTab(3)}
                        >
                            <Text style={[styles.tabText, tabItem === 3 && styles.activeTabText]}>Reviews</Text>
                        </TouchableOpacity>
                    </View>

                    {tabItem === 1 && (
                        <TabAbout
                            description={item.description}
                            manager={{
                                image: 'https://play-lh.googleusercontent.com/VMPS_t-CGBp-NVqefuMvMOGEDfmovBcGiepmAAF1I9hkdjLOjsfVjEV5d41DTAy3qI_akNaJKTdmaNwMRIs=w240-h480-rw',
                                name: 'Kieu Phuoc',
                                role: 'Manager'
                            }}
                        />
                    )}

                    {/* {tabItem === 2 && (
                        <TabLocation location={event.location} title={event.title} />
                    )} */}

                    {tabItem === 3 && (
                        <TabReviews />
                    )}

                    <Text style={styles.sectionTitle}>Popular Events</Text>
                    
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
                </View>
            </ScrollView>

            {/* Booking */}
            <View style={styles.footer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Total price</Text>
                    <Text style={styles.price}>${item.ticket_price}.000</Text>
                </View>
                <TouchableOpacity style={styles.bookButton} onPress={() => router.push('/booking')}>
                    <Ionicons name="cart" size={20} color="#fff" />
                    <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 350,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    favoriteButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    eventTypeContainer: {
        backgroundColor: COLORS.primary + '10',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    eventType: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        color: '#333',
        fontWeight: '600',
        marginLeft: 4,
        marginRight: 4,
    },
    reviewCount: {
        color: '#666',
        fontSize: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    location: {
        color: '#666',
        marginLeft: 5,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        marginBottom: 20,
    },
    tab: {
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
    },
    tabText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    eventsList: {
        paddingBottom: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    priceContainer: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 14,
        color: '#666',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    bookButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        gap: 8,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});


export default EventDetail;