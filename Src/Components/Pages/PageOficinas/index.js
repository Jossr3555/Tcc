import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, Pressable, ScrollView } from 'react-native';
import { getFirestore, collection, onSnapshot, doc, updateDoc, getDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { db } from '../../DataBase/DataLauncher';
import { Dialog, Portal, Button } from 'react-native-paper';
import { PersonUser } from '../PageLogin';

export default function OficinasScrean() {
    const [oficinas, setOficinas] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [oficinaSelecionada, setOficinaSelecionada] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [userData, setUserData] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const oficinasCollection = collection(db, 'Oficinas');
        const unsubscribe = onSnapshot(oficinasCollection, (querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
                const oficina = { ...doc.data(), id: doc.id };
                if (oficina.AnoDisponivel === PersonUser.ano) {
                    list.push(oficina);
                }
            });
            setOficinas(list);
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

    async function inscreverOficina(oficinaId, nomeOficina) {
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

            if (userDataAtual.oficinasInscrito?.includes(nomeOficina) || userDataAtual.oficinasEspera?.includes(nomeOficina)) {
                setDialogMessage("Você já está inscrito ou na fila de espera desta oficina.");
                setDialogVisible(true);
                return;
            }

            const oficinaRef = doc(db, "Oficinas", oficinaId);
            const oficinaSnap = await getDoc(oficinaRef);

            if (!oficinaSnap.exists()) {
                setDialogMessage("Oficina não encontrada.");
                setDialogVisible(true);
                return;
            }

            const oficinaData = oficinaSnap.data();

            if (oficinaData.Vagas > 0) {
                await updateDoc(userRef, {
                    oficinasInscrito: arrayUnion(nomeOficina)
                });
                await updateDoc(oficinaRef, {
                    Vagas: oficinaData.Vagas - 1,
                    inscritos: arrayUnion(user.uid)
                });

                setUserData({
                    ...userDataAtual,
                    oficinasInscrito: [...(userDataAtual.oficinasInscrito || []), nomeOficina]
                });

                setDialogMessage(`Você se inscreveu em ${nomeOficina}`);
            } else {
                await updateDoc(userRef, {
                    oficinasEspera: arrayUnion(nomeOficina)
                });
                await updateDoc(oficinaRef, {
                    filaEspera: arrayUnion(user.uid)
                });

                setUserData({
                    ...userDataAtual,
                    oficinasEspera: [...(userDataAtual.oficinasEspera || []), nomeOficina]
                });

                setDialogMessage(`As vagas estão cheias. Você foi colocado na fila de espera para ${nomeOficina}`);
            }
            setDialogVisible(true);
        } catch (error) {
            console.error("Erro ao se inscrever na oficina:", error);
            setDialogMessage("Erro ao tentar se inscrever.");
            setDialogVisible(true);
        }
    }

    async function removerDaFilaDeEspera(oficinaId, nomeOficina) {
        try {
            const user = auth.currentUser;
            if (!user) {
                setDialogMessage("Usuário não autenticado.");
                setDialogVisible(true);
                return;
            }

            const userRef = doc(db, "usuarios", user.uid);
            const oficinaRef = doc(db, "Oficinas", oficinaId);

            await updateDoc(userRef, {
                oficinasEspera: arrayRemove(nomeOficina)
            });
            await updateDoc(oficinaRef, {
                filaEspera: arrayRemove(user.uid)
            });

            setUserData({
                ...userData,
                oficinasEspera: (userData?.oficinasEspera || []).filter(e => e !== nomeOficina)
            });

            setDialogMessage(`Você foi removido da fila de espera de ${nomeOficina}`);
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
        const jaInscrito = userData?.oficinasInscrito?.includes(item.Nome);

        if (jaInscrito) {
            return <Button disabled textColor="#008000">Inscrito</Button>;
        }

        if (item.Vagas > 0) {
            return (
                <Button textColor="#010222" onPress={() => inscreverOficina(item.id, item.Nome)}>
                    Inscrever-se
                </Button>
            );
        } else if (naFilaDeEspera) {
            return (
                <Button textColor="#FF0000" onPress={() => removerDaFilaDeEspera(item.id, item.Nome)}>
                    Remover da Fila ({item.filaEspera?.length || 0})
                </Button>
            );
        } else {
            return (
                <Button textColor="#010222" onPress={() => inscreverOficina(item.id, item.Nome)}>
                    Fila de Espera ({item.filaEspera?.length || 0})
                </Button>
            );
        }
    };

    const pluralize = (count, singular, plural) => count === 1 ? singular : plural;

    return (
        <View style={styles.container}>
            <FlatList
                data={oficinas}
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
                                setOficinaSelecionada(item);
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
                        {oficinaSelecionada && (
                            <>
                                <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
                                    <Text style={styles.title}>{oficinaSelecionada.Nome}</Text>
                                    <Text>Descrição:<Text style={styles.info}> {oficinaSelecionada.descricao}</Text></Text>
                                    <Text>Professor:<Text style={styles.info}> {oficinaSelecionada.supervisor}</Text></Text>
                                    <Text>Categoria:<Text style={styles.info}> {oficinaSelecionada.Categoria}</Text></Text>
                                    <Text>Dia:<Text style={styles.info}> {oficinaSelecionada.DiaSemanal}</Text></Text>
                                    <Text>Horário:<Text style={styles.info}> {oficinaSelecionada.HorarioInicio} - {oficinaSelecionada.HorarioFim}</Text></Text>
                                    <Text>Vagas:<Text style={styles.info}> {oficinaSelecionada.Vagas}</Text></Text>
                                    {oficinaSelecionada.Vagas <= 0 && oficinaSelecionada.filaEspera?.length > 0 && (
                                        <Text style={styles.info}>
                                            <Text style={{ color: '#000' }}>Fila de Espera: </Text>
                                            {oficinaSelecionada.filaEspera.length} {pluralize(oficinaSelecionada.filaEspera.length, 'aluno(a)', 'alunos(as)')}
                                        </Text>
                                    )}
                                </ScrollView>
                                <View style={styles.modalButtons}>
                                    <Button textColor="#010222" onPress={() => setModalVisible(false)}>Fechar</Button>
                                    {renderSubscribeButton(oficinaSelecionada)}
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        width: '85%',
        maxHeight: '80%',
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
    detailsButton: {
        backgroundColor: '#003366',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        padding: 10,
        marginTop: 10,
        alignSelf: 'center',
        width: '60%',
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
        marginTop: 15,
    },
});
