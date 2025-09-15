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
  font-size: ${theme.fontSizes.xxlarge}px;
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xl}px;
`;

export const Input = styled.TextInput`
  width: 100%;
  height: 50px;
  border-color: ${theme.colors.border};
  border-width: 1px;
  border-radius: ${theme.borderRadius.md}px;
  padding: 0 ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.md}px;
  background-color: ${theme.colors.white};
  color: ${theme.colors.text};
`;

export const Button = styled.TouchableOpacity<{ variant?: 'primary' | 'secondary' }>`
  width: 100%;
  height: 50px;
  background-color: ${(props: { variant?: 'primary' | 'secondary' }) => 
    props.variant === 'secondary' ? theme.colors.surface : theme.colors.primary};
  justify-content: center;
  align-items: center;
  border-radius: ${theme.borderRadius.md}px;
  margin-top: ${theme.spacing.md}px;
`;

export const ButtonText = styled.Text<{ variant?: 'primary' | 'secondary' }>`
  color: ${(props: { variant?: 'primary' | 'secondary' }) => 
    props.variant === 'secondary' ? theme.colors.text : theme.colors.white};
  font-size: ${theme.fontSizes.large}px;
  font-weight: bold;
`;

export const Title = styled.Text`
  font-size: ${theme.fontSizes.xlarge}px;
  font-weight: bold;
  color: ${theme.colors.text};
  text-align: center;
  margin: ${theme.spacing.xl}px 0;
`;

export const Card = styled.TouchableOpacity<{ backgroundColor?: string }>`
  background-color: ${(props: { backgroundColor?: string }) => props.backgroundColor || theme.colors.white};
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.md}px;
  margin: ${theme.spacing.sm}px 0;
  shadow-color: ${theme.colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 2;
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
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl}px;
  padding: ${theme.spacing.xl}px;
  margin: ${theme.spacing.md}px 0;
  border-width: 2px;
  border-color: rgba(0, 122, 255, 0.15);
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 6px;
  shadow-opacity: 0.15;
  shadow-radius: 12px;
  elevation: 8;
  position: relative;
  overflow: hidden;
`;

export const FeaturedCardTitle = styled.Text`
  font-size: ${theme.fontSizes.medium}px;
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
  font-size: ${theme.fontSizes.small}px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  font-weight: 500;
`;

export const FeaturedCardAccent = styled.View`
  position: absolute;
  top: -30px;
  right: -30px;
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: rgba(0, 122, 255, 0.06);
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