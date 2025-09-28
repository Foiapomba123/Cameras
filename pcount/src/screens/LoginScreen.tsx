import React, { useState, useRef } from 'react';
import { Alert, Text, View, TouchableOpacity, Dimensions, KeyboardAvoidingView, ScrollView, Platform, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme';
import styled from 'styled-components/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface LoginScreenProps {
  navigation: any;
}

// Styled Components
const GradientBackground = styled.View`
  flex: 1;
`;

const CurvedOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  margin-top: ${Math.min(screenHeight * 0.08, 80)}px;
`;

const LoginCard = styled.View`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding: ${screenWidth * 0.06}px;
  padding-top: ${Math.max(screenHeight * 0.05, 40)}px;
`;

const LogoContainer = styled.View`
  align-items: center;
  margin-bottom: ${Math.max(screenHeight * 0.02, 16)}px;
`;

const SubTitle = styled.Text`
  font-size: ${theme.fontSizes.lg}px;
  color: ${theme.colors.textInverse};
  text-align: center;
  margin-top: ${theme.spacing.sm}px;
  font-weight: 500;
  opacity: 0.95;
  letter-spacing: 0.5px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
`;

const FormContainer = styled.View`
  width: 100%;
  max-width: ${Math.min(screenWidth * 0.9, 380)}px;
  padding: ${screenHeight * 0.02}px ${screenWidth * 0.04}px;
  margin-bottom: ${Math.max(screenHeight * 0.02, 16)}px;
`;

const InputWrapper = styled.View`
  position: relative;
  margin-bottom: ${Math.max(screenHeight * 0.015, 12)}px;
`;

const StyledInput = styled.TextInput`
  background-color: #ffffff;
  border-width: 1.5px;
  border-color: rgba(255, 255, 255, 0.3);
  border-radius: 14px;
  padding: ${Math.max(screenHeight * 0.018, 14)}px ${screenWidth * 0.04}px ${Math.max(screenHeight * 0.018, 14)}px ${screenWidth * 0.13}px;
  font-size: ${Math.max(screenWidth * 0.042, 16)}px;
  color: #333333;
  min-height: ${Math.max(screenHeight * 0.06, 48)}px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 8px;
  elevation: 2;
  font-weight: 500;
`;

const InputIconContainer = styled.View`
  position: absolute;
  left: ${screenWidth * 0.04}px;
  top: ${Math.max(screenHeight * 0.018, 14)}px;
  z-index: 1;
`;

const EyeIconContainer = styled.TouchableOpacity`
  position: absolute;
  right: ${screenWidth * 0.04}px;
  top: ${Math.max(screenHeight * 0.012, 10)}px;
  z-index: 1;
  padding: ${Math.max(screenWidth * 0.025, 12)}px;
  border-radius: 20px;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
`;

const LoginButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8
})`
  padding: ${Math.max(screenHeight * 0.014, 10)}px;
  align-items: center;
  min-height: ${Math.max(screenHeight * 0.055, 44)}px;
  justify-content: center;
  width: 100%;
  background-color: transparent;
`;

const VersionText = styled.Text`
  color: rgba(0, 0, 0, 0.6);
  font-size: ${Math.max(screenWidth * 0.032, 12)}px;
  font-weight: 500;
  text-align: center;
  margin-top: ${Math.max(screenHeight * 0.02, 16)}px;
`;


const WelcomeText = styled.Text`
  font-size: ${theme.fontSizes.xs}px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  margin-top: ${theme.spacing.lg}px;
  line-height: 20px;
  font-weight: 500;
  opacity: 0.8;
`;

// Styled components for bottom action area
const BottomActionArea = styled.View`
  width: 100%;
  padding: ${screenWidth * 0.04}px;
  padding-top: ${Math.max(screenHeight * 0.02, 16)}px;
  padding-bottom: ${Math.max(screenHeight * 0.03, 20)}px;
  background-color: transparent;
  border-top-width: 0px;
  border-top-color: transparent;
`;

const ContentArea = styled.View`
  flex: 1;
  align-items: center;
  width: 100%;
