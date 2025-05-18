import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Alert,
  Linking,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApis, endpoints } from '../../configs/Apis';
import { useState, useEffect, useCallback } from 'react';
import { Overlay } from './Overlay';
import { useFocusEffect } from '@react-navigation/native';

const TicketCheckIn = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false); // Stop continuos scan
  const [loading, setLoading] = useState(false); 
  const [isCameraActive, setIsCameraActive] = useState(false); // Manage CameraView

  // Reset status and check permission when focus
  useFocusEffect(
    useCallback(() => {
      setScanned(false);
      setLoading(false);
      setIsCameraActive(false); // Stop camera

      const checkAndRequestPermission = async () => {
        if (!permission) {
          setLoading(true);
          const result = await requestPermission();
          console.log('Permission result:', result);
          setLoading(false);
          if (result.granted) {
            setIsCameraActive(true); // Tunr on camera if granted
          }
        } else if (permission.granted) {
          setIsCameraActive(true); 
        }
      };

      checkAndRequestPermission();

      return () => {
        setIsCameraActive(false); // Turn camera of when out of sight
      };
    }, [permission, requestPermission])
  );

  const handleBarcodeScanned = async ({ data }) => {
    if (scanned) return; // Stop scan when scanned
    setScanned(true);
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Your sessions has time out. Please log in again');
        return;
      }

      // Call API
      const response = await authApis(token).post(endpoints['check_in'], {
        qr_code_data: data, 
      });

      
      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Check-in successfully!');
      }
    } catch (error) {
      console.error('Check-in Error:', error);
      if (error.response?.status === 403) {
        Alert.alert('Error', 'You do not have permission to check-in this ticket.');
      } else {
        Alert.alert('Lỗi', 'Check-in thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
      setTimeout(() => setScanned(false), 2000); // Cho phép quét lại sau 2 giây
    }
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.title}>Đang xử lý...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (permission?.granted && isCameraActive) {
    return (
      <SafeAreaView style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          enableTorch={false} // Tắt đèn flash để tiết kiệm tài nguyên
        />
        <Overlay />
      </SafeAreaView>
    );
  }

  if (permission?.status === 'denied') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.title}>Cần quyền truy cập Camera</Text>
          <Text style={styles.errorText}>
            Vui lòng cấp quyền camera trong cài đặt thiết bị để sử dụng tính năng quét QR.
          </Text>
          <Pressable onPress={openSettings}>
            <Text style={styles.buttonStyle}>Mở Cài đặt</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.permissionContainer}>
        <Text style={styles.title}>Đang kiểm tra quyền truy cập Camera...</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 40,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonStyle: {
    color: '#0E7AFE',
    fontSize: 20,
    textAlign: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#0E7AFE',
    borderRadius: 5,
  },
});

export default TicketCheckIn;