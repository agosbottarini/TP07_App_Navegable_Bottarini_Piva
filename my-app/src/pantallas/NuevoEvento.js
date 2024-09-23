import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Picker, Switch, ScrollView, StyleSheet, Alert, Modal } from 'react-native';

const NuevoEvento = ({ route, navigation }) => {
  const { token } = route.params;
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [idEventCategory, setIdEventCategory] = useState('');
  const [idEventLocation, setIdEventLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [enabledForEnrollment, setEnabledForEnrollment] = useState(false);
  const [maxAssistance, setMaxAssistance] = useState('');
  const [idCreatorUser, setIdCreatorUser] = useState('');

  const [isSummaryModalVisible, setIsSummaryModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/event_categories/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/event_locations/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setLocations(data);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
    fetchCategories();
  }, [token]);

  const validateFields = () => {
    if (!name || !description || !idEventCategory || !idEventLocation || !startDate || !duration || !price || !maxAssistance || !idCreatorUser) {
      return false;
    }
    return true;
  };

  const handleCreateEvent = async () => {
    const eventData = {
      name,
      description,
      id_event_category: parseInt(idEventCategory, 10),
      id_event_location: parseInt(idEventLocation, 10),
      start_date: startDate,
      duration_in_minutes: parseInt(duration, 10),
      price: parseInt(price, 10),
      enabled_for_enrollment: enabledForEnrollment ? 1 : 0,
      max_assistance: parseInt(maxAssistance, 10),
      id_creator_user: parseInt(idCreatorUser, 10),
    };

    try {
      const response = await fetch('http://localhost:3000/api/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (response.status === 201) {
        setIsSuccessModalVisible(true);
      } else {
        Alert.alert('Error', 'Hubo un error al crear el evento');
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Crear Nuevo Evento</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nombre del evento"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Categoría del evento</Text>
      <Picker
        selectedValue={idEventCategory}
        onValueChange={(itemValue) => setIdEventCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione una opción" value="" />
        {categories.map((category) => (
          <Picker.Item key={category.id} label={category.name} value={category.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Ubicación del evento</Text>
      <Picker
        selectedValue={idEventLocation}
        onValueChange={(itemValue) => setIdEventLocation(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione una opción" value="" />
        {locations.map((location) => (
          <Picker.Item key={location.id} label={location.name} value={location.id} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Fecha de inicio (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Duración en minutos"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <View style={styles.switchContainer}>
        <Text>Habilitado para inscripción</Text>
        <Switch
          value={enabledForEnrollment}
          onValueChange={setEnabledForEnrollment}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Asistencia máxima"
        value={maxAssistance}
        onChangeText={setMaxAssistance}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="ID del creador"
        value={idCreatorUser}
        onChangeText={setIdCreatorUser}
        keyboardType="numeric"
      />

      <Button title="Revisar Evento" onPress={() => {
        if (validateFields()) {
          setIsSummaryModalVisible(true);
        }
      }} color="#007BFF" />

      <Modal visible={isSummaryModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Resumen del Evento</Text>
            <Text>Nombre: {name}</Text>
            <Text>Descripción: {description}</Text>
            <Text>Categoría: {categories.find(cat => cat.id == idEventCategory)?.name}</Text>
            <Text>Ubicación: {locations.find(loc => loc.id == idEventLocation)?.name}</Text>
            <Text>Fecha de inicio: {startDate}</Text>
            <Text>Duración: {duration} minutos</Text>
            <Text>Precio: ${price}</Text>
            <Text>Inscripción habilitada: {enabledForEnrollment ? 'Sí' : 'No'}</Text>
            <Text>Asistencia máxima: {maxAssistance}</Text>
            <Text>ID del creador: {idCreatorUser}</Text>

            <View style={styles.modalButtons}>
              <Button title="Confirmar" onPress={() => {
                setIsSummaryModalVisible(false);
                handleCreateEvent();
              }} />
              <Button title="Cancelar" onPress={() => setIsSummaryModalVisible(false)} color="red" />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isSuccessModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Éxito</Text>
            <Text>Su evento se ha publicado correctamente.</Text>
            <Button title="Cerrar" onPress={() => {
              setIsSuccessModalVisible(false);
              navigation.goBack();
            }} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#343a40',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343a40',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
});

export default NuevoEvento;
