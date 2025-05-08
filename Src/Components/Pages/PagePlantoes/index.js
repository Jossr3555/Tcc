import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, ScrollView, Pressable } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../DataBase/DataLauncher';
import { Button, IconButton } from 'react-native-paper';
import { PersonUser } from '../PageLogin';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Cores estilizadas
const primaryColor = '#2962FF'; // Azul mais chamativo
const textColorDark = '#212121';
const textColorLight = '#757575';
const backgroundColor = '#F5F5F5';
const cardBackground = '#FFFFFF';
const cardShadow = '#9E9E9E'; // Cinza para sombreamento
const modalBackground = 'rgba(0, 0, 0, 0.8)';
const buttonCardBackground = primaryColor;
const buttonCardText = '#FFFFFF';

export default function PlantoesScreen() {
    const [plantoes, setPlantoes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [plantaoSelecionado, setPlantaoSelecionado] = useState(null);

    const fetchPlantoes = useCallback(async () => {
        try {
            const q = query(collection(db, 'Plantoes'), where('AnoDisponivel', '==', PersonUser.ano));
            const snapshot = await getDocs(q);
            const lista = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPlantoes(lista);
        } catch (error) {
            console.error("Erro ao buscar plantões:", error);
        }
    }, []);

    useEffect(() => {
        fetchPlantoes();
    }, [fetchPlantoes]);

    return (
        <View style={styles.container}>
            <FlatList
                data={plantoes}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <View style={[
                        styles.cardContainer,
                        { marginTop: index > 0 ? -10 : 0 }, // Removi a propriedade transform
                    ]}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>{item.Nome}</Text>
                            <View style={styles.cardInfo}>
                                <Icon name="calendar-month-outline" size={16} color={textColorLight} />
                                <Text style={styles.cardInfoText}>{item.DiaSemanal}</Text>
                            </View>
                            <View style={styles.cardInfo}>
                                <Icon name="clock-outline" size={16} color={textColorLight} />
                                <Text style={styles.cardInfoText}>{item.HorarioInicio} - {item.HorarioFim}</Text>
                            </View>
                            <Pressable
                                style={styles.detailsButton}
                                onPress={() => {
                                    setPlantaoSelecionado(item);
                                    setModalVisible(true);
                                }}
                            >
                                <Text style={styles.detailsButtonText}>Detalhes</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            />

            {/* Modal permanece o mesmo */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{plantaoSelecionado?.Nome}</Text>
                                <IconButton
                                    icon="close"
                                    size={30}
                                    color={textColorLight}
                                    onPress={() => setModalVisible(false)}
                                    style={styles.closeIcon}
                                />
                            </View>
                            <View style={styles.modalInfo}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Professor:</Text>
                                    <Text style={styles.infoText}>{plantaoSelecionado?.Professor}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Ano:</Text>
                                    <Text style={styles.infoText}>{plantaoSelecionado?.AnoDisponivel}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Dia:</Text>
                                    <Text style={styles.infoText}>{plantaoSelecionado?.DiaSemanal}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Horário:</Text>
                                    <Text style={styles.infoText}>{plantaoSelecionado?.HorarioInicio} - {plantaoSelecionado?.HorarioFim}</Text>
                                </View>
                                {plantaoSelecionado?.Descricao && (
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>Detalhes:</Text>
                                        <Text style={styles.infoText}>{plantaoSelecionado.Descricao}</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.modalButtonContainer}>
                                <Button
                                    mode="contained"
                                    onPress={() => setModalVisible(false)}
                                    style={styles.modalButton}
                                    labelStyle={styles.modalButtonText}
                                >
                                    Fechar
                                </Button>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: backgroundColor,
        padding: 25,
    },
    cardContainer: {
        marginBottom: 20,
    },
    card: {
        backgroundColor: cardBackground,
        borderRadius: 15,
        padding: 18, // Reduzi um pouco o padding interno
        shadowColor: cardShadow,
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 9,
        elevation: 7,
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 20, // Reduzi um pouco a fonte do título
        fontWeight: 'bold',
        color: primaryColor,
        marginBottom: 5,
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    cardInfoText: {
        fontSize: 14,
        color: textColorLight,
        marginLeft: 8,
        marginRight: 15,
    },
    cardProfessor: {
        fontSize: 16,
        color: textColorDark,
        marginBottom: 8,
    },
    cardDetails: {
        // Removi este estilo, pois agora exibimos diretamente
    },
    cardDetailText: {
        // Removi este estilo
    },
    detailIcon: {
        marginRight: 5, // Ajustei a margem do ícone
    },
    detailsButton: {
        backgroundColor: buttonCardBackground,
        borderRadius: 8,
        paddingVertical: 8, // Reduzi o padding do botão
        paddingHorizontal: 12, // Reduzi o padding do botão
        alignSelf: 'flex-start',
        marginTop: 8, // Adicionei um pouco de margem superior
    },
    detailsButtonText: {
        color: buttonCardText,
        fontSize: 14,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: modalBackground,
    },
    modalContent: {
        backgroundColor: cardBackground,
        borderRadius: 20,
        padding: 35,
        width: '90%',
        maxHeight: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.6,
        shadowRadius: 18,
        elevation: 12,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: primaryColor,
    },
    closeIcon: {
        marginRight: -15,
    },
    modalInfo: {
        marginTop: 20,
    },
    infoRow: {
        marginBottom: 18,
    },
    infoLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: textColorDark,
        marginBottom: 5,
    },
    infoText: {
        fontSize: 18,
        color: textColorLight,
    },
    modalButtonContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    modalButton: {
        borderRadius: 10,
        backgroundColor: primaryColor,
        width: '50%',
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 8,
        textAlign: 'center',
    },
});