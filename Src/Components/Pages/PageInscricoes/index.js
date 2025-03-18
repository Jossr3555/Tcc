import * as React from 'react';
import { View, FlatList, Text, Button, Alert } from 'react-native';
import { db } from '../../DataBase/DataLauncher';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export default function PageEnrollment() {
    const [eletivas, setEletivas] = React.useState([]);
    const auth = getAuth(); 

    // Função para buscar as eletivas inscritas do usuário
    async function buscarInscricoes() {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.log("Usuário não autenticado");
                return;
            }

            const userRef = doc(db, "usuarios", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                setEletivas(userSnap.data().eletivasinscrito || []);
            } else {
                console.log("Usuário não encontrado!");
                setEletivas([]);
            }
        } catch (error) {
            console.error("Erro ao buscar inscrições:", error);
        }
    }

    async function inscreverEletiva(nomeEletiva) {
        try {
            const user = auth.currentUser;
            if (!user) {
                Alert.alert("Erro", "Usuário não autenticado.");
                return;
            }

            const userRef = doc(db, "usuarios", user.uid);

            await updateDoc(userRef, {
                eletivasinscrito: arrayUnion(nomeEletiva)
            });

            Alert.alert("Sucesso!", `Você se inscreveu em ${nomeEletiva}`);
            buscarInscricoes(); // Atualiza a lista após a inscrição
        } catch (error) {
            console.error("Erro ao se inscrever na eletiva:", error);
        }
    }


    React.useEffect(() => {
        buscarInscricoes();
    }, []);

    return (
        <View style={{ padding: 20 }}>

            {/* Lista de eletivas inscritas */}
            <FlatList
                data={eletivas}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Text style={{ fontSize: 16, padding: 5 }}>• {item}</Text>
                )}
            />

        </View>
    );
}
