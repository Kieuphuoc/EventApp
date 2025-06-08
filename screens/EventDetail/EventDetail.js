import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import COLORS from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import TabReviews from '../../components/TabReviews';
import TabLocation from '../../components/TabLocation';
import TabAbout from '../../components/TabAbout';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Apis, { endpoints } from '../../configs/Apis';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../../constants/globalStyles';

const EventDetail = ({ route }) => {
    const { id } = route.params;
    const eventId = parseInt(id, 10);

    const navigation = useNavigation();

    const [tabItem, moveTab] = useState(1);
    const [rating, setRating] = useState({});
    const [events, setEvents] = useState(null);
    const [loading, setLoading] = useState(true); // Đã thêm loading state

    const price = Number(events?.ticket_price)?.toFixed(0);

    const loadEvents = async () => {
        try {
            let res = await Apis.get(endpoints['eventDetail'](eventId));
            if (res.data) {
                setEvents(res.data);
            }
        } catch (ex) {
            console.error("Error loading events:", ex);
            setEvents({}); // Đảm bảo item là object
        } finally {
            setLoading(false);
        }
    };

    const loadRating = async () => {
        try {
            let res = await Apis.get(endpoints['stats_rating'](eventId));
            setRating(res.data || {}); // Kiểm tra res.data
        } catch (error) {
            console.error('Lỗi gọi API:', error);
        }
    };

    useEffect(() => {
        loadEvents();
    }, [eventId]); // Thêm event_id làm dependency

    useEffect(() => {
        loadRating();
    }, []);

    return (



        <GestureHandlerRootView style={styles.container}>
            {events === null ? <ActivityIndicator /> : <><StatusBar barStyle="light-content" />
                <ScrollView>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: events.image }} style={styles.image} />
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.favoriteButton}>
                            <Ionicons name="heart-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        <View style={styles.header}>
                            <View style={styles.eventTypeContainer}>
                                <Text style={styles.eventType}>{events.category?.name}</Text>
                            </View>
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={18} color="#FFD700" />
                                <Text style={styles.rating}>
                                    {rating.average_rating ? `${rating.average_rating.toFixed(1)}` : ""}
                                </Text>
                                <Text style={styles.reviewCount}>
                                    {rating.review_count ? `(${rating.review_count} reviews)` : "No review"}
                                </Text>
                            </View>
                        </View>

                        <Text style={globalStyles.header}>{events.title || 'No Title'}</Text>
                        <View style={styles.locationContainer}>
                            <Ionicons name="location" size={16} color={COLORS.primary} />
                            <Text style={styles.location}>{events.location || 'Unknown Location'}</Text>
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

                        {/* Tab About */}
                        {tabItem === 1 && (
                            <TabAbout
                                description={events.description || 'No description available'}
                                ticketSold={events.ticket_sold}
                                ticketQuantity={events.ticket_quantity}
                                startTime={events.start_time}
                                endTime={events.end_time}

                                manager={{
                                    image: events.organizer.avatar || 'https://example.com/default-avatar.png',
                                    name: `${events.organizer.first_name} ${events.organizer.last_name}`,
                                    role: 'Organizer',
                                    id: events.organizer.id
                                }}

                            />
                        )}

                        {/* Tab Location */}
                        {tabItem === 2 && (
                            <TabLocation item={events} />
                        )}

                        {/* Tab Reviews */}
                        {tabItem === 3 && (

                            <TabReviews event_id={events.id} />

                        )}
                    </View>
                </ScrollView>

                {/* Booking */}
                <View style={styles.footer}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Total price</Text>
                        <Text style={styles.price}>{price || 0} ₫</Text>
                    </View>
                    <TouchableOpacity style={styles.bookButton} onPress={() => navigation.navigate('booking', { event: events })}>
                        <Ionicons name="cart" size={20} color="#fff" />
                        <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                </View></>}
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        backgroundColor: COLORS.primary + '20',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    eventType: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 15,
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
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginLeft: 5,
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
        fontSize: 24,
        color: COLORS.error,
        fontWeight: 'bold',
    },
    bookButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        gap: 8,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 3,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default EventDetail;