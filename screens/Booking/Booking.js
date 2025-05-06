import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';

const PROMO_CODES = [
  { code: 'SUMMER10', discount: 10, description: 'Giảm 10% cho mùa hè' },
  { code: 'WELCOME20', discount: 20, description: 'Giảm 20% cho khách hàng mới' },
  { code: 'SPECIAL15', discount: 15, description: 'Giảm 15% cho sự kiện đặc biệt' },
];

const PAYMENT_METHODS = [
  { id: 'cash', name: 'Tiền mặt', icon: 'cash-outline' },
  { id: 'momo', name: 'Ví MoMo', icon: 'wallet-outline' },
];

const Booking = ({ route, navigation }) => {
  const { event } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const basePrice = event.price || 0;
  const totalPrice = basePrice * quantity;
  const discount = isPromoApplied ? totalPrice * 0.1 : 0;
  const finalPrice = totalPrice - discount;

  const handlePromoApply = (code) => {
    setPromoCode(code);
    setIsPromoApplied(true);
    setShowPromoModal(false);
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
          <Text style={styles.headerTitle}>Booking Details</Text>
        </View>
      <ScrollView style={styles.scrollView}>
        

        <View style={styles.content}>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.eventDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="calendar" size={20} color={COLORS.primary} />
                <Text style={styles.detailText}>{event.date}</Text>
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
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.promoSection}>
            <Text style={styles.sectionTitle}>Promo Code</Text>
            <TouchableOpacity 
              style={styles.promoInputContainer}
              onPress={() => setShowPromoModal(true)}
            >
              <View style={styles.promoInput}>
                <Text style={styles.promoText}>
                  {promoCode || 'Chọn mã khuyến mãi'}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => setShowPromoModal(true)}
              >
                <Text style={styles.applyButtonText}>Chọn</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
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
                <Text style={styles.paymentPlaceholder}>Chọn phương thức thanh toán</Text>
              )}
              <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.priceBreakdown}>
            <Text style={styles.sectionTitle}>Price Breakdown</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Base Price</Text>
              <Text style={styles.priceValue}>${basePrice.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Quantity</Text>
              <Text style={styles.priceValue}>x{quantity}</Text>
            </View>

            {isPromoApplied && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Discount (10%)</Text>
                <Text style={[styles.priceValue, styles.discountText]}>-${discount.toFixed(2)}</Text>
              </View>
            )}
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${finalPrice.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.footerTotalLabel}>Total Amount</Text>
          <Text style={styles.footerTotalValue}>${finalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.payButton, !selectedPayment && styles.payButtonDisabled]}
          onPress={() => {
            if (selectedPayment) {
              navigation.navigate('PaymentSuccess');
            }
          }}
          disabled={!selectedPayment}
        >
          <Text style={styles.payButtonText}>
            {selectedPayment ? 'Thanh toán' : 'Vui lòng chọn phương thức thanh toán'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Promo Code Modal */}
      <Modal
        visible={showPromoModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPromoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn mã khuyến mãi</Text>
              <TouchableOpacity onPress={() => setShowPromoModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={PROMO_CODES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.promoItem}
                  onPress={() => handlePromoApply(item.code)}
                >
                  <View>
                    <Text style={styles.promoCode}>{item.code}</Text>
                    <Text style={styles.promoDescription}>{item.description}</Text>
                  </View>
                  <Text style={styles.promoDiscount}>-{item.discount}%</Text>
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
              <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.accentLight,
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
    shadowOpacity: 0.2,
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
  promoText: {
    fontSize: 16,
    color: COLORS.primaryDark,
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
    color: COLORS.primaryDark,
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