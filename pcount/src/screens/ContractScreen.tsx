import React from 'react';
import { FlatList } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Contract } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import {
  Container,
  Title,
  Card,
  ButtonText,
} from '../components/StyledComponents';

interface ContractScreenProps {
  navigation: any;
}

export const ContractScreen: React.FC<ContractScreenProps> = ({ navigation }) => {
  const { selectContract, contracts, loading, error, loadContracts } = useAuth();

  const handleContractSelect = (contract: Contract) => {
    selectContract(contract);
    // Removido navigation.navigate - deixa o AppNavigator controlar automaticamente
  };

  // Mostra loading spinner enquanto carrega
  if (loading) {
    return <LoadingSpinner message="Carregando contratos..." />;
  }

  // Mostra erro se houver
  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={loadContracts}
        retryText="Tentar novamente"
      />
    );
  }

  return (
    <Container style={{ padding: 16 }}>
      <Title>Selecione o Contrato</Title>
      
      <FlatList
        data={contracts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card onPress={() => handleContractSelect(item)}>
            <ButtonText variant="secondary">{item.name}</ButtonText>
          </Card>
        )}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};