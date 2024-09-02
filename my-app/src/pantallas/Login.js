import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const Login = ({ route, navigation }) => {
  const { nombre: regNombre, apellido: regApellido, usuario: regUsuario, contraseña: regContraseña } = route.params || {};

  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (usuario === regUsuario && contraseña === regContraseña) {
      navigation.navigate('Inicio', { nombre: regNombre, apellido: regApellido });
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Usuario"
        value={usuario}
        onChangeText={setUsuario}
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        value={contraseña}
        onChangeText={setContraseña}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button style={styles.boton} title="Iniciar sesión" onPress={handleLogin} />
      <Button title="Registrarse" onPress={() => navigation.navigate('Registro')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  error: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  boton: {
    marginBottom: 20

    // MIRAR ESTILOS
  },
});

export default Login;