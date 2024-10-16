import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/pantallas/Login';
import Registro from './src/pantallas/Registro';
import Inicio from './src/pantallas/Inicio';
import NuevoEvento from './src/pantallas/NuevoEvento';
import Inscripcion from './src/pantallas/Inscripcion';
import Administrador from './src/pantallas/Administrador';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}


