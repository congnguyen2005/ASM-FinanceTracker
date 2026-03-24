import { ThemedText, ThemedView } from '@/components';
import { insertTransaction } from '@/database/db';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const CATEGORIES = ['Ăn uống', 'Shopping', 'Di chuyển', 'Giải trí', 'Hóa đơn', 'Khác'];
const TYPES = ['expense', 'income'];

export default function AddTransactionScreen() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [type, setType] = useState('expense');
  const [loading, setLoading] = useState(false);

  const textColor = useThemeColor({}, 'text');
  const inputBackground = useThemeColor({ light: '#f5f5f5', dark: '#2c2c2c' }, 'background');

  const add = async () => {
    if (!title.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên giao dịch');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ');
      return;
    }

    setLoading(true);
    try {
      await insertTransaction({
        title: title.trim(),
        amount: amountNum,
        category,
        type,
        date: new Date().toISOString(),
      });

      Alert.alert('Thành công', 'Đã thêm giao dịch', [{ text: 'OK', onPress: () => router.back() }]);

      setTitle('');
      setAmount('');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm giao dịch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <ThemedText style={styles.label}>Tên giao dịch</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: inputBackground, color: textColor }]}
            placeholder="Nhập tên giao dịch"
            placeholderTextColor={textColor + '80'}
            onChangeText={setTitle}
            value={title}
          />

          <ThemedText style={styles.label}>Số tiền</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: inputBackground, color: textColor }]}
            placeholder="Nhập số tiền"
            placeholderTextColor={textColor + '80'}
            onChangeText={setAmount}
            value={amount}
            keyboardType="numeric"
          />

          <ThemedText style={styles.label}>Loại giao dịch</ThemedText>
          <View style={styles.typeContainer}>
            {TYPES.map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.typeButton,
                  type === t && styles.typeButtonActive,
                  { backgroundColor: type === t ? '#007AFF' : inputBackground },
                ]}
                onPress={() => setType(t)}>
                <Text style={[styles.typeText, { color: type === t ? '#fff' : textColor }]}>
                  {t === 'expense' ? 'Chi tiêu' : 'Thu nhập'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ThemedText style={styles.label}>Danh mục</ThemedText>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive,
                  { backgroundColor: category === cat ? '#007AFF' : inputBackground },
                ]}
                onPress={() => setCategory(cat)}>
                <Text style={[styles.categoryText, { color: category === cat ? '#fff' : textColor }]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.addButton, loading && styles.disabledButton]}
            onPress={add}
            disabled={loading}>
            <Text style={styles.addButtonText}>{loading ? 'Đang xử lý...' : 'Thêm giao dịch'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  disabledButton: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});