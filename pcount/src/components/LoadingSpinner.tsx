import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { theme } from '../theme';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Carregando...',
  size = 'large',
  color = theme.colors.primary,
}) => {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    }}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text style={{
          marginTop: 16,
          fontSize: 16,
          color: theme.colors.text,
          textAlign: 'center',
        }}>
          {message}
        </Text>
      )}
    </View>
  );
};