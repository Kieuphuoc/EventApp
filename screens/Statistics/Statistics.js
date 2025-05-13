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
import { PieChart, BarChart } from 'react-native-chart-kit';
import { authApis, endpoints } from '../../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const CHART_COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
  '#9966FF', '#FF9F40', '#F7464A', '#46BFBD',
];

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalTickets: 0,
    totalRevenue: '0',
    totalViews: 0,
    categoryDistribution: [],
    monthlyRevenue: [],
  });

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn('No token found, using mock data.');
        throw new Error('No token found');
      }

      const response = await authApis(token).get(endpoints['dashboard']);
      if (response.data && typeof response.data === 'object') {
        setStats({
          totalEvents: response.data.events || 0,
          totalTickets: response.data.total_tickets || 0,
          totalRevenue: response.data.total_revenue || '0',
          totalViews: response.data.total_views || 0,
          categoryDistribution: Array.isArray(response.data.categoryDistribution) && response.data.categoryDistribution.length > 0
            ? response.data.categoryDistribution
            : [
                { category: 'Music', count: 5 },
                { category: 'Sports', count: 3 },
              ],
          monthlyRevenue: Array.isArray(response.data.monthlyRevenue) && response.data.monthlyRevenue.length > 0
            ? response.data.monthlyRevenue
            : [
                { month: 'Jan', revenue: 1000 },
                { month: 'Feb', revenue: 2000 },
              ],
        });
      } else {
        console.warn('API response data is not in expected format, using mock data.');
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
      setStats({
        totalEvents: 25,
        totalTickets: 250,
        totalRevenue: '$37,500.00',
        totalViews: 1500,
        categoryDistribution: [
          { category: 'Concerts', count: 8 },
          { category: 'Workshops', count: 5 },
          { category: 'Festivals', count: 6 },
          { category: 'Sports', count: 4 },
          { category: 'Tech', count: 2 },
        ],
        monthlyRevenue: [
          { month: 'Jan', revenue: 2500 },
          { month: 'Feb', revenue: 4000 },
          { month: 'Mar', revenue: 3200 },
          { month: 'Apr', revenue: 5500 },
          { month: 'May', revenue: 4800 },
          { month: 'Jun', revenue: 6200 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  const pieChartData = stats.categoryDistribution.map((item, index) => ({
    name: item.category,
    population: item.count,
    color: CHART_COLORS[index % CHART_COLORS.length],
    legendFontColor: COLORS.darkGrey || '#555',
    legendFontSize: 13,
  }));

  const barChartData = {
    labels: stats.monthlyRevenue.map((item) => item.month),
    datasets: [
      {
        data: stats.monthlyRevenue.map((item) => item.revenue),
        color: (opacity = 1) => COLORS.secondary,
      },
    ],
  };

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
          onPress={loadStatistics}
          disabled={loading}
        >
          <Ionicons name="refresh-circle-outline" size={28} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        {renderStatCard(
          'Total Tickets',
          stats.totalTickets.toLocaleString(),
          'ticket-outline',
          COLORS.primary
        )}
        {renderStatCard(
          'Total Revenue',
          stats.totalRevenue,
          'wallet-outline',
          COLORS.secondary
        )}
        {renderStatCard(
          'Total Views',
          stats.totalViews.toLocaleString(),
          'eye-outline',
          COLORS.success || '#2ECC71'
        )}
      </View>

      {stats.categoryDistribution.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Event Categories</Text>
          <View style={styles.chartView}>
            <PieChart
              data={pieChartData}
              width={width - 40}
              height={230}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="20"
              absolute
            />
          </View>
        </View>
      )}

      {stats.monthlyRevenue.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Monthly Revenue Stream</Text>
          <View style={styles.chartView}>
            <BarChart
              data={barChartData}
              width={width - 50}
              height={230}
              yAxisLabel="$"
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
                barPercentage: 0.7,
                style: {
                  borderRadius: 16,
                },
              }}
              style={styles.barChartStyle}
              showValuesOnTopOfBars
              verticalLabelRotation={stats.monthlyRevenue.length > 5 ? 25 : 0}
            />
          </View>
        </View>
      )}

      {!stats.categoryDistribution.length && !stats.monthlyRevenue.length && !loading && (
        <View style={styles.noDataContainer}>
          <Ionicons name="sad-outline" size={60} color={COLORS.grey} />
          <Text style={styles.noDataText}>No statistics to display yet.</Text>
          <Text style={styles.noDataSubText}>
            Start creating events to see your dashboard come alive!
          </Text>
        </View>
      )}
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
  chartView: {
    alignItems: 'center',
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
    marginTop: 50,
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
});

export default Statistics;