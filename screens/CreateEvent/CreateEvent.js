import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import COLORS from '../../constants/colors';

export default function CreateEvent({ navigation }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState({
    title: '',
    category: '',
    description: '',
    start_time: new Date(),
    end_time: new Date(),
    location: '',
    ticket_quantity: '',
    ticket_price: ''
  });
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const categories = [
    { id: 'music', name: 'Music' },
    { id: 'sports', name: 'Sports' },
    { id: 'arts', name: 'Arts & Theater' },
    { id: 'food', name: 'Food & Drink' },
    { id: 'business', name: 'Business' },
    { id: 'other', name: 'Other' }
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDate(false);
    if (selectedDate) {
      setEvent({ ...event, start_time: selectedDate });
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDate(false);
    if (selectedDate) {
      setEvent({ ...event, end_time: selectedDate });
    }
  };

  const formatDate = (date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
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
            <View style={styles.pickerWrapper} >
              <Ionicons name="list" size={24} color={COLORS.primary} style={styles.inputIcon} />
              
              {/* <Picker
                selectedValue={event.category}
                style={styles.picker}
                onValueChange={(value) => setEvent({ ...event, category: value })}
              >
                <Picker.Item label="Select a category" value="" />
                {categories.map((category) => (
                  <Picker.Item key={category.id} label={category.name} value={category.id} />
                ))}
              </Picker> */}

            </View>
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
                onPress={() => setShowStartDate(true)}
              >
                <Ionicons name="calendar" size={24} color={COLORS.primary} style={styles.inputIcon} />
                <Text style={styles.dateTimeText}>
                  Start: {formatDate(event.start_time)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowEndDate(true)}
              >
                <Ionicons name="time" size={24} color={COLORS.primary} style={styles.inputIcon} />
                <Text style={styles.dateTimeText}>
                  End: {formatDate(event.end_time)}
                </Text>
              </TouchableOpacity>
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

          {/* Image Upload Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cover Image</Text>
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
            onPress={() => { }}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? "Creating..." : "Create Event"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Pickers */}
      {showStartDate && (
        <DateTimePicker
          value={event.start_time}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={onStartDateChange}
        />
      )}
      {showEndDate && (
        <DateTimePicker
          value={event.end_time}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={onEndDateChange}
        />
      )}
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
  picker: {
    flex: 1,
    color: COLORS.primaryDark,
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
