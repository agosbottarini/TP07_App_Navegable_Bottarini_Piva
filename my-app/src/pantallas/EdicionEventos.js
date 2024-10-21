import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const EdicionEventos = ({ route, navigation }) => {
  const { token } = route.params;
  const [events, setEvents] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/event/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const data = await response.json();

        const eventosFuturos = await Promise.all(
          data
            .filter((evento) => new Date(evento.start_date) > new Date())
            .map(async (evento) => {
              const enrollmentResponse = await fetch(`http://localhost:3000/api/event/${evento.id}/enrollment/participants`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              if (enrollmentResponse.status === 200) {
                const participants = await enrollmentResponse.json();
                evento.participantes = participants.length;
              } else {
                evento.participantes = 0;
              }

              return evento;
            })
        );

        setEvents(eventosFuturos);
      }
    } catch (error) {
      console.error('Error', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleEditPress = (evento) => {
    navigation.navigate('EditarEvento', { evento, token });
  };

  const handleViewParticipantsPress = (evento) => {
    navigation.navigate('VerParticipantes', { evento, token });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <Text style={styles.title}>Administrador</Text>

      {events.map((item, index) => (
        <View key={index} style={styles.eventContainer}>
          <Text style={styles.eventName}>Nombre: {item.name}</Text>
          <Text style={styles.eventDescription}>Fecha: {new Date(item.start_date).toLocaleDateString()}</Text>
          <Text style={styles.eventDescription}>Participantes: {item.participantes}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={() => handleViewParticipantsPress(item)}>
              <Text style={styles.buttonText}>Ver Participantes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleEditPress(item)}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    height: '100vw',
    marginEnd: '1vw',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  eventContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 16,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default EdicionEventos;
