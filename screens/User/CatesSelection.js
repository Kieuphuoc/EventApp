import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Apis, { endpoints } from '../../configs/Apis';
import COLORS from '../../constants/colors';
import { userStyles } from './UserStyles';


const CatesSelection = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Lấy danh sách categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await Apis.get(endpoints['category']);
        setCategories(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        Alert.alert('Error', 'Failed to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Toggle chọn category
  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Submit preferences
  const submitPreferences = async () => {
    if (selectedCategories.length === 0) {
      Alert.alert('Info', 'Please select at least one category or skip.');
      return;
    }

    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Gửi từng category_id đến endpoint user-preferences
      for (const categoryId of selectedCategories) {
        const formData = new FormData();
        formData.append('category_id', categoryId);

        await Apis.post(
          endpoints['user-preferences'],
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      Alert.alert('Success', 'Preferences saved!', [
        { text: 'OK', onPress: () => navigation.navigate('index') },
      ]);
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'Failed to save preferences. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

 const skipPreferences = () => {
    if (user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'index' }],
      });
    } else {
      navigation.navigate('login');
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        userStyles.inputContainer,
        { paddingVertical: 15, marginBottom: 10 },
        selectedCategories.includes(item.id) && { backgroundColor: COLORS.primaryLight },
      ]}
      onPress={() => toggleCategory(item.id)}
    >
      <Text style={[userStyles.input, { color: selectedCategories.includes(item.id) ? '#fff' : '#333' }]}>
        {item.name}
      </Text>
      <Ionicons
        name={selectedCategories.includes(item.id) ? 'checkbox' : 'square-outline'}
        size={20}
        color={selectedCategories.includes(item.id) ? '#fff' : COLORS.primary}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={userStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
      <View style={userStyles.header}>
        <Text style={userStyles.title}>Personalize Your Feed</Text>
        <Text style={userStyles.subtitle}>
          What event category are you interested in? Let us know that we can personalize your newsfeed!
        </Text>
      </View>
      <View style={userStyles.form}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text>No categories available</Text>}
          />
        )}
        <TouchableOpacity
          style={[userStyles.loginButton, submitting && { opacity: 0.6 }]}
          onPress={submitPreferences}
          disabled={submitting || loading}
        >
          <Text style={userStyles.loginButtonText}>
            {submitting ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[userStyles.forgotPassword, { alignSelf: 'center', marginTop: 10 }]}
          onPress={skipPreferences}
          disabled={submitting || loading}
        >
          <Text style={userStyles.forgotPasswordText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CatesSelection;