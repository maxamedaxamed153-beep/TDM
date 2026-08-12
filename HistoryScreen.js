// screens/HistoryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firestore';
import MatchCard from '../components/MatchCard';
import TeamLogo from '../components/TeamLogo';
import { LoadingState, EmptyState, ErrorState } from '../components/ScreenState';
import { colors, typography, spacing, radius } from '../theme/theme';

export default function HistoryScreen() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'matches'),
      where('status', '==', 'completed'),
      orderBy('scheduledAt', 'desc')
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setMatches(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error('HistoryScreen error:', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  if (loading) return <LoadingState label="Loading match history…" />;
  if (error) return <ErrorState message={error} />;

  return (
    <View style={styles.screen}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListEmptyComponent={<EmptyState title="No completed matches yet" />}
        renderItem={({ item }) => <MatchCard match={item} onPress={setSelected} />}
      />

      <Modal
        visible={!!selected}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setSelected(null)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalCard}>
            {selected && <MatchDetail match={selected} onClose={() => setSelected(null)} />}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function MatchDetail({ match, onClose }) {
  return (
    <View>
      <View style={styles.modalHeader}>
        <Text style={styles.modalMap}>{match.map || 'MAP TBD'}</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.modalMatchup}>
        <View style={styles.modalTeam}>
          <TeamLogo uri={match.teamA?.logoUrl} size={64} tier={match.winner === 'A' ? 'gold' : 'default'} />
          <Text style={styles.modalTeamName}>{match.teamA?.name ?? 'TBD'}</Text>
        </View>
        <Text style={styles.modalScore}>{match.scoreA ?? 0} - {match.scoreB ?? 0}</Text>
        <View style={styles.modalTeam}>
          <TeamLogo uri={match.teamB?.logoUrl} size={64} tier={match.winner === 'B' ? 'gold' : 'default'} />
          <Text style={styles.modalTeamName}>{match.teamB?.name ?? 'TBD'}</Text>
        </View>
      </View>

      <Text style={styles.summaryLabel}>SUMMARY</Text>
      <Text style={styles.summaryText}>{match.summary || 'No summary provided for this match.'}</Text>

      {match.mvp ? (
        <View style={styles.mvpRow}>
          <Text style={styles.summaryLabel}>MVP</Text>
          <View style={styles.mvpBadge}>
            {match.mvp.photoUrl ? (
              <Image source={{ uri: match.mvp.photoUrl }} style={styles.mvpPhoto} />
            ) : null}
            <View>
              <Text style={styles.mvpName}>{match.mvp.playerName}</Text>
              <Text style={styles.mvpStats}>
                {match.mvp.kills ?? 0} kills · {match.mvp.damage ?? 0} dmg
              </Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalMap: {
    color: colors.cyan,
    fontFamily: typography.bodyBold,
    fontSize: 12,
    letterSpacing: 1,
  },
  close: { color: colors.textMuted, fontSize: 18 },
  modalMatchup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  modalTeam: { alignItems: 'center', width: 100 },
  modalTeamName: {
    color: colors.textPrimary,
    fontFamily: typography.bodyBold,
    fontSize: 13,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  modalScore: {
    color: colors.gold,
    fontFamily: typography.display,
    fontSize: 28,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontFamily: typography.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  summaryText: {
    color: colors.textSecondary,
    fontFamily: typography.body,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: spacing.md,
  },
  mvpRow: { marginTop: spacing.sm },
  mvpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.goldDim,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  mvpPhoto: { width: 40, height: 40, borderRadius: 20, marginRight: spacing.sm },
  mvpName: { color: colors.textPrimary, fontFamily: typography.bodyBold, fontSize: 13 },
  mvpStats: { color: colors.textMuted, fontFamily: typography.body, fontSize: 11, marginTop: 2 },
});

