import React from 'react';
import { View, Text } from 'react-native';
import {
  Container,
  CenteredContainer,
  Title,
  Button,
  ButtonText,
} from '../components/StyledComponents';
import { theme } from '../theme';

export const ProductionScreen: React.FC = () => {
  return (
    <Container>
      <CenteredContainer>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 24, marginBottom: 16 }}>📷</Text>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: 'bold', 
            backgroundColor: theme.colors.primary,
            color: theme.colors.white,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8
          }}>
            SCAN ME!
          </Text>
        </View>
        
        <Title>Selecione uma Produção</Title>
        
        <Text style={{ 
          textAlign: 'center', 
          color: theme.colors.text,
          fontSize: 16,
          marginBottom: 32
        }}>
          Não há produção aberta para o dispositivo
        </Text>
        
        <Button>
          <ButtonText>📱 Escanear QR Code</ButtonText>
        </Button>
      </CenteredContainer>
    </Container>
  );
};