import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert, Modal, TouchableOpacity } from 'react-native';
import { getFirestore, collection, onSnapshot, doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { db } from '../../DataBase/DataLauncher';

export default function ElectivsScream() {

    const [eletivas, setEletivas] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [eletivaSelecionada, setEletivaSelecionada] = useState(null);
    const auth = getAuth();

    // Buscar eletivas em tempo real
    React.useEffect(() => {
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

    //  Função para inscrever o usuário na eletiva ou colocá-lo na fila de espera
    async function inscreverEletiva(eletivaId, nomeEletiva) {
        try {
            const user = auth.currentUser;
            if (!user) {
                Alert.alert("Erro", "Usuário não autenticado.");
                return;
            }

            const eletivaRef = doc(db, "Eletivas", eletivaId);
            const eletivaSnap = await getDoc(eletivaRef);

            if (!eletivaSnap.exists()) {
                Alert.alert("Erro", "Eletiva não encontrada.");
                return;
            }

            const eletivaData = eletivaSnap.data();
            const userRef = doc(db, "usuarios", user.uid);

            if (eletivaData.Vagas > 0) {
                // Inscreve normalmente se houver vagas
                await updateDoc(userRef, {
                    eletivasinscrito: arrayUnion(nomeEletiva)
                });

                await updateDoc(eletivaRef, {
                    Vagas: eletivaData.Vagas - 1,
                    inscritos: arrayUnion(user.uid)
                });

                Alert.alert("Sucesso!", `Você se inscreveu em ${nomeEletiva}`);
            } else {
                // Coloca na fila de espera se não houver vagas
                await updateDoc(userRef, {
                    eletivasEspera: arrayUnion(nomeEletiva)
                });

                await updateDoc(eletivaRef, {
                    filaEspera: arrayUnion(user.uid)
                });

                Alert.alert("Lista de Espera", `As vagas estão cheias. Você foi colocado na fila de espera para ${nomeEletiva}`);
            }

        } catch (error) {
            console.error("Erro ao se inscrever na eletiva:", error);
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

                        <Button 
                            title="Ver Detalhes" 
                            onPress={() => {
                                setEletivaSelecionada(item);
                                setModalVisible(true);
                            }} 
                        />
                    </View>
                )}
            />

            {/* Modal de Detalhes */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {eletivaSelecionada && (
                            <>
                                <Text style={styles.modalTitle}>{eletivaSelecionada.Nome}</Text>
                                <Text style={styles.info}>Categoria: {eletivaSelecionada.Categoria}</Text>
                                <Text style={styles.info}>Dia: {eletivaSelecionada.DiaSemanal}</Text>
                                <Text style={styles.info}>Horário: {eletivaSelecionada.HorarioInicio} - {eletivaSelecionada.HorarioFim}</Text>
                                <Text style={styles.info}>Vagas: {eletivaSelecionada.Vagas}</Text>

                                <Button 
                                    title={eletivaSelecionada.Vagas > 0 ? "Inscrever-se" : "Entrar na Fila de Espera"} 
                                    onPress={() => {
                                        inscreverEletiva(eletivaSelecionada.id, eletivaSelecionada.Nome);
                                        setModalVisible(false);
                                    }} 
                                />

                                <TouchableOpacity 
                                    style={styles.closeButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.closeText}>Fechar</Text>
                                </TouchableOpacity>
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
        backgroundColor: '#fff',
        padding: 10,
    },
    card: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    info: {
        fontSize: 14,
        color: '#333',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#ff5252',
        borderRadius: 5,
    },
    closeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

