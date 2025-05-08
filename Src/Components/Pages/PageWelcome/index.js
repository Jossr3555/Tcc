import { View, Text, Pressable, SafeAreaView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { styles } from './styles';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Logo com animação */}
      <View style={styles.containerLogo}>
        <Animatable.Image
          animation="flipInY"
          source={require('./IconApp.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Animatable.View
        delay={600}
        animation="fadeInUp"
        style={styles.containerForm}
      >
        <Animatable.Text
          delay={1000}
          animation="pulse"
          style={styles.title}
        >
          A sua jornada começa por você!
        </Animatable.Text>

        <View style={styles.textContainer}>
          <Text style={styles.text}>Seja o </Text>
          <Animatable.Text
            delay={1000}
            animation="pulse"
            style={styles.textHighlight}
          >
            autor
          </Animatable.Text>
          <Text style={styles.text}> da sua própria história!</Text>
        </View>

        {/* Botão de iniciar */}
        <Pressable
          style={styles.button}
          onPress={()=>navigation.navigate('LoginScreen')}
          accessibilityLabel="Iniciar navegação para a tela inicial"
          accessible={true}
        >
          <Text style={styles.buttonText}>Iniciar</Text>
        </Pressable>
      </Animatable.View>
    </SafeAreaView>
  );
}


