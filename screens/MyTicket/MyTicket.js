import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, StatusBar, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";

const tickets = [
  { id: "1", name: "Concert A", date: "2024-04-10", location: "Stadium X", status: "Upcoming" },
  { id: "2", name: "Football Match", date: "2024-03-28", location: "Arena Y", status: "Used" },
  { id: "3", name: "Movie Premiere", date: "2024-05-01", location: "Cinema Z", status: "Upcoming" },
];

export default function MyTicket() {
  const [searchText, setSearchText] = useState("");
  const [filteredTickets, setFilteredTickets] = useState(tickets);

  const handleSearch = (text) => {
    setSearchText(text);
    setFilteredTickets(
      tickets.filter((ticket) => ticket.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const renderTicket = ({ item }) => (
    <TouchableOpacity style={styles.ticketCard}>
      <View style={styles.ticketContent}>
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketName}>{item.name}</Text>
          <View style={[styles.statusBadge, item.status === "Upcoming" ? styles.upcomingBadge : styles.usedBadge]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.ticketDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color="#666" style={styles.detailIcon} />
            <Text style={styles.ticketInfo}>{item.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color="#666" style={styles.detailIcon} />
            <Text style={styles.ticketInfo}>{item.location}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tickets</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search tickets..."
            placeholderTextColor="#666"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredTickets}
        keyExtractor={(item) => item.id}
        renderItem={renderTicket}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  ticketCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketContent: {
    flex: 1,
    marginRight: 10,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  ticketName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  upcomingBadge: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  usedBadge: {
    backgroundColor: "rgba(244, 67, 54, 0.1)",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  upcoming: {
    color: "#4CAF50",
  },
  used: {
    color: "#F44336",
  },
  ticketDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailIcon: {
    marginRight: 8,
  },
  ticketInfo: {
    color: "#666",
    fontSize: 14,
  },
});
