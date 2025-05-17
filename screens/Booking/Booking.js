import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Modal,
  FlatList,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import Apis, { authApis, endpoints } from '../../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../../constants/globalStyles';
import { MyDispatchContext, MyUserContext } from '../../configs/Context';
import { ActivityIndicator } from 'react-native-paper';

const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash', icon: 'cash-outline' },
  { id: 'momo', name: 'MoMo', icon: 'wallet-outline' },
];

const Booking = ({ route, navigation }) => {
  const { event } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [appliedVoucher, setAppliedVoucher] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [discount, setDiscount] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount_id, setDiscount_id] = useState();
  const [percentDiscount, setPercentDiscount] = useState('');
  const [momoUrl, setMomoUrl] = useState(null);
  const [invoice_id, setInvoice_id] = useState(null);

  const basePrice = event.ticket_price || 0;
  const totalPrice = basePrice * quantity;
  const finalPrice = totalPrice - (appliedVoucher ? totalPrice * (percentDiscount / 100) : 0);

  const date = new Date(event.start_time);
  const day = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date).replace(/\//g, '/');
  const time = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

  const loadDiscount = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const res = await authApis(token).get(endpoints['my-discount']);
      if (res.data) {
        setDiscount(res.data);
      } else {
        setDiscount([]);
      }
    } catch (error) {
      console.error('Error loading discounts:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });
      setDiscount([]);
    } finally {
      setLoading(false);
    }
  };

  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);

  const booking = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      let form = new FormData();
      form.append('event_id', event.id);
      form.append('discount_id', discount_id ?? '');
      form.append('ticket_count', quantity);

      const res = await authApis(token).post(endpoints['invoice'], form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 201) {
        setInvoice_id(res.data.id);
        return res.data.id; // Return invoice_id for MoMo payment
      }
      throw new Error('Failed to create invoice');
    } catch (error) {
      console.error('Booking Error:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error; // Re-throw error to be handled by the caller
    }
  };

  const momoPayment = async (invoiceId) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    if (!invoiceId) {
      throw new Error('Invoice ID is missing');
    }

    const res = await authApis(token).post(
      endpoints['momo-payment'](invoiceId),
      null, // No FormData needed, invoice already created
      {
        headers: {
          'Content-Type': 'application/json', // Adjusted for POST with no body
        },
      }
    );

    console.log('Momo Payment Response:', res.data);
    console.log('URL MOMO:', res.data.pay_url);

    if (res.status === 200 && res.data) {
      const payUrl = res.data.pay_url; // Directly use pay_url
      setMomoUrl(payUrl);
      if (payUrl) {
        const supported = await Linking.canOpenURL(payUrl);
        if (supported) {
          await Linking.openURL(payUrl); // Navigate to the MoMo pay_url
        } else {
          Alert.alert('Error', 'Cannot open MoMo payment URL. Please ensure the MoMo app is installed.');
        }
      } else {
        Alert.alert('Error', 'No payment URL found in response.');
      }
    } else {
      throw new Error('Failed to initiate MoMo payment');
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Step 1: Create invoice
      const newInvoiceId = await booking();

      // Step 2: Handle payment based on method
      if (selectedPayment.id === 'momo') {
        await momoPayment(newInvoiceId);
      } else {
        // For Cash, navigate directly to payment success
        navigation.navigate('paymentSuccess');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      Alert.alert(
        'Error',
        error.message || 'Payment failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiscount();
  }, []);

  // Log momoUrl when it changes
  useEffect(() => {
    if (momoUrl) {
      console.log('Updated momoUrl:', momoUrl);
    }
  }, [momoUrl]);

  // Handle deep link callback from MoMo
  useEffect(() => {
    const handleDeepLink = ({ url }) => {
      console.log('Deep Link URL:', url);
      if (url.includes('success')) {
        navigation.navigate('paymentSuccess');
      } else if (url.includes('fail') || url.includes('cancel')) {
        Alert.alert('Payment Failed', 'MoMo payment was not successful. Please try again.');
      }
    };

    // Linking.addEventListener('url', handleDeepLink);
    // // Initial check for any pending deep link
    // Linking.getInitialURL().then((url) => {
    //   if (url) handleDeepLink({ url });
    // });

    return () => Linking.removeEventListener('url', handleDeepLink);
  }, [navigation]);

  const handlePromoApply = (code) => {
    setPromoCode(code);
    setAppliedVoucher(true);
    setShowVoucher(false);
  };

  const handlePaymentSelect = (method) => {
    setSelectedPayment(method);
    setShowPaymentModal(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bill of Payment</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.eventDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="calendar" size={20} color={COLORS.primary} />
                <Text style={styles.detailText}>{day} {time}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location" size={20} color={COLORS.primary} />
                <Text style={styles.detailText}>{event.location}</Text>
              </View>
            </View>
          </View>

          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Number of Tickets</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={24} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.min(quantity + 1, event.ticket_quantity))}
              >
                <Ionicons name="add" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.promoSection}>
            <Text style={styles.sectionTitle}>Voucher Discount</Text>
            <TouchableOpacity
              style={styles.promoInputContainer}
              onPress={() => setShowVoucher(true)}
            >
              <View style={styles.promoInput}>
                <Text style={promoCode ? styles.promoCode : styles.paymentPlaceholder}>
                  {promoCode || 'Select voucher'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowVoucher(true)}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity
              style={styles.paymentSelector}
              onPress={() => setShowPaymentModal(true)}
            >
              {selectedPayment ? (
                <View style={styles.selectedPayment}>
                  <Ionicons name={selectedPayment.icon} size={24} color={COLORS.primary} />
                  <Text style={styles.paymentText}>{selectedPayment.name}</Text>
                </View>
              ) : (
                <Text style={styles.paymentPlaceholder}>Select payment method</Text>
              )}
              <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.priceBreakdown}>
            <Text style={styles.sectionTitle}>Invoice</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Base Price</Text>
              <Text style={styles.priceValue}>{Number(event.ticket_price).toFixed(0)}₫</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Quantity</Text>
              <Text style={styles.priceValue}>x {quantity}</Text>
            </View>

            {appliedVoucher && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Discount</Text>
                <Text style={[styles.priceValue, styles.discountText]}>- {Number(percentDiscount)}%</Text>
              </View>
            )}
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{finalPrice}₫</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.footerTotalLabel}>Total Amount</Text>
          <Text style={styles.footerTotalValue}>{finalPrice}₫</Text>
        </View>
        <TouchableOpacity
          style={[styles.payButton, !selectedPayment && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={!selectedPayment || loading}
        >
          <Text style={[styles.payButtonText, loading && { opacity: 0.6 }]}>
            {selectedPayment ? (loading ? 'Paying...' : 'Pay') : 'Please select payment method'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Promo Code Modal */}
      <Modal
        visible={showVoucher}
        transparent
        animationType="slide"
        onRequestClose={() => setShowVoucher(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select voucher</Text>
              <TouchableOpacity onPress={() => setShowVoucher(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={discount}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.promoItem}
                  onPress={() => {
                    handlePromoApply(item.discount_code);
                    setPercentDiscount(item.discount_percent);
                    setDiscount_id(item.id);
                  }}
                >
                  <View>
                    <Text style={styles.promoCode}>{item.discount_code}</Text>
                    <Text style={styles.promoDescription}>{item.description || 'No description'}</Text>
                  </View>
                  <Text style={styles.promoDiscount}>-{item.discount_percent}%</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Payment Method Modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payment method</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={PAYMENT_METHODS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.paymentItem}
                  onPress={() => handlePaymentSelect(item)}
                >
                  <View style={styles.paymentItemLeft}>
                    <Ionicons name={item.icon} size={24} color={COLORS.primary} />
                    <Text style={styles.paymentItemText}>{item.name}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  backButton: {
    marginRight: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  eventInfo: {
    marginBottom: 30,
    backgroundColor: '#fff',
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
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  eventDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
    backgroundColor: COLORS.accentLight,
    padding: 12,
    borderRadius: 12,
  },
  detailText: {
    fontSize: 16,
    color: COLORS.primaryDark,
  },
  quantitySection: {
    marginBottom: 30,
    backgroundColor: '#fff',
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
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  quantityButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.secondaryLighter,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  quantityText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  promoSection: {
    marginBottom: 30,
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
  promoInputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  promoInput: {
    flex: 1,
    height: 50,
    borderWidth: 2,
    borderColor: COLORS.secondaryLighter,
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: COLORS.accentLight,
  },
  applyButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 25,
    borderRadius: 25,
    justifyContent: 'center',
    shadowColor: COLORS.secondaryDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentSection: {
    marginBottom: 30,
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
  paymentSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.accentLight,
    padding: 15,
    borderRadius: 15,
  },
  selectedPayment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  paymentText: {
    fontSize: 16,
    color: COLORS.primaryDark,
    fontWeight: '500',
  },
  paymentPlaceholder: {
    fontSize: 16,
    color: COLORS.primaryDark,
    opacity: 0.6,
  },
  priceBreakdown: {
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
  priceRow: {
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
  discountText: {
    color: COLORS.success,
    fontWeight: 'bold',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: COLORS.secondaryLighter,
    borderBottomWidth: 0,
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
  totalContainer: {
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
  payButton: {
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
  payButtonDisabled: {
    backgroundColor: COLORS.secondaryDark,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  promoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
  },
  promoCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  promoDescription: {
    fontSize: 14,
    color: COLORS.primaryDark,
    opacity: 0.7,
    marginTop: 4,
  },
  promoDiscount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
  },
  paymentItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  paymentItemText: {
    fontSize: 16,
    color: COLORS.primaryDark,
  },
});

export default Booking;