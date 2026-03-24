import { ThemedText, ThemedView } from '@/components';
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Thông tin ứng dụng</ThemedText>
      <ThemedText style={styles.description}>
        FinanceTracker - Ứng dụng quản lý chi tiêu cá nhân
      </ThemedText>
      <ThemedText style={styles.version}>Phiên bản 1.0.0</ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Quay lại trang chủ</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  description: {
    marginTop: 20,
    textAlign: 'center',
  },
  version: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.5,
  },
  link: {
    marginTop: 30,
    paddingVertical: 15,
  },
});