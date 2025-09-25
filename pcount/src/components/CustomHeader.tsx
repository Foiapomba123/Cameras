import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
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
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderWidth: 1.5,
            borderColor: 'rgba(255, 255, 255, 0.3)',
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
            <MaterialIcons 
              name="arrow-back" 
              size={18} 
              color={theme.colors.white}
              style={{ marginRight: 6 }}
            />
            <Text style={{ 
              color: theme.colors.white, 
              fontSize: 15, 
              fontWeight: '600',
              opacity: 0.95 
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