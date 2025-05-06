import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Apis, { endpoints } from '../../configs/Apis';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../constants/colors';
import { userStyles } from './UserStyles';
import * as ImagePicker from 'expo-image-picker';
import { HelperText } from 'react-native-paper';

const info = [
  {
    label: 'First Name',
    field: 'first_name',
    icon: 'person',
  },
  {
    label: 'Last Name',
    field: 'last_name',
    icon: 'person',
  },
  {
    label: 'Username',
    field: 'username',
    icon: 'at-outline',
  },
  {
    label: 'Email',
    field: 'email',
    icon: 'mail',
  },
  {
    label: 'Password',
    field: 'password',
    icon: 'lock-closed',
  },
  {
    label: 'Confirm Password',
    field: 'confirmPassword',
    icon: 'lock-closed',
  },
];

const Register = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [msg, setMsg] = useState('');

  const setState = (value, field) => {
    setUser({ ...user, [field]: value });
  };

  const pickImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissions denied!', 'Please allow access to the photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setState(result.assets[0], 'avatar');
    }
  };

  const validate = () => {
    if (Object.keys(user).length === 0) {
      setMsg('Please fill in all fields!');
      return false;
    }

    for (let i of info) {
      if (!user[i.field]) {
        setMsg(`Please enter ${i.label}`);
        return false;
      }
    }

    if (user.password !== user.confirmPassword) {
      setMsg('Passwords do not match');
      return false;
    }

    return true;
  };

  const register = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      let form = new FormData();
      for (let key in user) {
        if (key !== 'confirmPassword') { // Loại bỏ trường "Ktra mật khẩu", không lưu nó vào backend
          if (key === 'avatar') { // Xử lí đặc biệt cho trường avt
            form.append('avatar', { //form.append(key, value) => Thêm một cặp khóa giá trị vào form
              uri: user.avatar.uri,
              name: user.avatar.fileName || 'avatar.jpg',
              type: user.avatar.type || 'image/jpeg',
            });
          } else {
            form.append(key, user[key]);
          }
        }
      }

      let res = await Apis.post(endpoints['register'], form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 201) {
        Alert.alert('Success', 'Registration successful! Please login.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
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
          {/* Header & Logo */}
          <View style={userStyles.header}>
            <Image
              source={require('../../assets/images/mini_logo.png')}
              style={userStyles.logo}
              resizeMode="contain"
            />
            <Text style={userStyles.title}>Create Account</Text>
            <Text style={userStyles.subtitle}>Let’s join with us!</Text>
          </View>

          <HelperText type="error" visible={!!msg}>
            {msg}
          </HelperText>
          <View style={userStyles.form}>
            {info.map((i, index) => (
              <View key={index} style={userStyles.inputContainer}>
                <Ionicons
                  name={i.icon}
                  size={20}
                  color={COLORS.primary}
                  style={userStyles.inputIcon}
                />
                <TextInput
                  style={userStyles.input}
                  placeholder={i.label}
                  secureTextEntry={
                    i.field === 'password'
                      ? !showPassword // Tại vì secureTextEntry = True ngược lại với ShowPassword, lúc này ShowPassword = false
                      : i.field === 'confirmPassword'
                        ? !showConfirmPassword
                        : false
                  }
                  placeholderTextColor="#999"
                  value={user[i.field] || ''}
                  onChangeText={(t) => setState(t, i.field)}
                  autoCapitalize="none"
                />
                {i.label.includes('Password') && (
                  <TouchableOpacity
                    style={userStyles.eyeIcon}
                    onPress={() =>
                      i.field === 'password'
                        ? setShowPassword(!showPassword)
                        : setShowConfirmPassword(!showConfirmPassword) }>
                    <Ionicons
                      name={
                        i.field === 'password'
                          ? showPassword
                            ? 'eye'
                            : 'eye-off'
                          : showConfirmPassword
                          ? 'eye'
                          : 'eye-off'
                      }
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <TouchableOpacity onPress={pickImage} style={userStyles.imagePicker}>
              {user.avatar ? (
                <Image
                  source={{ uri: user.avatar.uri }}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <View
                  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                >
                  <Ionicons name="image" size={40} color={COLORS.primary} />
                  <Text
                    style={{
                      color: COLORS.primary,
                      marginTop: 10,
                      fontSize: 16,
                    }}
                  >
                    Upload Image
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[userStyles.loginButton, loading && { opacity: 0.6 }]}
              onPress={register}
              disabled={loading}
            >
              <Text style={userStyles.loginButtonText}>
                {loading ? 'Registering...' : 'Sign Up'}
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
              <Text style={userStyles.signupText}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('login')}>
                <Text style={userStyles.signupLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;