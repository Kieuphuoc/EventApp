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

const info = [
  {
    label: 'Tên',
    field: 'first_name',
    secureTextEntry: false,
    icon: 'person-outline',
  },
  {
    label: 'Họ và tên lót',
    field: 'last_name',
    secureTextEntry: false,
    icon: 'person-outline',
  },
  {
    label: 'Tên đăng nhập',
    field: 'username',
    secureTextEntry: false,
    icon: 'at-outline',
  },
  {
    label: 'Email',
    field: 'email',
    secureTextEntry: false,
    icon: 'mail-outline',
  },
  {
    label: 'Mật khẩu',
    field: 'password',
    secureTextEntry: true,
    icon: 'lock-closed-outline',
  },
  {
    label: 'Nhập lại mật khẩu',
    field: 'confirmPassword',
    secureTextEntry: true,
    icon: 'lock-closed-outline',
  },
];

const Register = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    first_name: '',
    last_name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async () => {
    if (!formData.username || !formData.password || !formData.email) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return;
    }
    try {
      setLoading(true);
      const response = await Apis.post(endpoints['register'], {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });
      if (response.status === 201) {
        Alert.alert(
          'Thành công',
          'Đăng ký thành công! Vui lòng đăng nhập.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Lỗi',
        error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            {/* Nếu có logo thì bỏ vào đây */}
            {/* <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" /> */}
            <Text style={styles.title}>Tạo tài khoản mới</Text>
            <Text style={styles.subtitle}>Đăng ký để tham gia sự kiện</Text>
          </View>
          <View style={styles.form}>
            {info.map((item, idx) => (
              <View style={styles.inputContainer} key={item.field}>
                <Ionicons name={item.icon} size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={item.label}
                  placeholderTextColor="#666"
                  value={formData[item.field]}
                  onChangeText={(text) => handleChange(item.field, text)}
                  secureTextEntry={
                    item.field === 'password'
                      ? !showPassword
                      : item.field === 'confirmPassword'
                      ? !showConfirmPassword
                      : false
                  }
                  keyboardType={item.field === 'email' ? 'email-address' : 'default'}
                  autoCapitalize={item.field === 'email' ? 'none' : 'sentences'}
                />
                {(item.field === 'password' || item.field === 'confirmPassword') && (
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() =>
                      item.field === 'password'
                        ? setShowPassword((prev) => !prev)
                        : setShowConfirmPassword((prev) => !prev)
                    }
                  >
                    <Ionicons
                      name={
                        (item.field === 'password' ? showPassword : showConfirmPassword)
                          ? 'eye-off'
                          : 'eye'
                      }
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity
              style={[styles.loginButton, loading && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>{loading ? 'Đang đăng ký...' : 'Đăng ký'}</Text>
            </TouchableOpacity>
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signupLink}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    color: '#333',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Register; 