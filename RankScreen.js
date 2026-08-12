// screens/RankScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firestore';
import RankRow from '../components/RankRow';
import { LoadingState, EmptyState, ErrorState } from '../components/ScreenState';
import { colors, typography, spacing } from '../theme/theme';

export default function RankScreen() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'teams'), orderBy('points', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setTeams(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error('RankScreen error:', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  if (loading) return <LoadingState label="Loading leaderboard…" />;
  if (error) return <ErrorState message={error} />;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>LEADERBOARD</Text>
        <Text style={styles.subtitle}>{teams.length} teams competing</Text>
      </View>

      <View style={styles.columnHeader}>
        <Text style={[styles.colLabel, { width: 28, textAlign: 'center' }]}>#</Text>
        <Text style={[styles.colLabel, { flex: 1, marginLeft: 44 + spacing.sm * 2 }]}>TEAM</Text>
        <Text style={styles.colLabel}>POINTS</Text>
      </View>

      <FlatList
        data={teams}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListEmptyComponent={<EmptyState title="No teams ranked yet" />}
        renderItem={({ item, index }) => <RankRow rank={index + 1} team={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { padding: spacing.md, paddingBottom: spacing.sm },
  title: {
    color: colors.textPrimary,
    fontFamily: typography.display,
    fontSize: 24,
    letterSpacing: 1,
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 12,
    marginTop: 2,
  },
  columnHeader: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  colLabel: {
    color: colors.textMuted,
    fontFamily: typography.bodyBold,
    fontSize: 10,
    letterSpacing: 1,
  },
  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
});

