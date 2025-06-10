import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import COLORS from '../constants/colors';

const Category = ({ type, iconName, onPress }) => {

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPress}>
                <View style={styles.icon}><Ionicons name={iconName} size={33} color={COLORS.primary} /></View>
                <Text style={{ fontSize: 14, fontWeight: 500, marginTop: 5, color: '#666', alignSelf: 'center' }}>{type}</Text>
            </TouchableOpacity>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: 7,
    },
    icon: {
        width: 60,
        height: 60,
        backgroundColor: COLORS.accentLight,
        borderRadius: 30, 
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary, 
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },

})

export default Category;
