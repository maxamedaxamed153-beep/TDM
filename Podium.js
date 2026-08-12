// components/Podium.js
// Stylized top-3 podium. Rank 1 sits elevated in the center with a gold
// hex frame + crown; 2 and 3 flank it, lower and cooler-toned — a visual
// hierarchy instead of three identical rows.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TeamLogo from './TeamLogo';
import { colors, typography, radius } from '../theme/theme';

const STEP_HEIGHT = { 1: 92, 2: 64, 3: 48 };
const LOGO_SIZE = { 1: 76, 2: 58, 3: 58 };

function PodiumSlot({ team, place }) {
  if (!team) return <View style={styles.slot} />;
  return (
    <View style={styles.slot}>
      {place === 1 && <Text style={styles.crown}>👑</Text>}
      <TeamLogo uri={team.logoUrl} size={LOGO_SIZE[place]} tier={place === 1 ? 'gold' : 'default'} />
      <Text style={styles.name} numberOfLines={1}>{team.name}</Text>
      <Text style={styles.points}>{team.points ?? 0} PTS</Text>
      <View style={[styles.step, { height: STEP_HEIGHT[place] }, place === 1 && styles.stepFirst]}>
        <Text style={[styles.stepNum, place === 1 && styles.stepNumFirst]}>{place}</Text>
      </View>
    </View>
  );
}

export default function Podium({ teams = [] }) {
  const [first, second, third] = teams;
  return (
    <View style={styles.wrap}>
      <PodiumSlot team={second} place={2} />
      <PodiumSlot team={first} place={1} />
      <PodiumSlot team={third} place={3} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingTop: 8,
  },
  slot: {
    width: 108,
    alignItems: 'center',
  },
  crown: { fontSize: 20, marginBottom: 2 },
  name: {
    color: colors.textPrimary,
    fontFamily: typography.bodyBold,
    fontSize: 13,
    marginTop: 8,
    maxWidth: 100,
  },
  points: {
    color: colors.gold,
    fontFamily: typography.displaySemi,
    fontSize: 13,
    marginTop: 2,
    marginBottom: 8,
  },
  step: {
    width: '100%',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopLeftRadius: radius.sm,
    borderTopRightRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 6,
  },
  stepFirst: {
    backgroundColor: colors.bgElevated,
    borderColor: colors.gold,
  },
  stepNum: {
    color: colors.textMuted,
    fontFamily: typography.display,
    fontSize: 22,
  },
  stepNumFirst: {
    color: colors.gold,
    fontSize: 26,
  },
});

