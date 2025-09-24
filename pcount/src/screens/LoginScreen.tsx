import React, { useState, useEffect } from 'react';
import { Alert, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  CenteredContainer,
  Logo,
  Input,
  Button,
  ButtonText,
} from '../components/StyledComponents';
import { theme } from '../theme';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();

  // Reage às mudanças de erro para mostrar mensagens detalhadas
  useEffect(() => {
    if (error) {
      Alert.alert('Erro de Login', error);
    }
  }, [error]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const success = await login(email, password);
    // Erro é exibido automaticamente via useEffect quando error muda
    // Removido navigation.navigate - deixa o AppNavigator controlar automaticamente
  };

  return (
    <Container>
      <CenteredContainer>
        <Logo>PCOUNT</Logo>
        
        <Input
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <Input
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <Button onPress={handleLogin}>
          <ButtonText>Entrar</ButtonText>
        </Button>
        
        <Text style={{ 
          fontSize: theme.fontSizes.small,
          color: theme.colors.textSecondary,
          textAlign: 'center',
          marginTop: theme.spacing.md
        }}>
          Conectando à API real PCount{'\n'}
          Use suas credenciais de acesso válidas
        </Text>
      </CenteredContainer>
    </Container>
  );
};