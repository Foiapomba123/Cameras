import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { productionLines } from '../data/productionLines';
import {
  Container,
  Title,
  Card,
  StatusIndicator,
} from '../components/StyledComponents';
import { theme } from '../theme';

interface LinesScreenProps {
  navigation: any;
}

export const LinesScreen: React.FC<LinesScreenProps> = ({ navigation }) => {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'produzindo': return 'Produzindo';
      case 'aguardando': return 'Aguardando';
      case 'iniciando': return 'Iniciando';
      default: return status;
    }
  };

  return (
    <Container style={{ padding: 16 }}>
      <Title>Selecione uma Linha</Title>
      
      <View style={{ flexDirection: 'row', marginBottom: 16, alignItems: 'center' }}>
        <StatusIndicator status="iniciando" />
        <Text style={{ marginLeft: 8, marginRight: 16 }}>Iniciando</Text>
        <StatusIndicator status="aguardando" />
        <Text style={{ marginLeft: 8, marginRight: 16 }}>Aguardando</Text>
        <StatusIndicator status="produzindo" />
        <Text style={{ marginLeft: 8 }}>Produzindo</Text>
      </View>
      
      <FlatList
        data={productionLines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card onPress={() => navigation.navigate('LineDetail', { line: item })}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <StatusIndicator status={item.status} />
                <View style={{ marginLeft: 16 }}>
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: 'bold', 
                    color: theme.colors.white,
                    backgroundColor: theme.colors.success,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4
                  }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 14, marginTop: 4 }}>{item.code}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 16 }}>→</Text>
            </View>
          </Card>
        )}
      />
    </Container>
  );
};