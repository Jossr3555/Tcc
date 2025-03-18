import { PersonUser } from '../PageLogin';
import * as React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomModal from './ModalUsuario';

export default function HomeScreen({ navigation }) {
    const [visibleModal, setVisibleModal] = React.useState(false);

    const student = {
        name: PersonUser.name || 'Aluno Desconhecido',
        rm: PersonUser.rm || '000000',
        email : PersonUser.email || 'abcd@gmail.com'
    };

    return (
        <View style={styles.container}>
            {/* Modal */}
            <CustomModal visible={visibleModal} hideModal={() => setVisibleModal(false)} student={student} navigation={navigation} />

            {/* Cabeçalho */}
            <View style={styles.header}>
                <View>
                    <Pressable style={styles.avatarContainer} onPress={() => setVisibleModal(true)}>
                        <View style={styles.avatarWrapper}>
                            <Image source={require('../../../Assets/Aluno.webp')} style={styles.avatar} />
                        </View>
                    </Pressable>
                    <Text style={styles.username}>Seja bem-vindo, {student.name}</Text>
                </View>

                <View style={styles.flexSpacer} />

                <View style={styles.iconContainer}>
                    <Pressable onPress={() => navigation.navigate('Avisos')}>
                        <Icon name="bell" size={25} color="#fff" />
                    </Pressable>
                </View>
            </View>

            <View style={styles.content}>
                {/* Sombreamento na parte inferior */}

                <Pressable onPress={()=>navigation.navigate('Eletivas')}>
                    <Text>
                        Eletivas
                    </Text>
                </Pressable>
                

                <Pressable onPress={()=>navigation.navigate('inscriçoes')}>
                    <Text>
                     inscriçoes
                    </Text>
                </Pressable>


                <View style={styles.shadowOverlay} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 10,
    },
    header: {
        backgroundColor: "#010222",
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
        color: "#fff",
        fontSize: 16,
        marginTop: 25,
        textAlign: "center",
        fontWeight: 'bold'
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
        flex: 8.2,
        backgroundColor: "#fff",
        position: "relative",
    },
    avatarContainer: {
        borderRadius: 25
    },
    shadowOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 0, // Ajuste conforme necessário
        backgroundColor: "rgb(255, 255, 255)", // Cor da sombra
        
    },
});
