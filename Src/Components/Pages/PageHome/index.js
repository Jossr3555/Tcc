import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { BottomNavigation, Provider as PaperProvider } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
<<<<<<< HEAD
import CustomModal from './ModalUsuario';  // Se necessário
import { PersonUser } from '../PageLogin'; // Se necessário
=======
import CustomModal from './ModalUsuario';
import { PersonUser } from '../PageLogin';
import PageEnrollment from '../PageInscricoes';
import TimeGradeScreen from '../PageTimeGrade';
>>>>>>> 2023597 (meu amor)

const InicioRoute = ({ navigation }) => {
  const [visibleModal, setVisibleModal] = React.useState(false);

  const defaultUser = {
    name: 'Usuário Teste',
    rm: '000000',
    email: 'teste@email.com',
    ano: 2,
  };

  const currentUser = {
    name: PersonUser?.name ?? defaultUser.name,
    rm: PersonUser?.rm ?? defaultUser.rm,
    email: PersonUser?.email ?? defaultUser.email,
    ano: PersonUser?.ano ?? defaultUser.ano,
  };

  const PrimeyName = currentUser.name.split(/ (.+)/)[0];

  const student = {
    ...currentUser,
    PrimeyName,
  };

  return (
    <View style={styles.screenContainer}>
      <CustomModal visible={visibleModal} hideModal={() => setVisibleModal(false)} student={student} navigation={navigation} />

      <View style={styles.header}>
        <Pressable style={styles.avatarContainer} onPress={() => setVisibleModal(true)}>
          <View style={styles.avatarWrapper}>
            <Image source={require('../../../Assets/Aluno.webp')} style={styles.avatar} />
          </View>
        </Pressable>
        <Text style={styles.username}>Bem-vindo, {student.PrimeyName}</Text>

        <Pressable style={styles.bellIcon} onPress={() => navigation.navigate('Avisos')}>
          <Feather name="bell" size={26} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.form}>
        <Pressable style={styles.button} onPress={() => navigation.navigate('Plantões')}>
          <Image source={require('../../../Assets/Ico/Plantões.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Plantões</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => navigation.navigate('Avisos')}>
          <Image source={require('../../../Assets/Ico/Avisos.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Avisos</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => navigation.navigate('Eletivas')}>
          <Image source={require('../../../Assets/Ico/Eletivas.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Eletivas</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => navigation.navigate('Oficinas')}>
          <Image source={require('../../../Assets/Ico/Oficinas.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Oficinas</Text>
        </Pressable>
      </View>
    </View>
  );
};

const InscricoesRoute = () => (
<<<<<<< HEAD
  <View style={styles.centeredScreen}>
    <Text style={styles.routeText}>Minhas Inscrições</Text>
  </View>
);

const NotificacoesRoute = () => (
  <View style={styles.centeredScreen}>
    <Text style={styles.routeText}>Notificações</Text>
  </View>
);

function MainApp({ navigation }) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
=======
  <PageEnrollment/>
);

const NotificacoesRoute = () => (
  <TimeGradeScreen/>
);

function MainApp({ navigation }) {

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([

>>>>>>> 2023597 (meu amor)
    {
      key: 'inicio',
      title: 'Início',
      icon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
    },
    {
      key: 'inscricoes',
      title: 'Minhas Inscrições',
      icon: ({ color, size }) => <Icon name="book-open-blank-variant" color={color} size={size} />,
    },
    {
      key: 'notificacoes',
<<<<<<< HEAD
      title: 'Notificações',
=======
      title: 'Grade Horaría',
>>>>>>> 2023597 (meu amor)
      icon: ({ color, size }) => <Icon name="bell-outline" color={color} size={size} />,
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    inicio: () => <InicioRoute navigation={navigation} />,
    inscricoes: InscricoesRoute,
    notificacoes: NotificacoesRoute,
<<<<<<< HEAD
=======
    
>>>>>>> 2023597 (meu amor)
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor="#1E88E5"
      inactiveColor="#A5A5A5"
      barStyle={{ backgroundColor: '#f5f5f5' }}
      labelStyle={{ fontSize: 14, fontWeight: 'bold' }}
    />
  );
}

export default function AppWrapper({ navigation }) {
  return (
    <PaperProvider>
      <MainApp navigation={navigation} />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#00022F',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  avatarContainer: {
    borderRadius: 26,
  },
  avatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  username: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 15,
    flex: 1,
  },
  bellIcon: {
    marginLeft: 'auto',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#f4f4f4',
    height: 62,
    width: '80%',
    borderRadius: 6,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    width: 46,
    height: 46,
    resizeMode: 'contain',
    borderRadius: 6,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 20,
    color: '#000',
  },
  centeredScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeText: {
    fontSize: 20,
    color: '#333',
  },
});
