import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Inicio = ({ route }) => {
  const { nombre, apellido } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido {nombre} {apellido}</Text>
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
    textAlign: 'center',
  },
});

export default Inicio;
