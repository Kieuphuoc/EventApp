import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

const EventCard = ({ item, onPress }) => {

  const date = new Date(item.start_time);
  const dayMonth = `${date.getDate()}/${date.getMonth() + 1}`;
  const time = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress} >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
        />
        <View style={styles.overlay}>
          <View style={styles.category}>
            <Text style={styles.categoryText}>{item.category.name}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>${item.ticket_price}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar" size={14} color={COLORS.primary} />
              <Text style={styles.detailText}>{dayMonth}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time" size={14} color={COLORS.primary} />
              <Text style={styles.detailText}>{time}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location" size={14} color={COLORS.primary} />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.bookmarkButton}>
            <Ionicons name="bookmark-outline" size={18} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000', // Màu của bóng
    shadowOffset: { width: 0, height: 2 }, // Độ lệch của bóng (ngang, dọc)
    shadowOpacity: 0.2, // Độ mờ của bóng (0 đến 1)
    shadowRadius: 4, // Độ lan tỏa của bóng
    // Thêm elevation cho Android
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  category: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
  },
  priceContainer: {
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  detailText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  bookmarkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EventCard;
