import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const Inicio = ({ route, navigation }) => {
  const { nombre, apellido, token } = route.params;
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

  // Hace que se refresque la pagina cada vez que se vuelva a ella 
  //(se actualizan los participantes de los eventos sin actualizar la pagina)
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleEventPress = (evento) => {
    navigation.navigate('Inscripcion', { evento, token });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <Text style={styles.title}>Bienvenido/a {nombre} {apellido}</Text>

      <View style={styles.buttonContainer}>
        <Button title="+" onPress={() => navigation.navigate('NuevoEvento', { token: token, nombre: nombre})} />
      </View>


      {events.map((item, index) => (
        <TouchableOpacity key={index} style={styles.eventContainer} onPress={() => handleEventPress(item)}>
          <Text style={styles.eventName}>Nombre: {item.name}</Text>
          <Text style={styles.eventDescription}>Descripción: {item.description}</Text>
          <Text style={styles.eventDescription}>Participantes: {item.participantes} / {item.max_assistance}</Text>
          
          {item.participantes >= item.max_assistance && (
            <Text style={styles.eventFull}>Lugares llenos</Text>
          )}
        </TouchableOpacity>
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
  eventFull: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
    alignSelf: 'center',
    width: '80%',
  },  
});

export default Inicio;
