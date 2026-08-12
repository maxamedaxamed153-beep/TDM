// screens/ScheduleScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firestore';
import MatchCard from '../components/MatchCard';
import { LoadingState, EmptyState, ErrorState } from '../components/ScreenState';
import { colors, typography, spacing } from '../theme/theme';

function dateKey(ts) {
  const date = typeof ts?.toDate === 'function' ? ts.toDate() : new Date(ts);
  if (isNaN(date.getTime())) return 'TBD';
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function ScheduleScreen() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'matches'),
      where('status', 'in', ['upcoming', 'live']),
      orderBy('scheduledAt', 'asc')
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setMatches(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error('ScheduleScreen error:', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const sections = useMemo(() => {
    const grouped = {};
    matches.forEach((m) => {
      const key = dateKey(m.scheduledAt);
      grouped[key] = grouped[key] || [];
      grouped[key].push(m);
    });
    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [matches]);

  if (loading) return <LoadingState label="Loading schedule…" />;
  if (error) return <ErrorState message={error} />;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>MATCH SCHEDULE</Text>
        <Text style={styles.subtitle}>All upcoming fixtures</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled
        ListEmptyComponent={<EmptyState title="No matches scheduled" />}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{section.title.toUpperCase()}</Text>
          </View>
        )}
        renderItem={({ item }) => <MatchCard match={item} />}
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
  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  sectionHeader: {
    backgroundColor: colors.bg,
    paddingVertical: spacing.sm,
  },
  sectionHeaderText: {
    color: colors.cyan,
    fontFamily: typography.bodyBold,
    fontSize: 12,
    letterSpacing: 1.5,
  },
});

