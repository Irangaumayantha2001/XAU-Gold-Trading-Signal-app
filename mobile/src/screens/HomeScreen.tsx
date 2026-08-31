import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import client from '../api/client';

interface PriceData {
  bid?: number;
  ask?: number;
  timestamp: string;
  error?: string;
}

interface HistoryPrice {
  bid?: number;
  ask?: number;
  timestamp: string;
}

export default function HomeScreen() {
  const [price, setPrice] = useState<PriceData | null>(null);
  const [history, setHistory] = useState<HistoryPrice[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchData = async (): Promise<void> => {
    try {
      const [liveRes, historyRes] = await Promise.all([
        client.get<PriceData>('/prices/live'),
        client.get<HistoryPrice[]>('/prices/history?limit=20'),
      ]);

      setPrice(liveRes.data);
      setHistory(historyRes.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Error fetching prices:', error.message);
      } else {
        console.log('Error fetching prices:', error);
      }
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);

    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <Text style={styles.title}>XAU/USD Live Price</Text>

      {price && !price.error ? (
        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>BID</Text>

          <Text style={styles.priceValue}>
            {price.bid?.toFixed(2) ?? '--'}
          </Text>

          <Text style={styles.priceLabel}>ASK</Text>

          <Text style={[styles.priceValue, styles.askPrice]}>
            {price.ask?.toFixed(2) ?? '--'}
          </Text>

          <Text style={styles.timestamp}>
            {new Date(price.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      ) : (
        <Text style={styles.loading}>Loading price...</Text>
      )}

      <Text style={styles.subtitle}>Recent Prices</Text>

      {history.slice(-10).map((p, i) => (
        <View key={`${p.timestamp}-${i}`} style={styles.historyRow}>
          <Text style={styles.historyText}>
            Bid: {p.bid?.toFixed(2) ?? '--'}
          </Text>

          <Text style={styles.historyTime}>
            {new Date(p.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      ))}
    </ScrollView>
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
    marginBottom: 20,
  },

  priceCard: {
    backgroundColor: '#1e222d',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#26a69a',
  },

  priceLabel: {
    color: '#787b86',
    fontSize: 14,
    marginTop: 8,
  },

  priceValue: {
    color: '#26a69a',
    fontSize: 36,
    fontWeight: 'bold',
  },

  askPrice: {
    color: '#ef5350',
  },

  timestamp: {
    color: '#787b86',
    fontSize: 12,
    marginTop: 8,
  },

  loading: {
    color: '#787b86',
    fontSize: 16,
    textAlign: 'center',
  },

  subtitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 10,
  },

  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2B2B43',
  },

  historyText: {
    color: '#d1d4dc',
    fontSize: 14,
  },

  historyTime: {
    color: '#787b86',
    fontSize: 12,
  },
});
/*
import { useEffect } from "react";
import { testBackend } from "../services/api";

export default function HomeScreen() {

  useEffect(() => {
    testBackend()
      .then((data) => {
        console.log("BACKEND RESPONSE:", data);
      })
      .catch((error) => {
        console.error("BACKEND ERROR:", error);
      });
  }, []);

  return null;
}*/