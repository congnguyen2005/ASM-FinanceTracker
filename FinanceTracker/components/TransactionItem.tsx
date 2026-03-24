import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface TransactionItemProps {
  item: {
    id: number;
    title: string;
    amount: number;
    category: string;
    type: string;
    date: string;
  };
  onDelete: (id: number) => void;
}

export default function TransactionItem({ item, onDelete }: TransactionItemProps) {
  const isExpense = item.type === 'expense';
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333' }, 'icon');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <View>
        <ThemedText style={styles.title}>{item.title}</ThemedText>
        <ThemedText style={styles.category}>{item.category}</ThemedText>
        <ThemedText style={styles.date}>
          {new Date(item.date).toLocaleDateString('vi-VN')}
        </ThemedText>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, { color: isExpense ? '#ff4444' : '#4caf50' }]}>
          {isExpense ? '-' : '+'}
          {formatCurrency(item.amount)}
        </Text>

        <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
          <Text style={styles.deleteText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  category: {
    marginTop: 4,
    fontSize: 13,
    opacity: 0.7,
  },
  date: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.5,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteBtn: {
    marginTop: 8,
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});