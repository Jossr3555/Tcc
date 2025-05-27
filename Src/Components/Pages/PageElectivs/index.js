import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, Pressable, ScrollView } from 'react-native';
import { getFirestore, collection, onSnapshot, doc, updateDoc, getDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { db } from '../../DataBase/DataLauncher';
import { Dialog, Portal, Button } from 'react-native-paper';
import { PersonUser } from '../PageLogin';
import { styles } from './style';

export default function ElectivsScream() {
    const [eletivas, setEletivas] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [eletivaSelecionada, setEletivaSelecionada] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [userData, setUserData] = useState(null);
    const auth = getAuth();
    
    useEffect(() => {
        const eletivsCollection = collection(db, 'Eletivas');
        const unsubscribe = onSnapshot(eletivsCollection, (querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
                const eletiva = { ...doc.data(), id: doc.id };
                if (eletiva.AnoDisponivel === PersonUser.ano) {
                    list.push(eletiva);
                }
            });
            setEletivas(list);
        });

        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, "usuarios", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUserData(userSnap.data());
                }
            }
        };

        fetchUserData();

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

            const userDataAtual = userSnap.data();

            if (userDataAtual.eletivasinscrito?.includes(nomeEletiva) || userDataAtual.eletivasEspera?.includes(nomeEletiva)) {
                setDialogMessage("Você já está inscrito ou na fila de espera desta eletiva.");
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

                setUserData({
                    ...userDataAtual,
                    eletivasinscrito: [...(userDataAtual.eletivasinscrito || []), nomeEletiva]
                });

                setDialogMessage(`Você se inscreveu em ${nomeEletiva}`);
                setModalVisible(false); // Fecha o modal automaticamente após a inscrição
            } else {
                await updateDoc(userRef, {
                    eletivasEspera: arrayUnion(nomeEletiva)
                });
                await updateDoc(eletivaRef, {
                    filaEspera: arrayUnion(user.uid)
                });

                setUserData({
                    ...userDataAtual,
                    eletivasEspera: [...(userDataAtual.eletivasEspera || []), nomeEletiva]
                });

                setDialogMessage(`As vagas estão cheias. Você foi colocado na fila de espera para ${nomeEletiva}`);
                setModalVisible(false); // Fecha o modal automaticamente após a inscrição na fila
            }
            setDialogVisible(true);
        } catch (error) {
            console.error("Erro ao se inscrever na eletiva:", error);
            setDialogMessage("Erro ao tentar se inscrever.");
            setDialogVisible(true);
        }
    }

    async function removerDaFilaDeEspera(eletivaId, nomeEletiva) {
        try {
            const user = auth.currentUser;
            if (!user) {
                setDialogMessage("Usuário não autenticado.");
                setDialogVisible(true);
                return;
            }

            const userRef = doc(db, "usuarios", user.uid);
            const eletivaRef = doc(db, "Eletivas", eletivaId);

            await updateDoc(userRef, {
                eletivasEspera: arrayRemove(nomeEletiva)
            });
            await updateDoc(eletivaRef, {
                filaEspera: arrayRemove(user.uid)
            });

            setUserData({
                ...userData,
                eletivasEspera: (userData?.eletivasEspera || []).filter(e => e !== nomeEletiva)
            });

            setDialogMessage(`Você foi removido da fila de espera de ${nomeEletiva}`);
            setModalVisible(false); // Fecha o modal automaticamente após a remoção
            setDialogVisible(true);
        } catch (error) {
            console.error("Erro ao remover da fila de espera:", error);
            setDialogMessage("Erro ao tentar remover da fila de espera.");
            setDialogVisible(true);
        }
    }

    const renderSubscribeButton = (item) => {
        const user = auth.currentUser;
        const naFilaDeEspera = user && item.filaEspera?.includes(user.uid);
        const jaInscrito = userData?.eletivasinscrito?.includes(item.Nome);

        if (jaInscrito) {
            return (
                <Button disabled textColor="#008000">
                    Inscrito
                </Button>
            );
        }

        if (item.Vagas > 0) {
            return (
                <Button textColor="#010222" onPress={() => inscreverEletiva(item.id, item.Nome)}>
                    Inscrever-se
                </Button>
            );
        } else if (naFilaDeEspera) {
            return (
                <Button textColor="#FF0000" onPress={() => removerDaFilaDeEspera(item.id, item.Nome)}>
                    Remover da Fila ({item.filaEspera.length})
                </Button>
            );
        } else {
            return (
                <Button textColor="#010222" onPress={() => inscreverEletiva(item.id, item.Nome)}>
                    Fila de Espera ({item.filaEspera?.length || 0})
                </Button>
            );
        }
    };

    const pluralize = (count, singular, plural) => {
        return count === 1 ? singular : plural;
    };

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
                        <Text style={styles.info}>
                            {item.Vagas > 0 ? `Vagas: ${item.Vagas}` : `Fila de Espera (${item.filaEspera?.length || 0})`}
                        </Text>

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
                        <Button 
                            onPress={() => setDialogVisible(false)} 
                            textColor="#ADD8E6"  // Azul claro para o botão
                            style={styles.dialogButton}
                        >
                            OK
                        </Button>
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
                                <ScrollView contentContainerStyle={styles.modalScrollViewContent}>
                                    <Text style={styles.title}>{eletivaSelecionada.Nome}</Text>
                                    <Text style={[styles.info, {marginBottom: 8}]}>Descrição: <Text style={{fontWeight: 'normal'}}>{eletivaSelecionada.Descricao}</Text></Text>
                                    <Text style={styles.info}>Professor: <Text style={{fontWeight: 'normal'}}>{eletivaSelecionada.Professor}</Text></Text>
                                    <Text style={styles.info}>Categoria: <Text style={{fontWeight: 'normal'}}>{eletivaSelecionada.Categoria}</Text></Text>
                                    <Text style={styles.info}>Dia: <Text style={{fontWeight: 'normal'}}>{eletivaSelecionada.DiaSemanal}</Text></Text>
                                    <Text style={styles.info}>Horário: <Text style={{fontWeight: 'normal'}}>{eletivaSelecionada.HorarioInicio} - {eletivaSelecionada.HorarioFim}</Text></Text>
                                    <Text style={styles.info}>Vagas: <Text style={{fontWeight: 'normal'}}>{eletivaSelecionada.Vagas}</Text></Text>
                                    {eletivaSelecionada.Vagas <= 0 && eletivaSelecionada.filaEspera?.length > 0 && (
                                        <Text style={styles.info}>
                                            <Text style={{ color: '#000' }}>Fila de Espera: </Text>
                                            {eletivaSelecionada.filaEspera.length} {pluralize(eletivaSelecionada.filaEspera.length, 'aluno(a)', 'alunos(as)')}
                                        </Text>
                                    )}
                                </ScrollView>
                                <View style={styles.modalButtons}>
                                    <Button textColor="#010222" onPress={() => setModalVisible(false)}>Fechar</Button>
                                    {renderSubscribeButton(eletivaSelecionada)}
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}