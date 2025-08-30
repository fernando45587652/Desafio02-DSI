import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CountryList from './screen/ContrieList';
import CountryDetail from './screen/ContrieDetail';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Countries"
          component={CountryList}
          options={{ title: 'Países' }}
        />
        <Stack.Screen
          name="CountryDetail"
          component={CountryDetail}
          options={({ route }) => ({
            title: route.params?.title ?? 'Detalles',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
