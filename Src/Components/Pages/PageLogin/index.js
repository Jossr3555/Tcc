import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ActivityIndicator, Linking, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { validarAcesso } from '../../DataBase/Functions/AuthUser';
import { Person } from '../../functions/Objects/pessoa';
import { PaperProvider, Dialog, Portal, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export let PersonUser = null;

export default function LoginScreen({ navigation }) {
  const [conta, setConta] = useState('');
  const [senha, setSenha] = useState('');
  const [securyt, setSecuryt] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorConta, setErrorConta] = useState(false);
  const [errorSenha, setErrorSenha] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const showDialog = (message) => {
    setDialogMessage(message);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const handleLogin = async () => {
    setErrorConta(false);
    setErrorSenha(false);
    setInvalidCredentials(false);

    if (!conta || !senha) {
      if (!conta) setErrorConta(true);
      if (!senha) setErrorSenha(true);

      showDialog('Preencha todos os campos!');
      setTimeout(() => {
        setErrorConta(false);
        setErrorSenha(false);
      }, 2000);
      return;
    }

    if (!conta.includes('@')) {
      setErrorConta(true);
      showDialog('E-mail inválido!');
      setTimeout(() => setErrorConta(false), 2000);
      return;
    }
    

    setLoading(true);
    try {
      const resultado = await validarAcesso(conta, senha);
      await AsyncStorage.setItem('@hasSeenWelcome', 'true');
    
      if (resultado.sucesso) {
        PersonUser = new Person(resultado.nome, resultado.rm, conta, resultado.ano);
        navigation.navigate('HomeScreen');
      } else {
        setInvalidCredentials(true);
        setTimeout(() => setInvalidCredentials(false), 2000);
        showDialog(resultado.mensagem);
      }
    } catch (error) {
      console.error('Erro ao validar acesso:', error);
      showDialog('Ocorreu um problema ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
    
  };

  const handleRecuperarSenha = () => {
    Linking.openURL('https://saafapp.cscedu.com.br/login/objetivosorocaba').catch(err => 
      console.error('Erro ao abrir o link:', err)
    );
  };

  return (
  <PaperProvider>
    <SafeAreaView style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={[styles.title, { color: '#333333' }]}>A sua </Text>
        <Animatable.Text delay={1000} animation="pulse" style={[styles.title, { color: '#4A90E2' }]}>jornada</Animatable.Text>
        <Text style={[styles.title, { color: '#333333' }]}> começa agora</Text>
      </Animatable.View>

      <Animatable.View delay={1000} animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.label}>E-mail</Text>
        <Animatable.View 
          animation={errorConta || invalidCredentials ? 'shake' : undefined} 
          style={[styles.inputContainer, (errorConta || invalidCredentials) && styles.inputError]}
        >
          <TextInput
            placeholder="Digite seu e-mail"
            value={conta}
            onChangeText={setConta}
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor="#999"
            autoCapitalize='none'
          />
        </Animatable.View>

        <Text style={styles.label}>Senha</Text>
        <Animatable.View 
          animation={errorSenha || invalidCredentials ? 'shake' : undefined} 
          style={[styles.inputContainer, (errorSenha || invalidCredentials) && styles.inputError]}
        >
          <TextInput
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={securyt}
            style={styles.input}
            placeholderTextColor="#999"
            autoCapitalize='none'
          />
          <Pressable onPress={() => setSecuryt(!securyt)} style={styles.iconButton}>
            <Ionicons name={securyt ? 'eye-off' : 'eye'} size={24} color="#B0C4DE" />
          </Pressable>
        </Animatable.View>

        <Pressable onPress={handleRecuperarSenha}>
          <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
        </Pressable>

        <Pressable style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.buttonText}>Conectar</Text>}
        </Pressable>
      </Animatable.View>
      <StatusBar style="light" />
    </SafeAreaView>

    <Portal>
      <Dialog visible={dialogVisible} onDismiss={hideDialog}>
        <Dialog.Title>Aviso</Dialog.Title>
        <Dialog.Content>
          <Text>{dialogMessage}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  </PaperProvider>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  containerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  containerForm: {
    backgroundColor: '#FFFFFF',
    flex: 4,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#B0C4DE',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333333',
  },
  inputError: {
    borderBottomColor: 'red',
  },
  iconButton: {
    padding: 10,
  },
  forgotPassword: {
    fontSize: 14,
    color: '#4A90E2',
    textAlign: 'right',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#010222', // Altere esta cor para a desejada
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  
  buttonDisabled: {
    backgroundColor: '#B0C4DE',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

