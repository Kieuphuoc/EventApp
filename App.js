import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from './screens/Home/Home';
import EventDetail from './screens/EventDetail/EventDetail';
import Login from './screens/User/Login';
import Register from './screens/User/Register';
import { Ionicons } from "@expo/vector-icons";
import COLORS from "./constants/colors";
import MyTicket from './screens/MyTicket/MyTicket';
import CreateEvent from "./screens/CreateEvent/CreateEvent";
import FavouriteEvent from "./screens/FavouriteEvent/FavouriteEvent";
import Profile from "./screens/Profile/Profile";  

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="eventDetail" component={EventDetail} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{
      tabBarActiveTintColor: COLORS.primary,
      tabBarStyle: {
        borderTopWidth: 0,
        backgroundColor: COLORS.background,
        height: 60,
      },
      headerShown: false, 
    }}>
      <Tab.Screen name="index" options={{
        title: 'Home',
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={COLORS.primary} size={24} />
        ),
      }} component={StackNavigator} />
      <Tab.Screen name="myTicket"
        options={{
          title: 'My Ticket',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'ticket' : 'ticket-outline'} color={COLORS.primary} size={24} />
          ),
        }} component={MyTicket} />
      <Tab.Screen name="createEvent"
        options={{
          title: 'Create Event',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} color={COLORS.primary} size={24} />
          ),
        }} component={CreateEvent} />
      <Tab.Screen name="favouriteEvent"
        options={{
          title: 'Favourite',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} color={COLORS.primary} size={24} />
          ),
        }} component={FavouriteEvent} />
      <Tab.Screen name="profile"
        options={{
          title: 'My Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={COLORS.primary} size={24} />
          ),
        }} component={Profile} />
    </Tab.Navigator>
  );
}

  const App = () => {
    return (
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    );
  }

  export default App;