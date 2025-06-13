import React, { useEffect, useState } from 'react';
import { collection, getDocs, getDoc, deleteDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Alert, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomeScreen = () => {
  const [favorites, setFavorites] = useState([]);

  const loadFavor = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const favorRef = collection(db, 'users', user.uid, 'favorites');
      const favorSnapshot = await getDocs(favorRef);
      const favorList = favorSnapshot.docs.map(doc => doc.id);
      setFavorites(favorList);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const favor = async (id) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'Please login to add favorites');
        return;
      }

      const favorRef = doc(db, 'users', user.uid, 'favorites', id);
      const favorDoc = await getDoc(favorRef);

      if (favorDoc.exists()) {
        await deleteDoc(favorRef);
        setFavorites(prev => prev.filter(item => item !== id));
      } else {
        await setDoc(favorRef, { timestamp: serverTimestamp() });
        setFavorites(prev => [...prev, id]);
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      Alert.alert('Error', 'Failed to update favorite');
    }
  };

  useEffect(() => {
    loadFavor();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      {/* Add your event list and other UI components here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default HomeScreen; 