import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  SafeAreaView, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../constants/colors';
import { userStyles } from './UserStyles';
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { Alert } from 'react-native';
import { MyDispatchContext } from '../../configs/Context';

const Login = () => {
  const [user, setUser] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useContext(MyDispatchContext);
  const navigation = useNavigation();
  const [msg, setMsg] = useState(null);
  const info = [{
    label: 'username',
    icon: "person",
    secureTextEntry: false,
    field: "username"
  }, {
    label: 'Mật khẩu',
    icon: "lock-closed",
    secureTextEntry: true,
    field: "password"
  }];

  const setState = (value, field) => {
    setUser({ ...user, [field]: value });
  }
  const validate = () => {
    if (!user?.username || !user?.password) {
      setMsg("Vui lòng nhập tên đăng nhập và mật khẩu!");
      return false;
    }

    setMsg(null);

    return true;
  }


  const login = async () => {
    console.log("Login pressed"); // ✅ Kiểm tra nút có hoạt động không
    if (validate() === true) {
      try {
        setLoading(true);

        const formData = new FormData();
        formData.append('username', user.username);
        formData.append('password', user.password);
        formData.append('grant_type', 'password');
        formData.append('client_id', "9J87vnUboufZI6oWdhNtd0pLSq7OhEEvketSdt9D");
        formData.append('client_secret', "9GPR7JTMlk43rXNAp5tbaSawqsEuT6rFEUaO4VAA0JJr3Qc5fSn6WLiZkwAxrmmvjJnIi3H3f4JkumSvjRDS0cyxcFyYJ0Ij5cbfxuDL7M81f8guKv1kWJkhLI7DQ26j");

        let res = await Apis.post(endpoints['login'], formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        await AsyncStorage.setItem('token', res.data.access_token);

        let u = await authApis(res.data.access_token).get(endpoints['current-user']);

        console.info(u.data);
        dispatch({
          "type": "login",
          "payload": u.data
        });
        navigation.navigate("index");

      } catch (ex) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
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
              source={require('../../assets/images/mini_logo.png')}
              style={userStyles.logo}
              resizeMode="contain"
            />
            <Text style={userStyles.title}>Welcome Back</Text>
            <Text style={userStyles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={userStyles.form}>
            {info.map((i, index) => 
            <View key={index} style={userStyles.inputContainer}> 
              <Ionicons name={i.icon} size={20} color={COLORS.primary} style={userStyles.inputIcon} />
              <TextInput
              value={user[i.field]}
              onChangeText={t => setState(t, i.field)}
              key={i.field} label={i.label}
              secureTextEntry={i.field.includes("password") ? !showPassword : i.secureTextEntry}
              autoCapitalize="none"
              style={userStyles.input} />
              {i.field.includes('password') && <TouchableOpacity
                style={userStyles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>}
            </View>
            )}

            <TouchableOpacity style={userStyles.forgotPassword}>
              <Text style={userStyles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[userStyles.loginButton, loading && { opacity: 0.6 }]}
              disabled={loading}
              loading={loading}
              onPress={login}
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
              <TouchableOpacity onPress={() => navigation.navigate('register')}>
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