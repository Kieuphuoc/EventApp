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

import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import COLORS from "../constants/colors";
import { authApis, endpoints } from "../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MyReceipt({ navigation }) {
  const [tabItem, moveTab] = useState(1);

  const [invoice, setInvoice] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      let res = await authApis(token).get(endpoints["invoice"]);
      console.log("Ivoice:", res.data);
      if (res.data) {
        setInvoice(res.data);
      }
    } catch (ex) {
      console.error("Error loading invoice:", ex);
      console.log("Error details:", ex.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoice();
  }, []);

  const successInvoice = invoice.filter(t => t.payment_status === "success");
  const failInvoice = invoice.filter(t => t.payment_status === "fail");

  const Invoice = ({ item }) => (
    <View style={styles.ticketCard}>
      <TouchableOpacity style={styles.ticketDetailsContainer} onPress={() => navigation.navigate('myInvoice', item.id)}>
        <View style={styles.ticketHeader}>
          <Image source={{ uri: item?.event?.image }} style={styles.eventImage} />
          <View style={styles.eventInfoContainer}>
            <Text style={styles.eventTitle} numberOfLines={1} ellipsizeMode="tail">
              {item?.event?.title || "Event Title Missing"}
            </Text>
            <View style={styles.infoRow}>
              <Ionicons name="ticket" size={18} color={COLORS.primary} />
              <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
                Quantity: {item.ticket_count || "N/A"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="pricetag" size={18} color={COLORS.primary} />
              <Text style={styles.infoText}>
                Discount: {item?.discount_amount || "0"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="wallet" size={18} color={COLORS.primary} />
              <Text style={styles.infoText}>
                Total price: {item?.final_amount || "0"}
              </Text>
            </View>
      
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
         <TouchableOpacity style={styles.searchButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={'white'} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Receipt</Text>
        </View>
      </View>

      <ScrollView style={{ paddingInline: 15 }}>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, tabItem === 1 && styles.activeTab]}
            onPress={() => moveTab(1)}
          >
            <Text style={[styles.tabText, tabItem === 1 && styles.activeTabText]}>Payment Success</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tabItem === 2 && styles.activeTab]}
            onPress={() => moveTab(2)}
          >
            <Text style={[styles.tabText, tabItem === 2 && styles.activeTabText]}>Payment Fail</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : (
          <><>

            {tabItem === 1 && (
              <FlatList
                data={successInvoice}
                renderItem={({ item, index }) => <Invoice key={index} item={item} />}
                contentContainerStyle={styles.listContent}
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No Success Payment found</Text>
                  </View>
                }
              />
            )}
            {tabItem === 2 && (
              <FlatList
                data={failInvoice}
                renderItem={({ item, index }) => <Invoice key={index} item={item} />}
                contentContainerStyle={styles.listContent}
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No Fail Payment found</Text>
                  </View>
                }
              />
            )}
          </>
          </>
        )}


      </ScrollView>

    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
    searchButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    marginBottom: 15,
    gap:10
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: 12,
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
  ticketCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    // marginHorizontal: 15,
    marginBottom: 15,
shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketDetailsContainer: {
    padding: 15,
  },
  ticketHeader: {
    flexDirection: "row",
    gap: 15,
  },
  eventImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  eventInfoContainer: {
    flex: 1,
    gap: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    color: 'yellow',
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLORS.accentLight,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.darkGrey,
    marginLeft: 10,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 50,
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
    alignItems: "center",
    marginTop: 50,
  },
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
    padding: 25,
    width: '90%',
    maxWidth: 360,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  modalQrImage: {
    width: 280,
    height: 280,
    marginBottom: 20,
    borderRadius: 12,
  },
  modalText: {
    fontSize: 16,
    color: COLORS.primaryDark,
    textAlign: "center",
    fontWeight: '500',
  },
  closeButton: {
    position: "absolute",
    top: -15,
    right: -15,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  listContent: {
    // paddingHorizontal: 20,
    // paddingBottom: 20,
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
});