`;

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      Alert.alert('Erro', 'Credenciais inválidas');
    }
    // Removido navigation.navigate - deixa o AppNavigator controlar automaticamente
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GradientBackground>
        <ImageBackground
          source={require('../../assets/background.png')}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          <CurvedOverlay />
          <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView 
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <LoginCard>
                <ContentArea>
        {/* Logo Area */}
        <LogoContainer style={{ marginTop: Math.max(screenHeight * 0.08, 60) }}>
          <View style={{ alignItems: 'center', marginBottom: Math.max(screenHeight * 0.03, 24) }}>
            {/* Main PCOUNT Logo */}
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: 8
            }}>
              <Text style={{
                fontSize: Math.min(screenWidth * 0.12, 48),
                fontWeight: '800',
                color: 'rgba(255, 255, 255, 0.95)',
                letterSpacing: 1,
                textShadowColor: 'rgba(0, 0, 0, 0.2)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4
              }}>
                PC
              </Text>
              <View style={{
                width: Math.max(screenWidth * 0.1, 40),
                height: Math.max(screenWidth * 0.1, 40),
                borderRadius: Math.max(screenWidth * 0.05, 20),
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: screenWidth * 0.01,
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
                elevation: 6
              }}>
                <MaterialIcons name="visibility" size={Math.max(screenWidth * 0.05, 20)} color="#667eea" />
              </View>
              <Text style={{
                fontSize: Math.min(screenWidth * 0.12, 48),
                fontWeight: '800',
                color: 'rgba(255, 255, 255, 0.95)',
                letterSpacing: 1,
                textShadowColor: 'rgba(0, 0, 0, 0.2)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4
              }}>
                UNT
              </Text>
            </View>
          </View>
        </LogoContainer>
        
        <FormContainer>
          {/* Form Title */}
          <Text style={{
            fontSize: Math.max(screenWidth * 0.040, 16),
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: Math.max(screenHeight * 0.01, 8),
            fontWeight: '600',
            lineHeight: Math.max(screenWidth * 0.050, 20)
          }}>
            Entre com suas credenciais para{'\n'}acessar o sistema.
          </Text>
          
          {/* Login Form */}
          <View style={{ width: '100%' }}>
            {/* Email Input */}
            <InputWrapper>
              <View style={{ position: 'relative' }}>
                <InputIconContainer>
                  <MaterialIcons name="email" size={Math.max(screenWidth * 0.055, 22)} color="#667eea" />
                </InputIconContainer>
                <StyledInput
                  ref={emailRef}
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoComplete="email"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  placeholderTextColor="rgba(0, 0, 0, 0.5)"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  style={emailFocused ? {
                    borderColor: '#667eea',
                    borderWidth: 2,
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    shadowOpacity: 0.1
                  } : {}}
                />
              </View>
            </InputWrapper>
            
            {/* Password Input */}
            <InputWrapper>
              <View style={{ position: 'relative' }}>
                <InputIconContainer>
                  <MaterialIcons name="lock" size={Math.max(screenWidth * 0.055, 22)} color="#667eea" />
                </InputIconContainer>
                <StyledInput
                  ref={passwordRef}
                  placeholder="Digite sua senha"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  textContentType="password"
                  autoComplete="current-password"
                  returnKeyType="go"
                  placeholderTextColor="rgba(0, 0, 0, 0.5)"
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  onSubmitEditing={handleLogin}
                  style={passwordFocused ? {
                    borderColor: '#667eea',
                    borderWidth: 2,
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    shadowOpacity: 0.1
                  } : {}}
                />
                <EyeIconContainer onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons 
                    name={showPassword ? "visibility" : "visibility-off"} 
                    size={Math.max(screenWidth * 0.055, 22)} 
                    color="#667eea" 
                  />
                </EyeIconContainer>
              </View>
            </InputWrapper>
          </View>
          
        </FormContainer>
        </ContentArea>

        {/* Bottom Action Area */}
        <BottomActionArea>
          {/* Login Button */}
          <LinearGradient
            colors={['#4A90E2', '#357ABD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              marginTop: Math.max(screenHeight * 0.001, 2),
            }}
          >
            <LoginButton onPress={handleLogin}>
              <Text style={{
                color: 'white',
                fontSize: Math.max(screenWidth * 0.045, 18),
                fontWeight: '700',
                letterSpacing: 0.5
              }}>
                Entrar
              </Text>
            </LoginButton>
          </LinearGradient>
          
          {/* Version */}
          <VersionText>v2.0.0</VersionText>
        </BottomActionArea>
      </LoginCard>
            </ScrollView>
          </KeyboardAvoidingView>
        </ImageBackground>
      </GradientBackground>
    </SafeAreaView>
  );
};