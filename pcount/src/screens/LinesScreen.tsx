import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { useProductionLines } from '../hooks/useProductions';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Title,
  Card,
  StatusIndicator,
} from '../components/StyledComponents';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { theme } from '../theme';

interface LinesScreenProps {
  navigation: any;
}

export const LinesScreen: React.FC<LinesScreenProps> = ({ navigation }) => {
  const { selectedContract } = useAuth();
  
  // Buscar as linhas de produção usando o contrato selecionado
  // Hook fará no-op se contratoId for falsy
  const { data: productionLines, loading, error } = useProductionLines(
    selectedContract?.id
  );

  const getStatusText = (status: string) => {
    switch (status) {
      case 'produzindo': return 'Produzindo';
      case 'aguardando': return 'Aguardando';
      case 'iniciando': return 'Iniciando';
      default: return status;
    }
  };

  // Verificar se um contrato foi selecionado
  if (!selectedContract) {
    return (
      <Container style={{ padding: 16 }}>
        <ErrorMessage 
          message="Nenhum contrato selecionado. Por favor, faça login novamente."
        />
      </Container>
    );
  }

  // Mostrar loading
  if (loading) {
    return (
      <Container style={{ padding: 16 }}>
        <Title>Carregando Linhas...</Title>
        <LoadingSpinner />
      </Container>
    );
  }

  // Mostrar erro
  if (error) {
    return (
      <Container style={{ padding: 16 }}>
        <Title>Selecione uma Linha</Title>
        <ErrorMessage message={error} />
      </Container>
    );
  }

  // Verificar se existem linhas
  if (!productionLines || productionLines.length === 0) {
    return (
      <Container style={{ padding: 16 }}>
        <Title>Selecione uma Linha</Title>
        <Text style={{ textAlign: 'center', marginTop: 32, color: theme.colors.textSecondary }}>
          Nenhuma linha de produção encontrada para este contrato.
        </Text>
      </Container>
    );
  }

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