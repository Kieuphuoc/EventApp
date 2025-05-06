import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../constants/colors';
import { userStyles } from './UserStyles';
import Apis, { endpoints } from '../../configs/Apis';
import { Alert } from 'react-native';

const Login = () => {
  const [username, setUsername] = useState(''); // Sử dụng username thay vì email
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      // Tạo FormData để gửi yêu cầu POST /token/
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('grant_type', 'password');
      formData.append('client_id', '9J87vnUbou0fZ16oWdhNtd0pLsq7OhEVEvketSdt9D');
      formData.append('client_secret', '9GPRZJTMK43XNAp5baSawsqEUt6rFEuA0VA...'); // Đảm bảo client_secret chính xác

      const response = await Apis.post(endpoints['token'], formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const { access_token: token } = response.data; // Giả định API trả về access_token

        // Lưu token vào AsyncStorage
        await AsyncStorage.setItem('authToken', token);

        // Cấu hình token cho các yêu cầu API tiếp theo
        Apis.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Gọi endpoint /user/me/ để lấy thông tin người dùng
        const userResponse = await Apis.get(endpoints['userMe']);
        if (userResponse.status === 200) {
          const userData = userResponse.data;
          Alert.alert(
            'Success',
            `Welcome back, ${userData.first_name || userData.username}!`,
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('Home'), // Điều hướng đến Home
              },
            ]
          );
        } else {
          throw new Error('Failed to fetch user data');
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_description ||
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={userStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={userStyles.keyboardView}
      >
        <ScrollView contentContainerStyle={userStyles.scrollContent}>
          <View style={userStyles.header}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={userStyles.logo}
              resizeMode="contain"
            />
            <Text style={userStyles.title}>Welcome Back</Text>
            <Text style={userStyles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={userStyles.form}>
            <View style={userStyles.inputContainer}>
              <Ionicons name="person" size={20} color={COLORS.primary} style={userStyles.inputIcon} />
              <TextInput
                style={userStyles.input}
                placeholder="Username"
                placeholderTextColor="#666"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={userStyles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color={COLORS.primary} style={userStyles.inputIcon} />
              <TextInput
                style={userStyles.input}
                placeholder="Password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={userStyles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={userStyles.forgotPassword}>
              <Text style={userStyles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[userStyles.loginButton, loading && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={userStyles.loginButtonText}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <View style={userStyles.divider}>
              <View style={userStyles.dividerLine} />
              <Text style={userStyles.dividerText}>OR</Text>
              <View style={userStyles.dividerLine} />
            </View>

            <View style={userStyles.socialButtons}>
              <TouchableOpacity style={userStyles.socialButton}>
                <Ionicons name="logo-google" size={24} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity style={userStyles.socialButton}>
                <Ionicons name="logo-facebook" size={24} color="#4267B2" />
              </TouchableOpacity>
              <TouchableOpacity style={userStyles.socialButton}>
                <Ionicons name="logo-apple" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={userStyles.signupContainer}>
              <Text style={userStyles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={userStyles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;