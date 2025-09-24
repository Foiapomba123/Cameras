import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';

interface CustomHeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({ 
  title, 
  showBackButton = false 
}) => {
  const navigation = useNavigation();

  return (
    <View style={{
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingTop: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {showBackButton && (
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ 
            position: 'absolute', 
            left: 12, 
            top: 58,
            zIndex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: theme.borderRadius.md,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            elevation: 2,
            // Web shadow using boxShadow
            ...Platform.select({
              web: {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              },
              default: {
                shadowColor: theme.colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
              }
            }),
          }}
          activeOpacity={0.7}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Text style={{ 
              color: theme.colors.white, 
              fontSize: 16, 
              fontWeight: '600',
              marginRight: 4 
            }}>
              ←
            </Text>
            <Text style={{ 
              color: theme.colors.white, 
              fontSize: 14, 
              fontWeight: '500',
              opacity: 0.9 
            }}>
              Voltar
            </Text>
          </View>
        </TouchableOpacity>
      )}
      
      <View style={{ alignItems: 'center' }}>
        <Text style={{
          color: theme.colors.white,
          fontSize: 20,
          fontWeight: 'bold'
        }}>
          PCOUNT
        </Text>
        {title && (
          <Text style={{
            color: theme.colors.white,
            fontSize: 14,
            opacity: 0.9
          }}>
            {title}
          </Text>
        )}
      </View>
    </View>
  );
};