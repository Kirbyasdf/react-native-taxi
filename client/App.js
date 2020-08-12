import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import _ from 'lodash';
import {API_KEY} from './secert';
const App = () => {
  const [position, setPosition] = useState({lat: 0, long: 0});
  const [error, setError] = useState(null);
  const [destination, setDestination] = useState('');
  const [predictionArr, setPredicitonArr] = useState([]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          long: pos.coords.longitude,
          lat: pos.coords.latitude,
        });
      },
      (error) => setError(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000},
    );
  }, []);

  const onChangeDesintation = async (text) => {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input=${text}&location=${position.lat},${position.long}&radius=2000`;
    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      setPredicitonArr(json.predictions);
    } catch (e) {
      console.error(e);
    }
  };
  const debounceOnChangeDesintation = _.debounce(onChangeDesintation, 1000);

  const renderPrediction = () =>
    predictionArr.map(({id, description}) => (
      <Text style={styles.suggestions} key={id}>
        {description}
      </Text>
    ));

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: position.lat,
          longitude: position.long,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        showsUserLocation={true}></MapView>
      <TextInput
        style={styles.destinationInput}
        value={destination}
        onChangeText={(text) => {
          setDestination(text);
          debounceOnChangeDesintation(text);
        }}
        placeholder="Enter destination..."
      />
      {renderPrediction()}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  destinationInput: {
    height: 40,
    borderWidth: 0.5,
    borderRadius: 100 / 50,
    marginHorizontal: 5,
    marginTop: 50,
    backgroundColor: 'white',
    padding: 5,
  },
  suggestions: {
    backgroundColor: 'white',
    padding: 5,
    fontSize: 18,
    borderWidth: 0.5,
    marginHorizontal: 5,
  },
  error: {
    fontSize: 20,
    color: 'firebrick',
    backgroundColor: 'blue',
  },
});

export default App;

// <Marker
//         coordinate={{
//           error: error,
//           latitude: position.lat,
//           longitude: position.long,
//         }}
//       />
