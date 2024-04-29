import React, {useCallback, useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {debounce} from 'lodash';
import { fetchLocations,fetchWeatherForecast } from '../api/WeatherApi';
//import Lottie from "react-lottie";

export default function Screen({navigation}) {
    const [search, setSearch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [weather, setWeather] = useState({});
    const [loading, setLoading] = useState(true);
    const [isCelsius, setIsCelsius] = useState(true);

   

    const handleLocation = (item) => {
        console.log('location', item);
        if (item && item.name) {
        setLocations([]);
        setLoading(true);
        fetchWeatherForecast({
            cityName: item.name,
            days: '7'
        }).then(data => {
            setWeather(data);
            setLoading(false);
            console.log('got forecast data', data);
        });
    } else {
        console.log("Invalid 'item' passed to handleLocation");
    }
    }
    const handleSearch = value => {
        console.log('search value', value);

        if (value.length>2){
           fetchLocations({cityName:value}).then(data=>{
          console.log('got location', data);
          setLocations(data);
        })
        }
       
    }

     const handleSwitch = () => {
  
      setIsCelsius((previousState) => !previousState);
    };

    const textdebounce = useCallback (debounce(handleSearch, 1000), []);

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
      fetchLocalWeatherData();
    },[])

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
      {
        loading? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white text-4xl">loading...</Text>
             {/* <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  /> */}
          </View>
        ) : (
          <SafeAreaView className="flex flex-1" >
        <View style={{height: '37%'}} className="mt-4 relative z-50">
            <View className='flex-row justify-between items-center rounded-full' style={{backgroundColor: search? '#7a7b7d' : 'transparent' }}>
                {
                     search ? (
                        <TextInput onChangeText={textdebounce} className="pl-6 h-10 flex-1 text-base" placeholder='Search city' placeholderTextColor={'#fff'}></TextInput>
                
                     ) : null
                }
               <TouchableOpacity onPress={() => setSearch(!search)} className="rounded-full p-3 m-1" style={{backgroundColor:'#acacad'}}>
                    <Ionicons name='search' size={25} color="white"/>
                </TouchableOpacity>
            </View>

            {
                locations.length> 0 && search ? (
                    <View className="absolute w-full bg-gray-200 top-20 left-0 right-0 rounded-3xl">
                        {
                            locations.map((item, index) => {
                                return (
                                    <TouchableOpacity onPress={() => handleLocation(item)} key={index} className="flex-row items-center justify-content-spacebetween bg-gray-300 rounded-3xl border-0 p-3 px-4 mb-1">
                                        <Fontisto name='map-marker-alt' size={20} color="gray"/>
                                        <Text className="text-base font-semibold ml-2">{item?.name}, {item?.country}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                ) : null
            }
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
          <Text style={{ marginRight: 10, color:'#fff' }}>Mode &#176;F</Text>
          <Switch
            onValueChange={handleSwitch}
            value={isCelsius}
            trackColor={{ false: 'black', true: 'white' }}
            thumbColor={isCelsius ? 'black' : 'white'}
            ios_backgroundColor="gray"
            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }} // Adjust the size here
          />
          <Text style={{ marginLeft: 10, color:'#fff' }}>&#176;C</Text>
        </View>

        <View className="mx-4 flex justify-around flex-1 mb-2">
          {/* location */}
          <Text className="text-white text-center text-2xl font-bold">
          {location?.name},
            <Text className="text-2xl font-semibold">
            {' ' +location?.country}
            </Text>
          </Text>

          {/* weather image */}
          <View className="flex-row justify-center">
          <MaterialCommunityIcons name="weather-cloudy" size={100} color="yellow"
          className="w-52 h-52"
          />
          </View>
          {/* degree celcius */}
            <View className="space-y-2">
              <Text className="text-center font-bold text-white text-6xl ml-5">
                {isCelsius ? `${current?.temp_c} °C` : `${current?.temp_f} °F`}
              </Text>
              <Text className="text-center text-white text-xl tracking-widest">
                {current?.condition?.text}
              </Text>
            </View>
            <View className="flex-row justify-between mx-4">
              <View className="flex-row space-x-2 items-center">
                <MaterialCommunityIcons name="weather-windy" size={40} color="yellow" className="w-52 h-52" />
                <Text className="text-white font-semibold text-base">
                {current?.wind_kph} Km
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <Entypo name="drop" size={40} color="yellow" className="w-52 h-52" />
                <Text className="text-white font-semibold text-base">
                {current?.humidity}
                
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <MaterialCommunityIcons name="weather-sunny" size={40} color="yellow" className="w-52 h-52" />
                <Text className="text-white font-semibold text-base">
                6:05 AM
                </Text>
              </View>
          </View>
        </View>
        <View className="mb-2 space-y-3">
          <View className="flex-row items-center mx-5 space-x-2">
            <Entypo name="calendar" size={22} color="white" className="w-52 h-52" />
            <Text className="text-white text-base"> Daily forecast</Text>
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
                      <MaterialCommunityIcons name="weather-sunny" size={40} color="yellow" className="h-11 w-11" />
                      <Text className="text-white">{day}</Text>
                      <Text className="text-white text-xl font-semibold">
                        {isCelsius ? `${current?.temp_c} °C` : `${current?.temp_f} °F`}
                      </Text>
                    </View>
                  )
                })
              } 
              
        

              

              
          </ScrollView>
        </View>
      </SafeAreaView>
        )
      }
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#444c5c',
  },
});
