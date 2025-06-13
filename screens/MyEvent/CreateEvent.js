import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../constants/colors';
import { Chip } from 'react-native-paper';
import Apis, { authApis, endpoints } from '../../configs/Apis';

export default function CreateEvent({ navigation }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState({
    title: '',
    category_id: '',
    description: '',
    start_time: new Date(),
    end_time: new Date(),
    location: '',
    ticket_quantity: '',
    ticket_price: '',
  });
  const [cates, setCates] = useState([]);
  const [showCates, setShowCates] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Tải danh mục
  const loadCates = async () => {
    try {
      let res = await Apis.get(endpoints['category']);
      setCates(res.data);
    } catch (error) {
      console.error('Error loading categories:', error);
      Alert.alert('Error', 'Failed to load categories.');
    }
  };

  // Chọn ảnh
  const pickImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissions denied!', 'Please allow access to the photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // Xử lý chọn ngày giờ
  const onStartTimeChange = (_, selectedDate) => {
    setShowStartPicker(Platform.OS === 'ios'); // Giữ hiển thị trên iOS
    if (selectedDate && selectedDate instanceof Date && !isNaN(selectedDate)) {
      setEvent((prev) => ({ ...prev, start_time: selectedDate }));
    }
  };

  const onEndTimeChange = (_, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios'); // Giữ hiển thị trên iOS
    if (selectedDate && selectedDate instanceof Date && !isNaN(selectedDate)) {
      setEvent((prev) => ({ ...prev, end_time: selectedDate }));
    }
  };

  // Hàm định dạng ngày giờ
  const formatDateTime = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      return 'Select date and time';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const validate = (eventData) => {
    // Kiểm tra các trường bắt buộc
    if (!eventData.title.trim()) {
      throw new Error('Event title is required.');
    }
    if (!eventData.category_id) {
      throw new Error('Please select a category.');
    }
    if (!eventData.ticket_quantity.trim()) {
      throw new Error('Ticket quantity is required.');
    }
    if (!eventData.ticket_price.trim()) {
      throw new Error('Ticket price is required.');
    }

    // Kiểm tra ticket_quantity và ticket_price
    const quantity = parseInt(eventData.ticket_quantity);
    const price = parseFloat(eventData.ticket_price);
    if (isNaN(quantity) || quantity <= 0) {
      throw new Error('Ticket quantity must be a positive number.');
    }
    if (isNaN(price) || price <= 0) {
      throw new Error('Ticket price must be a positive number.');
    }

    // Kiểm tra start_time và end_time
    if (!(eventData.start_time instanceof Date) || isNaN(eventData.start_time)) {
      throw new Error('Invalid start time.');
    }
    if (!(eventData.end_time instanceof Date) || isNaN(eventData.end_time)) {
      throw new Error('Invalid end time.');
    }
    if (eventData.start_time > eventData.end_time) {
      throw new Error('End time must be after start time.');
    }
  };

  const create = async () => {
  Alert.alert(
    'Confirm',
    'Are you sure you want to create this event?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Create',
        onPress: async () => {
          try {
            setLoading(true);
            validate(event);
            const token = await AsyncStorage.getItem('token');
            if (!token) {
              throw new Error('No token found');
            }

            let form = new FormData();
            form.append('title', event.title);
            form.append('category_id', event.category_id);
            form.append('description', event.description || '');
            form.append('start_time', event.start_time.toISOString());
            form.append('end_time', event.end_time.toISOString());
            form.append('location', event.location || '');
            form.append('ticket_quantity', event.ticket_quantity);
            form.append('ticket_price', event.ticket_price);

            if (image) {
              const filename = image.split('/').pop();
              const match = /\.(\w+)$/.exec(filename);
              const type = match ? `image/${match[1]}` : `image`;
              form.append('image', {
                uri: image,
                name: filename,
                type,
              });
            }

            let res = await authApis(token).post(endpoints['event'], form, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            if (res.status === 201) {
              Alert.alert('Success', 'Event created successfully!');
              setEvent({
                title: '',
                category_id: '',
                description: '',
                start_time: new Date(),
                end_time: new Date(),
                location: '',
                ticket_quantity: '',
                ticket_price: '',
              });
              setImage(null);
              navigation.goBack();
            }
          } catch (error) {
            console.error('Create Event Error:', {
              message: error.message,
              response: error.response,
              status: error.response?.status,
              data: error.response?.data,
            });
            if (error.response?.status === 401) {
              Alert.alert('Session Expired', 'Please log in again.', [
                { text: 'OK', onPress: () => navigation.navigate('Login') },
              ]);
            } else {
              Alert.alert('Error', error.message || 'Failed to create event.');
            }
          } finally {
            setLoading(false);
          }
        },
      },
    ]
  );
};

  useEffect(() => {
    loadCates();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Event</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Title</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="create" size={24} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter event title"
                placeholderTextColor={COLORS.primaryDark + '60'}
                value={event.title}
                onChangeText={(text) => setEvent({ ...event, title: text })}
              />
            </View>
          </View>

          {/* Category Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <TouchableOpacity
              style={styles.pickerWrapper}
              onPress={() => setShowCates(!showCates)}
            >
              <Ionicons name="list" size={24} color={COLORS.primary} style={styles.inputIcon} />
              <Text style={styles.dateTimeText}>
                {cates.find((c) => c.id === event.category_id)?.name || 'Select category'}
              </Text>
            </TouchableOpacity>
            {showCates && (
              <View style={styles.chipContainer}>
                {cates.map((item) => (
                  <Chip
                    key={item.id}
                    style={styles.chip}
                    onPress={() => {
                      setEvent({ ...event, category_id: item.id });
                      setShowCates(false);
                    }}
                  >
                    {item.name}
                  </Chip>
                ))}
              </View>
            )}
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="document-text" size={24} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter event description"
                placeholderTextColor={COLORS.primaryDark + '60'}
                value={event.description}
                onChangeText={(text) => setEvent({ ...event, description: text })}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Date & Time Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date & Time</Text>
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowStartPicker(true)}
              >
                <Ionicons name="calendar" size={24} color={COLORS.primary} style={styles.inputIcon} />
                <Text style={styles.dateTimeText}>
                  {formatDateTime(event.start_time)}
                </Text>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={event.start_time || new Date()}
                  mode="datetime"
                  display="default"
                  onChange={onStartTimeChange}
                  accentColor={COLORS.primary}
                />
              )}

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowEndPicker(true)}
              >
                <Ionicons name="time" size={24} color={COLORS.primary} style={styles.inputIcon} />
                <Text style={styles.dateTimeText}>
                  {formatDateTime(event.end_time)}
                </Text>
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={event.end_time || new Date()}
                  mode="datetime"
                  display="default"
                  onChange={onEndTimeChange}
                  accentColor={COLORS.primary}
                />
              )}
            </View>
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location" size={24} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter event location"
                placeholderTextColor={COLORS.primaryDark + '60'}
                value={event.location}
                onChangeText={(text) => setEvent({ ...event, location: text })}
              />
            </View>
          </View>

          {/* Ticket Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ticket Information</Text>
            <View style={styles.ticketContainer}>
              <View style={styles.inputWrapper}>
                <Ionicons name="ticket" size={24} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Number of tickets"
                  placeholderTextColor={COLORS.primaryDark + '60'}
                  value={event.ticket_quantity}
                  onChangeText={(text) => setEvent({ ...event, ticket_quantity: text })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Ionicons name="pricetags" size={24} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Price per ticket"
                  placeholderTextColor={COLORS.primaryDark + '60'}
                  value={event.ticket_price}
                  onChangeText={(text) => setEvent({ ...event, ticket_price: text })}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Image Upload */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Photos</Text>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={40} color={COLORS.primary} />
                  <Text style={styles.uploadText}>Tap to upload cover image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Create Button */}
          <TouchableOpacity
            style={[styles.createButton, loading && styles.createButtonDisabled]}
            onPress={create}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? 'Creating...' : 'Create Event'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  backButton: {
    marginRight: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    color: COLORS.primaryDark,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
    borderRadius: 12,
    padding: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  chip: {
    backgroundColor: COLORS.accentLight,
  },
  dateTimeContainer: {
    gap: 10,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
    borderRadius: 12,
    padding: 12,
  },
  dateTimeText: {
    flex: 1,
    color: COLORS.primaryDark,
    fontSize: 16,
  },
  ticketContainer: {
    gap: 10,
  },
  imagePicker: {
    backgroundColor: COLORS.accentLight,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
  },
  uploadText: {
    color: COLORS.primaryDark + '60',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: COLORS.secondaryDark,
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.secondaryDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});