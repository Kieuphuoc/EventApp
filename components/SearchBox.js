import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Keyboard,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import globalStyles from '../constants/globalStyles';
import { useNavigation } from '@react-navigation/native';
import Apis, { endpoints } from '../configs/Apis';
const SearchBox = ({ navigation, onSearch, suggestions = [], onFocus, onBlur, onEnter }) => {
  // const navigation = useNavigation();

  const [q, setQ] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [suggestion, setSuggestion] = useState([]);
  const [loading, setLoading] = useState(false);

  const debounceTimeoutRef = useRef(null);

  const loadSuggestion = async (keyword) => {
    try {
      setLoading(true);
      let allEvents = [];
      let nextPageUrl = `${endpoints['event']}?search=${keyword}`;

      while (nextPageUrl) {
        const res = await Apis.get(nextPageUrl);
        if (res.data && res.data.results) {
          allEvents = [...allEvents, ...res.data.results]; // Gộp dữ liệu từ các trang
          nextPageUrl = res.data.next; // Cập nhật URL trang tiếp theo
        } else {
          break; // Thoát nếu không có dữ liệu
        }
      }

      setSuggestion(allEvents); // Cập nhật state với toàn bộ dữ liệu
    } catch (ex) {
      console.error("Error loading all suggestions:", ex);
      setSuggestion([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Clear timeout trước khi set timeout mới
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Nếu searchText rỗng thì không gọi API mà clear suggestion luôn
    if (!searchText) {
      setSuggestion([]);
      return;
    }

    // Đặt timeout 500ms để gọi API loadSuggestion
    debounceTimeoutRef.current = setTimeout(() => {
      loadSuggestion(searchText);
    }, 500);

    // Cleanup function khi component unmount hoặc searchText thay đổi
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchText]);

  return (
    <View style={styles.container}>
      <View style={[globalStyles.container, globalStyles.mb, globalStyles.mi]}>
        <TextInput
          style={[globalStyles.input, globalStyles.placeholder]}
          placeholder="Search Event.."
          placeholderTextColor={'gray'}
          value={searchText}
          onChangeText={setSearchText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => {
              setIsFocused(false);
            }, 100);
          }}
          onSubmitEditing={() => navigation.navigate('searchingScreen', { searchText })}
        />
        {searchText.length > 0 ?
          <TouchableOpacity
            style={[globalStyles.button]}
            onPress={() => navigation.navigate('searchingScreen', { searchText })}
          >
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity> : <View
            style={[globalStyles.button]}
          >
            <Ionicons name="search" size={24} color="white" />
          </View>
        }
      </View>

      {(isFocused && suggestion.length > 0 && searchText.length > 0) && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestion}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}

                onPress={() => {
                  console.log("Pressed item id:", item.id);
                  navigation.navigate('eventDetail', { id: item.id });
                }}
              >
                <Image source={{ uri: item.image }} style={styles.suggestionImage} />
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionTitle}>{item.title}</Text>
                  <Text style={styles.suggestionDate}>{item.date}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 400,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
  },
  suggestionImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  suggestionDate: {
    fontSize: 12,
    color: COLORS.grey,
  },
});

export default SearchBox; 