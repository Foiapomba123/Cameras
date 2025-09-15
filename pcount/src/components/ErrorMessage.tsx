import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { theme } from '../theme';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  retryText = 'Tentar novamente',
}) => {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    }}>
      <Text style={{
        fontSize: 18,
        color: theme.colors.error || '#FF3B30',
        textAlign: 'center',
        marginBottom: 16,
      }}>
        ⚠️ Erro
      </Text>
      
      <Text style={{
        fontSize: 16,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
      }}>
        {message}
      </Text>
      
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={{
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{
            color: theme.colors.white,
            fontSize: 16,
            fontWeight: '600',
          }}>
            {retryText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};