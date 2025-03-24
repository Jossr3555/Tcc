import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper'; // ✅ Importando o Provider

// Importação das telas 
import WelcomeScreen from '../Pages/PageWelcome/index';
import LoginScreen from '../Pages/PageLogin/index';
import HomeScreen from '../Pages/PageHome';
import WarningsScream from '../Pages/PageWarnings'; // Corrigido para começar com maiúscula
import ElectivsScream from '../Pages/PageElectivs';
import PageEnrollment from '../Pages/PageInscricoes';

// Criando o Stack Navigator
const Stack = createStackNavigator();

export default function StackNavegator() {
    return (
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='LoginScreen'>

                    <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />

                    <Stack.Screen 
                        name="Avisos" 
                        component={WarningsScream} // Agora está correto
                        options={{ 
                            headerShown: true, 
                            headerTitleAlign: 'center',
                        }} 
                    />

                    <Stack.Screen 
                        name="Eletivas" 
                        component={ElectivsScream} 
                        options={{ 
                            headerShown: true, 
                            headerTitleAlign: 'center',
                        }} 
                    />

                    <Stack.Screen 
                        name="Inscrições" 
                        component={PageEnrollment} 
                        options={{ 
                            headerShown: true, 
                            headerTitleAlign: 'center',
                        }} 
                    />

                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}
