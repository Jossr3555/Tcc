import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper'; // ✅ Importando o Provider


//importação das telas 
import WelcomeScreen from '../Pages/PageWelcome/index';
import LoginScreen from '../Pages/PageLogin/index';
import HomeScreen from '../Pages/PageHome';
import warningsScream from '../Pages/PageWarnings';

// Criando o Stack Navigator
const Stack = createStackNavigator();

export default function StackNavegator(){
    return(
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='WelcomeScreen'>

                <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />

                <Stack.Screen 
                    name="Avisos" 
                    component={warningsScream} 
                    options={{ 
                        headerShown: true, 
                        headerStyle: { }, // Exemplo de estilo válido
                        headerTitleAlign: 'center',

                    }} 
                />


                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}