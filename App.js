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
import EditProfile from "./screens/Profile/EditProfile";
import { MyDispatchContext, MyUserContext } from "./configs/Context";
import { useContext, useEffect, useReducer } from "react";
import MyUserReducer from "./reducers/MyUserReducer";
import Booking from "./screens/Booking/Booking";
import PaymentSuccess from "./screens/PaymentSuccess";
import SearchingScreen from "./screens/SearchingScreen";

import Statistics from "./screens/Statistics/Statistics";
import MyEvent from "./screens/MyEvent/MyEvent";
import EditEvent from "./screens/CreateEvent/EditEvent";
import CatesSelection from "./screens/User/CatesSelection";
import TicketCheckIn from "./screens/CheckIn/TicketCheckIn";
import UpcommingEvent from "./screens/UpcomingEvent";
import MyInvoice from "./screens/MyInvoice";

import { NotificationProvider, useNotification } from "./context/NotificationContext";
import * as Notifications from "expo-notifications";
import CategoryFilter from "./screens/CategoryFilter";
import { useFonts } from "expo-font";
import MyReceipt from "./screens/MyReceipt";

import firebase from '@react-native-firebase/app';
import { firebaseConfig } from './configs/firebaseConfig';
import { GoogleSignin } from "@react-native-google-signin/google-signin"

// Notification config
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
})

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="eventDetail" component={EventDetail} />
      <Stack.Screen name="upcomingEvent" component={UpcommingEvent} />
      <Stack.Screen name="booking" component={Booking} />
      <Stack.Screen name="searchingScreen" component={SearchingScreen} />
      <Stack.Screen name="paymentSuccess" component={PaymentSuccess} />
      <Stack.Screen name="categoryFilter" component={CategoryFilter} />
    </Stack.Navigator>
  );
}

const StackProfile = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="userProfile" component={Profile} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="register" component={Register} />
      <Stack.Screen name="catesSelection" component={CatesSelection} />
      <Stack.Screen name="editProfile" component={EditProfile} />
    </Stack.Navigator>
  )
}

const StackMyEvent = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="myEvent" component={MyEvent} />
      <Stack.Screen name="createEvent" component={CreateEvent} />
      <Stack.Screen name="editEvent" component={EditEvent} />
    </Stack.Navigator>
  )
}

const StackMyTicket = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="myTicket" component={MyTicket} />
      <Stack.Screen name="myInvoice" component={MyInvoice} />
    </Stack.Navigator>
  )
}

const StackFavourite = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="favoriteEvent" component={FavouriteEvent} />
      <Stack.Screen name="eventDetail" component={EventDetail} />
    </Stack.Navigator>
  )
}

const StackMyReceipt = ( ) =>{
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="myReceipt" component={MyReceipt} />
      <Stack.Screen name="myInvoice" component={MyInvoice} />
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  const user = useContext(MyUserContext);
  // const dispatch = useContext(MyDispatchContext);
  // console.log(user);
  console.log(user);


  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarStyle: {
          borderTopWidth: 1,
          backgroundColor: 'white',
          height: 80,
        },
        headerShown: false,
      }}
    >
      {/* Home tab - visible to all users */}
      <Tab.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={COLORS.primary} size={24} />
          ),
        }}
        component={StackNavigator}
      />

      {(user === null || user?._j === null) ? (
        <>
          <Tab.Screen
            name="login"
            options={{
              title: 'Login',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'person' : 'person-outline'} color={COLORS.primary} size={24} />
              ),
            }}
            component={Login}
          />
          <Tab.Screen
            name="register"
            options={{
              title: 'Register',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'person' : 'person-outline'} color={COLORS.primary} size={24} />
              ),
            }}
            component={Register}
          />
        </>
      ) : (
        <>
          {/* Organizer only */}
          {user?._j?.role === 'organizer' && (
            <>
              <Tab.Screen
                name="stackMyEvent"
                options={{
                  title: 'My Events',
                  tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'calendar' : 'calendar-outline'} color={COLORS.primary} size={24} />
                  ),
                }}
                component={StackMyEvent}
              />
              <Tab.Screen
                name="statistics"
                options={{
                  title: 'Statistics',
                  tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} color={COLORS.primary} size={24} />
                  ),
                }}
                component={Statistics}
              />
              <Tab.Screen
                name="ticketCheckIn"
                options={{
                  title: 'Check In',
                  tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'qr-code' : 'qr-code-outline'} color={COLORS.primary} size={24} />
                  ),
                }}
                component={TicketCheckIn}
              />
              <Tab.Screen
                name="profile"
                options={{
                  title: 'Profile',
                  tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'person' : 'person-outline'} color={COLORS.primary} size={24} />
                  ),
                }}
                component={StackProfile}
              />
            </>

          )}

          {/* Participant only */}
          {user?._j?.role === 'participant' && (
            <>
              <Tab.Screen
                name="favouriteEvent"
                options={{
                  title: 'Favourites',
                  tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'heart' : 'heart-outline'} color={COLORS.primary} size={24} />
                  ),
                }}
                component={StackFavourite}
              />
              <Tab.Screen
                name="myTicket"
                options={{
                  title: 'My Tickets',
                  tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'ticket' : 'ticket-outline'} color={COLORS.primary} size={24} />
                  ),
                }}
                component={StackMyTicket}
              />
              <Tab.Screen
                name="myReceipt"
                options={{
                  title: 'My Invoice',
                  tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'receipt' : 'receipt-outline'} color={COLORS.primary} size={24} />
                  ),
                }}
                component={StackMyReceipt}
              />
              <Tab.Screen
                name="profile"
                options={{
                  title: 'Profile',
                  tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'person' : 'person-outline'} color={COLORS.primary} size={24} />
                  ),
                }}
                component={StackProfile}
              />

            </>

          )}

        </>

      )}
    </Tab.Navigator>
  );
};

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  // Initializer firebase
  if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

  useEffect(() => {
    GoogleSignin.configure({  
      webClientId: "951760374677-29quu8dvcdaeqjr33jq8e2bgspncjd2r.apps.googleusercontent.com",
      profileImageSize: 150
    });
  });


  const [fontsLoaded] = useFonts({
    'GreatVibes': require('./assets/fonts/GreatVibes-Regular.ttf'),
  });

  // if (!fontsLoaded) return <AppLoading />;

  return (
    <NotificationProvider>
      <MyUserContext.Provider value={user} >
        <MyDispatchContext.Provider value={dispatch}>
          <NavigationContainer>
            <TabNavigator />
          </NavigationContainer>
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </NotificationProvider>

  );
}

export default App;