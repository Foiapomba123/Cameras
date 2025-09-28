import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Modal, FlatList, useWindowDimensions, ImageBackground } from 'react-native';
import { Svg, Rect, Text as SvgText, Line, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
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

// Funções para obter valores responsivos baseados na largura
const getResponsivePadding = (width: number) => {
  if (width < 375) return 12;
  if (width < 768) return 16;
  return 20;
};

const getResponsiveCardSpacing = (width: number) => {
  if (width < 375) return theme.spacing.xs / 2;
  if (width < 768) return theme.spacing.xs;
  return theme.spacing.sm;
};

// Componente de cartão do Total Produzido com design modernizado
const TotalProducedCard: React.FC<{ 
  value: number; 
  title: string;
  subtitle?: string;
}> = ({ value, title, subtitle }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;
  // Garantir que o valor seja positivo
  const safeValue = Math.max(0, value);
  
  // Definir os níveis e cores (baseado na imagem de referência)
  const levels = [
    { threshold: 4800, color: '#dc2626', label: '4800' },
    { threshold: 6600, color: '#ea580c', label: '6600' },
    { threshold: 8400, color: '#65a30d', label: '8400' },
    { threshold: 10200, color: '#16a34a', label: '10200' },
    { threshold: 13000, color: '#0891b2', label: '13000' }
  ];
  
  // Determinar qual nível foi atingido
  const currentLevel = levels.reduce((prev, curr) => 
    safeValue >= curr.threshold ? curr : prev, 
    levels[0]
  );
  
  return (
    <View style={{
      backgroundColor: '#ffffff',
      borderRadius: theme.borderRadius['2xl'],
      padding: isSmallScreen ? theme.spacing.lg : theme.spacing.xl,
      marginVertical: theme.spacing.md,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Efeito de gradiente de fundo */}
      <LinearGradient
        colors={['rgba(6, 182, 212, 0.05)', 'rgba(6, 182, 212, 0.02)']}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      />
      
      {/* Título */}
      <Text style={{
        fontSize: isSmallScreen ? theme.fontSizes.xs : theme.fontSizes.sm,
        fontWeight: '700',
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: isSmallScreen ? theme.spacing.md : theme.spacing.lg,
        letterSpacing: 1,
        textTransform: 'uppercase'
      }}>
        {title}
      </Text>
      
      {/* Layout do conteúdo principal */}
      <View style={{ alignItems: 'center' }}>
        {/* Círculo visual com indicador de progresso */}
        <View style={{
          width: isSmallScreen ? 140 : 180,
          height: isSmallScreen ? 140 : 180,
          borderRadius: isSmallScreen ? 70 : 90,
          backgroundColor: '#f8fafc',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: isSmallScreen ? theme.spacing.md : theme.spacing.lg,
          borderWidth: isSmallScreen ? 6 : 8,
          borderColor: currentLevel.color,
          position: 'relative'
        }}>
          {/* Valor principal */}
          <Text 
            adjustsFontSizeToFit
            numberOfLines={1}
            style={{
              fontSize: isSmallScreen ? 28 : 36,
              fontWeight: '900',
              color: theme.colors.text,
              textAlign: 'center',
              paddingHorizontal: theme.spacing.sm
            }}
          >
            {safeValue.toLocaleString('pt-BR')}
          </Text>
          
          {/* Indicador pequeno do nível atual */}
          <View style={{
            position: 'absolute',
            top: isSmallScreen ? -8 : -12,
            right: isSmallScreen ? -8 : -12,
            width: isSmallScreen ? 20 : 24,
            height: isSmallScreen ? 20 : 24,
            borderRadius: isSmallScreen ? 10 : 12,
            backgroundColor: currentLevel.color,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <MaterialIcons name="trending-up" size={isSmallScreen ? 12 : 14} color="#ffffff" />
          </View>
        </View>
        
        {/* Legend responsiva */}
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          marginBottom: isSmallScreen ? theme.spacing.sm : theme.spacing.md,
          paddingHorizontal: theme.spacing.xs
        }}>
          {levels.map((level, index) => (
            <View key={index} style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: isSmallScreen ? 2 : theme.spacing.xs,
              marginBottom: theme.spacing.xs,
              backgroundColor: safeValue >= level.threshold ? level.color : '#f1f5f9',
              paddingHorizontal: isSmallScreen ? 6 : theme.spacing.sm,
              paddingVertical: isSmallScreen ? 2 : 4,
              borderRadius: theme.borderRadius.md,
              opacity: safeValue >= level.threshold ? 1 : 0.6
            }}>
              <Text style={{
                fontSize: isSmallScreen ? 10 : theme.fontSizes.xs,
                color: safeValue >= level.threshold ? '#ffffff' : theme.colors.text,
                fontWeight: '700'
              }}>
                {level.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
      
      {subtitle && (
        <Text style={{
          fontSize: theme.fontSizes.xs,
          color: theme.colors.textSecondary,
          textAlign: 'center',
          fontWeight: '500',
          marginTop: theme.spacing.sm
        }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

// Componente de cartão de estatística modernizado
const StatCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  backgroundColor?: string;
}> = ({ title, value, subtitle, icon, accentColor, backgroundColor = '#ffffff' }) => {
  const { width } = useWindowDimensions();
  // Tamanhos responsivos baseados no tamanho da tela
  const isSmallScreen = width < 375;
  const isLargeScreen = width >= 768;
  const cardPadding = isSmallScreen ? theme.spacing.sm : theme.spacing.md;
  const titleFontSize = isSmallScreen ? 10 : theme.fontSizes.xs;
  const valueFontSize = isSmallScreen ? theme.fontSizes.lg : theme.fontSizes.xl;
  const subtitleFontSize = isSmallScreen ? 9 : theme.fontSizes.xs;
  const iconSize = isSmallScreen ? 24 : 28;
  const iconPadding = isSmallScreen ? 4 : 6;
  const iconInnerSize = isSmallScreen ? 14 : 16;
  
  return (
    <View style={{
      backgroundColor: backgroundColor,
      borderRadius: theme.borderRadius.xl,
      padding: cardPadding,
      flex: 1,
      marginHorizontal: 0,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderLeftWidth: 4,
      borderLeftColor: accentColor,
      minHeight: isSmallScreen ? 70 : 80,
      maxWidth: isLargeScreen ? 180 : undefined // Limite máximo em telas grandes
    }}>
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: theme.spacing.xs
      }}>
        <Text 
          numberOfLines={1}
          style={{ 
            fontSize: titleFontSize, 
            color: theme.colors.textSecondary,
            fontWeight: '600',
            flex: 1
          }}
        >
          {title}
        </Text>
        <View style={{
          backgroundColor: accentColor,
          borderRadius: theme.borderRadius.sm,
          width: iconSize,
          height: iconSize,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <MaterialIcons name={icon as any} size={iconInnerSize} color="#ffffff" />
        </View>
      </View>
      
      <Text 
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{ 
          fontSize: valueFontSize, 
          fontWeight: '800', 
          color: theme.colors.text,
          marginBottom: 2
        }}
      >
        {value}
      </Text>
      
      <Text 
        numberOfLines={1}
        style={{ 
          fontSize: subtitleFontSize, 
          color: theme.colors.textSecondary,
          fontWeight: '500'
        }}
      >
        {subtitle}
      </Text>
    </View>
  );
};

// Componente de gráfico de barras modernizado para mobile
const BarChart: React.FC<{ data: Array<{ hour: string; value: number }> }> = ({ data }) => {
  const { width: screenWidth } = useWindowDimensions();
  if (!data || data.length === 0) {
    return (
      <View style={{ 
        alignItems: 'center', 
        marginVertical: theme.spacing.lg, 
        height: 160, 
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        borderWidth: 1,
        borderColor: '#e2e8f0'
      }}>
        <MaterialIcons name="equalizer" size={32} color={theme.colors.textSecondary} />
        <Text style={{ 
          color: theme.colors.textSecondary, 
          textAlign: 'center',
          fontSize: theme.fontSizes.sm,
          fontWeight: '500',
          marginTop: theme.spacing.sm
        }}>
          Nenhum dado disponível
        </Text>
      </View>
    );
  }

  // Tamanho responsivo e adaptativo para diferentes tamanhos de tela
  const baseChartWidth = Math.min(screenWidth - 40, 480);
  const chartHeight = 140;
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const padding = { top: 20, right: 16, bottom: 30, left: 16 };
  
  // Calcular largura das barras para evitar overflow
  const availableWidth = baseChartWidth - padding.left - padding.right;
  const barGroupWidth = availableWidth / data.length;
  const actualBarWidth = Math.min(barGroupWidth * 0.7, 28); // Máximo 28px por barra
  const showLabels = barGroupWidth >= 14; // Só mostrar labels se houver espaço

  return (
    <View style={{ marginVertical: theme.spacing.md, alignItems: 'center' }}>
      <View style={{ alignItems: 'center' }}>
        <Svg width={baseChartWidth} height={chartHeight + padding.top + padding.bottom}>
          {/* Background sutil */}
          <Rect
            x={0}
            y={0}
            width={baseChartWidth}
            height={chartHeight + padding.top + padding.bottom}
            fill="#fafbfc"
            rx={8}
          />
          
          {/* Grid lines horizontais sutis */}
          {[1, 2, 3].map((i) => {
            const y = padding.top + (i * chartHeight) / 4;
            return (
              <Line
                key={i}
                x1={padding.left}
                y1={y}
                x2={baseChartWidth - padding.right}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth={0.5}
                opacity={0.7}
              />
            );
          })}

          {/* Barras com gradiente e estilo moderno */}
          {data.map((item, index) => {
            const barHeight = Math.max((item.value / maxValue) * chartHeight, 4);
            const x = padding.left + index * barGroupWidth + (barGroupWidth - actualBarWidth) / 2;
            const y = padding.top + chartHeight - barHeight;
            
            return (
              <G key={index}>
                {/* Barra principal */}
                <Rect
                  x={x}
                  y={y}
                  width={actualBarWidth}
                  height={barHeight}
                  fill="#3b82f6"
                  rx={Math.min(actualBarWidth / 8, 4)}
                  ry={Math.min(actualBarWidth / 8, 4)}
                />
                
                {/* Efeito de gradiente/highlight */}
                {actualBarWidth >= 8 && (
                  <Rect
                    x={x + 2}
                    y={y}
                    width={actualBarWidth - 4}
                    height={Math.max(barHeight * 0.3, 2)}
                    fill="#60a5fa"
                    rx={2}
                    ry={2}
                    opacity={0.8}
                  />
                )}
                
                {/* Valor em cima da barra (apenas se houver espaço) */}
                {barHeight > 20 && showLabels && item.value > 0 && (
                  <SvgText
                    x={x + actualBarWidth / 2}
                    y={y - 6}
                    fontSize="9"
                    fill={theme.colors.text}
                    textAnchor="middle"
                    fontWeight="700"
                  >
                    {item.value}
                  </SvgText>
                )}
                
                {/* Label do horário */}
                {showLabels && (
                  <SvgText
                    x={x + actualBarWidth / 2}
                    y={padding.top + chartHeight + 18}
                    fontSize="9"
                    fill={theme.colors.textSecondary}
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {item.hour.split(':')[0]}h
                  </SvgText>
                )}
              </G>
            );
          })}

          {/* Linha base sutil */}
          <Line
            x1={padding.left}
            y1={padding.top + chartHeight}
            x2={baseChartWidth - padding.right}
            y2={padding.top + chartHeight}
            stroke="#d1d5db"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </Svg>
      </View>
      
      {/* Valor máximo para referência */}
      {maxValue > 0 && (
        <Text style={{
          fontSize: theme.fontSizes.xs,
          color: theme.colors.textSecondary,
          marginTop: theme.spacing.sm,
          textAlign: 'center'
        }}>
          Máximo: {maxValue} unidades
        </Text>
      )}
    </View>
  );
};

// Componente do header com fundo igual ao da tela de login
const DashboardHeader: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { width: screenWidth } = useWindowDimensions();
  
  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={{
        paddingTop: 50,
        paddingBottom: 24,
        paddingHorizontal: theme.spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10
      }}
      resizeMode="cover"
    >
      {/* Logo VITON */}
      <View style={{
        backgroundColor: '#fbbf24',
        borderRadius: theme.borderRadius.xl,
        width: 58,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5
      }}>
        <Text style={{ 
          fontSize: theme.fontSizes.xs, 
          fontWeight: '900', 
          color: '#000',
          letterSpacing: 0.8
        }}>VITON</Text>
      </View>
      
      {/* Logo PCOUNT com design da tela de login */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        flex: 1
      }}>
        <Text style={{
          fontSize: Math.min(screenWidth * 0.08, 32),
          fontWeight: '800',
          color: 'rgba(255, 255, 255, 0.95)',
          letterSpacing: 1,
          textShadowColor: 'rgba(0, 0, 0, 0.2)',
          textShadowOffset: { width: 0, height: 2 },
          textShadowRadius: 4
        }}>
          PC
        </Text>
        <View style={{
          width: Math.max(screenWidth * 0.06, 24),
          height: Math.max(screenWidth * 0.06, 24),
          borderRadius: Math.max(screenWidth * 0.03, 12),
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: screenWidth * 0.01,
          elevation: 6
        }}>
          <MaterialIcons name="visibility" size={Math.max(screenWidth * 0.03, 12)} color="#667eea" />
        </View>
        <Text style={{
          fontSize: Math.min(screenWidth * 0.08, 32),
          fontWeight: '800',
          color: 'rgba(255, 255, 255, 0.95)',
          letterSpacing: 1,
          textShadowColor: 'rgba(0, 0, 0, 0.2)',
          textShadowOffset: { width: 0, height: 2 },
          textShadowRadius: 4
        }}>
          UNT
        </Text>
      </View>
      
      {/* Botão Logout */}
      <TouchableOpacity
        onPress={onLogout}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: theme.borderRadius.xl,
          width: 44,
          height: 44,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 5
        }}
      >
        <MaterialIcons name="power-settings-new" size={22} color="rgba(255, 255, 255, 0.95)" />
      </TouchableOpacity>
    </ImageBackground>
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
          backgroundColor: '#ffffff',
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          borderRadius: 20,
          marginBottom: theme.spacing.md,
          alignSelf: 'flex-start',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          shadowColor: '#64748b',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          flexDirection: 'row',
          alignItems: 'center',
          minWidth: 240
        }}
      >
        <View style={{
          backgroundColor: '#3b82f6',
          borderRadius: 8,
          width: 32,
          height: 32,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: theme.spacing.sm
        }}>
          <MaterialIcons name="date-range" size={18} color="#ffffff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ 
            color: '#475569', 
            fontSize: theme.fontSizes.xs, 
            fontWeight: '500',
            marginBottom: 2
          }}>
            Período selecionado
          </Text>
          <Text style={{ 
            color: '#1e293b', 
            fontSize: theme.fontSizes.sm, 
            fontWeight: '700'
          }}>
            {formatDate(startDate)} - {formatDate(endDate)}
          </Text>
        </View>
        <MaterialIcons name="keyboard-arrow-down" size={20} color="#64748b" />
      </TouchableOpacity>
      
      <Modal visible={showModal} transparent animationType="slide">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: theme.spacing.lg
        }}>
          <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            padding: theme.spacing.xl,
            width: '100%',
            maxWidth: 340,
            maxHeight: '85%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 10
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing.lg
            }}>
              <View style={{
                backgroundColor: '#3b82f6',
                borderRadius: 10,
                width: 36,
                height: 36,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: theme.spacing.md
              }}>
                <MaterialIcons name="date-range" size={20} color="#ffffff" />
              </View>
              <Text style={{ 
                color: '#1e293b', 
                fontSize: theme.fontSizes.lg, 
                fontWeight: '700'
              }}>
                Selecionar Período
              </Text>
            </View>
            
            {/* Seleção manual de datas */}
            <View style={{ marginBottom: theme.spacing.lg }}>
              <Text style={{ 
                color: '#475569', 
                fontSize: theme.fontSizes.sm, 
                fontWeight: '600',
                marginBottom: theme.spacing.sm
              }}>
                Data Inicial:
              </Text>
              <View style={{ 
                backgroundColor: '#f8fafc', 
                borderRadius: 16, 
                marginBottom: theme.spacing.md,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                borderWidth: 1,
                borderColor: '#e2e8f0'
              }}>
                <Input
                  value={tempStartDate}
                  onChangeText={setTempStartDate}
                  placeholder="dd/mm/yyyy"
                  placeholderTextColor="#94a3b8"
                  style={{ 
                    color: '#1e293b', 
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    margin: 0,
                    height: 40,
                    fontSize: theme.fontSizes.sm
                  }}
                />
              </View>
              
              <Text style={{ 
                color: '#475569', 
                fontSize: theme.fontSizes.sm, 
                fontWeight: '600',
                marginBottom: theme.spacing.sm
              }}>
                Data Final:
              </Text>
              <View style={{ 
                backgroundColor: '#f8fafc', 
                borderRadius: 16, 
                marginBottom: theme.spacing.md,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                borderWidth: 1,
                borderColor: '#e2e8f0'
              }}>
                <Input
                  value={tempEndDate}
                  onChangeText={setTempEndDate}
                  placeholder="dd/mm/yyyy"
                  placeholderTextColor="#94a3b8"
                  style={{ 
                    color: '#1e293b', 
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    margin: 0,
                    height: 40,
                    fontSize: theme.fontSizes.sm
                  }}
                />
              </View>
            </View>
            
            {/* Períodos pré-definidos */}
            <Text style={{ 
              color: '#475569', 
              fontSize: theme.fontSizes.sm, 
              fontWeight: '600',
              marginBottom: theme.spacing.sm
            }}>
              Períodos rápidos:
            </Text>
            {presetRanges.map((range, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  // Converte as datas dos presets para DD/MM/YYYY
                  setTempStartDate(formatDateForInput(range.start));
                  setTempEndDate(formatDateForInput(range.end));
                }}
                style={{
                  backgroundColor: '#3b82f6',
                  paddingHorizontal: theme.spacing.lg,
                  paddingVertical: theme.spacing.md,
                  borderRadius: 16,
                  marginBottom: theme.spacing.sm,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <MaterialIcons name="schedule" size={16} color="#ffffff" style={{ marginRight: theme.spacing.sm }} />
                <Text style={{ 
                  color: '#ffffff', 
                  fontWeight: '600',
                  fontSize: theme.fontSizes.sm
                }}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
            
            <View style={{ flexDirection: 'row', marginTop: theme.spacing.lg, gap: theme.spacing.sm }}>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={{
                  backgroundColor: '#f1f5f9',
                  paddingVertical: theme.spacing.md,
                  paddingHorizontal: theme.spacing.lg,
                  borderRadius: 16,
                  flex: 1,
                  borderWidth: 1,
                  borderColor: '#e2e8f0'
                }}
              >
                <Text style={{ 
                  color: '#475569', 
                  textAlign: 'center', 
                  fontWeight: '600',
                  fontSize: theme.fontSizes.sm
                }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleSave}
                style={{
                  backgroundColor: '#3b82f6',
                  paddingVertical: theme.spacing.md,
                  paddingHorizontal: theme.spacing.lg,
                  borderRadius: 16,
                  flex: 1
                }}
              >
                <Text style={{ 
                  color: '#ffffff', 
                  textAlign: 'center', 
                  fontWeight: '700',
                  fontSize: theme.fontSizes.sm
                }}>
                  Aplicar
                </Text>
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
          backgroundColor: '#ffffff',
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          borderRadius: 20,
          marginBottom: theme.spacing.lg,
          borderWidth: 1,
          borderColor: '#e2e8f0',
          shadowColor: '#64748b',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          minWidth: 200
        }}
      >
        <View style={{
          backgroundColor: '#10b981',
          borderRadius: 8,
          width: 32,
          height: 32,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: theme.spacing.sm
        }}>
          <MaterialIcons name="factory" size={18} color="#ffffff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ 
            color: '#475569', 
            fontSize: theme.fontSizes.xs, 
            fontWeight: '500',
            marginBottom: 2
          }}>
            Linha de produção
          </Text>
          <Text style={{ 
            color: '#1e293b', 
            fontSize: theme.fontSizes.sm, 
            fontWeight: '700'
          }}>
            {selectedLineId ? selectedLine?.name || 'Linha específica' : 'Todas as Linhas'}
          </Text>
        </View>
        <MaterialIcons name="keyboard-arrow-down" size={20} color="#64748b" />
      </TouchableOpacity>
      
      <Modal visible={showModal} transparent animationType="slide">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: theme.spacing.lg
        }}>
          <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            padding: theme.spacing.xl,
            width: '100%',
            maxWidth: 320,
            maxHeight: '80%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 10
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing.lg
            }}>
              <View style={{
                backgroundColor: '#10b981',
                borderRadius: 10,
                width: 36,
                height: 36,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: theme.spacing.md
              }}>
                <MaterialIcons name="factory" size={20} color="#ffffff" />
              </View>
              <Text style={{ 
                color: '#1e293b', 
                fontSize: theme.fontSizes.lg, 
                fontWeight: '700'
              }}>
                Selecionar Linha
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={() => {
                onLineChange(null);
                setShowModal(false);
              }}
              style={{
                backgroundColor: selectedLineId === null ? '#3b82f6' : '#f8fafc',
                paddingHorizontal: theme.spacing.lg,
                paddingVertical: theme.spacing.md,
                borderRadius: 16,
                marginBottom: theme.spacing.sm,
                borderWidth: selectedLineId === null ? 0 : 1,
                borderColor: '#e2e8f0',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <View style={{
                backgroundColor: selectedLineId === null ? 'rgba(255, 255, 255, 0.2)' : '#e2e8f0',
                borderRadius: 6,
                width: 24,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: theme.spacing.sm
              }}>
                <MaterialIcons 
                  name="check-circle" 
                  size={16} 
                  color={selectedLineId === null ? '#ffffff' : '#64748b'} 
                />
              </View>
              <Text style={{ 
                color: selectedLineId === null ? '#ffffff' : '#1e293b', 
                fontWeight: selectedLineId === null ? '700' : '500',
                fontSize: theme.fontSizes.sm
              }}>
                Todas as Linhas
              </Text>
            </TouchableOpacity>
            
            <ScrollView style={{ maxHeight: 280 }} showsVerticalScrollIndicator={false}>
              {lines.map((line) => (
                <TouchableOpacity
                  key={line.id}
                  onPress={() => {
                    onLineChange(line.id);
                    setShowModal(false);
                  }}
                  style={{
                    backgroundColor: selectedLineId === line.id ? '#3b82f6' : '#f8fafc',
                    paddingHorizontal: theme.spacing.lg,
                    paddingVertical: theme.spacing.md,
                    borderRadius: 16,
                    marginBottom: theme.spacing.sm,
                    borderWidth: selectedLineId === line.id ? 0 : 1,
                    borderColor: '#e2e8f0',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <View style={{
                    backgroundColor: selectedLineId === line.id ? 'rgba(255, 255, 255, 0.2)' : '#e2e8f0',
                    borderRadius: 6,
                    width: 24,
                    height: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: theme.spacing.sm
                  }}>
                    <MaterialIcons 
                      name="check-circle" 
                      size={16} 
                      color={selectedLineId === line.id ? '#ffffff' : '#64748b'} 
                    />
                  </View>
                  <Text style={{ 
                    color: selectedLineId === line.id ? '#ffffff' : '#1e293b', 
                    fontWeight: selectedLineId === line.id ? '700' : '500',
                    fontSize: theme.fontSizes.sm
                  }}>
                    {line.name} {line.code}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={{
                backgroundColor: '#f1f5f9',
                paddingVertical: theme.spacing.md,
                borderRadius: 16,
                marginTop: theme.spacing.lg,
                borderWidth: 1,
                borderColor: '#e2e8f0'
              }}
            >
              <Text style={{ 
                color: '#475569', 
                textAlign: 'center', 
                fontWeight: '600',
                fontSize: theme.fontSizes.sm
              }}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export const DashboardScreen: React.FC = () => {
  const { selectedContract, currentUser, logout } = useAuth();
  const { width } = useWindowDimensions();
  
  // Breakpoints dinâmicos baseados na largura atual
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;
  
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
  
  // Buscar as estatísticas de produção usando o contrato selecionado e filtros
  // IMPORTANTE: Este hook deve ser chamado ANTES dos early returns para manter a ordem dos hooks
  const { data: productionStats, loading, error } = useProductionStats(
    selectedContract?.id || '',
    filters
  );

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  const handleLogout = async () => {
    await logout();
  };

  // Verificar se um contrato foi selecionado e usuário autenticado
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
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingBottom: theme.spacing.xl,
          paddingHorizontal: getResponsivePadding(width),
          paddingTop: getResponsivePadding(width)
        }}
      >
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
          fontSize: isSmallScreen ? 16 : isMediumScreen ? 18 : 20, 
          fontWeight: 'bold', 
          color: theme.colors.text, 
          marginBottom: getResponsivePadding(width),
          textAlign: 'center',
          paddingHorizontal: theme.spacing.sm
        }}>
          Dashboard {selectedLineId ? productionLines?.find(l => l.id === selectedLineId)?.name : ''}
        </Text>
        
        {/* Cartões de estatísticas com layout responsivo real */}
        {isSmallScreen ? (
          // Layout responsivo para telas pequenas: primeiro card full-width, outros dois em linha
          <View style={{ marginBottom: theme.spacing.lg }}>
            {/* Primeiro cartão ocupando largura total */}
            <View style={{ marginBottom: theme.spacing.sm }}>
              <StatCard
                title="Hora(s)"
                value={`${stats.operationHours}`}
                subtitle="Operação"
                icon="schedule"
                accentColor="#f59e0b"
              />
            </View>
            
            {/* Dois cartões em linha */}
            <View style={{ 
              flexDirection: 'row'
            }}>
              <View style={{ flex: 1, marginRight: getResponsiveCardSpacing(width) / 2 }}>
                <StatCard
                  title="Hora(s)"
                  value={`${stats.productiveHours}`}
                  subtitle="Produtivas"
                  icon="warning"
                  accentColor="#ef4444"
                />
              </View>
              <View style={{ flex: 1, marginLeft: getResponsiveCardSpacing(width) / 2 }}>
                <StatCard
                  title="Produção"
                  value={`${stats.avgProduction}`}
                  subtitle="Média / Hr"
                  icon="trending-up"
                  accentColor="#06b6d4"
                />
              </View>
            </View>
          </View>
        ) : (
          // Layout horizontal tradicional para telas médias e grandes
          <View style={{ 
            flexDirection: 'row', 
            marginBottom: theme.spacing.lg,
            paddingHorizontal: theme.spacing.xs
          }}>
            <View style={{ flex: 1, marginRight: getResponsiveCardSpacing(width) }}>
              <StatCard
                title="Hora(s)"
                value={`${stats.operationHours}`}
                subtitle="Operação"
                icon="schedule"
                accentColor="#f59e0b"
              />
            </View>
            
            <View style={{ flex: 1, marginHorizontal: getResponsiveCardSpacing(width) }}>
              <StatCard
                title="Hora(s)"
                value={`${stats.productiveHours}`}
                subtitle="Produtivas"
                icon="warning"
                accentColor="#ef4444"
              />
            </View>
            
            <View style={{ flex: 1, marginLeft: getResponsiveCardSpacing(width) }}>
              <StatCard
                title="Produção"
                value={`${stats.avgProduction}`}
                subtitle="Média / Hr"
                icon="trending-up"
                accentColor="#06b6d4"
              />
            </View>
          </View>
        )}
        
        {/* Cartão do Total Produzido */}
        <TotalProducedCard
          value={stats.totalProduced}
          title="TOTAL PRODUZIDO"
          subtitle="Unidades produzidas no período"
        />
        
        <View style={{ 
          backgroundColor: '#ffffff',
          borderRadius: theme.borderRadius.xl,
          padding: isSmallScreen ? theme.spacing.md : theme.spacing.lg,
          marginTop: theme.spacing.lg,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3
        }}>
          <Text style={{ 
            fontSize: isSmallScreen ? 12 : 14, 
            fontWeight: 'bold', 
            marginBottom: theme.spacing.md, 
            color: theme.colors.text,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 0.5
          }}>
            TOTAL PRODUZIDO / HORA
          </Text>
          <BarChart data={stats.hourlyProduction} />
          <Text style={{ 
            fontSize: isSmallScreen ? 10 : 11, 
            color: theme.colors.textSecondary, 
            textAlign: 'center', 
            marginTop: theme.spacing.sm,
            paddingHorizontal: theme.spacing.sm
          }}>
            Unidades produzidas por horário de trabalho
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
};