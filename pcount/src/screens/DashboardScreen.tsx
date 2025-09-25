import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Svg, Rect, Text as SvgText, Line, G } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { useProductionStats, useProductionLines } from '../hooks/useProductions';
import { useAuth } from '../contexts/AuthContext';
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
  Button,
  ButtonText,
  Input,
} from '../components/StyledComponents';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

// Componente de gráfico de barras personalizado
const BarChart: React.FC<{ data: Array<{ hour: string; value: number }> }> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <View style={{ alignItems: 'center', marginVertical: 16, height: 200 }}>
        <Text style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>
          Nenhum dado de produção disponível
        </Text>
      </View>
    );
  }

  const chartWidth = width - 96;
  const chartHeight = 200;
  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = (chartWidth - 80) / data.length;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };

  return (
    <View style={{ alignItems: 'center', marginVertical: 16 }}>
      <Svg width={chartWidth} height={chartHeight + padding.top + padding.bottom}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = padding.top + (i * chartHeight) / 4;
          const value = Math.round(maxValue - (i * maxValue) / 4);
          return (
            <G key={i}>
              <Line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke={theme.colors.border}
                strokeWidth={0.5}
                opacity={0.5}
              />
              <SvgText
                x={padding.left - 10}
                y={y + 3}
                fontSize="10"
                fill={theme.colors.textSecondary}
                textAnchor="end"
              >
                {value}
              </SvgText>
            </G>
          );
        })}

        {/* Barras */}
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = padding.left + index * barWidth + barWidth * 0.1;
          const y = padding.top + chartHeight - barHeight;
          
          return (
            <G key={index}>
              <Rect
                x={x}
                y={y}
                width={barWidth * 0.8}
                height={barHeight}
                fill={theme.colors.primary}
                opacity={0.8}
                rx={2}
              />
              {/* Valor da quantidade em cima da barra */}
              <SvgText
                x={x + (barWidth * 0.4)}
                y={y - 8}
                fontSize="10"
                fill={theme.colors.text}
                textAnchor="middle"
                fontWeight="bold"
              >
                {item.value}
              </SvgText>
              <SvgText
                x={x + (barWidth * 0.4)}
                y={padding.top + chartHeight + 15}
                fontSize="9"
                fill={theme.colors.textSecondary}
                textAnchor="middle"
              >
                {item.hour.split(':')[0]}h
              </SvgText>
            </G>
          );
        })}

        {/* Eixo X */}
        <Line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={chartWidth - padding.right}
          y2={padding.top + chartHeight}
          stroke={theme.colors.border}
          strokeWidth={1}
        />

        {/* Eixo Y */}
        <Line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke={theme.colors.border}
          strokeWidth={1}
        />
      </Svg>
    </View>
  );
};

