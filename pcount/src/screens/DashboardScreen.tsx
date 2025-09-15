import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Svg, Rect, Text as SvgText, Line, G } from 'react-native-svg';
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

const { width } = Dimensions.get('window');

// Componente de gráfico de barras personalizado
const BarChart: React.FC<{ data: Array<{ hour: string; value: number }> }> = ({ data }) => {
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
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 16, color: theme.colors.text }}>TOTAL PRODUZIDO / HORA</Text>
          <BarChart data={productionStats.hourlyProduction} />
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