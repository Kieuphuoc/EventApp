import React, { use, useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import InputBox from '../../components/InputBox';

export default function CreateEvent() {
  const [image, setImage] = useState(null);
  const [loading, setLoading]= useState(false);
  const validate = () =>{
    if(Object.keys(event).length=== 0) {
      setMsg('Please fill in all fields!');
      return false;
    }
  }

  // const create = async ()=>{
  //   if(!validate()) return;
  //   setLoading(true);
  //   try {
  //     let form = new FormData();
  //     for(let field in event) {
  //       if(field == 'image') {
  //         form.append('image',{
  //           uri: event.image.uri,
  //           name: event.image.name,

  //         })
  //       }
  //     }
  //   }
  // }

  const [event, setEvent] = useState({});

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // const handleCreate = () => {
  //   console.log({
  //     eventName,
  //     description,
  //     date,
  //     location,
  //     image,
  //   });
  // };
  const info = [
    {
      label: "Event Name",
      field: "title",
      icon: "calendar",
    },
    {
      label: "Description",
      field: "description",
      icon: "document-text",
    },
    {
      label: "Start Time",
      field: "start_time",
      icon: "time",
    },{
      label: "End Time",
      field: "end_time",
      icon: "time",
    }, 
    {
      label: "Location",
      field: "location",
      icon: "location",
    },
    {
      label: "Ticket Quantity",
      field: "ticket_quantity",
      icon: "location",
    },
    {
      label: "Price",
      field: "ticket_price",
      icon: "pricetags",
    },
  ];
  

  return (
    <View>
      <View style={styles.header}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Create New Event</Text>
      </View>
      <ScrollView>
        <View style={{ padding: 20, paddingTop: 30 }}>

          {info.map((i, index) => {
            <View key={index} style={styles.inputContainer}>
              <Ionicons name={i.icon} size={20} color={COLORS.primary} style={[styles.inputIcon]} />
              <TextInput
                style={[styles.input]}
                placeholder={i.label}
                placeholderTextColor="#666"
                value={event[i,field]}
                onChangeText={onChangeText}
                multiline={i.label.includes('description') ? true : false }
                />
            </View>
          })}

          {/* Cover Image */}
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {image ? (
              <Image source={{ uri: image }} style={{ width: '100%', height: '100%', }} />
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                <Ionicons name="image" size={40} color={COLORS.primary} />
                <Text style={{ color: COLORS.primary, marginTop: 10, fontSize: 16, }}>Upload Image</Text>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 16,
  },
});
