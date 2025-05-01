import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";


const Header=() => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Image source={require("../assets/images/mini_logo.png")} style={{ width: 60, height: 60 }} />
            <TouchableOpacity
                // onPress={() => router.push('/notification')}
            >
                <Ionicons name="notifications" size={24} color={COLORS.primary} />
            </TouchableOpacity>
        </View>
    );
}
export default Header;
