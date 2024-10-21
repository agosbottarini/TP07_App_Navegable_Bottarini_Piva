//Arreglar el scrollview
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

const Inscripcion = ({ route, navigation }) => {
  const event = route.params.evento;
  const token = route.params.token;
  const usuario = route.params.nombre;
  const [loading, setLoading] = useState(false);
  const [inscriptionFull, setInscriptionFull] = useState(false); 

  useEffect(() => {
    const checkEventCapacity = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/event/${event.id}/enrollment/participants`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const participants = await response.json();
          console.log(participants)
          if (participants.length >= event.max_assistance) {
            setInscriptionFull(true); 
          }
        }
      } catch (error) {
        console.error('Error obteniendo la capacidad del evento:', error);
      }
    };

    checkEventCapacity();
  }, [event.id, event.max_assistance]);

  const handleInscripcion = async () => {
    setLoading(true);  
    try {
      const response = await fetch(`http://localhost:3000/api/event/${event.id}/enrollment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        navigation.navigate('Inicio', { nombre: usuario, token: token });
        Alert.alert('Éxito', 'Te has inscrito correctamente al evento');
        
      } else {
        Alert.alert('Error', 'No se pudo completar la inscripción');
      }
    } catch (error) {
      console.error('Error inscribiéndose al evento:', error);
      Alert.alert('Error', 'Ocurrió un error al intentar inscribirse');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
    <View style={styles.container}>
      <Text style={styles.title}>Inscripción al Evento</Text>

      <View style={styles.eventDetails}>
        <Text style={styles.label}>Nombre: <Text style={styles.value}>{event.name}</Text></Text>
        <Text style={styles.label}>Descripción: <Text style={styles.value}>{event.description}</Text></Text>
        <Text style={styles.label}>Fecha de Inicio: <Text style={styles.value}>{new Date(event.start_date).toLocaleDateString()}</Text></Text>
        <Text style={styles.label}>Duración (min): <Text style={styles.value}>{event.duration_in_minutes}</Text></Text>
        <Text style={styles.label}>Precio: <Text style={styles.value}>${event.price}</Text></Text>
        <Text style={styles.label}>Asistencia Máxima: <Text style={styles.value}>{event.max_assistance}</Text></Text>
      </View>


      {!inscriptionFull && (
        <View style={styles.buttonContainer}>
          <Button 
            title={loading ? "Cargando..." : "Inscribirse"} 
            onPress={handleInscripcion} 
            disabled={loading}  
          />
        </View>
      )}

      {inscriptionFull && (
        <Text style={styles.fullText}>Este evento ya no tiene más lugares disponibles.</Text>
      )}
    </View>
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  eventDetails: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  value: {
    fontWeight: 'normal',
    color: '#666',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  fullText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Inscripcion;
