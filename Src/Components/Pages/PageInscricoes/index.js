import { query, where, getDocs } from "firebase/firestore"; // Importe as funções necessárias
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, Pressable
} from 'react-native';
import {
    getFirestore, collection, onSnapshot, doc, updateDoc, getDoc, arrayRemove
} from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { db } from '../../DataBase/DataLauncher';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Ou outra biblioteca de ícones

export default function PageEnrollment() {
    const [eletivasInscritas, setEletivasInscritas] = useState([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [eletivaToRemove, setEletivaToRemove] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "usuarios", auth.currentUser?.uid), (docSnap) => {
            if (docSnap.exists()) {
                setEletivasInscritas(docSnap.data().eletivasinscrito || []);
            } else {
                console.log("Usuário não encontrado!");
                setEletivasInscritas([]);
            }
        }, (error) => {
            console.error("Erro ao buscar inscrições:", error);
        });

        return () => unsubscribe();
    }, [auth.currentUser?.uid]);

    async function desinscreverEletiva(nomeEletiva) {
        if (!nomeEletiva) return;
        setLoading(true);
        try {
            const user = auth.currentUser;
            if (!user) {
                setDialogMessage("Usuário não autenticado.");
                setDialogVisible(true);
                return;
            }

            const userRef = doc(db, "usuarios", user.uid);

            await updateDoc(userRef, {
                eletivasinscrito: arrayRemove(nomeEletiva)
            });

            // Aumentar a vaga na coleção de Eletivas
            const eletivasQuery = collection(db, 'Eletivas');
            const q = query(eletivasQuery, where('Nome', '==', nomeEletiva));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (eletivaDoc) => {
                    const eletivaData = eletivaDoc.data();
                    if (eletivaData) {
                        await updateDoc(eletivaDoc.ref, {
                            Vagas: eletivaData.Vagas + 1,
                            inscritos: arrayRemove(user.uid)
                        });
                    }
                });
            }

            setDialogMessage(`Você se desinscreveu de ${nomeEletiva}`);
            setVisibleModal(false);
            setDialogVisible(true);
        } catch (error) {
            console.error("Erro ao se desinscrever da eletiva:", error);
            setDialogMessage("Não foi possível se desinscrever.");
            setDialogVisible(true);
        } finally {
            setLoading(false);
        }
    }

    const showModal = (nomeEletiva) => {
        setEletivaToRemove(nomeEletiva);
        setVisibleModal(true);
    };

    const hideModal = () => setVisibleModal(false);

    return (
        <View style={styles.container}>
            <FlatList
                data={eletivasInscritas}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.eletivaText}>{item}</Text>
                        <TouchableOpacity onPress={() => showModal(item)} style={styles.deleteButton}>
                            <Icon name="delete" size={24} color="gray" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <Modal
                visible={visibleModal}
                transparent={true}
                onRequestClose={hideModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirmar Desinscrição</Text>
                        <Text style={styles.modalParagraph}>Deseja realmente se desinscrever de <Text style={{ fontWeight: 'bold' }}>{eletivaToRemove}</Text>?</Text>
                        <View style={styles.modalButtons}>
                            <Button onPress={hideModal}>Cancelar</Button>
                            <Button onPress={() => desinscreverEletiva(eletivaToRemove)} loading={loading}>Confirmar</Button>
                        </View>
                    </View>
                </View>
            </Modal>

            {dialogVisible && (
                <Modal
                    visible={dialogVisible}
                    transparent={true}
                    onRequestClose={() => setDialogVisible(false)}
                >
                    <View style={styles.dialogContainer}>
                        <View style={styles.dialogContent}>
                            <Text style={styles.dialogMessage}>{dialogMessage}</Text>
                            <Button onPress={() => setDialogVisible(false)}>OK</Button>
                        </View>
                    </View>
                </Modal>
            )}
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
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
        borderLeftWidth: 5,
        borderLeftColor: '#003366',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    eletivaText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
        flexShrink: 1,
    },
    deleteButton: {
        padding: 8,
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
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#003366',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalParagraph: {
        fontSize: 16,
        color: '#444',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    dialogContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dialogContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    dialogMessage: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
});