import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const suggestions = [
  'bún đậu mắm tôm', 'jollibee', 'mì cay', 'trà sữa', 'gà rán'
];

const categories = [
  { name: 'Cà Phê/Trà', icon: require('../assets/images/mini_logo.png') },
  { name: 'Trà sữa', icon: require('../assets/images/mini_logo.png') },
  // Thêm các mục khác nếu muốn
];

export default function SearchingScreen({ navigation }) {
  const [query, setQuery] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 40 }}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Tìm món ăn hoặc nhà hàng..."
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
        <TouchableOpacity onPress={() => setQuery('')}>
          <Text style={{ color: '#2196F3', fontWeight: '600', marginLeft: 8 }}>Hủy</Text>
        </TouchableOpacity>
      </View>

      {/* Đề xuất cho bạn */}
      <Text style={styles.sectionTitle}>ĐỀ XUẤT CHO BẠN</Text>
      <View style={styles.suggestionContainer}>
        {suggestions.map((item, idx) => (
          <View key={idx} style={styles.suggestionTag}>
            <Ionicons name="trending-up" size={16} color="#ff7043" style={{ marginRight: 4 }} />
            <Text style={styles.suggestionText}>{item}</Text>
          </View>
        ))}
      </View>

      {/* Banner ưu đãi */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
        <Image
          source={{ uri: 'https://img.upanh.tv/2024/05/18/banner-demo.jpg' }}
          style={styles.banner}
        />
        {/* Thêm nhiều banner nếu muốn */}
      </ScrollView>

      {/* Danh mục ẩm thực */}
      <Text style={styles.sectionTitle}>ẨM THỰC</Text>
      <View style={styles.categoryRow}>
        {categories.map((cat, idx) => (
          <View key={idx} style={styles.categoryBox}>
            <Image source={cat.icon} style={styles.categoryIcon} />
            <Text style={styles.categoryText}>{cat.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    borderRadius: 12,
    marginHorizontal: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 44,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: '#222',
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#444',
    fontSize: 15,
    marginLeft: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  suggestionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 12,
    marginBottom: 8,
  },
  suggestionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionText: {
    color: '#ff7043',
    fontWeight: '600',
    fontSize: 14,
  },
  banner: {
    width: 340,
    height: 90,
    borderRadius: 12,
    marginLeft: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
  },
  categoryBox: {
    alignItems: 'center',
    marginRight: 24,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 13,
    color: '#444',
    fontWeight: '500',
  },
}); 