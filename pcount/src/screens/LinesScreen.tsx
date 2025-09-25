import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useProductionLinesWithFallback } from '../hooks/useMockFallback';
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
  
  // Buscar as linhas de produção com fallback automático para mock
  const { data: productionLines, loading, error } = useProductionLinesWithFallback(
    selectedContract?.id || ''
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

  // Mostrar erro apenas se não houver dados (fallback pode resolver automaticamente)
  if (error && !productionLines) {
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
            <View style={{ paddingVertical: 8 }}>
              {/* Header com nome da linha e status */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <StatusIndicator status={item.status} />
                  <View style={{
                    backgroundColor: item.status === 'produzindo' ? theme.colors.success : 
                                   item.status === 'iniciando' ? theme.colors.warning : theme.colors.textSecondary,
                    marginLeft: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 6
                  }}>
                    <Text style={{ 
                      fontSize: 16, 
                      fontWeight: 'bold', 
                      color: theme.colors.white,
                    }}>
                      {item.name}
                    </Text>
                  </View>
                </View>
                <View style={{
                  backgroundColor: theme.colors.primary,
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <MaterialIcons name="arrow-forward" size={24} color={theme.colors.white} />
                </View>
              </View>
              
              {/* Informações da máquina */}
              <View style={{ paddingLeft: 4 }}>
                <Text style={{ 
                  fontSize: 12, 
                  color: theme.colors.textSecondary,
                  marginBottom: 4
                }}>
                  {item.code}
                </Text>
                
                {item.operator && (
                  <Text style={{ 
                    fontSize: 12, 
                    color: theme.colors.text,
                    marginBottom: 2
                  }}>
                    👤 {item.operator}
                  </Text>
                )}
                
                {item.location && (
                  <Text style={{ 
                    fontSize: 12, 
                    color: theme.colors.text,
                    marginBottom: 2
                  }}>
                    📍 {item.location}
                  </Text>
                )}
                
                {item.machineType && (
                  <Text style={{ 
                    fontSize: 12, 
                    color: theme.colors.text,
                    marginBottom: 2
                  }}>
                    ⚙️ {item.machineType}
                  </Text>
                )}
                
                {item.temperature !== undefined && (
                  <Text style={{ 
                    fontSize: 12, 
                    color: item.temperature > 150 ? theme.colors.error : 
                           item.temperature > 100 ? theme.colors.warning : theme.colors.text,
                    marginBottom: 2
                  }}>
                    🌡️ {item.temperature}°C
                  </Text>
                )}
                
                {item.lastMaintenance && (() => {
                  const date = new Date(item.lastMaintenance);
                  return !isNaN(date.getTime()) ? (
                    <Text style={{ 
                      fontSize: 12, 
                      color: theme.colors.text,
                      marginBottom: 4
                    }}>
                      🔧 Manutenção: {date.toLocaleDateString('pt-BR')}
                    </Text>
                  ) : null;
                })()}
                
                {/* Produção e eficiência */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                  {item.capacity !== undefined && item.currentProduction !== undefined && (
                    <Text style={{ 
                      fontSize: 12, 
                      color: theme.colors.text,
                      fontWeight: '600'
                    }}>
                      🏭 {item.currentProduction}/{item.capacity} unidades
                    </Text>
                  )}
                  
                  {item.efficiency !== undefined && (
                    <Text style={{ 
                      fontSize: 12, 
                      color: item.efficiency > 80 ? theme.colors.success : 
                             item.efficiency > 50 ? theme.colors.warning : theme.colors.error,
                      fontWeight: '600'
                    }}>
                      📊 {item.efficiency.toFixed(1)}%
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </Card>
        )}
      />
    </Container>
  );
};