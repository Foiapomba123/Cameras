import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
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
      justifyContent: 'space-between'
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        {showBackButton && (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginRight: 16 }}
          >
            <Text style={{ color: theme.colors.white, fontSize: 18 }}>←</Text>
          </TouchableOpacity>
        )}
        
        <Image 
          source={require('../../assets/icon.png')} 
          style={{ 
            width: 28, 
            height: 28, 
            marginRight: 8 
          }}
          resizeMode="contain"
        />
        
        <View>
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
    </View>
  );
};