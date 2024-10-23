import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert, ScrollView } from 'react-native';

const VerParticipantes = ({ route, navigation }) => {
  const { evento, token } = route.params;
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/event/${evento.id}/enrollment/participants`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const participantIds = await response.json();

          const participantsData = await Promise.all(
            participantIds.map(async (participantArray) => {
              console.log(participantArray)
              const participantId = participantArray;
              const userResponse = await fetch(`http://localhost:3000/api/user/${participantId.id_user}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });

              if (userResponse.status === 200) {
                // Devolver solo el objeto del usuario
                return await userResponse.json();
              } else {
                return null; // Regresar null si la respuesta no es exitosa
              }
            })
          );

          // Filtrar y aplanar el array en un solo paso
          const cleanParticipants = participantsData.filter((p) => p !== null).flat();
          setParticipants(cleanParticipants);
        } else {
          Alert.alert('Error', 'No se pudieron obtener los participantes.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Hubo un problema al cargar los participantes.');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [evento.id, token]);

  console.log(participants)

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Participantes del Evento: {evento.name}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : participants.length > 0 ? (
        participants.map((item) => (
          <View key={item.id} style={styles.participantCard}>
            <Text style={styles.participantName}>Nombre: {item.first_name} {item.last_name}</Text>
            <Text>Nombre de usuario: {item.username}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noParticipants}>No hay participantes registrados para este evento.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  participantCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  participantName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noParticipants: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default VerParticipantes;
