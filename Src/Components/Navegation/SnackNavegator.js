import React, { useEffect, useState } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { ToastProvider } from 'react-native-toast-notifications';

// Importação das telas
import WelcomeScreen from '../Pages/PageWelcome/index';
import LoginScreen from '../Pages/PageLogin/index';
import HomeScreen from '../Pages/PageHome';
import WarningsScream from '../Pages/PageWarnings';
import ElectivsScream from '../Pages/PageElectivs';
import PageEnrollment from '../Pages/PageInscricoes';
import PlanoesScrean from '../Pages/PagePlantoes';
import TimeGradeScreen from '../Pages/PageTimeGrade';
import OficinasScrean from '../Pages/PageOficinas';

const Stack = createStackNavigator();

export default function StackNavegator() {
  return (
    <PaperProvider>
      <ToastProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='WelcomeScreen'>

            <Stack.Screen

              name="WelcomeScreen"
              component={WelcomeScreen}
              options={{ headerShown: false }}

            />
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{ headerShown: false}}
            />
            <Stack.Screen
              name="Avisos"
              component={WarningsScream}
              options={{ headerShown: true, headerTitleAlign: 'center' }}
            />
            <Stack.Screen
              name="Eletivas"
              component={ElectivsScream}
              options={{ headerShown: true, headerTitleAlign: 'center' }}
            />
            <Stack.Screen
              name="Inscrições"
              component={PageEnrollment}
              options={{
                headerShown: true,
                headerTitleAlign: 'center',
                headerTintColor: '#0047AB',
              }}
            />
            <Stack.Screen
              name="Plantões"
              component={PlanoesScrean}
              options={{ headerShown: true, headerTitleAlign: 'center' }}
            />
            <Stack.Screen
              name="Grade Horaria"
              component={TimeGradeScreen}
              options={{ headerShown: true, headerTitleAlign: 'center' }}
            />
            <Stack.Screen
              name="Oficinas"
              component={OficinasScrean}
              options={{ headerShown: true, headerTitleAlign: 'center' }}
            />
            
          </Stack.Navigator>
        </NavigationContainer>
      </ToastProvider>
    </PaperProvider>
  );
}
