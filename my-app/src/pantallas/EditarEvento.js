import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const EditarEvento = ({ route, navigation }) => {
  const { evento, token } = route.params;
  const [name, setName] = useState(evento.name);
  const [description, setDescription] = useState(evento.description);
  const [startDate, setStartDate] = useState(evento.start_date.slice(0, 10)); 
  const [duration, setDuration] = useState(evento.duration_in_minutes);
  const [price, setPrice] = useState(evento.price);
  const [maxAssistance, setMaxAssistance] = useState(evento.max_assistance);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/event`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: evento.id, 
          name,
          description,
          start_date: startDate,
          duration_in_minutes: duration,
          price,
          max_assistance: maxAssistance,
          enabled_for_enrollment: evento.enabled_for_enrollment,
          id_event_category: evento.id_event_category,
          id_event_location: evento.id_event_location,
          id_creator_user: evento.id_creator_user,
        }),
      });

      if (response.status === 200) {
        Alert.alert('Éxito', 'Evento actualizado correctamente.');
        navigation.navigate('EdicionEventos', { token: token });
      } else {
        Alert.alert('Error', 'Hubo un problema al actualizar el evento.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo actualizar el evento.');
    }
  };

  const handleDelete = async () => {
    try {
      // Verifica si existen inscripciones asociadas al evento
      console.log(evento)
      const getEnrollmentsResponse = await fetch(`http://localhost:3000/api/event/${evento.id}/enrollment`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (getEnrollmentsResponse.status === 200) {
        const enrollments = await getEnrollmentsResponse.json();
        if (enrollments.length > 0) {
          // Si hay inscripciones, eliminarlas primero
          const deleteEnrollmentsResponse = await fetch(`http://localhost:3000/api/event/${evento.id}/enrollment`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (deleteEnrollmentsResponse.status !== 200) {
            Alert.alert('Error', 'Hubo un problema al eliminar las inscripciones.');
            return;
          }
        }
      } else if (getEnrollmentsResponse.status !== 404) {
        Alert.alert('Error', 'Hubo un problema al verificar las inscripciones.');
        return;
      }

      // Si no hay inscripciones o ya fueron eliminadas, eliminar el evento
      const deleteEventResponse = await fetch(`http://localhost:3000/api/event/${evento.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (deleteEventResponse.status === 200) {
        Alert.alert('Éxito', 'Evento eliminado correctamente.');
        navigation.navigate('EdicionEventos', { token: token });
      } else {
        Alert.alert('Error', 'Hubo un problema al eliminar el evento.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo eliminar el evento o las inscripciones.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Evento</Text>
      <Text>Título</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />
      <Text>Descripción</Text>
      <TextInput value={description} onChangeText={setDescription} style={styles.input} />
      <Text>Fecha de Inicio</Text>
      <TextInput value={startDate} onChangeText={setStartDate} style={styles.input} />
      <Text>Duración en Minutos</Text>
      <TextInput value={duration} onChangeText={setDuration} style={styles.input} keyboardType="numeric" />
      <Text>Precio</Text>
      <TextInput value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" />
      <Text>Máxima Asistencia</Text>
      <TextInput value={maxAssistance} onChangeText={setMaxAssistance} style={styles.input} keyboardType="numeric" />

      <View style={styles.buttonContainer}>
        <Button title="Guardar cambios" onPress={handleSave} />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button title="Eliminar evento" onPress={handleDelete} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default EditarEvento;
