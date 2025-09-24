import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import {
  Container,
  Card,
} from '../components/StyledComponents';
import { theme } from '../theme';

interface ProductionDetailScreenProps {
  route: any;
  navigation: any;
}

export const ProductionDetailScreen: React.FC<ProductionDetailScreenProps> = ({ route }) => {
  const { production, line } = route.params;

  // Função para formatar datas corretamente
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    
    // Verifica se a data já está no formato brasileiro (DD/MM/YYYY - HH:MM)
    if (dateStr.includes(' - ')) {
      return dateStr.split(' - ')[0];
    }
    
    // Se for ISO timestamp, converte para formato brasileiro
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return dateStr;
      }
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '-';
    
    // Verifica se a data já está no formato brasileiro (DD/MM/YYYY - HH:MM)
    if (dateStr.includes(' - ')) {
      return dateStr.split(' - ')[1];
    }
    
    // Se for ISO timestamp, converte para formato de hora
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return '-';
      }
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '-';
    }
  };

  // Verificar se temos dados reais ou usar demonstrativos
  const hasRealData = production.totalProduced !== undefined && production.totalProduced !== null;
  const totalProduced = hasRealData ? production.totalProduced : 2390;
  const avgPerHour = production.avgPerHour ?? (hasRealData ? 0 : 3.66);
  const avgGeneral = production.avgGeneral ?? 0;
  
  // Dados de produção por hora - usar os dados da produção se disponível, senão usar demonstrativos
  const hasRealHourlyData = production.hourlyData && Array.isArray(production.hourlyData);
  const hourlyData = hasRealHourlyData ? production.hourlyData : [
    80, 1, 0, 0, 0, 1, 128, 138, 140, 155, 142, 130,
    117, 123, 136, 117, 130, 127, 124, 134, 121, 126, 127, 93
  ];

  return (
    <Container>
      <ScrollView style={{ padding: 16 }}>
        <Card style={{ marginBottom: 16 }}>
          <View style={{ marginBottom: 12 }}>
            <View style={{ 
              backgroundColor: production.status === 'EM PRODUCAO' ? theme.colors.success : theme.colors.textSecondary,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              alignSelf: 'flex-start',
              marginBottom: 16
            }}>
              <Text style={{ 
                color: theme.colors.white,
                fontSize: 14,
                fontWeight: 'bold'
              }}>
                Produção
              </Text>
              <Text style={{ 
                color: theme.colors.white,
                fontSize: 12,
                fontWeight: 'bold'
              }}>
                {line.name} {production.status}
              </Text>
            </View>

            {/* Operador (início produção) */}
            <View style={{ 
              backgroundColor: theme.colors.surface,
              padding: 12,
              borderRadius: 8,
              marginBottom: 12
            }}>
              <Text style={{ 
                fontSize: 14,
                fontWeight: 'bold',
                color: theme.colors.text,
                marginBottom: 4
              }}>
                Operador (início produção)
              </Text>
              <Text style={{ 
                fontSize: 14,
                color: theme.colors.text
              }}>
                {production.technician}
              </Text>
            </View>

            {/* Linha de produção e Código da linha */}
            <View style={{ 
              flexDirection: 'row',
              marginBottom: 12
            }}>
              <View style={{ 
                flex: 1,
                backgroundColor: theme.colors.surface,
                padding: 12,
                borderRadius: 8,
                marginRight: 6
              }}>
                <Text style={{ 
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: theme.colors.text,
                  marginBottom: 4
                }}>
                  Linha de produção
                </Text>
                <Text style={{ 
                  fontSize: 14,
                  color: theme.colors.text
                }}>
                  {line.name}
                </Text>
              </View>
              <View style={{ 
                flex: 1,
                backgroundColor: theme.colors.surface,
                padding: 12,
                borderRadius: 8,
                marginLeft: 6
              }}>
                <Text style={{ 
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: theme.colors.text,
                  marginBottom: 4
                }}>
                  Código da linha
                </Text>
                <Text style={{ 
                  fontSize: 14,
                  color: theme.colors.text
                }}>
                  {line.code}
                </Text>
              </View>
            </View>

            {/* Produto */}
            <View style={{ 
              backgroundColor: theme.colors.surface,
              padding: 12,
              borderRadius: 8,
              marginBottom: 12
            }}>
              <Text style={{ 
                fontSize: 14,
                fontWeight: 'bold',
                color: theme.colors.text,
                marginBottom: 4
              }}>
                Produto
              </Text>
              <Text style={{ 
                fontSize: 14,
                color: theme.colors.text
              }}>
                {production.productName}
              </Text>
            </View>

            {/* Cabeçalho dos dados de produção */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 8
            }}>
              <Text style={{ 
                fontSize: 14,
                fontWeight: 'bold',
                color: theme.colors.text
              }}>
                Estatísticas de Produção
              </Text>
              {!hasRealData && (
                <Text style={{ 
                  fontSize: 10,
                  color: theme.colors.textSecondary,
                  fontStyle: 'italic'
                }}>
                  Dados demonstrativos
                </Text>
              )}
            </View>

            {/* Dados de produção em grid */}
            <View style={{ 
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: 12
            }}>
              <View style={{ 
                width: '33.33%',
                backgroundColor: theme.colors.surface,
                padding: 12,
                borderRadius: 8,
                marginRight: '1%',
                marginBottom: 8
              }}>
                <Text style={{ 
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: theme.colors.text,
                  marginBottom: 4
                }}>
                  Data prod.
                </Text>
                <Text style={{ 
                  fontSize: 14,
                  color: theme.colors.text
                }}>
                  {formatDate(production.startDate)}
                </Text>
              </View>
              
              <View style={{ 
                width: '33.33%',
                backgroundColor: theme.colors.surface,
                padding: 12,
                borderRadius: 8,
                marginRight: '1%',
                marginBottom: 8
              }}>
                <Text style={{ 
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: theme.colors.text,
                  marginBottom: 4
                }}>
                  Hora início
                </Text>
                <Text style={{ 
                  fontSize: 14,
                  color: theme.colors.text
                }}>
                  {formatTime(production.startDate)}
                </Text>
              </View>
              
              <View style={{ 
                width: '32.33%',
                backgroundColor: theme.colors.surface,
                padding: 12,
                borderRadius: 8,
                marginBottom: 8
              }}>
                <Text style={{ 
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: theme.colors.text,
                  marginBottom: 4
                }}>
                  Hora final
                </Text>
                <Text style={{ 
                  fontSize: 14,
                  color: theme.colors.text
                }}>
                  {production.endDate ? formatTime(production.endDate) : '-'}
                </Text>
              </View>
              
              <View style={{ 
                width: '33.33%',
                backgroundColor: theme.colors.surface,
                padding: 12,
                borderRadius: 8,
                marginRight: '1%'
              }}>
                <Text style={{ 
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: theme.colors.text,
                  marginBottom: 4
                }}>
                  Total prod.
                </Text>
                <Text style={{ 
                  fontSize: 14,
                  color: hasRealData ? theme.colors.text : theme.colors.textSecondary
                }}>
                  {totalProduced}
                </Text>
              </View>
              
              <View style={{ 
                width: '33.33%',
                backgroundColor: theme.colors.surface,
                padding: 12,
                borderRadius: 8,
                marginRight: '1%'
              }}>
                <Text style={{ 
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: theme.colors.text,
                  marginBottom: 4
                }}>
                  Média / hr
                </Text>
                <Text style={{ 
                  fontSize: 14,
                  color: hasRealData ? theme.colors.text : theme.colors.textSecondary
                }}>
                  {avgPerHour}
                </Text>
              </View>
              
              <View style={{ 
                width: '32.33%',
                backgroundColor: theme.colors.surface,
                padding: 12,
                borderRadius: 8
              }}>
                <Text style={{ 
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: theme.colors.text,
                  marginBottom: 4
                }}>
                  Média /
                </Text>
                <Text style={{ 
                  fontSize: 14,
                  color: theme.colors.text
                }}>
                  {avgGeneral}
                </Text>
              </View>
            </View>

            {/* Produção por hora */}
            <View style={{ 
              backgroundColor: theme.colors.surface,
              padding: 12,
              borderRadius: 8
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ 
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: theme.colors.text
                }}>
                  Produção / hora
                </Text>
                {!hasRealHourlyData && (
                  <Text style={{ 
                    fontSize: 10,
                    color: theme.colors.textSecondary,
                    fontStyle: 'italic'
                  }}>
                    Dados demonstrativos
                  </Text>
                )}
              </View>
              
              {/* Grid de horas - Primeira linha */}
              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                {Array.from({ length: 12 }, (_, i) => (
                  <View key={i} style={{ 
                    flex: 1,
                    backgroundColor: theme.colors.primary,
                    margin: 1,
                    paddingVertical: 6,
                    alignItems: 'center',
                    borderRadius: 4
                  }}>
                    <Text style={{ 
                      color: theme.colors.white,
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}>
                      {i}
                    </Text>
                  </View>
                ))}
              </View>
              
              {/* Valores da primeira linha */}
              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                {hourlyData.slice(0, 12).map((value: number, i: number) => (
                  <View key={i} style={{ 
                    flex: 1,
                    margin: 1,
                    paddingVertical: 4,
                    alignItems: 'center'
                  }}>
                    <Text style={{ 
                      color: theme.colors.text,
                      fontSize: 11
                    }}>
                      {value}
                    </Text>
                  </View>
                ))}
              </View>
              
              {/* Grid de horas - Segunda linha */}
              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                {Array.from({ length: 12 }, (_, i) => (
                  <View key={i + 12} style={{ 
                    flex: 1,
                    backgroundColor: theme.colors.primary,
                    margin: 1,
                    paddingVertical: 6,
                    alignItems: 'center',
                    borderRadius: 4
                  }}>
                    <Text style={{ 
                      color: theme.colors.white,
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}>
                      {i + 12}
                    </Text>
                  </View>
                ))}
              </View>
              
              {/* Valores da segunda linha */}
              <View style={{ flexDirection: 'row' }}>
                {hourlyData.slice(12, 24).map((value: number, i: number) => (
                  <View key={i + 12} style={{ 
                    flex: 1,
                    margin: 1,
                    paddingVertical: 4,
                    alignItems: 'center'
                  }}>
                    <Text style={{ 
                      color: theme.colors.text,
                      fontSize: 11
                    }}>
                      {value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Card>
      </ScrollView>
    </Container>
  );
};