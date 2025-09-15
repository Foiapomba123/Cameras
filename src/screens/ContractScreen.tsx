import React from 'react';
import { FlatList } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { contracts } from '../data/contracts';
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
  const { selectContract } = useAuth();

  const handleContractSelect = (contract: any) => {
    selectContract(contract);
    // Removido navigation.navigate - deixa o AppNavigator controlar automaticamente
  };

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
      />
    </Container>
  );
};