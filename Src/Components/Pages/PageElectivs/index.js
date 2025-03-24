import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, Pressable
} from 'react-native';
import {
    getFirestore, collection, onSnapshot, doc, updateDoc, getDoc, arrayUnion
} from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { db } from '../../DataBase/DataLauncher';
import { Dialog, Portal, Button } from 'react-native-paper';

export default function ElectivsScream() {

    const [eletivas, setEletivas] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [eletivaSelecionada, setEletivaSelecionada] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const auth = getAuth();

    useEffect(() => {
        const eletivsCollection = collection(db, 'Eletivas');
        const unsubscribe = onSnapshot(eletivsCollection, (querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
                list.push({ ...doc.data(), id: doc.id });
            });
            setEletivas(list);
        });
        return () => unsubscribe();
    }, []);

    async function inscreverEletiva(eletivaId, nomeEletiva) {
        try {
            const user = auth.currentUser;
            if (!user) {
                setDialogMessage("Usuário não autenticado.");
                setDialogVisible(true);
                return;
            }

            const userRef = doc(db, "usuarios", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                setDialogMessage("Usuário não encontrado.");
                setDialogVisible(true);
                return;
            }

            const userData = userSnap.data();
            if (userData.eletivasinscrito?.includes(nomeEletiva)) {
                setDialogMessage("Você já está inscrito nesta eletiva.");
                setDialogVisible(true);
                return;
            }

            const eletivaRef = doc(db, "Eletivas", eletivaId);
            const eletivaSnap = await getDoc(eletivaRef);

            if (!eletivaSnap.exists()) {
                setDialogMessage("Eletiva não encontrada.");
                setDialogVisible(true);
                return;
            }

            const eletivaData = eletivaSnap.data();

            if (eletivaData.Vagas > 0) {
                await updateDoc(userRef, {
                    eletivasinscrito: arrayUnion(nomeEletiva)
                });
                await updateDoc(eletivaRef, {
                    Vagas: eletivaData.Vagas - 1,
                    inscritos: arrayUnion(user.uid)
                });
                setDialogMessage(`Você se inscreveu em ${nomeEletiva}`);
            } else {
                await updateDoc(userRef, {
                    eletivasEspera: arrayUnion(nomeEletiva)
                });
                await updateDoc(eletivaRef, {
                    filaEspera: arrayUnion(user.uid)
                });
                setDialogMessage(`As vagas estão cheias. Você foi colocado na fila de espera para ${nomeEletiva}`);
            }
            setDialogVisible(true);
        } catch (error) {
            console.error("Erro ao se inscrever na eletiva:", error);
            setDialogMessage("Erro ao tentar se inscrever.");
            setDialogVisible(true);
        }
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={eletivas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.Nome}</Text>
                        <Text style={styles.info}>Categoria: {item.Categoria}</Text>
                        <Text style={styles.info}>Dia: {item.DiaSemanal}</Text>
                        <Text style={styles.info}>Horário: {item.HorarioInicio} - {item.HorarioFim}</Text>
                        <Text style={styles.info}>Vagas: {item.Vagas}</Text>

                        <Pressable
                            onPress={() => {
                                setEletivaSelecionada(item);
                                setModalVisible(true);
                            }}
                            style={styles.detailsButton}
                        >
                            <Text style={styles.buttonText}>Detalhes</Text>
                        </Pressable>
                    </View>
                )}
            />

            <Portal>
                <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                    <Dialog.Content>
                        <Text>{dialogMessage}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogVisible(false)}>OK</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {eletivaSelecionada && (
                            <>
                                <Text style={styles.title}>{eletivaSelecionada.Nome}</Text>
                                <Text style={styles.info}>Descrição: {eletivaSelecionada.Descricao}</Text>
                                <Text style={styles.info}>Professor: {eletivaSelecionada.Professor}</Text>
                                <Text style={styles.info}>Categoria: {eletivaSelecionada.Categoria}</Text>
                                <Text style={styles.info}>Dia: {eletivaSelecionada.DiaSemanal}</Text>
                                <Text style={styles.info}>Horário: {eletivaSelecionada.HorarioInicio} - {eletivaSelecionada.HorarioFim}</Text>
                                <Text style={styles.info}>Vagas: {eletivaSelecionada.Vagas}</Text>
                                <View style={styles.modalButtons}>
                                    <Button textColor="#010222"  onPress={() => setModalVisible(false)}>Fechar</Button>
                                    <Button 
                                        textColor="#010222"
                                        onPress={() => {
                                            if (eletivaSelecionada) {
                                                inscreverEletiva(eletivaSelecionada.id, eletivaSelecionada.Nome);
                                                setModalVisible(false);
                                            }
                                    }}>Inscrever-se</Button>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        padding: 15,
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
        borderLeftWidth: 5,
        borderLeftColor: '#FFD700',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#003366',
        marginBottom: 5,
    },
    info: {
        fontSize: 14,
        color: '#444',
        marginBottom: 3,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    detailsButton: {
        backgroundColor: '#003366',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        padding: 10,
        marginTop: 10, // Adicionei marginTop para separar o botão dos textos
        alignSelf: 'center', // Centraliza o botão
        width: '60%' // Defina uma largura para o botão
    },
    subscribeButton: {
        backgroundColor: '#4CAF50', // Cor verde para o botão de inscrever
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        padding: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
});