import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { ContractScreen } from '../screens/ContractScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { LinesScreen } from '../screens/LinesScreen';
import { ProductionScreen } from '../screens/ProductionScreen';
import { LineDetailScreen } from '../screens/LineDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen 
        name="Lines" 
        component={LinesScreen}
        options={{
          tabBarLabel: 'Linhas',
        }}
      />
      <Tab.Screen 
        name="Production" 
        component={ProductionScreen}
        options={{
          tabBarLabel: 'Produção',
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated, selectedContract } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : !selectedContract ? (
          <Stack.Screen name="ContractScreen" component={ContractScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="LineDetail" component={LineDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};