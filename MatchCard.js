// components/MatchCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import TeamLogo from './TeamLogo';
import ClippedCard from './ClippedCard';
import { colors, typography, spacing } from '../theme/theme';

function formatDateTime(ts) {
  const date = typeof ts?.toDate === 'function' ? ts.toDate() : new Date(ts);
  if (isNaN(date.getTime())) return { date: 'TBD', time: '' };
  return {
    date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
  };
}

export default function MatchCard({ match, onPress }) {
  const { date, time } = formatDateTime(match.scheduledAt);
  const completed = match.status === 'completed';

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onPress && onPress(match)}>
      <ClippedCard style={styles.card} accent={completed ? colors.borderLight : colors.gold}>
        <View style={styles.top}>
          <Text style={styles.map}>{match.map || 'MAP TBD'}</Text>
          <Text style={styles.dateTime}>{date} · {time}</Text>
        </View>

        <View style={styles.matchup}>
          <View style={styles.teamCol}>
            <TeamLogo uri={match.teamA?.logoUrl} size={48} />
            <Text style={styles.teamName} numberOfLines={1}>{match.teamA?.name ?? 'TBD'}</Text>
          </View>

          <View style={styles.centerCol}>
            {completed ? (
              <Text style={styles.score}>
                {match.scoreA ?? 0} - {match.scoreB ?? 0}
              </Text>
            ) : (
              <Text style={styles.vs}>VS</Text>
            )}
            {match.status === 'live' && <Text style={styles.liveTag}>LIVE</Text>}
          </View>

          <View style={styles.teamCol}>
            <TeamLogo uri={match.teamB?.logoUrl} size={48} />
            <Text style={styles.teamName} numberOfLines={1}>{match.teamB?.name ?? 'TBD'}</Text>
          </View>
        </View>
      </ClippedCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.md, marginBottom: spacing.md },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  map: {
    color: colors.textMuted,
    fontFamily: typography.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
  },
  dateTime: {
    color: colors.textSecondary,
    fontFamily: typography.body,
    fontSize: 12,
  },
  matchup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamCol: { alignItems: 'center', width: 96 },
  teamName: {
    color: colors.textPrimary,
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  centerCol: { alignItems: 'center', width: 72 },
  vs: {
    color: colors.textMuted,
    fontFamily: typography.display,
    fontSize: 18,
  },
  score: {
    color: colors.gold,
    fontFamily: typography.display,
    fontSize: 22,
  },
  liveTag: {
    color: colors.red,
    fontFamily: typography.bodyBold,
    fontSize: 10,
    letterSpacing: 1,
    marginTop: 4,
  },
});

