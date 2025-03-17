import React from 'react';
import { Modal, Portal, Text, Button } from 'react-native-paper';
import { View, StyleSheet, Pressable } from 'react-native';

const CustomModal = ({ visible, hideModal, student, navigation }) => {
  return (
    <Portal>
      {visible && (
        <Pressable style={styles.overlay} onPress={() => { hideModal();  }}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Informações do Aluno</Text>
            <Text style={styles.modalText}>Nome: {student.name}</Text>
            <Text style={styles.modalText}>RM: {student.rm}</Text>
            <Button buttonColor='#05083A' mode="contained" onPress={hideModal} style={styles.button}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro sem blur
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
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
  },
});

export default CustomModal;
