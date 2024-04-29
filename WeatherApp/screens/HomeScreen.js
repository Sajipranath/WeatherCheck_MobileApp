import React, {useCallback, useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView, Switch, PermissionsAndroid, Platform  } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { fetchWeatherForecast } from '../api/WeatherApi';
//import Lottie from "react-lottie";

export default function HomeScreen({navigation, route}) {
    const [weather, setWeather] = useState({});
    const [loading, setLoading] = useState(true);
    const [isCelsius, setIsCelsius] = useState(true);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    
     const handleSwitch = () => {
        setIsCelsius((previousState) => !previousState);
    };

    const {current, location} = weather;

     useEffect(() => {
        if (weather?.forecast?.forecastday && weather.forecast.forecastday.length > 0) {
            // Iterate over each forecast day
            weather.forecast.forecastday.forEach((day, index) => {
                if (day.day && typeof day.day.maxtemp_c !== 'undefined') {
                    console.log(`Max Temperature for Day ${index + 1}: ${day.day.maxtemp_c}`);
                } else {
                    console.log(`Max Temperature for Day ${index + 1} is not available.`);
                }
            });
        } else {
            console.log('No forecast data available.');
        }
    }, [weather]);

    useEffect(() => {
        if (route.params?.weatherData) {
            // Use passed weather data
            setWeather(route.params.weatherData);
            setLoading(false);
        } else {
            // Fetch local weather data
            fetchLocalWeatherData();
        }
    }, [route.params?.weatherData]);

   
    
    const fetchLocalWeatherData = async () => (
      fetchWeatherForecast({
        cityName: 'Colombo',
        days: '7'
      }).then(data => {
        setWeather(data);
        setLoading(false);
      })
    )

    

  return (
    <View className="relative" style={styles.container}>
      <StatusBar style="dark"/>
      <Text>Home</Text>
        <SafeAreaView className="flex flex-1" >
        

        <View className="flex-row items-center justify-end px-10">
          <Text className="mr-4 text-white">Mode &#176;F</Text>
          <Switch
            onValueChange={handleSwitch}
            value={isCelsius}
            trackColor={{ false: 'bg-gray-500', true: 'bg-white' }}
            thumbColor={isCelsius ? 'bg-gray-500' : 'bg-white'}
            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }} 
            className="transform scale-150" 
          />
          <Text className="ml-4 text-white">&#176;C</Text>
        </View>

      <View className="flex-1 flex-row mt-10">
          <View className="mx-4 flex justify-start flex-1 mb-2">
            
            <Text className="text-white text-center text-3xl font-bold">
            {location?.name},
              
            </Text>
            <Text className="text-white text-center text-lg font-semibold">
              {' ' +location?.country}
              </Text>

            
            <View className="flex-row justify-center">
              <Image  source={{ uri: 'https:' + current?.condition?.icon }}style={{ width: 120, height: 120 }}/>
            </View>
            
              <View className="space-y-2">
                <Text className="text-center font-bold text-white text-5xl ml-5 leading-60">
                  {isCelsius
                    ? `${current?.temp_c} °C`
                    : <View><Text>{current?.temp_f}</Text></View>}
                </Text>



                <Text className="text-center text-white text-xl tracking-widest">
                  {current?.condition?.text}
                </Text>
              </View>
            </View>
              <View className="flex-column justify-start mx-6 mt-4">
                <View className="flex justify-center items-center w-24 rounded-full py-3 space-y-1 mr-3 mx-0 mt-6" style={{backgroundColor: '#7a7b7d' }}>
                  <MaterialCommunityIcons name="weather-windy" size={40} color="yellow" className="w-52 h-52" />
                  <Text className="text-white font-semibold text-base">
                  {current?.wind_kph} KmpH
                  </Text>
                </View>
                <View className="flex justify-center items-center w-24 rounded-full py-3 space-y-1 mr-3 mx-0 mt-8" style={{backgroundColor: '#7a7b7d' }}>
                  <Entypo name="drop" size={40} color="yellow" className="w-52 h-52" />
                  <Text className="text-white font-semibold text-base">
                  {current?.humidity}%
                  
                  </Text>
                </View>
              </View>
      </View>
        <View className="mb-2 space-y-3">
          <View className="flex-row items-center mx-5 space-x-2">
            <Entypo name="calendar" size={22} color="white" className="w-52 h-52" />
            <Text className="text-white text-base"> Daily Weather</Text>
          </View>
          <ScrollView horizontal contentContainerStyle={{paddingHorizontal: 15}}
            showsHorizontalScrollIndicator={false}>
               {
                weather?.forecast?.forecastday?.map((item, index) => {
                  if (!item) return null;

                  let date = new Date(item.date);
                  let format = {weekday:'long'};
                  let day = date.toLocaleDateString('en-US', format).split(',')[0];
                  return(
                    <View key={index} className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-3"
                      style={{backgroundColor: '#7a7b7d' }}>
                      <Image  source={{ uri: 'https:' + item?.day?.condition?.icon }}style={{ width: 52, height: 52 }}/>
                      <Text className="text-white">{day}</Text>
                      <Text className="text-white text-xl font-semibold">
                        {isCelsius ? `${item?.day?.avgtemp_c} °C` : `${item?.day?.avgtemp_f} °F`}
                      </Text>
                    </View>
                  )
                })
              } 
              
        

              

              
          </ScrollView>
        </View>
      </SafeAreaView>
        
      
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#444c5c',
  },
});
