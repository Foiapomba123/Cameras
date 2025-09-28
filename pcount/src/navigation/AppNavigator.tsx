import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme';
import { CustomHeader } from '../components/CustomHeader';
import { LoginScreen } from '../screens/LoginScreen';
import { ContractScreen } from '../screens/ContractScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { LinesScreen } from '../screens/LinesScreen';
import { ProductionScreen } from '../screens/ProductionScreen';
import { LineDetailScreen } from '../screens/LineDetailScreen';
import { ProductionDetailScreen } from '../screens/ProductionDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        header: () => <CustomHeader />,
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="dashboard" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Lines" 
        component={LinesScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Production" 
        component={ProductionScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="precision-manufacturing" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated, selectedContract } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: true,
          header: () => <CustomHeader />,
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : !selectedContract ? (
          <Stack.Screen 
            name="ContractScreen" 
            component={ContractScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="LineDetail" 
              component={LineDetailScreen}
              options={{ 
                header: () => <CustomHeader title="Produção de linha" showBackButton={true} />
              }}
            />
            <Stack.Screen 
              name="ProductionDetail" 
              component={ProductionDetailScreen}
              options={{ 
                header: () => <CustomHeader title="Detalhes da Produção" showBackButton={true} />
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};