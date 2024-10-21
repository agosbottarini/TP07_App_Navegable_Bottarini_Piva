import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const EditarEvento = ({ route, navigation }) => {
  const { evento, token } = route.params;
  const [name, setName] = useState(evento.name);
  const [startDate, setStartDate] = useState(evento.start_date);
  const [description, setDescription] = useState(evento.description);
  const [price, setPrice] = useState(evento.price.toString());
  const [maxAssistance, setMaxAssistance] = useState(evento.max_assistance.toString());

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/event/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          start_date: startDate,
          description,
          price: parseFloat(price),
          max_assistance: parseInt(maxAssistance),
        }),
      });

      if (response.status === 200) {
        Alert.alert('Éxito', 'El evento ha sido actualizado correctamente');
        navigation.goBack(); 
        Alert.alert('Error', 'No se pudo actualizar el evento');
      }
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
      Alert.alert('Error', 'Ocurrió un error al actualizar el evento');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Evento</Text>

      <Text style={styles.label}>Nombre del evento</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del evento"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Fecha de inicio</Text>
      <TextInput
        style={styles.input}
        placeholder="Fecha de inicio (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Precio</Text>
      <TextInput
        style={styles.input}
        placeholder="Precio"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Capacidad máxima</Text>
      <TextInput
        style={styles.input}
        placeholder="Capacidad máxima"
        keyboardType="numeric"
        value={maxAssistance}
        onChangeText={setMaxAssistance}
      />

      <View style={styles.buttonContainer}>
        <Button title="Guardar cambios" onPress={handleSave} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Cancelar" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginBottom: 15,
  },
});

export default EditarEvento;
