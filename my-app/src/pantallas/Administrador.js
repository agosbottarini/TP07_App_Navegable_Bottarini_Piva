import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const Administrador = ({route, navigation }) => {
  const { nombre, apellido, token } = route.params;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('EdicionEventos', { nombre: nombre, token: token })}
      >
        <Text style={styles.cardTitle}>Eventos Disponibles</Text>
        <Text style={styles.cardDescription}>
          Administra y edita los detalles de los eventos existentes.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('EventosHistoricos')}
      >
        <Text style={styles.cardTitle}>Eventos Historicos</Text>
        <Text style={styles.cardDescription}>
          Gestiona la lista de eventos pasados.
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 40,
    marginVertical: 10,
    width: '100%',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: '#6c757d',
  },
});

export default Administrador;
