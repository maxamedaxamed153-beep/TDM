// components/RankRow.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TeamLogo from './TeamLogo';
import { colors, typography, spacing, radius } from '../theme/theme';

export default function RankRow({ rank, team }) {
  const isTop3 = rank <= 3;
  const tier = rank === 1 ? 'gold' : rank <= 3 ? 'cyan' : 'default';

  return (
    <View style={[styles.row, isTop3 && styles.rowTop3]}>
      <View style={styles.rankWrap}>
        <Text style={[styles.rankNum, isTop3 && { color: rank === 1 ? colors.gold : colors.cyan }]}>
          {rank}
        </Text>
      </View>

      <TeamLogo uri={team.logoUrl} size={44} tier={tier} style={styles.logo} />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{team.name}</Text>
        <Text style={styles.subStats}>
          {team.wins ?? 0}W · {team.kills ?? 0} kills
        </Text>
      </View>

      <View style={styles.pointsWrap}>
        <Text style={styles.points}>{team.points ?? 0}</Text>
        <Text style={styles.pointsLabel}>PTS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  rowTop3: {
    borderColor: colors.goldDim,
  },
  rankWrap: { width: 28, alignItems: 'center' },
  rankNum: {
    color: colors.textMuted,
    fontFamily: typography.display,
    fontSize: 18,
  },
  logo: { marginHorizontal: spacing.sm },
  info: { flex: 1 },
  name: {
    color: colors.textPrimary,
    fontFamily: typography.bodyBold,
    fontSize: 14,
  },
  subStats: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 11,
    marginTop: 2,
  },
  pointsWrap: { alignItems: 'flex-end' },
  points: {
    color: colors.gold,
    fontFamily: typography.display,
    fontSize: 18,
  },
  pointsLabel: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 9,
    letterSpacing: 1,
  },
});

