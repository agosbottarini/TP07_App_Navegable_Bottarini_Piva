import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';

const Inicio = ({ route }) => {
  const { nombre, apellido } = route.params;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
          
          const uniqueEvents = data.reduce((acc, current) => {
            const x = acc.find(item => item.name === current.name);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);

          setEvents(uniqueEvents); 
        }
      } 
      catch (error) {
        console.error('Error fetching data:', error);
      } 
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
       <Text style={styles.title}>Bienvenido {nombre} {apellido}</Text>
    <FlatList
      data={events}
      renderItem={({ item }) => (
        <View>
          <Text>Name: {item.name}</Text>
          <Text>Description: {item.description}</Text>
        </View>
      )}
    />

    <Button title="Registrarse" onPress={() => navigation.navigate('Registro')} />
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
});

export default Inicio;
