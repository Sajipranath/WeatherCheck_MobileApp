import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'


//Screens
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';

//Screen names
const HomePage = 'Home';
const SearchPage = 'Search';

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
     <NavigationContainer>
       <Tab.Navigator
        initialRouteName={HomePage}
           screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === HomePage) {
                iconName = focused ? 'home' : 'home-outline';
            } else if (rn === SearchPage) {
                iconName = focused ? 'search' : 'search-outline';
            }
            //console.log('IconName:', iconName);
            // Return home or search component
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#a0a1a3',
          tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
          tabBarStyle: { padding: 10, height: 70, backgroundColor:'#444c5c' },
          headerShown: false
        })}
       >
        <Tab.Screen component={HomeScreen} name={HomePage} />
        <Tab.Screen component={SearchScreen} name={SearchPage} />

        
       </Tab.Navigator>
     </NavigationContainer>
    
  );
}