import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
          style={{ position: 'absolute', left: 16, zIndex: 1 }}
        >
          <Text style={{ color: theme.colors.white, fontSize: 18 }}>←</Text>
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