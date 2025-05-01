import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import InputBox from '../../components/InputBox';

export default function CreateEvent() {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreate = () => {
    console.log({
      eventName,
      description,
      date,
      location,
      image,
    });
  };

  return (
    <View>
      <View style={styles.header}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Create New Event</Text>
      </View>
      <ScrollView>
        <View style={{ padding: 20, paddingTop: 30 }}>

          {/* Event Name */}
          <InputBox
            placeholder="Event Name"
            value={eventName}
            onChangeText={setEventName}
            iconName="calendar"
          />

          {/* Description */}
          <InputBox
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            iconName="document-text"
            multiline={true}
            style={{ height: 100}}
          />

          {/* Date & Time */}
          <InputBox
            placeholder="Date & Time"
            value={date}
            onChangeText={setDate}
            iconName="time"
          />

          {/* Location */}
          <InputBox
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
            iconName="location"
          />

          {/* Price */}
          <InputBox
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            iconName="pricetags"
          />

          {/* Cover Image */}
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {image ? (
              <Image source={{ uri: image }} style={{ width: '100%', height: '100%', }} />
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                <Ionicons name="image" size={40} color={COLORS.primary} />
                <Text style={{color: COLORS.primary, marginTop: 10, fontSize: 16,}}>Upload Image</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Create Event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  imagePicker: {
    backgroundColor: '#fff',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
});
