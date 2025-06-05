import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, off } from 'firebase/database';
import { MyUserContext } from '../configs/Context';
import { useContext } from 'react';
// import Animated from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZhHoO-BTjnrKRKGDfV_eoc5dLd_Ro2H8",
  authDomain: "eventapp-ec219.firebaseapp.com",
  projectId: "eventapp-ec219",
  storageBucket: "eventapp-ec219.firebasestorage.app",
  messagingSenderId: "420300732473",
  appId: "1:420300732473:web:72ce68d33186177df275e8",
  measurementId: "G-5GTWBT3ZJP",
  databaseURL: "https://eventapp-ec219-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const ChatModal = ({ visible, onClose, manager }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  //   const [fadeAnim] = useState(new Animated.Value(0));
  //   const [slideAnim] = useState(new Animated.Value(height));
  const flatListRef = useRef(null);
  const user = useContext(MyUserContext);
  console.log(messages);

  useEffect(() => {
    if (visible) {
      const chatRef = ref(database, `chats/${manager.id}_${user?._j?.id}`);
      console.log('Chat reference:', chatRef.toString());
      console.log('User data:', user);
      console.log("UserID:", user?._j.id);
      console.log("ManagerID:", manager?.id);
      console.log("Sender Name:", `${user?._j.first_name} ${user?._j.last_name}`);

      onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        if (snapshot.val()) { console.log("Co du lieu!"); }


        if (data) {
          const messageList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setMessages(messageList.sort((a, b) => a.timestamp - b.timestamp));
          // setMessages(sortedList);
          console.log('Loaded messages:', messageList.sort((a, b) => a.timestamp - b.timestamp)); //
        }
      });

      return () => {
        // Cleanup subscription
        off(chatRef);
      };
    }
  }, [visible, manager.id, user?.id]);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    try {
      const chatRef = ref(database, `chats/${manager?.id}_${user?._j.id}`);
      console.log('Sending message to:', chatRef.toString());
      console.log('Message data:', {
        text: message,
        senderId: user?._j?.id,
        senderName: `${user?._j.first_name} ${user?._j.last_name}`,
        timestamp: Date.now()
      });

      await push(chatRef, {
        text: message,
        senderId: user?._j?.id,
        senderName: `${user?._j.first_name} ${user?._j.last_name}`,
        timestamp: Date.now()
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const renderMessage = ({ item }) => {
    console.log("Done");
    const isOwnMessage = item.senderId === user._j.id;
    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        {!isOwnMessage && (
          <Text style={styles.senderName}>{item.senderName}</Text>
        )}
        <View style={[
          styles.messageBubble,
          isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble
        ]}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.backdrop}>
          <TouchableOpacity style={styles.backdropTouchable} activeOpacity={1} onPress={onClose} />
        </View>

        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Chat with {manager.name}</Text>
              <Text style={styles.subtitle}>{manager.role}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close-circle" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            style={styles.messageList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            onLayout={() => flatListRef.current?.scrollToEnd()}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor={COLORS.grey}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!message.trim()}
            >
              <Ionicons name="send" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80%',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.grey,
  },
  closeButton: {
    padding: 5,
  },
  messageList: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    marginBottom: 10,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: COLORS.grey,
    marginBottom: 4,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '100%',
  },
  ownMessageBubble: {
    backgroundColor: COLORS.primary,
  },
  otherMessageBubble: {
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 16,
    color: COLORS.white,
  },
  timestamp: {
    fontSize: 10,
    color: COLORS.grey,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatModal; 