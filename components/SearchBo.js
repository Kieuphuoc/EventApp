import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import globalStyles from '../constants/globalStyles';

const SearchBo = ({ onSearch, suggestions = [] }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredSuggestions([])
      return;
    }

    const filtered = suggestions.filter(item =>
      item.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  }, [searchText, suggestions]);

  const handleSearch = (text) => {
    setSearchText(text);
    onSearch(text);
  };

  const handleSuggestionPress = (suggestion) => {
    setSearchText(suggestion);
    setFilteredSuggestions([]);
    Keyboard.dismiss();
    onSearch(suggestion);
  };

  const handleClear = () => {
    setSearchText('');
    setFilteredSuggestions([]);
    onSearch('');
  };

  return (
    <View style={styles.container}>
      <View style={[globalStyles.container, globalStyles.mb, globalStyles.mi]} >
        <TextInput style={[globalStyles.input, globalStyles.placeholder]}
          placeholder="Search Event.."
          placeholderTextColor={'gray'}
        // value={q} onChangeText={setQ}
        />

        <View style={[globalStyles.button]}>
          <Ionicons name="search" size={24} color="white" />
        </View>
      </View>

      {isFocused && filteredSuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={filteredSuggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(item)}
              >
                <Ionicons name="search" size={16} color={COLORS.grey} style={styles.suggestionIcon} />
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  searchContainerFocused: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.primaryDark,
    padding: 0,
  },
  clearButton: {
    padding: 5,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 20,
    right: 20,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
  },
  suggestionIcon: {
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 14,
    color: COLORS.primaryDark,
  },
});

export default SearchBo; 