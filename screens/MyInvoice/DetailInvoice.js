import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';
import { authApis, endpoints } from '../../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../constants/colors';
import Header from '../../components/Header';

const { width } = Dimensions.get('window');

const DetailInvoice = ({ route, navigation }) => {

  const id = route.params;
  const invoice_id = parseInt(id, 10);

  console.log(invoice_id);
  const [invoice, setInvoice] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      let res = await authApis(token).get(endpoints["invoice-detail"](invoice_id));
      console.log("Invoice:", res.data);
      if (res.data) {
        setInvoice(res.data);
      }
    } catch (ex) {
      console.error("Error loading invoice:", ex);
      console.log("Error details:", ex.response?.data);
      setInvoice([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoice();
  }, []);



  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <Header title={"Invoice Detail"} navigation={true} />
      {loading ? <ActivityIndicator size={'large'} color={COLORS.primary} /> : <><ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Event Details</Text>

            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={24} color={COLORS.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Event</Text>
                <Text style={styles.detailValue}>{invoice?.event?.title}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="time" size={24} color={COLORS.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>
                  {invoice?.event?.start_time ? (() => {
                    const date = new Date(invoice.event.start_time);
                    const day = new Intl.DateTimeFormat('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    }).format(date).replace(/\//g, '/');
                    const time = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                    return `${day} at ${time}`;
                  })() : "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="location" size={24} color={COLORS.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{invoice?.event?.location}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Ticket Details</Text>

            <View style={styles.detailRow}>
              <Ionicons name="ticket" size={24} color={COLORS.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Ticket price</Text>
                <Text style={styles.detailValue}>{invoice?.event?.ticket_price}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="people" size={24} color={COLORS.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Quantity</Text>
                <Text style={styles.detailValue}>{invoice?.ticket_count}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price per ticket</Text>
              <Text style={styles.priceValue}>{invoice?.event?.ticket_price}₫</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Discount amount</Text>
              <Text style={styles.priceValue}>{invoice?.discount_amount == 0 ? 0 : `- ${invoice?.discount_amount}`}₫</Text>
            </View>

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>${invoice?.final_amount}</Text>
            </View>
          </View>
        </View>
      </ScrollView><View style={styles.footer}>
          <View style={styles.footerTotalContainer}>
            <Text style={styles.footerTotalLabel}>Total Amount</Text>
            <Text style={styles.footerTotalValue}>${invoice?.final_amount}</Text>
          </View>
        </View></>}


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  detailsContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: COLORS.accentLight,
    padding: 12,
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
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.accentLight,
    marginVertical: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
  },
  priceLabel: {
    fontSize: 16,
    color: COLORS.primaryDark,
  },
  priceValue: {
    fontSize: 16,
    color: COLORS.primaryDark,
    fontWeight: '500',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: COLORS.secondaryLighter,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondaryLighter,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  footerTotalContainer: {
    marginBottom: 15,
    backgroundColor: COLORS.accentLight,
    padding: 15,
    borderRadius: 15,
  },
  footerTotalLabel: {
    fontSize: 14,
    color: COLORS.primaryDark,
    fontWeight: '500',
  },
  footerTotalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  confirmButton: {
    backgroundColor: COLORS.secondaryDark,
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: COLORS.secondaryDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DetailInvoice; 