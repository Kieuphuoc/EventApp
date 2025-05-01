import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

const TabAbout = ({ description, manager }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const shortDescription = description.slice(0, 170);
    const fullDescription = description;

    return (
        <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
                {isExpanded ? fullDescription : shortDescription}
                {description.length > 100 && (
                    <Text
                        onPress={() => setIsExpanded(!isExpanded)}
                        style={styles.seeMore}
                    >
                        {isExpanded ? ' See less' : ' See more'}
                    </Text>
                )}
            </Text>

            <Text style={styles.sectionTitle}>Project Manager</Text>
            <View style={styles.managerContainer}>
                <Image
                    source={{ uri: manager.image }}
                    style={styles.managerImage}
                />
                <View style={styles.managerInfo}>
                    <Text style={styles.managerName}>{manager.name}</Text>
                    <Text style={styles.managerRole}>{manager.role}</Text>
                </View>
                <View style={styles.managerActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="chatbox-ellipses" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="call" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default TabAbout;

const styles = StyleSheet.create({
    tabContent: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    description: {
        color: '#666',
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 20,
    },
    seeMore: {
        color: COLORS.primary,
        fontWeight: '500',
    },
    managerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 12,
    },
    managerImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    managerInfo: {
        marginLeft: 15,
        flex: 1,
    },
    managerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    managerRole: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    managerActions: {
        flexDirection: 'row',
        gap: 15,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
}); 