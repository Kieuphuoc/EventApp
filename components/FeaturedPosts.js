import React from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { featuredPosts } from "../constants/featuredPosts";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

export default function FeaturedPosts() {
  return (
    <View style={styles.container}>
      <FlatList
        data={featuredPosts}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image 
              source={{ uri: item.eventImage }}
              style={styles.image}
            />
            
            <View style={styles.content}>
              <View style={styles.header}>
                <View style={styles.badge}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.badgeText}>Featured</Text>
                </View>
                <Text style={styles.likes}>{item.likes} likes</Text>
              </View>

              <Text style={styles.title} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.author}>
                <Image 
                  source={{ uri: item.author.avatar }}
                  style={styles.avatar}
                />
                <Text style={styles.authorName}>{item.author.name}</Text>
              </View>

              <View style={styles.footer}>
                <View style={styles.info}>
                  <Ionicons name="calendar" size={16} color={COLORS.primary} />
                  <Text style={styles.infoText}>Tomorrow, 8 PM</Text>
                </View>
                <View style={styles.info}>
                  <Ionicons name="location" size={16} color={COLORS.primary} />
                  <Text style={styles.infoText}>Central Park</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Join Now</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    width: 280,
    marginHorizontal: 8,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    color: '#FF9500',
    fontSize: 12,
    fontWeight: '600',
  },
  likes: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 24,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary + '20',
  },
  authorName: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

