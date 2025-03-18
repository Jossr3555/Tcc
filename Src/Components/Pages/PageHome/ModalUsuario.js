import React from 'react';
import { Modal, Portal, Text, Button } from 'react-native-paper';
import { View, StyleSheet, Pressable } from 'react-native';

const Desconectar = (navigation, hideModal) => {
  hideModal();  // Fecha o modal antes de navegar
  setTimeout(() => {
    navigation.navigate('LoginScreen');
  }, 300); // Pequeno delay para evitar conflitos
};

const CustomModal = ({ visible, hideModal, student, navigation }) => {
  return (
    <Portal>
      {visible && (
        <Pressable style={styles.overlay} onPress={hideModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Informações do Aluno</Text>
            
            <View style={styles.infoContainer}>
              <Text style={styles.modalText}>Nome: {student.name}</Text>
              <Text style={styles.modalText}>RM: {student.rm}</Text>
              <Text style={styles.modalText}>E-mail: {student.email}</Text>
            </View>
            
            <Pressable onPress={() => Desconectar(navigation, hideModal)}>
              <Text style={[styles.modalText, styles.disconnectText]}>
                Desconectar-se
              </Text>
            </Pressable>
            
            <Button buttonColor="#05083A" mode="contained" onPress={hideModal} style={styles.button}>
              Fechar
            </Button>
          </View>
        </Pressable>
      )}
    </Portal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    width: 300,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
  },
  disconnectText: {
    color: '#9E0909',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    marginTop: 10,
    borderColor: '#9E0909'
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default CustomModal;
