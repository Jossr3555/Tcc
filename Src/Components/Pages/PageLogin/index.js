import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { validarAcesso } from '../../DataBase/DataLauncher';
import { Person } from '../../functions/Objects/pessoa';

// Armazena globalmente o usuário autenticado
export let PersonUser = null;

export default function LoginScreen({ navigation }) {
    const [acont, setAcont] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [securityText, setSecurityText] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    const handleLogin = async () => {
        if (!acont || !password) {
            Alert.alert("Erro", "Preencha todos os campos!");
            return;
        }

        setLoading(true);
        try {
            const resultado = await validarAcesso(acont.trim(), password);

            if (resultado.sucesso) {
                // Criando a instância de usuário autenticado
                PersonUser = new Person(resultado.nome, resultado.rm);
                
                // Redirecionando para a tela inicial
                navigation.navigate("HomeScreen");
            } else {
                Alert.alert("Erro", resultado.mensagem);
            }
        } catch (error) {
            console.error("Erro ao validar acesso:", error);
            Alert.alert("Erro", "Ocorreu um problema ao fazer login. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={["#23458F", "#0A1F50"]} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.text}>A sua jornada começa por você!</Text>

                <View style={styles.inputsContainer}>
                    {/* Campo de Usuário */}
                    <View style={styles.inputContainer}>
                        <Icon name="account-outline" size={24} color="#FFF" style={styles.icon} />
                        <TextInput
                            value={acont}
                            onChangeText={setAcont}
                            style={styles.textInput}
                            placeholder="Usuário"
                            placeholderTextColor="#BBB"
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    {/* Campo de Senha */}
                    <View style={styles.inputContainer}>
                        <Icon name="lock-outline" size={24} color="#FFF" style={styles.icon} />
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            style={styles.textInput}
                            placeholder="Senha"
                            placeholderTextColor="#BBB"
                            secureTextEntry={securityText}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={() => setSecurityText(!securityText)} style={styles.toggleButton}>
                            <Icon name={securityText ? "eye-off-outline" : "eye-outline"} size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Botão de Login */}
                    <TouchableOpacity 
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={styles.buttonText}>Entrar</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',  
        justifyContent: 'center',  
    },
    content: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingBottom: '10%',
    },
    text: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputsContainer: {
        width: '100%',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        borderWidth: 1,
        borderColor: '#F7E521',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    textInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#FFF',
        paddingHorizontal: 10,
        borderWidth: 0,
        outlineStyle: "none",
    },
    icon: {
        marginRight: 10,
    },
    toggleButton: {
        position: 'absolute',
        right: 10,
    },
    button: {
        backgroundColor: '#05083A',
        width: '55%',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 40,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonDisabled: {
        opacity: 0.6,
    }
});
