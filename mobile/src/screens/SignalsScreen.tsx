import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import client from '../api/client';

interface Signal {
  id: number;
  signal_type: 'BUY' | 'SELL';
  confidence: number;
  entry_price: number;
  stop_loss: number;
  take_profit_1: number;
  take_profit_2?: number | null;
  take_profit_3?: number | null;
  reasoning: string;
  created_at: string;
}

interface LevelRowProps {
  label: string;
  value?: number | null;
  color?: string;
}

export default function SignalsScreen() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [latest, setLatest] = useState<Signal | null>(null);

  const fetchSignals = async (): Promise<void> => {
    try {
      const res = await client.get<Signal[]>(
        '/signals/history?limit=10'
      );

      setSignals(res.data);

      if (res.data.length > 0) {
        setLatest(res.data[0]);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Error:', error.message);
      } else {
        console.log('Error:', error);
      }
    }
  };

  const generateSignal = async (): Promise<void> => {
    try {
      Alert.alert(
        'Generating...',
        'Analyzing market conditions'
      );

      const res = await client.post<Signal>(
        '/signals/generate'
      );

      setLatest(res.data);

      await fetchSignals();
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Trading Signals</Text>

      <TouchableOpacity
        style={styles.generateBtn}
        onPress={generateSignal}
      >
        <Text style={styles.generateText}>
          Generate New Signal
        </Text>
      </TouchableOpacity>

      {latest && (
        <View
          style={[
            styles.signalCard,
            latest.signal_type === 'BUY'
              ? styles.buyCard
              : styles.sellCard,
          ]}
        >
          <Text style={styles.signalType}>
            {latest.signal_type}
          </Text>

          <Text style={styles.confidence}>
            {(latest.confidence * 100).toFixed(0)}% Confidence
          </Text>

          <View style={styles.levels}>
            <LevelRow
              label="Entry"
              value={latest.entry_price}
            />

            <LevelRow
              label="Stop Loss"
              value={latest.stop_loss}
              color="#ef5350"
            />

            <LevelRow
              label="Take Profit 1"
              value={latest.take_profit_1}
              color="#26a69a"
            />

            {latest.take_profit_2 != null && (
              <LevelRow
                label="TP2"
                value={latest.take_profit_2}
                color="#26a69a"
              />
            )}

            {latest.take_profit_3 != null && (
              <LevelRow
                label="TP3"
                value={latest.take_profit_3}
                color="#26a69a"
              />
            )}
          </View>

          <Text style={styles.reasoning}>
            {latest.reasoning}
          </Text>
        </View>
      )}

      <Text style={styles.subtitle}>
        Signal History
      </Text>

      {signals.map((s) => (
        <View key={s.id} style={styles.historyCard}>
          <Text
            style={[
              styles.historyType,
              s.signal_type === 'BUY'
                ? styles.buyText
                : styles.sellText,
            ]}
          >
            {s.signal_type}
          </Text>

          <Text style={styles.historyPrice}>
            Entry: {s.entry_price.toFixed(2)}
          </Text>

          <Text style={styles.historyTime}>
            {new Date(s.created_at).toLocaleString()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

function LevelRow({
  label,
  value,
  color = '#fff',
}: LevelRowProps) {
  return (
    <View style={styles.levelRow}>
      <Text style={styles.levelLabel}>
        {label}
      </Text>

      <Text
        style={[
          styles.levelValue,
          { color },
        ]}
      >
        {value?.toFixed(2) ?? '--'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131722',
    padding: 16,
  },

  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  generateBtn: {
    backgroundColor: '#2962FF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },

  generateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  signalCard: {
    backgroundColor: '#1e222d',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
  },

  buyCard: {
    borderLeftColor: '#26a69a',
  },

  sellCard: {
    borderLeftColor: '#ef5350',
  },

  signalType: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },

  confidence: {
    color: '#787b86',
    fontSize: 14,
    marginBottom: 12,
  },

  levels: {
    marginVertical: 10,
  },

  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },

  levelLabel: {
    color: '#787b86',
    fontSize: 14,
  },

  levelValue: {
    fontSize: 16,
    fontWeight: '600',
  },

  reasoning: {
    color: '#b2b5be',
    fontSize: 13,
    marginTop: 10,
    lineHeight: 18,
  },

  subtitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },

  historyCard: {
    backgroundColor: '#1e222d',
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },

  historyType: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  buyText: {
    color: '#26a69a',
  },

  sellText: {
    color: '#ef5350',
  },

  historyPrice: {
    color: '#d1d4dc',
    fontSize: 14,
    marginTop: 4,
  },

  historyTime: {
    color: '#787b86',
    fontSize: 11,
    marginTop: 4,
  },
});