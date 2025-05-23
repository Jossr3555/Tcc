import React, { useState } from 'react';
import { Portal, Text, Button, Dialog } from 'react-native-paper';
import { View, StyleSheet, Pressable } from 'react-native';

const Desconectar = (navigation, hideModal) => {
  hideModal();
  setTimeout(() => {
    navigation.navigate('LoginScreen');
  }, 300);
};

const CustomModal = ({ visible, hideModal, student, navigation }) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <Portal>
      {visible && (
        <Pressable style={styles.overlay} onPress={hideModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Informações do Aluno</Text>

            <View style={styles.infoContainer}>
              <Text style={styles.modalText}><Text style={styles.label}>Nome:</Text> {student.name}</Text>
              <Text style={styles.modalText}><Text style={styles.label}>RM:</Text> {student.rm}</Text>
              <Text style={styles.modalText}><Text style={styles.label}>E-mail:</Text> {student.email}</Text>
              <Text style={styles.modalText}><Text style={styles.label}>Ano Letivo:</Text> {student.ano}° Ano</Text>
            </View>

            <Button
              mode="outlined"
              textColor="#9E0909"
              style={styles.disconnectButton}
              onPress={() => setShowDialog(true)}
            >
              Desconectar-se
            </Button>

            <Button
              buttonColor="#05083A"
              textColor="#fff"
              mode="contained"
              onPress={hideModal}
              style={styles.closeButton}
            >
              Fechar
            </Button>
          </View>
        </Pressable>
      )}

      {/* Dialog de confirmação */}
      <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
        <Dialog.Title>Confirmar saída</Dialog.Title>
        <Dialog.Content>
          <Text>Tem certeza que deseja sair da conta?</Text>
        </Dialog.Content>
        <Dialog.Actions>
        <Button onPress={() => setShowDialog(false)}>Cancelar</Button>
        <Button
          onPress={() => {
            setShowDialog(false);       // Fecha o Dialog
            hideModal();                // Fecha o Modal principal
            setTimeout(() => {
        navigation.goBack();
      }, 300);
    }}
  >
    Sim, sair
  </Button>
</Dialog.Actions>
      </Dialog>
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
    backgroundColor: '#fff',
    padding: 24,
    width: 320,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#05083A',
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 20,
    alignSelf: 'stretch',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    color: '#05083A',
  },
  disconnectButton: {
    borderColor: '#9E0909',
    borderWidth: 1.2,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
  },
  closeButton: {
    borderRadius: 8,
    width: '100%',
  },
});

export default CustomModal;