// Componente do header com logo e logout
const DashboardHeader: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  return (
    <View style={{
      backgroundColor: '#00BFFF',
      paddingTop: 50,
      paddingBottom: 16,
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <View style={{
        backgroundColor: '#FFD700',
        padding: 8,
        borderRadius: 8,
        width: 60,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#000' }}>VITON</Text>
      </View>
      
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        flex: 1
      }}>PCOUNT</Text>
      
      <TouchableOpacity
        onPress={onLogout}
        style={{
          backgroundColor: '#4A5568',
          padding: 8,
          borderRadius: 8,
          width: 40,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18 }}>⏻</Text>
      </TouchableOpacity>
    </View>
  );
};

// Componente do seletor de datas
const DateSelector: React.FC<{
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
}> = ({ startDate, endDate, onDateChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '--';
    
    // Parse manual da data ISO para evitar problemas de timezone
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return '--';
    
    // Cria data local sem problemas de timezone
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    });
  };
  
  // Função para obter data e hora atual do Brasil
  const getBrazilDateTime = () => {
    const now = new Date();
    return now.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Função para obter data atual do Brasil no formato YYYY-MM-DD
  const getBrazilDate = () => {
    const now = new Date();
    const brazilTime = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now);
    return brazilTime; // Retorna no formato YYYY-MM-DD
  };
  
  // Função para obter data no formato YYYY-MM-DD (fuso horário do Brasil)
  const getLocalDateString = (date: Date = new Date()) => {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };
  
  // Função para converter YYYY-MM-DD para DD/MM/YYYY
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    
    // Verifica se já está no formato DD/MM/YYYY
    if (dateStr.includes('/')) {
      return dateStr;
    }
    
    // Valida formato YYYY-MM-DD
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!isoDateRegex.test(dateStr)) {
      return dateStr; // Retorna como está se não for válido
    }
    
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  };
  
  // Função para converter DD/MM/YYYY para YYYY-MM-DD
  const parseInputDate = (dateStr: string) => {
    if (!dateStr) return '';
    
    // Se já estiver no formato YYYY-MM-DD válido, retorna como está
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (isoDateRegex.test(dateStr)) {
      return dateStr;
    }
    
    // Se estiver no formato DD/MM/YYYY, converte
    const brDateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (brDateRegex.test(dateStr)) {
      const [day, month, year] = dateStr.split('/');
      if (day && month && year) {
        const dayPadded = day.padStart(2, '0');
        const monthPadded = month.padStart(2, '0');
        
        // Valida se a data é válida
        const testDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (testDate.getFullYear() == parseInt(year) && 
            testDate.getMonth() == parseInt(month) - 1 && 
            testDate.getDate() == parseInt(day)) {
          return `${year}-${monthPadded}-${dayPadded}`;
        }
      }
    }
    
    // Se não conseguir converter, retorna vazio para evitar datas inválidas
    return '';
  };
  
  const handleSave = () => {
    // Converte as datas de DD/MM/YYYY para YYYY-MM-DD antes de salvar
    const startDateConverted = parseInputDate(tempStartDate);
    const endDateConverted = parseInputDate(tempEndDate);
    
    // Só salva se ambas as datas forem válidas
    if (startDateConverted && endDateConverted) {
      onDateChange(startDateConverted, endDateConverted);
      setShowModal(false);
    } else {
      // Aqui poderia mostrar uma mensagem de erro, por enquanto só não fecha o modal
      console.warn('Datas inválidas:', { tempStartDate, tempEndDate });
    }
  };
  
  const presetRanges = [
    { label: 'Hoje', start: getBrazilDate(), end: getBrazilDate() },
    { label: 'Esta semana', start: getWeekStart(), end: getBrazilDate() },
    { label: 'Este mês', start: getMonthStart(), end: getBrazilDate() },
  ];
  
  function getWeekStart() {
    const now = new Date();
    
    // Obtém a data atual no Brasil
    const brazilToday = getBrazilDate();
    const [year, month, day] = brazilToday.split('-').map(Number);
    
    // Cria data UTC para o dia atual do Brasil
    const brazilDate = new Date(Date.UTC(year, month - 1, day));
    const dayOfWeek = brazilDate.getUTCDay();
    
    // Calcula o início da semana (domingo = 0)
    const daysToSubtract = dayOfWeek;
    const weekStartUTC = new Date(brazilDate);
    weekStartUTC.setUTCDate(brazilDate.getUTCDate() - daysToSubtract);
    
    // Formata de volta para YYYY-MM-DD
    const weekStartYear = weekStartUTC.getUTCFullYear();
    const weekStartMonth = String(weekStartUTC.getUTCMonth() + 1).padStart(2, '0');
    const weekStartDay = String(weekStartUTC.getUTCDate()).padStart(2, '0');
    
    return `${weekStartYear}-${weekStartMonth}-${weekStartDay}`;
  }
  
  function getMonthStart() {
    // Obtém a data atual no Brasil
    const brazilToday = getBrazilDate();
    const [year, month] = brazilToday.split('-').map(Number);
    
    // Primeiro dia do mês atual do Brasil
    const monthStartYear = year;
    const monthStartMonth = String(month).padStart(2, '0');
    const monthStartDay = '01';
    
    return `${monthStartYear}-${monthStartMonth}-${monthStartDay}`;
  };;
  
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          // Converte as datas para DD/MM/YYYY para exibir nos inputs
          setTempStartDate(formatDateForInput(startDate));
          setTempEndDate(formatDateForInput(endDate));
          setShowModal(true);
        }}
        style={{
          backgroundColor: '#2D3748',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          marginBottom: 8,
          alignSelf: 'flex-start'
        }}
      >
        <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
          De: {formatDate(startDate)} Até: {formatDate(endDate)}
        </Text>
      </TouchableOpacity>
      
      <Modal visible={showModal} transparent animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: '#2D3748',
            borderRadius: 12,
            padding: 20,
            width: '80%',
            maxHeight: '70%'
          }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
              Selecionar Período
            </Text>
            
            {/* Seleção manual de datas */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: '#fff', fontSize: 14, marginBottom: 8 }}>Data Inicial:</Text>
              <View style={{ 
                backgroundColor: '#4A5568', 
                borderRadius: 8, 
                marginBottom: 12,
                paddingHorizontal: 12,
                paddingVertical: 4
              }}>
                <Input
                  value={tempStartDate}
                  onChangeText={setTempStartDate}
                  placeholder="dd/mm/yyyy"
                  placeholderTextColor="#A0A0A0"
                  style={{ 
                    color: '#fff', 
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    margin: 0,
                    height: 40
                  }}
                />
              </View>
              
              <Text style={{ color: '#fff', fontSize: 14, marginBottom: 8 }}>Data Final:</Text>
              <View style={{ 
                backgroundColor: '#4A5568', 
                borderRadius: 8, 
                marginBottom: 12,
                paddingHorizontal: 12,
                paddingVertical: 4
              }}>
                <Input
                  value={tempEndDate}
                  onChangeText={setTempEndDate}
                  placeholder="dd/mm/yyyy"
                  placeholderTextColor="#A0A0A0"
                  style={{ 
                    color: '#fff', 
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    margin: 0,
                    height: 40
                  }}
                />
              </View>
            </View>
            
            {/* Períodos pré-definidos */}
            <Text style={{ color: '#fff', fontSize: 14, marginBottom: 8 }}>Períodos rápidos:</Text>
            {presetRanges.map((range, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  // Converte as datas dos presets para DD/MM/YYYY
                  setTempStartDate(formatDateForInput(range.start));
                  setTempEndDate(formatDateForInput(range.end));
                }}
                style={{
                  backgroundColor: '#4A5568',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 8
                }}
              >
                <Text style={{ color: '#fff', textAlign: 'center' }}>{range.label}</Text>
              </TouchableOpacity>
            ))}
            
            <View style={{ flexDirection: 'row', marginTop: 16 }}>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={{
                  backgroundColor: '#E53E3E',
                  padding: 12,
                  borderRadius: 8,
                  flex: 1,
                  marginRight: 8
                }}
              >
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleSave}
                style={{
                  backgroundColor: '#00BFFF',
                  padding: 12,
                  borderRadius: 8,
                  flex: 1,
                  marginLeft: 8
                }}
              >
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

