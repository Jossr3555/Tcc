import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { BottomNavigation, Provider as PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BackHandler } from 'react-native'; // Importar o BackHandler

import CustomModal from './ModalUsuario';
import { PersonUser } from '../PageLogin';
import PageEnrollment from '../PageInscricoes';
import TimeGradeScreen from '../PageTimeGrade';

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

  useEffect(() => {
    // Quando o componente for montado, adicionar o listener para o botão de voltar
    const backAction = () => {
      // Retorna true para bloquear o comportamento de voltar
      return true;
    };

    // Adiciona o listener ao back button
    BackHandler.addEventListener("hardwareBackPress", backAction);

    // Limpa o listener quando o componente for desmontado
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, []);

  return (
    <View style={styles.screenContainer}>
      <CustomModal visible={visibleModal} hideModal={() => setVisibleModal(false)} student={student} navigation={navigation} />

      <View style={styles.header}>
        <Pressable style={styles.avatarContainer} onPress={() => setVisibleModal(true)}>
          <View style={styles.avatarWrapper}>
            {(() => {
              if (currentUser.ano == 2) {
                return <Image source={require('./Alunos/f.jpeg')} style={styles.avatar} />;
              } else if (currentUser.ano == 3) {
                return <Image source={require('./Alunos/m.jpeg')} style={styles.avatar} />;
              } else {
                return null; // Ou outro conteúdo
              }
            })()}
          </View>
        </Pressable>
        <Text style={styles.username}>Bem-vindo, {student.PrimeyName}</Text>
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

const InscricoesRoute = () => <PageEnrollment />;
const NotificacoesRoute = () => <TimeGradeScreen />;

function MainApp({ navigation }) {
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'inicio', title: 'Início', icon: 'home' },
    { key: 'inscricoes', title: 'Inscrições', icon: 'book-open-blank-variant' },
    { key: 'notificacoes', title: 'Grade Horária', icon: 'bell-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    inicio: () => <InicioRoute navigation={navigation} />,
    inscricoes: InscricoesRoute,
    notificacoes: NotificacoesRoute,
  });

  const renderIcon = ({ route, focused, color }) => (
    <MaterialCommunityIcons name={route.icon} color={color} size={24} />
  );

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      renderIcon={renderIcon} 
      activeColor="#0047AB"
      inactiveColor="#A5A5A5"
      barStyle={{ backgroundColor: '#f5f5f5', height: 70}}
      labelStyle={{ fontSize: 16, fontWeight: 'bold'}}
      sceneAnimationType="shifting"
    />
  );
}

export default function AppWrapper({ navigation }) {
  return (
    <PaperProvider them="Light">
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
    backgroundColor: '#010222',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  avatarContainer: {
    borderRadius: 26,
  },
  avatarWrapper: {
    width: 48,
    height: 48,
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
  }
});
