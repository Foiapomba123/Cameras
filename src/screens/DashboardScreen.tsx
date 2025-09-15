import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { productionStats } from '../data/productions';
import {
  Container,
  Title,
  Card,
  FeaturedCard,
  FeaturedCardTitle,
  FeaturedCardValue,
  FeaturedCardSubtitle,
  FeaturedCardAccent,
  FeaturedCardIcon,
} from '../components/StyledComponents';
import { theme } from '../theme';

export const DashboardScreen: React.FC = () => {
  return (
    <Container>
      <ScrollView style={{ padding: 16 }}>
        <Title>Dashboard</Title>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <Card style={{ flex: 1, marginRight: 8 }}>
            <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>Horas</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.warning }}>
              {productionStats.operationHours}
            </Text>
            <Text style={{ fontSize: 10 }}>Operação</Text>
          </Card>
          
          <Card style={{ flex: 1, marginRight: 8 }}>
            <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>Horas</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.error }}>
              {productionStats.productiveHours}
            </Text>
            <Text style={{ fontSize: 10 }}>Produtivas</Text>
          </Card>
          
          <Card style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>Produção</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.info }}>
              {productionStats.avgProduction}
            </Text>
            <Text style={{ fontSize: 10 }}>Média / Hr</Text>
          </Card>
        </View>
        
        <FeaturedCard>
          <FeaturedCardAccent />
          <FeaturedCardIcon>
            <Text style={{ color: theme.colors.white, fontSize: 16, fontWeight: 'bold' }}>📊</Text>
          </FeaturedCardIcon>
          <FeaturedCardTitle>Total Produzido</FeaturedCardTitle>
          <FeaturedCardValue>{productionStats.totalProduced.toLocaleString()}</FeaturedCardValue>
          <FeaturedCardSubtitle>Unidades produzidas no período</FeaturedCardSubtitle>
        </FeaturedCard>
        
        <Card style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 16 }}>TOTAL PRODUZIDO / HORA</Text>
          <Text style={{ fontSize: 16 }}>Gráfico de produção por hora</Text>
        </Card>
      </ScrollView>
    </Container>
  );
};