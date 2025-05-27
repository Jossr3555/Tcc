import { query, where, getDocs } from "firebase/firestore";
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, SafeAreaView
} from 'react-native';
import {
    getFirestore, collection, onSnapshot, doc, updateDoc, arrayRemove
} from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { db } from '../../DataBase/DataLauncher';
import { Button, Card, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

// Lees Primary Colors
const leesPrimary = '#0047AB';
const leesSecondary = '#ADD8E6';
const leesAccent = '#FFA500';
const leesTextPrimary = '#333333';

const leesTextSecondary = '#666666';
const leesBackground = '#F5F5F5';
const leesCardBackground = '#FFFFFF';
const leesShadow = '#00000026';
    
export default function PageEnrollment() {
    const [eletivasInscritas, setEletivasInscritas] = useState([]);
    const [oficinasInscritas, setOficinasInscritas] = useState([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);
    const [tipoToRemove, setTipoToRemove] = useState("eletiva");
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [findActivitiesModalVisible, setFindActivitiesModalVisible] = useState(false);
    const auth = getAuth();
    const navigation = useNavigation();

    useEffect(() => {
        const uid = auth.currentUser?.uid;

        if (!uid) {
            console.warn("Usuário não autenticado.");
            
            return;
        }

        const unsubscribe = onSnapshot(doc(db, "usuarios", uid), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setEletivasInscritas(data.eletivasinscrito || []);
                setOficinasInscritas(data.oficinasInscrito || []);
            } else {
                console.log("Usuário não encontrado no Firestore!");
                setEletivasInscritas([]);
                setOficinasInscritas([]);
            }
        }, (error) => {
            console.error("Erro ao buscar inscrições:", error);
        });

        return () => unsubscribe();
    }, [auth.currentUser]);

    async function desinscreverItem(itemName, collectionName, arrayFieldName) {
        if (!itemName) return;
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
                [arrayFieldName]: arrayRemove(itemName)
            });

            const itemQuery = collection(db, collectionName);
            const q = query(itemQuery, where('Nome', '==', itemName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (itemDoc) => {
                    const itemData = itemDoc.data();
                    await updateDoc(itemDoc.ref, {
                        Vagas: itemData.Vagas + 1,
                        inscritos: arrayRemove(user.uid)
                    });
                });
            }

            setDialogMessage(`Você se desinscreveu de ${itemName}`);
        } catch (error) {
            console.error(`Erro ao se desinscrever de ${collectionName.slice(0, -1).toLowerCase()}:`, error);
            setDialogMessage("Não foi possível se desinscrever.");
        } finally {
            setVisibleModal(false);
            setDialogVisible(true);
            setLoading(false);
        }
    }

    const showModal = (nome, tipo) => {
        setItemToRemove(nome);
        setTipoToRemove(tipo);
        setVisibleModal(true);
    };

    const hideModal = () => setVisibleModal(false);

    const showFindActivitiesModal = () => setFindActivitiesModalVisible(true);
    const hideFindActivitiesModal = () => setFindActivitiesModalVisible(false);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={{marginTop: 8, marginBottom: 20, marginleft: 1}}>
                                        <Text style={{fontSize: 22}}>
                                            Inscrições
                                        </Text>
                                    </View>
                {eletivasInscritas.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Eletivas</Text>
                        <FlatList
                            data={eletivasInscritas}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <Card style={styles.listItem}>
                                    <Card.Content>
                                        <Text style={styles.listItemText}>{item}</Text>
                                    </Card.Content>
                                    <Card.Actions style={styles.listItemActions}>
                                        <IconButton
                                            icon="delete"
                                            color={leesAccent}
                                            size={24}
                                            onPress={() => showModal(item, 'eletiva')}
                                        />
                                    </Card.Actions>
                                </Card>
                            )}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                )}

                {oficinasInscritas.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Plantões</Text>
                        <FlatList
                            data={oficinasInscritas}
                            keyExtractor={(item, index) => `of-${index}`}
                            renderItem={({ item }) => (
                                <Card style={styles.listItem}>
                                    <Card.Content>
                                        <Text style={styles.listItemText}>{item}</Text>
                                    </Card.Content>
                                    <Card.Actions style={styles.listItemActions}>
                                        <IconButton
                                            icon="delete"
                                            color={leesAccent}
                                            size={24}
                                            onPress={() => showModal(item, 'oficina')}
                                        />
                                    </Card.Actions>
                                </Card>
                            )}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                )}

                {(eletivasInscritas.length === 0 && oficinasInscritas.length === 0) && (
                    <View style={styles.emptyContainer}>
                        <Icon name="inbox-arrow-down" size={50} color={leesTextSecondary} />
                        <Text style={styles.emptyText}>Você não está inscrito em nenhuma eletiva ou plantão.</Text>
                        <Button
                            mode="contained"
                            style={styles.enrollButton}
                            buttonColor={leesPrimary}
                            textColor={leesCardBackground}
                            onPress={showFindActivitiesModal}
                        >
                            Encontrar Atividades
                        </Button>
                    </View>
                )}

                <Modal
                    visible={visibleModal}
                    transparent={true}
                    onRequestClose={hideModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Confirmar Desinscrição</Text>
                            <Text style={styles.modalParagraph}>
                                Deseja realmente se desinscrever de <Text style={{ fontWeight: 'bold', color: leesPrimary }}>{itemToRemove}</Text>?
                            </Text>
                            <View style={styles.modalButtons}>
                                <Button onPress={hideModal} style={styles.modalButton} textColor={leesTextPrimary}>Cancelar</Button>
                                <Button
                                    onPress={() => {
                                        if (tipoToRemove === 'eletiva') {
                                            desinscreverItem(itemToRemove, 'Eletivas', 'eletivasinscrito');
                                        } else {
                                            desinscreverItem(itemToRemove, 'Oficinas', 'oficinasInscrito');
                                        }
                                    }}
                                    loading={loading}
                                    mode="contained"
                                    style={[styles.modalButton, styles.confirmButton]}
                                    buttonColor={leesAccent}
                                    textColor={leesCardBackground}
                                >
                                    Confirmar
                                </Button>
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
                                <Button onPress={() => setDialogVisible(false)} style={styles.dialogButton} textColor={leesTextPrimary}>OK</Button>
                            </View>
                        </View>
                    </Modal>
                )}

                <Modal
                    visible={findActivitiesModalVisible}
                    transparent={true}
                    onRequestClose={hideFindActivitiesModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.findActivitiesModalContent}>
                            <Text style={styles.findActivitiesModalTitle}>Onde você quer encontrar atividades?</Text>
                            <TouchableOpacity
                                style={styles.findActivitiesModalOption}
                                onPress={() => {
                                    hideFindActivitiesModal();
                                    navigation.navigate('Eletivas');
                                }}
                            >
                                <Text style={styles.findActivitiesModalOptionText}>Acessar Eletivas</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.findActivitiesModalOption}
                                onPress={() => {
                                    hideFindActivitiesModal();
                                    navigation.navigate('Oficinas');
                                }}
                            >
                                <Text style={styles.findActivitiesModalOptionText}>Acessar Oficinas</Text>
                            </TouchableOpacity>
                            <Button onPress={hideFindActivitiesModal} style={styles.modalButton} textColor={leesTextPrimary}>Cancelar</Button>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: leesBackground,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: leesPrimary,
        marginBottom: 25,
        textAlign: 'center',
        textShadowColor: leesShadow,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: leesPrimary,
        marginBottom: 12,
        textShadowColor: leesShadow,
        textShadowOffset: { width: 0.5, height: 0.5 },
        textShadowRadius: 1,
    },
    listItem: {
        backgroundColor: leesCardBackground,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 4,
        marginRight: 15,
        width: 220,
        shadowColor: leesShadow,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    listItemText: {
        fontSize: 17,
        color: leesTextPrimary,
    },
    listItemActions: {
        justifyContent: 'flex-end',
        paddingRight: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: leesCardBackground,
        padding: 30,
        borderRadius: 15,
        width: '88%',
        alignItems: 'center',
        elevation: 5,
        shadowColor: leesShadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: leesPrimary,
        marginBottom: 20,
        textShadowColor: leesShadow,
        textShadowOffset: { width: 0.5, height: 0.5 },
        textShadowRadius: 1,
    },
    modalParagraph: {
        fontSize: 17,
        color: leesTextSecondary,
        marginBottom: 30,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    modalButton: {
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    confirmButton: {
        elevation: 3,
    },
    dialogContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dialogContent: {
        backgroundColor: leesCardBackground,
        padding: 25,
        borderRadius: 12,
        width: '80%',
        alignItems: 'center',
        elevation: 3,
        shadowColor: leesShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    dialogMessage: {
        fontSize: 17,
        color: leesTextPrimary,
        marginBottom: 20,
        textAlign: 'center',
    },
    dialogButton: {
        borderRadius: 8,
        paddingHorizontal: 15,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    emptyText: {
        fontSize: 17,
        color: leesTextSecondary,
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 20,
    },
    enrollButton: {
        marginTop: 15,
        borderRadius: 10,
        elevation: 2,
    },
    findActivitiesModalContent: {
        backgroundColor: leesCardBackground,
        padding: 20, // Mais conciso
        borderRadius: 10, // Mais suave
        width: '75%', // Ligeiramente menor
        alignItems: 'center',
        elevation: 1, // Sombra bem sutil
        shadowColor: leesShadow,
        shadowOffset: { width: 0, height: 0.5 }, // Sombra bem suave
        shadowOpacity: 0.08,
        shadowRadius: 2,
        marginBottom: 10,
    },
    findActivitiesModalTitle: {
        fontSize: 17, // Ainda menor
        fontWeight: 'normal', // Menos 강조
        color: leesTextPrimary,
        marginBottom: 12,
        textAlign: 'center',
        textShadowColor: leesShadow,
        textShadowOffset: { width: 0.2, height: 0.2 },
        textShadowRadius: 0.3,
    },
    findActivitiesModalOption: {
        backgroundColor: leesCardBackground,
        borderRadius: 5, // Ainda mais suave
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 8,
        width: '90%',
        alignItems: 'center',
        borderWidth: 0.5, // Borda ainda mais sutil
        borderColor: leesSecondary,
    },
    findActivitiesModalOptionText: {
        fontSize: 15, // Tamanho da fonte menor
        color: leesTextPrimary,
        fontWeight: 'normal', // Menos 강조
    },
});