import React from 'react';
import { StyleSheet, View, Text, Pressable, SafeAreaView } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Logo com animação */}
      <View style={styles.containerLogo}>
        <Animatable.Image
          animation="flipInY"
          source={require('../../../Assets/Objetivo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Animatable.View
        delay={600}
        animation="fadeInUp"
        style={styles.containerForm}>
        <Animatable.Text 
          delay={1000}
          animation="pulse"
          style={styles.title}>
          A sua jornada começa por você!
        </Animatable.Text>

        <View style={styles.textContainer}>
          <Text style={styles.text}>Seja o </Text>
          <Animatable.Text 
            delay={1000}
            animation="pulse"
            style={styles.textHighlight}>
            autor
          </Animatable.Text>
          <Text style={styles.text}> da sua própria história!</Text>
        </View>

        {/* Botão de iniciar */}
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('LoginScreen')}
          accessibilityLabel="Iniciar navegação para a tela inicial"
          accessible={true}>
          <Text style={styles.buttonText}>Iniciar</Text>
        </Pressable>

      </Animatable.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  containerLogo: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '5%',
    borderRadius: 30
  },
  logo: {
    width: '80%',
    maxHeight: 220, // Limite de altura ajustado
  },
  containerForm: {
    flex: 2,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: '5%',
    paddingVertical: '5%',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 23, // Tamanho mantido
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  textContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  text: {
    color: '#444444',
    fontSize: 16,
  },
  textHighlight: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4A90E2',
  },
  button: {
    backgroundColor: '#010222',
    borderRadius: 25,
    paddingVertical: 14, // Botão mais alto para melhor toque
    paddingHorizontal: 40, // Botão mais largo
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    width: 200,
    textAlign: 'center',
    alignItems: 'center',
    height: 45,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});
