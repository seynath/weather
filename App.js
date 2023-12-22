import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Forecast from './screens/Forecast.js';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Forecast' options={{headerShown: false}} component={Forecast} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}