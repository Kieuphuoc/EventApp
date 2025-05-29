import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import RenderHTML from 'react-native-render-html';
import globalStyles from '../constants/globalStyles';

const TabAbout = ({ description, ticketSold, ticketQuantity, startTime, endTime, manager }) => {
    const [isExpanded, setIsExpanded] = useState(false); //Chưa xử lí được
    const { width } = useWindowDimensions(); // 👈 Lấy chiều rộng màn hình


    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const startDay = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(startDate);

    const endDay = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(endDate);

    const startTimeStr = `${startDate.getHours()}:${startDate.getMinutes().toString().padStart(2, '0')}`;
    const endTimeStr = `${endDate.getHours()}:${endDate.getMinutes().toString().padStart(2, '0')}`;

    return (
        <View style={{}}>
            {/* <Text style={globalStyles.text}>Ticket quantity: {ticketQuantity} </Text> */}
            <View style={globalStyles.container}><Text style={globalStyles.title}>Detail Information</Text>
                <View style={globalStyles.hor}>
                    <Ionicons name="ticket" size={15} color={COLORS.primary} />
                    <Text style={globalStyles.miniText}>Sold {ticketSold}/{ticketQuantity}</Text>
                </View>
            </View>
            <Text style={[globalStyles.text, globalStyles.mbText]}>Start: {startDay} at {startTimeStr}</Text>
            <Text style={[globalStyles.text, globalStyles.mbText]}>End: {endDay} at {endTimeStr}</Text>
            <Text style={globalStyles.text}>Remaining: {ticketQuantity - ticketSold}</Text>

            {/* <View style={globalStyles.mb}></View> */}
            <View style={globalStyles.mb}></View>


            <Text style={globalStyles.title}>Description</Text>
            <RenderHTML
                contentWidth={width}
                source={{
                    html: description
                    // isExpanded ? description : description.slice(0, 100) + '...',
                }}
                tagsStyles={{
                    p: {
                        color: '#666',
                        fontSize: 15,
                        lineHeight: 22,
                        // marginBottom: 20,
                    }
                }}
            />

            {/* {description.length > 100 && (
                <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                    <Text style={styles.seeMore}>
                        {isExpanded ? 'See less' : 'See more'}
                    </Text>
                </TouchableOpacity>
            )} */}

            <View style={globalStyles.mb}></View>


            {/* <TouchableOpacity><Text>see more</Text></TouchableOpacity> */}

            <Text style={globalStyles.title}>Project Manager</Text>
            <View style={[globalStyles.box, globalStyles.container]}>
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
    description: {
        color: '#666',
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 20,
    },
    seeMore: {
        color: COLORS.info,
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