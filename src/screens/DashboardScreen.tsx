import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { productionStats } from '../data/productions';
import {
  Container,
  Title,
  Card,
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
        
        <Card>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 16 }}>TOTAL PRODUZIDO</Text>
          <Text style={{ fontSize: 48, fontWeight: 'bold', textAlign: 'center' }}>
            {productionStats.totalProduced}
          </Text>
        </Card>
        
        <Card style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 16 }}>TOTAL PRODUZIDO / HORA</Text>
          <Text style={{ fontSize: 16 }}>Gráfico de produção por hora</Text>
        </Card>
      </ScrollView>
    </Container>
  );
};