import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";


const Header = ({ title, subtitle, navigation = false, onPress }) => {
    return (
        <View style={styles.header}>
            {navigation === true && <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={'white'} />
            </TouchableOpacity>}
            <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>{title}</Text>
                {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
            </View>
            <View style={styles.headerActions}>
                {onPress && <TouchableOpacity style={styles.searchButton} onPress={onPress}>
                    <Ionicons name="reload" size={24} color={COLORS.primary} />
                </TouchableOpacity>}

            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    headerSubtitle: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.8,
        marginTop: 4,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 15,
    },
    searchButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: COLORS.primary,
        padding: 20,
        paddingTop: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
        marginBottom: 15,
        gap: 12
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        letterSpacing: 0.5,
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
})
export default Header;
