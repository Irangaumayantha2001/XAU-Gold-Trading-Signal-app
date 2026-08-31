
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import client from "../api/client";

interface PriceData {
  symbol?: string;
  price?: number;
  bid?: number;
  ask?: number;
  unit?: string | null;
  timestamp: string;
  error?: string;
}

interface HistoryPrice {
  bid?: number;
  ask?: number;
  price?: number;
  timestamp: string;
}

export default function HomeScreen() {
  const [price, setPrice] = useState<PriceData | null>(null);
  const [history, setHistory] = useState<HistoryPrice[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (): Promise<void> => {
  try {
    console.log("FETCHING LIVE PRICE...");

    const liveRes = await client.get("/prices/live");

    console.log("STATUS:", liveRes.status);
    console.log("DATA:", liveRes.data);

    setPrice(liveRes.data);
    setError(null);

  } catch (error: any) {
    console.log("========== PRICE ERROR ==========");
    console.log("MESSAGE:", error?.message);
    console.log("STATUS:", error?.response?.status);
    console.log("RESPONSE:", error?.response?.data);
    console.log("================================");

    setError(
      error?.response?.data?.detail ||
      error?.message ||
      "Unable to load XAU/USD price"
    );

  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();

    // Refresh every 60 seconds.
    // This is safer for the Alpha Vantage free API.
    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  };

  const displayPrice =
    price?.price ??
    price?.bid ??
    null;

  const displayBid = price?.bid ?? price?.price ?? null;
  const displayAsk = price?.ask ?? price?.price ?? null;

  const lastUpdated = price?.timestamp
    ? new Date(price.timestamp).toLocaleTimeString()
    : "--";

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#26a69a"
          />
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>XAU SIGNALS</Text>
            <Text style={styles.subtitle}>
              Gold Trading Dashboard
            </Text>
          </View>

          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {/* ERROR */}
        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>
              Connection Error
            </Text>

            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        )}

        {/* MAIN PRICE CARD */}
        <View style={styles.priceCard}>
          <View style={styles.priceHeader}>
            <View>
              <Text style={styles.symbol}>
                XAU/USD
              </Text>

              <Text style={styles.marketName}>
                Gold / US Dollar
              </Text>
            </View>

            <View style={styles.marketStatus}>
              <View style={styles.statusDot} />

              <Text style={styles.statusText}>
                Market Data
              </Text>
            </View>
          </View>

          <View style={styles.mainPriceContainer}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#26a69a"
              />
            ) : displayPrice !== null ? (
              <>
                <Text style={styles.currency}>
                  $
                </Text>

                <Text style={styles.mainPrice}>
                  {displayPrice.toFixed(2)}
                </Text>
              </>
            ) : (
              <Text style={styles.noPrice}>
                --
              </Text>
            )}
          </View>

          <View style={styles.priceDivider} />

          {/* BID / ASK */}
          <View style={styles.bidAskContainer}>
            <View style={styles.bidAskBox}>
              <Text style={styles.bidAskLabel}>
                BID
              </Text>

              <Text style={styles.bidValue}>
                {displayBid !== null
                  ? displayBid.toFixed(2)
                  : "--"}
              </Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.bidAskBox}>
              <Text style={styles.bidAskLabel}>
                ASK
              </Text>

              <Text style={styles.askValue}>
                {displayAsk !== null
                  ? displayAsk.toFixed(2)
                  : "--"}
              </Text>
            </View>
          </View>

          <View style={styles.updatedContainer}>
            <Text style={styles.updatedLabel}>
              Last updated
            </Text>

            <Text style={styles.updatedTime}>
              {lastUpdated}
            </Text>
          </View>
        </View>

        {/* MARKET INFO */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Market Overview
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>
              SYMBOL
            </Text>

            <Text style={styles.statValue}>
              XAUUSD
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>
              UNIT
            </Text>

            <Text style={styles.statValue}>
              USD / OZ
            </Text>
          </View>
        </View>

        {/* RECENT PRICES */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Recent Prices
          </Text>

          <Text style={styles.sectionHint}>
            Last {Math.min(history.length, 10)}
          </Text>
        </View>

        <View style={styles.historyCard}>
          {history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyText}>
                No price history available
              </Text>
            </View>
          ) : (
            history
              .slice(-10)
              .reverse()
              .map((item, index) => {
                const itemPrice =
                  item.price ??
                  item.bid ??
                  null;

                return (
                  <View
                    key={`${item.timestamp}-${index}`}
                    style={styles.historyRow}
                  >
                    <View>
                      <Text style={styles.historyPrice}>
                        {itemPrice !== null
                          ? `$${itemPrice.toFixed(2)}`
                          : "--"}
                      </Text>

                      {item.bid !== undefined &&
                        item.ask !== undefined && (
                          <Text style={styles.historySpread}>
                            Bid {item.bid.toFixed(2)} · Ask{" "}
                            {item.ask.toFixed(2)}
                          </Text>
                        )}
                    </View>

                    <Text style={styles.historyTime}>
                      {new Date(
                        item.timestamp
                      ).toLocaleTimeString()}
                    </Text>
                  </View>
                );
              })
          )}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            XAU Signals
          </Text>

          <Text style={styles.footerSubtext}>
            Market data powered by your FastAPI backend
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0d1117",
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 40,
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  appName: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  subtitle: {
    color: "#7d8590",
    fontSize: 13,
    marginTop: 4,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#12251f",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1d4d40",
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: "#26a69a",
    marginRight: 6,
  },

  liveText: {
    color: "#26a69a",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  /* ERROR */

  errorCard: {
    backgroundColor: "#291719",
    borderWidth: 1,
    borderColor: "#5c292c",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },

  errorTitle: {
    color: "#ef5350",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 5,
  },

  errorText: {
    color: "#c9a3a5",
    fontSize: 12,
  },

  /* PRICE CARD */

  priceCard: {
    backgroundColor: "#161b22",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#252b33",
    marginBottom: 24,
  },

  priceHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  symbol: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },

  marketName: {
    color: "#7d8590",
    fontSize: 12,
    marginTop: 4,
  },

  marketStatus: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: "#26a69a",
    marginRight: 6,
  },

  statusText: {
    color: "#7d8590",
    fontSize: 10,
  },

  mainPriceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 25,
    minHeight: 58,
  },

  currency: {
    color: "#7d8590",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 6,
    marginRight: 3,
  },

  mainPrice: {
    color: "#ffffff",
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: -1,
  },

  noPrice: {
    color: "#7d8590",
    fontSize: 44,
    fontWeight: "700",
  },

  priceDivider: {
    height: 1,
    backgroundColor: "#252b33",
    marginBottom: 18,
  },

  /* BID ASK */

  bidAskContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  bidAskBox: {
    flex: 1,
    alignItems: "center",
  },

  verticalDivider: {
    width: 1,
    height: 38,
    backgroundColor: "#252b33",
  },

  bidAskLabel: {
    color: "#7d8590",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 5,
  },

  bidValue: {
    color: "#26a69a",
    fontSize: 21,
    fontWeight: "700",
  },

  askValue: {
    color: "#ef5350",
    fontSize: 21,
    fontWeight: "700",
  },

  updatedContainer: {
    alignItems: "center",
    marginTop: 20,
  },

  updatedLabel: {
    color: "#545d68",
    fontSize: 10,
  },

  updatedTime: {
    color: "#8b949e",
    fontSize: 11,
    marginTop: 3,
  },

  /* SECTION */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },

  sectionHint: {
    color: "#545d68",
    fontSize: 11,
  },

  /* STATS */

  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 26,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#161b22",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#252b33",
  },

  statLabel: {
    color: "#545d68",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 7,
  },

  statValue: {
    color: "#d1d4dc",
    fontSize: 14,
    fontWeight: "600",
  },

  /* HISTORY */

  historyCard: {
    backgroundColor: "#161b22",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#252b33",
    overflow: "hidden",
  },

  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#20262d",
  },

  historyPrice: {
    color: "#d1d4dc",
    fontSize: 15,
    fontWeight: "600",
  },

  historySpread: {
    color: "#545d68",
    fontSize: 10,
    marginTop: 3,
  },

  historyTime: {
    color: "#7d8590",
    fontSize: 11,
  },

  emptyHistory: {
    padding: 30,
    alignItems: "center",
  },

  emptyText: {
    color: "#545d68",
    fontSize: 13,
  },

  /* FOOTER */

  footer: {
    alignItems: "center",
    marginTop: 30,
  },

  footerText: {
    color: "#545d68",
    fontSize: 12,
    fontWeight: "600",
  },

  footerSubtext: {
    color: "#3f4650",
    fontSize: 10,
    marginTop: 4,
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