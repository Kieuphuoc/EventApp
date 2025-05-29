import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import COLORS from "../../constants/colors";
import { authApis, endpoints } from "../../configs/Apis";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

export default function MyTicket({ navigation }) {
  const [tabItem, moveTab] = useState(1);

  const [searchText, setSearchText] = useState("");
  const [ticket, setTicket] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [qr, setQr] = useState("");
  // const fadeAnim = useRef(new Animated.Value(0)).current; // Animation cho modal

  const loadTicket = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      let res = await authApis(token).get(endpoints["my-ticket"]);
      console.log("Tickets:", res.data);
      if (res.data) {
        setTicket(res.data);
      }
    } catch (ex) {
      console.error("Error loading tickets:", ex);
      console.log("Error details:", ex.response?.data);
      setTicket([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, []);

  const bookedTickets = ticket.filter(t => t.status === "booked");
  const checkedInTickets = ticket.filter(t => t.status === "checked-in");


  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    if (isNaN(date)) return "N/A";
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openModal = () => {
    setShowQr(true);

  };

  const closeModal = () => {

    setShowQr(false)
  };



  const Ticket = ({ item }) => (
    <View
      style={styles.ticketCard}
    >
      <TouchableOpacity style={styles.ticketDetailsContainer} onPress={() => navigation.navigate('myInvoice', item.invoice_id)} >
        <View style={styles.ticketHeader}>
          <Text style={styles.eventTitle} numberOfLines={1} ellipsizeMode="tail">
            {item?.event?.title || "Event Title Missing"}
          </Text>
          <View
            style={[
              styles.statusBadge,
              item.status === "booked"
                ? styles.bookedBadge
                : styles.checkedInBadge,
            ]}
          >
            <Text style={styles.statusText}>
              {item.status === "booked" ? "Booked" : "Checked-in"}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location" size={18} color={COLORS.primary} />
          <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
            {item.event?.location || "N/A"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={18} color={COLORS.primary} />
          <Text style={styles.infoText}>
            {formatDateTime(item?.event?.start_time)}
          </Text>
        </View>

        {item.checked_in_at && (
          <View style={styles.infoRow}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Checked in at:  {formatDateTime(item.checked_in_at) || "N/A"}
            </Text>
          </View>)}

      </TouchableOpacity>

      {/* Right Section - QR Preview */}
      <TouchableOpacity style={styles.qrPreviewContainer} onPress={() => {
        setQr(item.qr_code);
        openModal();
      }}>
        <Image
          style={styles.qrPreviewImage}
          source={{
            uri: item.qr_code || "https://via.placeholder.com/60?text=QR", // Placeholder
          }}
          resizeMode="contain"
        />
        <Ionicons name="chevron-down" size={20} color={COLORS.grey} style={styles.chevronIcon} />
      </TouchableOpacity>

    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Tickets</Text>
        </View>
      </View>

      <ScrollView style={{ paddingInline: 15 }}>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, tabItem === 1 && styles.activeTab]}
            onPress={() => moveTab(1)}
          >
            <Text style={[styles.tabText, tabItem === 1 && styles.activeTabText]}>Booked</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tabItem === 2 && styles.activeTab]}
            onPress={() => moveTab(2)}
          >
            <Text style={[styles.tabText, tabItem === 2 && styles.activeTabText]}>Checked-in</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : (
          <><>
            {tabItem === 1 && (
              <FlatList
                data={bookedTickets}
                renderItem={({ item, index }) => <Ticket key={index} item={item} />}
                contentContainerStyle={styles.listContent}
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No booked tickets found</Text>
                  </View>
                }
              />
            )}
            {tabItem === 2 && (
              <FlatList
                data={checkedInTickets}
                renderItem={({ item, index }) => <Ticket key={index} item={item} />}
                contentContainerStyle={styles.listContent}
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No checked-in tickets found</Text>
                  </View>
                }
              />
            )}
          </>
          </>
        )}


      </ScrollView>
      {showQr && (
        <Animated.View style={[styles.modalContainer,
        ]}>
          <TouchableOpacity style={styles.backdrop} onPress={closeModal} activeOpacity={1} />
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Ionicons name="close-circle" size={40} color={COLORS.primary} />
            </TouchableOpacity>
            <Image
              style={styles.modalQrImage}
              source={{
                uri: qr || "https://via.placeholder.com/300",
              }}
              resizeMode="contain"
            />
            <Text style={styles.modalText}>Scan this QR code to check-in</Text>
          </View>
        </Animated.View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 10,
  },
  bookedBadge: {
    backgroundColor: COLORS.primary + '60',
  },
  checkedInBadge: {
    backgroundColor: COLORS.error + '60',
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 10,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerActions: {
    flexDirection: "row",
    gap: 15,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.accentLight,
    borderRadius: 15,
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
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.primaryDark,
  },
  listContent: {
    // paddingHorizontal: 20,
    // paddingBottom: 20,
  },
  ticketCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    // padding: 15,
    borderRadius: 20,
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
    // marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 10,
  },
  bookedBadge: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
  },
  checkedInBadge: {
    backgroundColor: COLORS.error + "50",
  },

  ticketDetails: {
    gap: 8,
  },
  detailRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
    backgroundColor: COLORS.accentLight,
    padding: 10,
    borderRadius: 12,
  },
  detailTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.primaryDark,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.primaryDark,
    fontWeight: "500",
  },
  qrContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  qrImage: {
    width: "100%",
    height: "100%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.primaryDark,
    opacity: 0.6,
    textAlign: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  // Modal styles
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    width: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  modalQrImage: {
    width: 300,
    height: 300,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: COLORS.primaryDark,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: -15,
    right: -15,
    zIndex: 1,
  },
  ticketDetailsContainer: {
    flex: 1,
    padding: 15,
  },

  eventTitle: {
    fontSize: 18, // Slightly smaller title
    fontWeight: "600", // Semi-bold
    color: COLORS.primary, // Use primary dark or fallback
    flex: 1, // Take available space
    marginRight: 10, // Space before status badge
  },

  bookedText: {
    color: '#2e7d32', // Darker green text
  },
  checkedInText: {
    color: '#ef6c00', // Darker orange text
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.darkGrey,
    marginLeft: 8,
    flex: 1, // Allow text to wrap if needed, prevent pushing QR code
  },
  qrPreviewContainer: {
    width: 80, // Wider area for QR + chevron
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.lightGrey, // Slightly different background for contrast
    paddingVertical: 10,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.extraLightGrey || '#eee'
  },
  qrPreviewImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginBottom: 5, // Space between QR and chevron
  },
  chevronIcon: {
    marginTop: 3,
  },
  // Modal Styles
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.65)", // Darker backdrop
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 25,
    width: '85%', // Relative width
    maxWidth: 360, // Max width
    alignItems: "center",
    position: 'relative', // Needed for absolute positioned close button
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalQrImage: {
    width: 280, // Larger QR
    height: 280,
    marginBottom: 20,
    borderRadius: 5, // Optional subtle rounding
  },
});