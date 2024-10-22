import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';

const VerParticipantes = ({ route, navigation }) => {
  const { evento, token } = route.params;
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        // Primera llamada: obtener los IDs de los participantes
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
            participantIds.map(async (participantId) => {
              const userResponse = await fetch(`http://localhost:3000/api/user/${participantId.id_user}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });
              if (userResponse.status === 200) {

                return await userResponse.json();
              } else {
                return null;
              }
            })
          );
            console.log(participantsData)
          setParticipants(participantsData.filter((participant) => participant !== null));
          console.log(participants)
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

  const renderParticipant = ({ item }) => (
    <View style={styles.participantCard}>
      <Text style={styles.participantName}>Nombre: {item.name}</Text>
      <Text>Email: {item.email}</Text>
      <Text>Teléfono: {item.phone}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Participantes del Evento: {evento.name}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : participants.length > 0 ? (
        <FlatList
          data={participants}
          renderItem={renderParticipant}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noParticipants}>No hay participantes registrados para este evento.</Text>
      )}
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
