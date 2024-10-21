import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/pantallas/Login';
import Registro from './src/pantallas/Registro';
import Inicio from './src/pantallas/Inicio';
import NuevoEvento from './src/pantallas/NuevoEvento';
import Inscripcion from './src/pantallas/Inscripcion';
import Administrador from './src/pantallas/Administrador';
import EdicionEventos from './src/pantallas/EdicionEventos';
import EventosHistoricos from './src/pantallas/EventosHistoricos';
import EditarEvento from './src/pantallas/EditarEvento';
import VerParticipantes from './src/pantallas/VerParticipantes';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Inicio" component={Inicio} />
        <Stack.Screen name="NuevoEvento" component={NuevoEvento} />
        <Stack.Screen name="Inscripcion" component={Inscripcion} />
        <Stack.Screen name="Administrador" component={Administrador} />
        <Stack.Screen name="EdicionEventos" component={EdicionEventos} />
        <Stack.Screen name="EventosHistoricos" component={EventosHistoricos} />
        <Stack.Screen name="EditarEvento" component={EditarEvento} />
        <Stack.Screen name="VerParticipantes" component={VerParticipantes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



