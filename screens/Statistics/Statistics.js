import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { authApis, endpoints } from '../../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

// Log để kiểm tra import
console.log('BarChart:', typeof BarChart);
console.log('PieChart:', typeof PieChart);

const { width } = Dimensions.get('window');

const CHART_COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
  '#9966FF', '#FF9F40', '#F7464A', '#46BFBD',
];

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_tickets: 0,
    total_revenue: '0',
    total_views: 0,
    events: [],
  });
  const [monthlyStats, setMonthlyStats] = useState({
    ticket_pie_chart: [],
    revenue_pie_chart: [],
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyLoading, setMonthlyLoading] = useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await authApis(token).get(endpoints['dashboard']);
      console.log('Dashboard API response:', response.data);
      if (response.data) {
        setStats(response.data);
      }
    } catch (ex) {
      console.error('Error loading statistics:', ex);
      setStats({
        total_tickets: 0,
        total_revenue: '0',
        total_views: 0,
        events: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMonthlyStats = async () => {
    try {
      setMonthlyLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await authApis(token).get(endpoints['monthly'], {
        params: { month: selectedMonth, year: selectedYear },
      });
      console.log('Monthly API response:', response.data);
      if (response.data) {
        setMonthlyStats(response.data);
      }
    } catch (ex) {
      console.error('Error loading monthly statistics:', ex);
      setMonthlyStats({
        ticket_pie_chart: [],
        revenue_pie_chart: [],
      });
    } finally {
      setMonthlyLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadMonthlyStats();
  }, []);

  useEffect(() => {
    loadMonthlyStats();
  }, [selectedMonth, selectedYear]);

  // Dữ liệu cho BarChart
  const viewsChartData = {
    labels: Array.isArray(stats.events) ? stats.events.map(event => event.event_title?.length > 10 ? event.event_title.substring(0, 10) + '...' : event.event_title || 'Unknown') : [],
    datasets: [
      {
        data: Array.isArray(stats.events) ? stats.events.map(event => event.views || 0) : [],
      },
    ],
  };

  const ratingChartData = {
    labels: Array.isArray(stats.events) ? stats.events.map(event => event.event_title?.length > 10 ? event.event_title.substring(0, 10) + '...' : event.event_title || 'Unknown') : [],
    datasets: [
      {
        data: Array.isArray(stats.events) ? stats.events.map(event => event.average_rating || 0) : [],
      },
    ],
  };

  // Dữ liệu cho PieChart
  const ticketPieData = Array.isArray(monthlyStats.ticket_pie_chart) ? monthlyStats.ticket_pie_chart.map((item, index) => ({
    name: item.event_title?.length > 15 ? item.event_title.substring(0, 15) + '...' : item.event_title || 'Unknown',
    value: item.value || 0,
    color: CHART_COLORS[index % CHART_COLORS.length],
    legendFontColor: COLORS.darkGrey || '#555',
    legendFontSize: 12,
  })) : [];

  const revenuePieData = Array.isArray(monthlyStats.revenue_pie_chart) ? monthlyStats.revenue_pie_chart.map((item, index) => ({
    name: item.event_title?.length > 15 ? item.event_title.substring(0, 15) + '...' : item.event_title || 'Unknown',
    value: item.value || 0,
    color: CHART_COLORS[index % CHART_COLORS.length],
    legendFontColor: COLORS.darkGrey || '#555',
    legendFontSize: 12,
  })) : [];

  const renderStatCard = (title, value, icon, color) => (
    <View style={styles.statCard}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}30` }]}>
        <Ionicons name={icon} size={26} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading Stats...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Your Event Pulse</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => {
            loadStats();
            loadMonthlyStats();
          }}
          disabled={loading || monthlyLoading}
        >
          <Ionicons name="refresh-circle-outline" size={28} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        {renderStatCard(
          'Total Tickets',
          stats.total_tickets.toLocaleString(),
          'ticket-outline',
          COLORS.primary
        )}
        {renderStatCard(
          'Total Revenue',
          `$${parseFloat(stats.total_revenue).toLocaleString()}`,
          'wallet-outline',
          COLORS.secondary
        )}
        {renderStatCard(
          'Total Views',
          stats.total_views.toLocaleString(),
          'eye-outline',
          COLORS.success || '#2ECC71'
        )}
      </View>

      {Array.isArray(stats.events) && stats.events.length > 0 ? (
        <>
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Event Views</Text>
            <View style={styles.chartView}>
              <BarChart
                data={viewsChartData}
                width={width - 40}
                height={220}
                yAxisLabel=""
                chartConfig={{
                  backgroundColor: COLORS.white,
                  backgroundGradientFrom: COLORS.white,
                  backgroundGradientTo: COLORS.white,
                  decimalPlaces: 0,
                  color: (opacity = 1) => COLORS.primary,
                  labelColor: (opacity = 1) => COLORS.darkGrey || '#555',
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: COLORS.lightGrey || '#eef',
                  },
                  barPercentage: 0.4,
                  style: {
                    borderRadius: 16,
                  },
                }}
                style={styles.barChartStyle}
                verticalLabelRotation={stats.events.length > 3 ? 45 : 0}
                showValuesOnTopOfBars
              />
            </View>
          </View>

          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Event Ratings</Text>
            <View style={styles.chartView}>
              <BarChart
                data={ratingChartData}
                width={width - 40}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: COLORS.white,
                  backgroundGradientFrom: COLORS.white,
                  backgroundGradientTo: COLORS.white,
                  decimalPlaces: 1,
                  color: (opacity = 1) => COLORS.secondary,
                  labelColor: (opacity = 1) => COLORS.darkGrey || '#555',
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: COLORS.lightGrey || '#eef',
                  },
                  barPercentage: 0.4,
                  style: {
                    borderRadius: 16,
                  },
                }}
                style={styles.barChartStyle}
                verticalLabelRotation={stats.events.length > 3 ? 45 : 0}
                showValuesOnTopOfBars
              />
            </View>
          </View>
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <Ionicons name="sad-outline" size={60} color={COLORS.grey} />
          <Text style={styles.noDataText}>No statistics to display yet.</Text>
          <Text style={styles.noDataSubText}>
            Start creating events to see your dashboard come alive!
          </Text>
        </View>
      )}

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Monthly Statistics</Text>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedMonth}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <Picker.Item key={month} label={`Month ${month}`} value={month} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedYear}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
            >
              {Array.from({ length: 6 }, (_, i) => 2020 + i).map(year => (
                <Picker.Item key={year} label={`${year}`} value={year} />
              ))}
            </Picker>
          </View>
        </View>

        {monthlyLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading Monthly Stats...</Text>
          </View>
        ) : ticketPieData.length > 0 ? (
          <>
            <View style={styles.chartView}>
              <Text style={styles.subSectionTitle}>Ticket Distribution</Text>
              <PieChart
                data={ticketPieData}
                width={width - 40}
                height={200}
                chartConfig={{
                  backgroundColor: COLORS.white,
                  backgroundGradientFrom: COLORS.white,
                  backgroundGradientTo: COLORS.white,
                  color: (opacity = 1) => COLORS.primary,
                  labelColor: (opacity = 1) => COLORS.darkGrey || '#555',
                }}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="15"
                hasLegend={false}
                // absolute
              />
              <View style={styles.legendContainer}>
                {ticketPieData.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[styles.legendColor, { backgroundColor: item.color }]}
                    />
                    <Text style={styles.legendText}>{`${item.name}: ${item.value}`}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.chartView}>
              <Text style={styles.subSectionTitle}>Revenue Distribution</Text>
              <PieChart
                data={revenuePieData}
                width={width - 40}
                height={200}
                chartConfig={{
                  backgroundColor: COLORS.white,
                  backgroundGradientFrom: COLORS.white,
                  backgroundGradientTo: COLORS.white,
                  color: (opacity = 1) => COLORS.primary,
                  labelColor: (opacity = 1) => COLORS.darkGrey || '#555',
                }}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="15"
                hasLegend={false}
              />
              <View style={styles.legendContainer}>
                {revenuePieData.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[styles.legendColor, { backgroundColor: item.color }]}
                    />
                    <Text style={styles.legendText}>{`${item.name}: $${item.value.toLocaleString()}`}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="sad-outline" size={60} color={COLORS.grey} />
            <Text style={styles.noDataText}>No monthly statistics available.</Text>
            <Text style={styles.noDataSubText}>
              Select a different month or year to view stats.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight || '#F4F6F8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight || '#F4F6F8',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.grey,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 25,
    paddingTop: Platform.OS === 'android' ? 35 : 50,
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
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 15,
    color: COLORS.white,
    opacity: 0.9,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 25,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    minHeight: 110,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  statTitle: {
    fontSize: 12,
    color: COLORS.grey,
    marginTop: 3,
    textAlign: 'center',
  },
  chartSection: {
    marginHorizontal: 16,
    marginVertical: 15,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: COLORS.primaryDark,
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primaryDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  chartView: {
    alignItems: 'center',
    marginBottom: 20,
  },
  barChartStyle: {
    marginVertical: 8,
    borderRadius: 12,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.grey,
    textAlign: 'center',
    marginTop: 15,
  },
  noDataSubText: {
    fontSize: 14,
    color: COLORS.mediumGrey || '#888',
    textAlign: 'center',
    marginTop: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginHorizontal: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.darkGrey || '#555',
  },
});

export default Statistics;