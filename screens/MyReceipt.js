import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

// Mock data for receipts - replace with actual data from your backend
const mockReceipts = [
  {
    id: '1',
    eventName: 'Summer Music Festival',
    date: '2024-03-15',
    amount: 150.00,
    status: 'Paid',
    ticketType: 'VIP',
    quantity: 2,
  },
  {
    id: '2',
    eventName: 'Tech Conference 2024',
    date: '2024-03-10',
    amount: 75.00,
    status: 'Paid',
    ticketType: 'Standard',
    quantity: 1,
  },
  // Add more mock receipts as needed
];

const ReceiptItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.receiptItem} onPress={onPress}>
    <View style={styles.receiptHeader}>
      <Text style={styles.eventName}>{item.eventName}</Text>
      <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
    </View>
    <View style={styles.receiptDetails}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.status}>{item.status}</Text>
    </View>
  </TouchableOpacity>
);

const ReceiptDetail = ({ receipt, onClose }) => (
  <View style={styles.detailContainer}>
    <View style={styles.detailHeader}>
      <Text style={styles.detailTitle}>Receipt Details</Text>
      <TouchableOpacity onPress={onClose}>
        <Ionicons name="close" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
    
    <View style={styles.detailContent}>
      <DetailRow label="Event" value={receipt.eventName} />
      <DetailRow label="Date" value={receipt.date} />
      <DetailRow label="Amount" value={`$${receipt.amount.toFixed(2)}`} />
      <DetailRow label="Status" value={receipt.status} />
      <DetailRow label="Ticket Type" value={receipt.ticketType} />
      <DetailRow label="Quantity" value={receipt.quantity.toString()} />
    </View>
  </View>
);

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const MyReceipt = () => {
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Receipts</Text>
      </View>

      <FlatList
        data={mockReceipts}
        renderItem={({ item }) => (
          <ReceiptItem
            item={item}
            onPress={() => setSelectedReceipt(item)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {selectedReceipt && (
        <ReceiptDetail
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight || '#F4F6F8',
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'android' ? 25 : 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  listContainer: {
    padding: 16,
  },
  receiptItem: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  receiptDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    color: COLORS.grey,
  },
  status: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  detailContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  detailContent: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
  },
  detailLabel: {
    fontSize: 16,
    color: COLORS.grey,
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.primaryDark,
    fontWeight: '500',
  },
});

export default MyReceipt;
