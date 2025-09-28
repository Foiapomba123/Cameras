import styled from 'styled-components/native';
import { theme } from '../theme';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

export const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.xl}px;
`;

export const Logo = styled.Text`
  font-size: ${theme.fontSizes['4xl']}px;
  font-weight: 800;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xl}px;
  text-align: center;
  letter-spacing: -1px;
`;

export const Input = styled.TextInput`
  width: 100%;
  height: 56px;
  border-color: ${theme.colors.border};
  border-width: 1px;
  border-radius: ${theme.borderRadius.xl}px;
  padding: 0 ${theme.spacing.lg}px;
  margin-bottom: ${theme.spacing.md}px;
  background-color: ${theme.colors.surfaceElevated};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.base}px;
  shadow-color: ${theme.colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.08;
  shadow-radius: 8px;
  elevation: 2;
`;

export const Button = styled.TouchableOpacity<{ variant?: 'primary' | 'secondary' }>`
  width: 100%;
  height: 56px;
  background-color: ${(props: { variant?: 'primary' | 'secondary' }) => 
    props.variant === 'secondary' ? theme.colors.surfaceSecondary : theme.colors.primary};
  justify-content: center;
  align-items: center;
  border-radius: ${theme.borderRadius.xl}px;
  margin-top: ${theme.spacing.md}px;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 12px;
  elevation: 6;
`;

export const ButtonText = styled.Text<{ variant?: 'primary' | 'secondary' }>`
  color: ${(props: { variant?: 'primary' | 'secondary' }) => 
    props.variant === 'secondary' ? theme.colors.text : theme.colors.textInverse};
  font-size: ${theme.fontSizes.lg}px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

export const Title = styled.Text`
  font-size: ${theme.fontSizes.xl}px;
  font-weight: 700;
  color: ${theme.colors.text};
  text-align: center;
  margin: ${theme.spacing.xl}px 0;
  letter-spacing: -0.5px;
`;

export const Card = styled.TouchableOpacity<{ backgroundColor?: string }>`
  background-color: ${(props: { backgroundColor?: string }) => props.backgroundColor || theme.colors.surfaceElevated};
  border-radius: ${theme.borderRadius['2xl']}px;
  padding: ${theme.spacing.lg}px;
  margin: ${theme.spacing.sm}px 0;
  border-width: 1px;
  border-color: ${theme.colors.borderLight};
  shadow-color: ${theme.colors.shadow};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.12;
  shadow-radius: 16px;
  elevation: 4;
`;

export const StatusIndicator = styled.View<{ status: 'produzindo' | 'aguardando' | 'iniciando' }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${(props: { status: 'produzindo' | 'aguardando' | 'iniciando' }) => {
    switch (props.status) {
      case 'produzindo': return theme.colors.success;
      case 'aguardando': return theme.colors.warning;
      case 'iniciando': return theme.colors.info;
      default: return theme.colors.textSecondary;
    }
  }};
`;

export const FeaturedCard = styled.View`
  background-color: ${theme.colors.surfaceElevated};
  border-radius: ${theme.borderRadius['2xl']}px;
  padding: ${theme.spacing.xl}px;
  margin: ${theme.spacing.md}px 0;
  border-width: 1px;
  border-color: ${theme.colors.borderLight};
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 8px;
  shadow-opacity: 0.2;
  shadow-radius: 24px;
  elevation: 12;
  position: relative;
  overflow: hidden;
`;

export const FeaturedCardTitle = styled.Text`
  font-size: ${theme.fontSizes.sm}px;
  font-weight: 600;
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.lg}px;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

export const FeaturedCardValue = styled.Text`
  font-size: 52px;
  font-weight: 800;
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: ${theme.spacing.md}px;
  line-height: 56px;
`;

export const FeaturedCardSubtitle = styled.Text`
  font-size: ${theme.fontSizes.xs}px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  font-weight: 500;
`;

export const FeaturedCardAccent = styled.View`
  position: absolute;
  top: -40px;
  right: -40px;
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: ${theme.colors.accent};
  opacity: 0.1;
`;

export const FeaturedCardIcon = styled.View`
  position: absolute;
  top: ${theme.spacing.lg}px;
  right: ${theme.spacing.lg}px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${theme.colors.primary};
  justify-content: center;
  align-items: center;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 4;
`;