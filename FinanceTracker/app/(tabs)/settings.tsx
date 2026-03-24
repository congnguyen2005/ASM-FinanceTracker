import { ThemedText, ThemedView } from '@/components';
import { deleteAllTransactions } from '@/database/db';
import { useThemeColor } from '@/hooks/use-theme-color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SettingsScreen() {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const cardBackground = useThemeColor({ light: '#fff', dark: '#2c2c2c' }, 'background');

  useEffect(() => {
    loadCachedRate();
  }, []);

  const loadCachedRate = async () => {
    try {
      const cachedRate = await AsyncStorage.getItem('exchange_rate');
      const cachedTime = await AsyncStorage.getItem('exchange_rate_time');
      if (cachedRate && cachedTime) {
        setRate(parseFloat(cachedRate));
        setLastUpdate(new Date(parseInt(cachedTime)));
      }
    } catch (error) {
      console.error('Error loading cached rate:', error);
    }
  };

  const fetchRate = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      const usdToVnd = response.data.rates.VND;
      setRate(usdToVnd);
      const now = Date.now();
      await AsyncStorage.setItem('exchange_rate', usdToVnd.toString());
      await AsyncStorage.setItem('exchange_rate_time', now.toString());
      setLastUpdate(new Date(now));
      Alert.alert('Thành công', `1 USD = ${usdToVnd.toLocaleString('vi-VN')} VND`);
    } catch (error) {
      console.error('Error fetching rate:', error);
      Alert.alert('Lỗi', 'Không thể lấy tỷ giá. Vui lòng kiểm tra kết nối mạng.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = () => {
    Alert.alert(
      'Xóa tất cả dữ liệu',
      'Bạn có chắc chắn muốn xóa tất cả giao dịch? Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteAllTransactions();
            if (success) {
              Alert.alert('Thành công', 'Đã xóa tất cả giao dịch');
            } else {
              Alert.alert('Lỗi', 'Không thể xóa dữ liệu');
            }
          },
        },
      ]
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.card, { backgroundColor: cardBackground }]}>
        <ThemedText style={styles.title}>Tỷ giá USD/VND</ThemedText>
        <ThemedText style={styles.subtitle}>Cập nhật từ ExchangeRate-API</ThemedText>

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={fetchRate}
          disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cập nhật tỷ giá</Text>}
        </TouchableOpacity>

        {rate && (
          <View style={styles.rateInfo}>
            <ThemedText style={styles.rateLabel}>Tỷ giá hiện tại:</ThemedText>
            <ThemedText style={styles.rateValue}>1 USD = {formatCurrency(rate)}</ThemedText>
            {lastUpdate && (
              <ThemedText style={styles.updateText}>
                Cập nhật: {lastUpdate.toLocaleString('vi-VN')}
              </ThemedText>
            )}
          </View>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: cardBackground, marginTop: 16 }]}>
        <ThemedText style={styles.title}>Quản lý dữ liệu</ThemedText>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAll}>
          <Text style={styles.deleteButtonText}>Xóa tất cả giao dịch</Text>
        </TouchableOpacity>

        <ThemedText style={styles.warningText}>
          ⚠️ Lưu ý: Hành động này sẽ xóa vĩnh viễn tất cả dữ liệu giao dịch
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  rateInfo: {
    marginTop: 20,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  rateLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  updateText: {
    fontSize: 11,
    opacity: 0.5,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  warningText: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 12,
    textAlign: 'center',
  },
});