import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavegator from './Src/Components/Navegation/SnackNavegator';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import * as ScreenOrientation from 'expo-screen-orientation'; // Correção aqui

export default function App() {
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    // Verifica a conexão inicial
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });

    // Travamento de tela na vertical
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isConnected === false) {
    return (
      <SafeAreaProvider>
        <View style={styles.noConnectionContainer}>
          <Text style={styles.noConnectionText}>Sem conexão com a internet</Text>
          <Text style={styles.noConnectionSubtext}>Verifique sua conexão e tente novamente.</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StackNavegator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  noConnectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#23458F',
  },
  noConnectionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  noConnectionSubtext: {
    fontSize: 16,
    color: '#BBB',
    marginTop: 10,
  },
});
