import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Picker, Switch, ScrollView, StyleSheet, Alert, Modal } from 'react-native';

const NuevoEvento = ({ route, navigation }) => {
  const { token, nombre} = route.params; 
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [idEventCategory, setIdEventCategory] = useState('');
  const [idEventLocation, setIdEventLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [enabledForEnrollment, setEnabledForEnrollment] = useState(false);
  const [maxAssistance, setMaxAssistance] = useState('');

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

    const fetchUsername = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/user/${nombre}/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          console.log(data)
          setUsername(data[0]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchUsername();
    fetchLocations();
    fetchCategories();
  }, [token]);

  const validateFields = () => {
    if (!name || !description || !idEventCategory || !idEventLocation || !startDate || !duration || !price || !maxAssistance) {
      return false;
    }
    return true;
  };


  const handleCreateEvent = async () => {
    const eventData = {
      name,
      description,
      id_event_category: parseInt(idEventCategory),
      id_event_location: parseInt(idEventLocation),
      start_date: startDate,
      duration_in_minutes: parseInt(duration),
      price: parseInt(price),
      enabled_for_enrollment: enabledForEnrollment ? 1 : 0,
      max_assistance: parseInt(maxAssistance),
      id_creator_user: username.id, 
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
      } else if (response.status === 408) {
        console.log("Error, superaste la cantidad máxima de participantes");
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

      {idEventLocation ? (
        <Text style={styles.locationInfo}>
          {`Ubicación seleccionada: ${locations.find(loc => loc.id == idEventLocation)?.name}, Capacidad máxima: ${locations.find(loc => loc.id == idEventLocation)?.max_capacity} personas`}
        </Text>
      ) : null}

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
    backgroundColor: '#f5f5f5',
    height: '100vw',
    marginEnd: '1vw',
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
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  locationInfo: {
    fontStyle: 'italic',
    marginBottom: 20,
  },
});

export default NuevoEvento;
