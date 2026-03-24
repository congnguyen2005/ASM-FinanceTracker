import { ThemedText, ThemedView } from '@/components';
import { fetchTransactions } from '@/database/db';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';

export default function StatsScreen() {
  const [data, setData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [chartType, setChartType] = useState<'expense' | 'income'>('expense');
  const textColor = useThemeColor({}, 'text');

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [chartType])
  );

  const loadData = async () => {
    const transactions = await fetchTransactions();
    setData(transactions);

    const filtered = transactions.filter((t) => t.type === chartType);
    const categoryMap = {};
    filtered.forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const pieData = Object.entries(categoryMap).map(([name, value], index) => ({
      name: name.substring(0, 10),
      amount: value,
      color: colors[index % colors.length],
      legendFontColor: textColor,
      legendFontSize: 12,
    }));

    setCategoryData(pieData);
  };

  const chartData = {
    labels: ['Ăn uống', 'Shopping', 'Di chuyển', 'Giải trí', 'Hóa đơn', 'Khác'],
    datasets: [{ data: categoryData.map((c) => c.amount) }],
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const totalAmount = data.filter((t) => t.type === chartType).reduce((sum, t) => sum + t.amount, 0);

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <ThemedText style={styles.title}>
            {chartType === 'expense' ? 'Thống kê chi tiêu' : 'Thống kê thu nhập'}
          </ThemedText>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, chartType === 'expense' && styles.activeType]}
              onPress={() => setChartType('expense')}>
              <ThemedText style={[styles.typeText, chartType === 'expense' && styles.activeTypeText]}>
                Chi tiêu
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, chartType === 'income' && styles.activeType]}
              onPress={() => setChartType('income')}>
              <ThemedText style={[styles.typeText, chartType === 'income' && styles.activeTypeText]}>
                Thu nhập
              </ThemedText>
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.total}>
            Tổng {chartType === 'expense' ? 'chi' : 'thu'}: {formatCurrency(totalAmount)}
          </ThemedText>
        </View>

        {categoryData.length > 0 ? (
          <>
            <View style={styles.chartContainer}>
              <ThemedText style={styles.chartTitle}>Biểu đồ tròn</ThemedText>
              <PieChart
                data={categoryData}
                width={Dimensions.get('window').width - 32}
                height={220}
                chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>

            <View style={styles.chartContainer}>
              <ThemedText style={styles.chartTitle}>Biểu đồ cột</ThemedText>
              <BarChart
                data={chartData}
                width={Dimensions.get('window').width - 32}
                height={220}
                yAxisLabel=""
                yAxisSuffix="K"
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                verticalLabelRotation={30}
                fromZero
              />
            </View>

            <View style={styles.legendContainer}>
              <ThemedText style={styles.legendTitle}>Chi tiết theo danh mục</ThemedText>
              {categoryData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <ThemedText style={styles.legendName}>{item.name}</ThemedText>
                  <ThemedText style={styles.legendAmount}>{formatCurrency(item.amount)}</ThemedText>
                  <ThemedText style={styles.legendPercent}>
                    ({((item.amount / totalAmount) * 100).toFixed(1)}%)
                  </ThemedText>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              Chưa có dữ liệu {chartType === 'expense' ? 'chi tiêu' : 'thu nhập'}
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  typeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeType: {
    backgroundColor: '#007AFF',
  },
  typeText: {
    fontSize: 14,
  },
  activeTypeText: {
    color: '#fff',
  },
  total: {
    fontSize: 16,
    opacity: 0.7,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    alignSelf: 'flex-start',
    marginLeft: 16,
  },
  legendContainer: {
    padding: 16,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendName: {
    flex: 1,
    fontSize: 14,
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  legendPercent: {
    fontSize: 12,
    opacity: 0.6,
  },
  emptyContainer: {
    padding: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.5,
  },
});