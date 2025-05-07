import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import COLORS from '../constants/colors';

const TabLocation = ({ item }) => {
    const openGoogleMaps = () => {
        // Tạo URL mở Google Maps trực tiếp (cho cả trình duyệt và ứng dụng)
        const googleMapsUrl = `https://www.google.com/maps?q=${item.latitude},${item.longitude}`;
        const iosMapsUrl = `comgooglemaps://?q=${item.latitude},${item.longitude}`;

        // Kiểm tra xem thiết bị có phải là iOS và có ứng dụng Google Maps không
        if (Platform.OS === 'ios') {
            Linking.canOpenURL(iosMapsUrl)
                .then((supported) => {
                    if (supported) {
                        Linking.openURL(iosMapsUrl); // Mở Google Maps trên iOS
                    } else {
                        Linking.openURL(googleMapsUrl); // Nếu không có Google Maps, mở trên trình duyệt
                    }
                })
                .catch((err) => console.error('Error opening Google Maps on iOS', err));
        } else {
            // Trên Android, luôn sử dụng Google Maps URL
            Linking.canOpenURL(iosMapsUrl)
                .then((supported) => {
                    if (supported) {
                        Linking.openURL(iosMapsUrl);
                    } else {
                        Linking.openURL(googleMapsUrl);
                    }
                })
                .catch((err) => console.error('Error opening Google Maps on Android', err));
        }
    };

    return (
        <View style={{ marginBottom: 30 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 }}>Location</Text>
            <View style={{ height: 250, borderRadius: 8, overflow: 'hidden', marginBottom: 15 }}>
                <MapView
                    style={{ width: '100%', height: '100%' }}
                    initialRegion={{
                        latitude: item.latitude,
                        longitude: item.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: item.latitude,
                            longitude: item.longitude,
                        }}
                        title={item.location}
                        description={item.title}
                    />
                </MapView>
            </View>
            <View style={styles.locationInfo}>
                <Ionicons name="location" size={24} color={COLORS.primary} />
                <Text style={styles.locationText}>{item.location}</Text>
            </View>
            <TouchableOpacity style={styles.directionsButton} onPress={openGoogleMaps}>
                <Ionicons name="navigate" size={20} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Get Directions</Text>
            </TouchableOpacity>
        </View>
    );
};

export default TabLocation;

const styles = StyleSheet.create({
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary + '15',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
    },
    locationText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    directionsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 25,
        gap: 8,
        backgroundColor: COLORS.secondaryDark,
        shadowColor: COLORS.secondaryDark,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 3,
    },
});
