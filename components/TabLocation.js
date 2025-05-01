import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import COLORS from '../constants/colors';

const TabLocation = ({ location, title }) => {
    return (
        <View style={{ marginBottom: 30 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 }}>Location</Text>
            <View style={{ height: 250, borderRadius:8, overflow: 'hidden', marginBottom: 15 }}>
                <MapView
                    style={{ width: '100%', height: '100%' }}
                    initialRegion={{
                        latitude: 10.762622,
                        longitude: 106.660172,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: 10.762622,
                            longitude: 106.660172,
                        }}
                        title={location}
                        description={title}
                    />
                </MapView>
            </View>
            <View style={styles.locationInfo}>
                <Ionicons name="location" size={24} color={COLORS.primary} />
                <Text style={styles.locationText}>{location}</Text>
            </View>
            <TouchableOpacity style={styles.directionsButton}>
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
        backgroundColor: '#f8f9fa',
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
        borderRadius: 12,
        gap: 8,
    },
});