// Componente do seletor de produção
const ProductionSelector: React.FC<{
  selectedLineId: string | null;
  onLineChange: (lineId: string | null) => void;
  lines: any[];
}> = ({ selectedLineId, onLineChange, lines }) => {
  const [showModal, setShowModal] = useState(false);
  
  const selectedLine = lines.find(line => line.id === selectedLineId);
  
  return (
    <>
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={{
          backgroundColor: '#4A5568',
          padding: 12,
          borderRadius: 8,
          marginBottom: 16
        }}
      >
        <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>
          {selectedLineId ? selectedLine?.name || 'Linha específica' : 'Todo(s)'}
        </Text>
      </TouchableOpacity>
      
      <Modal visible={showModal} transparent animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: '#4A5568',
            borderRadius: 12,
            padding: 20,
            width: '80%',
            maxHeight: '70%'
          }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
              Todo(s)
            </Text>
            
            <TouchableOpacity
              onPress={() => {
                onLineChange(null);
                setShowModal(false);
              }}
              style={{
                backgroundColor: selectedLineId === null ? '#00BFFF' : '#2D3748',
                padding: 12,
                borderRadius: 8,
                marginBottom: 8
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Todo(s)</Text>
            </TouchableOpacity>
            
            <ScrollView style={{ maxHeight: 200 }}>
              {lines.map((line) => (
                <TouchableOpacity
                  key={line.id}
                  onPress={() => {
                    onLineChange(line.id);
                    setShowModal(false);
                  }}
                  style={{
                    backgroundColor: selectedLineId === line.id ? '#00BFFF' : '#2D3748',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 8
                  }}
                >
                  <Text style={{ color: '#fff', textAlign: 'center' }}>{line.name} {line.code}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={{
                backgroundColor: '#E53E3E',
                padding: 12,
                borderRadius: 8,
                marginTop: 16
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export const DashboardScreen: React.FC = () => {
  const { selectedContract, currentUser, logout } = useAuth();
  
  // Estados para filtros
  // Função para obter data do Brasil (deve estar antes dos useState)
  const getBrazilDateForInit = () => {
    const now = new Date();
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now);
  };
  
  const [startDate, setStartDate] = useState(getBrazilDateForInit());
  const [endDate, setEndDate] = useState(getBrazilDateForInit());
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  
  // Buscar linhas de produção
  const { data: productionLines } = useProductionLines(selectedContract?.id || '');
  
  // Construir filtros para a API
  const filters = useMemo(() => ({
    startDate,
    endDate,
    lineId: selectedLineId || undefined,
    usuarioId: currentUser?.id,
  }), [startDate, endDate, selectedLineId, currentUser?.id]);
  
  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  const handleLogout = async () => {
    await logout();
  };

  // Verificar se um contrato foi selecionado e usuário autenticado antes de chamar hooks
  if (!selectedContract) {
    return (
      <Container style={{ padding: 16 }}>
        <ErrorMessage 
          message="Nenhum contrato selecionado. Por favor, faça login novamente."
        />
      </Container>
    );
  }

  if (!currentUser?.id) {
    return (
      <Container style={{ padding: 16 }}>
        <ErrorMessage 
          message="Usuário não autenticado. Por favor, faça login novamente."
        />
      </Container>
    );
  }

  // Buscar as estatísticas de produção usando o contrato selecionado e filtros
  const { data: productionStats, loading, error } = useProductionStats(
    selectedContract.id,
    filters
  );

  // Mostrar loading
  if (loading) {
    return (
      <Container style={{ padding: 16 }}>
        <Title>Carregando Dashboard...</Title>
        <LoadingSpinner />
      </Container>
    );
  }

  // Mostrar erro
  if (error) {
    return (
      <Container>
        <ScrollView style={{ padding: 16 }}>
          <Title>Dashboard</Title>
          <ErrorMessage message={error} />
        </ScrollView>
      </Container>
    );
  }

  // Dados padrão caso não haja dados da API
  const stats = productionStats || {
    operationHours: '--',
    productiveHours: '--',
    avgProduction: 0,
    totalProduced: 0,
    hourlyProduction: [],
  };

  return (
    <Container>
      <DashboardHeader onLogout={handleLogout} />
      
      <ScrollView style={{ padding: 16 }}>
        <DateSelector
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
        />
        
        <ProductionSelector
          selectedLineId={selectedLineId}
          onLineChange={setSelectedLineId}
          lines={productionLines || []}
        />
        
        <Text style={{ 
          fontSize: 18, 
          fontWeight: 'bold', 
          color: theme.colors.text, 
          marginBottom: 16,
          textAlign: 'center'
        }}>Dashboard {selectedLineId ? productionLines?.find(l => l.id === selectedLineId)?.name : ''}</Text>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <Card style={{ flex: 1, marginRight: 8 }}>
            <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>Horas</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.warning }}>
              {stats.operationHours}
            </Text>
            <Text style={{ fontSize: 10 }}>Operação</Text>
          </Card>
          
          <Card style={{ flex: 1, marginRight: 8 }}>
            <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>Horas</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.error }}>
              {stats.productiveHours}
            </Text>
            <Text style={{ fontSize: 10 }}>Produtivas</Text>
          </Card>
          
          <Card style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>Produção</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.info }}>
              {stats.avgProduction}
            </Text>
            <Text style={{ fontSize: 10 }}>Média / Hr</Text>
          </Card>
        </View>
        
        <TouchableOpacity
          onPress={() => {
            // TODO: Navegar para tela de detalhes da produção
            console.log('Navegar para detalhes da produção');
          }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Ver detalhes da produção"
        >
          <FeaturedCard>
            <FeaturedCardAccent />
            <FeaturedCardIcon>
              <MaterialIcons name="arrow-forward" size={20} color={theme.colors.white} />
            </FeaturedCardIcon>
            <FeaturedCardTitle>Total Produzido</FeaturedCardTitle>
            <FeaturedCardValue>{stats.totalProduced.toLocaleString()}</FeaturedCardValue>
            <FeaturedCardSubtitle>Unidades produzidas no período</FeaturedCardSubtitle>
          </FeaturedCard>
        </TouchableOpacity>
        
        <Card style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 16, color: theme.colors.text }}>TOTAL PRODUZIDO / HORA</Text>
          <BarChart data={stats.hourlyProduction} />
          <Text style={{ 
            fontSize: 11, 
            color: theme.colors.textSecondary, 
            textAlign: 'center', 
            marginTop: 8 
          }}>
            Unidades produzidas por horário de trabalho
          </Text>
        </Card>
      </ScrollView>
    </Container>
  );
};