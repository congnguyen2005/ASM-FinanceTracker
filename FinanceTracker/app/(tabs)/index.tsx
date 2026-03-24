import { ThemedText, ThemedView } from '@/components';
import TransactionItem from '@/components/TransactionItem';
import { deleteTransaction, fetchTransactions } from '@/database/db';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const cardBackground = useThemeColor({ light: '#fff', dark: '#2c2c2c' }, 'background');

  const loadData = async () => {
    const transactions = await fetchTransactions();
    setData(transactions);

    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    setTotalIncome(income);
    setTotalExpense(expense);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDelete = async (id) => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa giao dịch này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await deleteTransaction(id);
          await loadData();
        },
      },
    ]);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: cardBackground }]}>
          <ThemedText style={styles.summaryLabel}>Tổng thu nhập</ThemedText>
          <ThemedText style={[styles.summaryAmount, { color: '#4caf50' }]}>
            {formatCurrency(totalIncome)}
          </ThemedText>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: cardBackground }]}>
          <ThemedText style={styles.summaryLabel}>Tổng chi tiêu</ThemedText>
          <ThemedText style={[styles.summaryAmount, { color: '#ff4444' }]}>
            {formatCurrency(totalExpense)}
          </ThemedText>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: cardBackground }]}>
          <ThemedText style={styles.summaryLabel}>Số dư</ThemedText>
          <ThemedText style={[styles.summaryAmount, { color: '#007AFF' }]}>
            {formatCurrency(totalIncome - totalExpense)}
          </ThemedText>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>Chưa có giao dịch nào</ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
    opacity: 0.7,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.5,
  },
});