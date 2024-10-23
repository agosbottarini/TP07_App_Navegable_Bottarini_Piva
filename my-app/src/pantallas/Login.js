import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const Login = ({ navigation }) => {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');

  const handleEntrar = async (isAdmin) => {
    try {
      const response = await fetch('http://localhost:3000/api/user/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: usuario,
          password: contraseña,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        const { token } = data;

        // Usamos el argumento isAdmin para determinar la navegación
        if (isAdmin) {
          navigation.navigate('Administrador', { nombre: usuario, token: token });
        } else {
          navigation.navigate('Inicio', { nombre: usuario, token: token });
        }

      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error en el login:', error);
      setError('Ocurrió un error al iniciar sesión.');
    }
  };

  const handleLogin = () => {
    handleEntrar(false);  // Indica que no es un administrador
  };

  const handleAdmin = () => {
    handleEntrar(true);   // Indica que es un administrador
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
      <View style={styles.boton}>
        <Button title="Iniciar sesión" onPress={handleLogin} />
      </View>

      <View style={styles.buttonContainer2}>
        <Button title="Registrarse" onPress={() => navigation.navigate('Registro')} />
      </View>

      <View style={styles.boton}>
        <Button title="Administrar" onPress={handleAdmin} />
      </View>
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
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  error: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  boton: {
    marginTop: 35,
    marginBottom: 10,
  },
});

export default Login; 
