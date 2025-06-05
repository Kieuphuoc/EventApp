import React, { useContext, useState } from 'react';
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
import Apis, { authApis, endpoints } from '../../configs/Apis';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../constants/colors';
import { userStyles } from './UserStyles';
import * as ImagePicker from 'expo-image-picker';
import { HelperText } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyDispatchContext, MyUserContext } from '../../configs/Context';
import { Snackbar } from 'react-native-paper';


const info = [
  {
    label: 'First Name',
    field: 'first_name',
    icon: 'person',
  },
  {
    label: 'Last Name',
    field: 'last_name',
    icon: 'person-add',
  },
  {
    label: 'Username',
    field: 'username',
    icon: 'person-circle',
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
    icon: 'shield-checkmark',
  },
];


const Register = () => {
  const navigation = useNavigation();
  const userContext = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showChoice, setShowChoice] = useState(false);
  const [role, setRole] = useState('');
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);

  console.log(role);

  const showError = (message) => {
    setMsg(message);
    setVisible(true);
  };


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
        showError(`Please enter ${i.label}`);
        return false;
      }
    }

    if (user.password !== user.confirmPassword) {
      showError('Passwords do not match');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      showError('Invalid email format.');
      return false;
    }

    const usernameRegex = /^\S+$/;
    if (!usernameRegex.test(user.username)) {
      showError('Username must not contain whitespace.');
      return false;
    }

    if (!role) {
      showError('Please select a role.');
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
        if (key !== 'confirmPassword') {
          if (key === 'avatar') {
            form.append('avatar', {
              uri: user.avatar.uri,
              name: user.avatar.fileName || 'avatar.jpg',
              type: user.avatar.type || 'image/jpeg',
            });
          }
          else {
            form.append(key, user[key]);
          }
        }
      }
      form.append('role', role);

      let res = await Apis.post(endpoints['register'], form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 201) {
        const formData = new FormData();
        formData.append('username', user.username);
        formData.append('password', user.password);
        formData.append('grant_type', 'password');
        formData.append('client_id', 'AZzHCDaw5vMIWUW7f0vuqhVunNNvwe8HhPdpxxBE');
        formData.append('client_secret', 'pcWoNqX3tQnZsAzPr3ZF4Z1E3WIydx5v5WRwBzxQbQaIFHdMmL29Vkkjd7rg6u926EVPte8rMkHxIrlDmNyfXuS7E6Tb2XkAz6M2RF4yUUug3HXg8IgRfLYJ4Cw0v4yg');
        
        let loginRes = await Apis.post(endpoints['login'], formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Store token
        const token = loginRes.data.access_token;
        await AsyncStorage.setItem('token', token);

        // Fetch user data
        let userData = await authApis(token).get(endpoints['current-user']);
        dispatch({
          type: 'login',
          payload: userData.data,
        });

        setTimeout(() => {
          console.log('User context after dispatch:', userContext);
          console.log('Navigation status:', navigation.getState().routes);

          // Route base on role
          if (role === 'participant') {
            console.log('Navigate to catesSelection...');
            navigation.reset({
              index: 0,
              routes: [{ name: 'profile', params: { screen: 'catesSelection' } }],
            });
          } else {
            console.log('Navigate to index...');
            navigation.reset({
              index: 0,
              routes: [{ name: 'index' }],
            });
          }
        }, 100);
      }
    } catch (error) {
      console.error('Registration Error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
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

          {/* <HelperText type="error" visible={!!msg}>{msg}</HelperText> */}
          {/* <Snackbar
            visible={visible}
            onDismiss={() => setVisible(false)}
            action={{
              label: 'Close',
              onPress: () => setVisible(false),
            }}
            duration={5000}
          >
            {msg}
          </Snackbar> */}
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
                        : setShowConfirmPassword(!showConfirmPassword)}>
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

            <TouchableOpacity style={showChoice ? userStyles.comboBox : userStyles.hiddenBox} onPress={() => setShowChoice(!showChoice)}>
              <Ionicons
                name='chevron-down'
                size={20}
                color={COLORS.primary}
                style={userStyles.inputIcon}
              />
              <Text style={[userStyles.input, { color: role ? '#333' : '#999' }]}>
                {role ? role : "Choose role"}
              </Text>

            </TouchableOpacity>
            {showChoice && (
              <View style={userStyles.dropdown}>
                <TouchableOpacity style={userStyles.dropdownItem} onPress={() => setRole('organizer')}><Text>Organizer</Text></TouchableOpacity>
                <TouchableOpacity style={userStyles.dropdownItem} onPress={() => setRole('participant')}><Text>Participant</Text></TouchableOpacity>
              </View>

            )}


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
        <Snackbar
          visible={visible}
          onDismiss={() => setVisible(false)}
          action={{
            label: 'Close',
            onPress: () => setVisible(false),
          }}
          duration={5000}
        >
          {msg}
        </Snackbar>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;