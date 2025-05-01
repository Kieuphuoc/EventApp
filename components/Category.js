import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import COLORS from '../constants/colors';

const Category = ({ type, iconName }) => {

    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <View style={styles.icon}><Ionicons name={iconName} size={35} color={COLORS.primary} /></View>               
                <Text style={{ fontSize: 14, fontWeight: 500, marginTop: 5, color: 'gray', alignSelf:'center' }}>{type}</Text>
            </TouchableOpacity>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    icon: {
        backgroundColor: COLORS.accentLight,
        shadowOffset: { width: 2, height: 4 },
        borderRadius: '50%',
        padding: 15,
        justify: 'center',
        alignItems: 'center',

    }
})

export default Category;
