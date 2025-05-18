import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../constants/colors';
import Apis, { authApis, endpoints } from '../../configs/Apis';
import { MyUserContext } from '../../configs/Context';

const CatesSelection = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigation();
  const user = useContext(MyUserContext);

  // Fetch categories when component mounts
  useEffect(() => {
    // Prevent going back with hardware back button (Android)
    const backHandler = navigation.addListener('beforeRemove', (e) => {
      // Prevent default behavior of going back
      if (e.data.action.type === 'GO_BACK') {
        e.preventDefault();
      }
    });

    const fetchCategories = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.navigate('login');
          return;
        }

        const res = await Apis.get(endpoints['category']);
        if (res.data) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        Alert.alert('Error', 'Failed to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    
    // Cleanup the event listener
    return backHandler;
  }, []);

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prevSelected => {
      if (prevSelected.includes(categoryId)) {
        return prevSelected.filter(id => id !== categoryId);
      } else {
        return [...prevSelected, categoryId];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedCategories.length === 0) {
      Alert.alert('No Selection', 'Please select at least one category to continue.');
      return;
    }

    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('login');
        return;
      }

      // Send to API
      for (const categoryId of selectedCategories) {
        const response = await authApis(token).post(endpoints['user_preference'], {
          category_id: categoryId
        });

        if (response.status !== 200 && response.status !== 201) {
          throw new Error(`Can save category with ID: ${categoryId}`);
        }
      }

      console.log('All categories were saved!');
      // Route to home
      navigation.reset({
        index: 0,
        routes: [{ name: 'index' }],
      });
    } catch (error) {
      console.error('Error when saving user preference:', error);
      Alert.alert('Error', 'Can not save user preference.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    // Reset navigation to main tab navigator
    navigation.reset({
      index: 0,
      routes: [{ name: 'index' }],
    });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategories.includes(item.id) && styles.categoryItemSelected
      ]}
      onPress={() => toggleCategory(item.id)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.categoryText,
        selectedCategories.includes(item.id) && styles.categoryTextSelected
      ]}>
        {item.name}
      </Text>
      {selectedCategories.includes(item.id) && (
        <Ionicons name="checkmark-circle" size={20} color="white" style={styles.checkIcon} />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
      
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/mini_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Personalize Your Experience</Text>
        <Text style={styles.subtitle}>Select categories you're interested in</Text>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.categoriesList}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={handleSkip}
          disabled={submitting}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.nextButton, submitting && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.nextButtonText}>
              Next
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.primary,
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  categoriesList: {
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  categoryItem: {
    flex: 1,
    margin: 8,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryItemSelected: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: 'white',
  },
  checkIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  skipButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CatesSelection;