import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import globalStyles from '../constants/globalStyles';


const Header = () => {
    return (
        <View style={[globalStyles.mi, globalStyles.fr, globalStyles.mb]}>
            {/* <Image source={require("../assets/images/mini_logo.png")} style={{ width: 60, height: 60 }} /> */}
            <Text style={{fontSize: 20, color: '#333', fontWeight: 700, }}>EventUp</Text>
            <TouchableOpacity>
                <Ionicons name="notifications" size={25} color={COLORS.primary} />
            </TouchableOpacity>
        </View>
    );
}
export default Header;
