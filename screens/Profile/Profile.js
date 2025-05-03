import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { useNavigation } from "@react-navigation/native";

const menuItems = [
  { icon: 'person', label: 'Edit Profile', screen: 'editProfile' },
  { icon: 'ticket', label: 'My Tickets', screen: 'myTickets' },
  { icon: 'heart', label: 'Favorites', screen: 'favouriteEvents' },
  { icon: 'notifications', label: 'Notifications', screen: 'notifications' },
  { icon: 'settings', label: 'Settings', screen: 'settings' },
  { icon: 'help-circle', label: 'Help & Support', screen: 'help' },
  { icon: 'information-circle', label: 'About', screen: 'about' },
];

const Profile= ()=> {
  const navigation = useNavigation();
 
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Here you would typically clear user data, tokens, etc.
            router.replace('/login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: 'https://m.media-amazon.com/images/S/pv-target-images/16627900db04b76fae3b64266ca161511422059cd24062fb5d900971003a0b70.jpg' }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>Kieu Phuoc</Text>
              <Text style={styles.email}>phuoc@example.com</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statItem} onPress={()=> navigation.navigate('register')}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Events</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Tickets</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item.screen)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={24} color={COLORS.primary} />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  menuContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 10,
    fontWeight: '600',
  },
});

export default Profile;