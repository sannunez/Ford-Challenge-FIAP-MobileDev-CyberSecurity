import { StyleSheet, Text, View,  FlatList } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AppRoutes from './routes/AppRoutes';
import { CarProvider } from './context/CarProvider';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CarProvider>
        <AppRoutes/>
      </CarProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
