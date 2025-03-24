import { PersonUser } from '../PageLogin';
import * as React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'; // Feather Icons
import CustomModal from './ModalUsuario';
import { Button } from 'react-native-paper';

// Defina as cores da Objetivo Sorocaba (substitua com as cores reais)
const primaryColor = '#010222'; // Cor primária (azul escuro)
const secondaryColor = '#007bff'; // *** VERIFIQUE ESTA COR *** - Substitua pela cor desejada
const textColorPrimary = '#fff';
const textColorSecondary = primaryColor;

export default function HomeScreen({ navigation }) {
    const [visibleModal, setVisibleModal] = React.useState(false);

    const student = {
        name: PersonUser.name || 'Aluno Desconhecido',
        rm: PersonUser.rm || '000000',
        email: PersonUser.email || 'abcd@gmail.com'
    };

    return (
        <View style={styles.container}>
            {/* Modal */}
            <CustomModal visible={visibleModal} hideModal={() => setVisibleModal(false)} student={student} navigation={navigation} />

            {/* Cabeçalho */}
            <View style={[styles.header, { backgroundColor: primaryColor }]}>
                <View>
                    <Pressable style={styles.avatarContainer} onPress={() => setVisibleModal(true)}>
                        <View style={styles.avatarWrapper}>
                            <Image source={require('../../../Assets/Aluno.webp')} style={styles.avatar} />
                        </View>
                    </Pressable>
                    <Text style={[styles.username, { color: textColorPrimary }]}>Seja bem-vindo, {student.name}</Text>
                </View>

                <View style={styles.flexSpacer} />

                <View style={styles.iconContainer}>
                    <Pressable onPress={() => navigation.navigate('Avisos')}>
                        <Feather name="bell" size={26} color={textColorPrimary} />
                    </Pressable>
                </View>
            </View>

            {/* Conteúdo principal */}
            <View style={styles.content}>
                <Button
                    icon="book"
                    mode="contained"
                    onPress={() => navigation.navigate('Eletivas')}
                    contentStyle={styles.buttonContent}
                    style={[styles.primaryButton, { backgroundColor: secondaryColor }]}
                    labelStyle={{ color: textColorPrimary, fontWeight: 'bold' }}
                >
                    Eletivas
                </Button>

                <Pressable style={styles.cardButton} onPress={() => navigation.navigate('Inscrições')}>
                    <Text style={[styles.cardButtonText, { color: textColorSecondary }]}>Inscrições</Text>
                    {/* Adicione um possível ícone aqui, como um calendário ou checkmark */}
                </Pressable>

                <View style={styles.shadowOverlay} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flex: 1.5,
        flexDirection: "row",
        alignItems: "flex-start",
        paddingHorizontal: 15,
        paddingTop: 22,
    },
    avatarWrapper: {
        width: 52,
        height: 52,
        borderRadius: 26,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'cover',
    },
    username: {
        fontSize: 16,
        marginTop: 25,
        textAlign: "center",
        fontWeight: 'bold',
    },
    flexSpacer: {
        flex: 1,
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
    },
    content: {
        flex: 8.5, // Ajustei o flex para compensar a remoção de um elemento
        backgroundColor: "#fff",
        position: "relative",
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20, // Aumentei um pouco o gap
        paddingHorizontal: 20, // Adicionei um pouco de padding horizontal
    },
    avatarContainer: {
        borderRadius: 25,
    },
    shadowOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 0,
        backgroundColor: "rgb(255, 255, 255)",
    },
    linkText: {
        fontSize: 16,
        color: "#010222",
        fontWeight: "bold",
    },
    primaryButton: {
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        elevation: 3, // Adiciona uma pequena sombra
        minWidth: '80%',
    },
    buttonContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardButton: {
        backgroundColor: '#f0f0f0', // Cor de fundo clara para o card
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        elevation: 2,
        minWidth: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    cardButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});