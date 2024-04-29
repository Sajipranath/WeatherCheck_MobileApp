import React, { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { fetchLocations, fetchWeatherForecast } from '../api/WeatherApi';

export default function SearchScreen() {
  const [search, setSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const handleLocation = (item) => {
    console.log('location', item);
    if (item && item.name) {
      setLocations([]);
      setLoading(true);
      fetchWeatherForecast({
        cityName: item.name,
        days: '7'
      })
        .then(data => {
          setLocations([]);
          setLoading(false);
          navigation.navigate('Home', { weatherData: data });
        })
        .catch(error => {
          setLoading(false);
          setError(error.message || 'An error occurred while fetching weather data.');
        });
    } else {
      console.log("Invalid 'item' passed to handleLocation");
    }
  };

  const handleSearch = value => {
  console.log('search value', value);

  if (value.length > 2) {
    setLoading(true);
    setError(null);
    fetchLocations({ cityName: value })
      .then(data => {
        setLocations(data);
        setLoading(false);
        // Check if the data is empty
        if (data.length === 0) {
          setError('locations is not matched. Search a near Town or City.');
        }
      })
      .catch(error => {
        setLoading(false);
        setError(error.message || 'An error occurred while fetching locations.');
      });
  }
};


  return (
    <View className="relative" style={styles.container}>
      <StatusBar style="dark" />
      <View className="mx-4 flex justify-around flex-1 mb-2">
        {/* location */}
        <Text className="text-white text-center text-2xl font-bold">
          Weather Search App
        </Text>
      </View>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-4xl">Loading...</Text>
        </View>
      ) : (
        <SafeAreaView className="flex flex-1">
          <View style={{ height: '37%' }} className="mt-4 relative z-50">
            <View className='flex-row justify-between items-center rounded-full' style={{ backgroundColor: search ? '#7a7b7d' : 'transparent' }}>
              {search ? (
                <TextInput onChangeText={handleSearch} className="pl-6 h-10 flex-1 text-base" placeholder='Search city' placeholderTextColor={'#fff'} />
              ) : null}
              <TouchableOpacity onPress={() => setSearch(!search)} className="rounded-full p-3 m-1" style={{ backgroundColor: '#acacad' }}>
                <Ionicons name='search' size={25} color="white" />
              </TouchableOpacity>
            </View>

            {error && (
               <View className="bg-red-500 px-3 py-2 rounded-md my-2 mx-4" >
                <Text className="text-white text-xl font-bold" >{error}</Text>
              </View>
            )}

            {locations.length > 0 && search && (
              <View className="absolute w-full bg-gray-200 top-20 left-0 right-0 rounded-3xl">
                {locations.map((item, index) => (
                  <TouchableOpacity onPress={() => handleLocation(item)} key={index} className="flex-row items-center justify-content-spacebetween bg-gray-300 rounded-3xl border-0 p-3 px-4 mb-1">
                    <Fontisto name='map-marker-alt' size={20} color="gray" />
                    <Text className="text-base font-semibold ml-2">{item?.name}, {item?.country}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#444c5c',
  },
  errorContainer: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
});
