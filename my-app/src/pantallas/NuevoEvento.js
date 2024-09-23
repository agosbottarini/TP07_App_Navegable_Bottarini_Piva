import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator } from 'react-native';

const NuevoEvento = ({route, navigation}) => {
    const { token } = route.params;
    console.log(token)
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);



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
            console.error('Error fetching data:', error);
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
              console.error('Error fetching data:', error);
            }
        };


    fetchLocations();
    fetchCategories();
    }, []);
    
    return(
        <View>    
            {categories.map((item, index) => (
                <View key={index}>
                    <Text>Name: {item.name}</Text>
                   
                </View>
            ))}

            {locations.map((item, index) => (
                <View key={index}>
                    <Text>Name: {item.name}</Text>
                   
                </View>
            ))}
        </View>

        
    )
}

export default NuevoEvento;