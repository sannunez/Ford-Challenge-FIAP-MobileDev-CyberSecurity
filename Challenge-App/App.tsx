import { StyleSheet, Text, View,  FlatList } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AppRoutes from './routes/AppRoutes';
import { CarProvider } from './context/CarProvider';
import { SavedCarsProvider } from './context/SavedCarsProvider';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SavedCarsProvider>
        <CarProvider>
          <AppRoutes/>
        </CarProvider>
      </SavedCarsProvider>
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
