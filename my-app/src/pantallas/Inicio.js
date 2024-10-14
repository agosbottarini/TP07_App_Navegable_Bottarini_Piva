import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';

const Inicio = ({ route, navigation }) => {
  const { nombre, apellido, token } = route.params;
  const [events, setEvents] = useState([]);

  useEffect(() => {
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
          
          const eventosFuturos = data.filter(evento => new Date(evento.start_date) > new Date());
          setEvents(eventosFuturos);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } 
    };

    fetchData();
  }, []);

  const handleEventPress = (evento) => {

    navigation.navigate('Inscripcion', { evento, token });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <Text style={styles.title}>Bienvenido/a {nombre} {apellido}</Text>

      <View style={styles.buttonContainer}>
        <Button title="+" onPress={() => navigation.navigate('NuevoEvento', { token: token })} />
      </View>

      {events.map((item, index) => (
        <TouchableOpacity key={index} style={styles.eventContainer} onPress={() => handleEventPress(item)}>
          <Text style={styles.eventName}>Nombre: {item.name}</Text>
          <Text style={styles.eventDescription}>Descripcion: {item.description}</Text>
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
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
    alignSelf: 'center',
    width: '80%',
  },
});

export default Inicio;
