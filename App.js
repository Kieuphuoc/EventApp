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
import { MyDispatchContext, MyUserContext } from "./configs/Context";
import { useContext, useReducer } from "react";
import MyUserReducer from "./reducers/MyUserReducer";
import Booking from "./screens/Booking/Booking";
import PaymentSuccess from "./screens/PaymentSuccess";
// import PaymentConfirmation from "./screens/PaymentConfirmation";
import CheckIn from "./screens/CheckIn/CheckIn";
import Statistics from "./screens/Statistics/Statistics";
import MyEvent from "./screens/MyEvent/MyEvent";
import EditEvent from "./screens/CreateEvent/EditEvent";
const Stack = createNativeStackNavigator();

const StackNavigator = () => {  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="eventDetail" component={EventDetail} />
      <Stack.Screen name="booking" component={Booking} />
      {/* <Stack.Screen name="paymentConfirmation" component={PaymentConfirmation} /> */}
      <Stack.Screen name="paymentSuccess" component={PaymentSuccess} />
    </Stack.Navigator>
  );
}

// const StackNavigatorProfile = () => {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="profile" component={Profile} />
//       <Stack.Screen name="login" component={Login} />
//       <Stack.Screen name="register" component={Register} />
//     </Stack.Navigator>
//   )
// }

const StackMyEvent = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="myEvent" component={MyEvent} />
      <Stack.Screen name="createEvent" component={CreateEvent} />
      <Stack.Screen name="editEvent" component={EditEvent} />
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  const user = useContext(MyUserContext);

  return (
    <Tab.Navigator screenOptions={{
      tabBarActiveTintColor: COLORS.primary,
      tabBarStyle: {
        borderTopWidth: 0,
        // borderRadius: 30,
        backgroundColor: 'white',
        height: 80,
        borderTopWidth:1,
      },
      headerShown: false,
    }}>
      <Tab.Screen name="index" options={{
        title: 'Home',
        tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={COLORS.primary} size={24} />),
      }} component={StackNavigator} />
      {user === null ? <>
        <Tab.Screen name="login"
          options={{
            title: 'Login', tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'person' : 'person-outline'} color={COLORS.primary} size={24} />),
          }} component={Login} />
        <Tab.Screen name="register"
          options={{
            title: 'Register',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} color={COLORS.primary} size={24} />
            ),
          }} component={Register}
        />
        
         
      </> : <>
       <Tab.Screen name="checkIn"
          options={{
            title: 'Check In',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'checkbox' : 'checkbox-outline'} color={COLORS.primary} size={24} />
            ),
          }} component={CheckIn} />
          
           <Tab.Screen name="statistics"
          options={{
            title: 'Statistics',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} color={COLORS.primary} size={24} />
            ),
          }} component={Statistics} />
       <Tab.Screen name="stackMyEvent"
          options={{
            title: 'Create Event',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} color={COLORS.primary} size={24} />
            ),
          }} component={StackMyEvent} />
        <Tab.Screen name="myTicket"
          options={{
            title: 'My Ticket',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'ticket' : 'ticket-outline'} color={COLORS.primary} size={24} />
            ),
          }} component={MyTicket} />
       
        <Tab.Screen name="favouriteEvent"
          options={{
            title: 'Favourite Event',
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
      </>}


    </Tab.Navigator>
  );
}

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <MyUserContext.Provider value={user} >
      <MyDispatchContext.Provider value={dispatch}>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  );
}

export default App;