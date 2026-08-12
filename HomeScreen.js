// screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firestore';
import TeamLogo from '../components/TeamLogo';
import ClippedCard from '../components/ClippedCard';
import CountdownTimer from '../components/CountdownTimer';
import Podium from '../components/Podium';
import NewsTicker from '../components/NewsTicker';
import { LoadingState, EmptyState, ErrorState } from '../components/ScreenState';
import { colors, typography, spacing } from '../theme/theme';

export default function HomeScreen() {
  const [nextMatch, setNextMatch] = useState(null);
  const [topTeams, setTopTeams] = useState([]);
  const [ticker, setTicker] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Next upcoming match: earliest scheduledAt with status "upcoming" or "live"
  useEffect(() => {
    const q = query(
      collection(db, 'matches'),
      where('status', 'in', ['upcoming', 'live']),
      orderBy('scheduledAt', 'asc'),
      limit(1)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setNextMatch(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() });
        setLoading(false);
      },
      (err) => {
        console.error('HomeScreen next match error:', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  // Top 3 teams by points
  useEffect(() => {
    const q = query(collection(db, 'teams'), orderBy('points', 'desc'), limit(3));
    const unsub = onSnapshot(q, (snap) => {
      setTopTeams(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // News ticker: single doc /tournamentInfo/ticker { messages: [...] }
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'tournamentInfo'), (snap) => {
      const doc = snap.docs.find((d) => d.id === 'ticker');
      setTicker(doc?.data()?.messages ?? []);
    });
    return unsub;
  }, []);

  if (loading) return <LoadingState label="Loading tournament…" />;
  if (error) return <ErrorState message={error} />;

  return (
    <View style={styles.screen}>
      <NewsTicker messages={ticker} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={false} tintColor={colors.gold} />}
      >
        <Text style={styles.sectionLabel}>NEXT MATCH</Text>
        {nextMatch ? (
          <ClippedCard style={styles.banner}>
            <View style={styles.bannerTop}>
              <Text style={styles.bannerMap}>{nextMatch.map || 'MAP TBD'} · {nextMatch.round || 'Group Stage'}</Text>
            </View>
            <View style={styles.bannerMatchup}>
              <View style={styles.bannerTeam}>
                <TeamLogo uri={nextMatch.teamA?.logoUrl} size={64} tier="cyan" />
                <Text style={styles.bannerTeamName} numberOfLines={1}>{nextMatch.teamA?.name ?? 'TBD'}</Text>
              </View>
              <Text style={styles.bannerVs}>VS</Text>
              <View style={styles.bannerTeam}>
                <TeamLogo uri={nextMatch.teamB?.logoUrl} size={64} tier="cyan" />
                <Text style={styles.bannerTeamName} numberOfLines={1}>{nextMatch.teamB?.name ?? 'TBD'}</Text>
              </View>
            </View>
            <CountdownTimer targetDate={nextMatch.scheduledAt} style={styles.countdown} />
          </ClippedCard>
        ) : (
          <EmptyState title="No upcoming matches" subtitle="Check back once the next round is scheduled." />
        )}

        <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>TOP 3 TEAMS</Text>
        {topTeams.length ? (
          <ClippedCard style={styles.podiumCard}>
            <Podium teams={topTeams} />
          </ClippedCard>
        ) : (
          <EmptyState title="Leaderboard is empty" subtitle="Points will appear once matches are scored." />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  sectionLabel: {
    color: colors.textMuted,
    fontFamily: typography.bodyBold,
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  banner: { padding: spacing.md },
  bannerTop: { marginBottom: spacing.md },
  bannerMap: {
    color: colors.cyan,
    fontFamily: typography.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
  },
  bannerMatchup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTeam: { alignItems: 'center', width: 120 },
  bannerTeamName: {
    color: colors.textPrimary,
    fontFamily: typography.bodyBold,
    fontSize: 14,
    marginTop: spacing.sm,
  },
  bannerVs: {
    color: colors.textMuted,
    fontFamily: typography.display,
    fontSize: 20,
    marginHorizontal: spacing.md,
  },
  countdown: {
    justifyContent: 'center',
    marginTop: spacing.lg,
    alignSelf: 'center',
  },
  podiumCard: { paddingVertical: spacing.lg },
});

