// components/CountdownTimer.js
// Ticks down to `targetDate` (a JS Date or Firestore Timestamp). Renders
// DD:HH:MM:SS in HUD-style boxes. Calls onExpire once when it hits zero.
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radius } from '../theme/theme';

function toMillis(target) {
  if (!target) return 0;
  if (typeof target?.toDate === 'function') return target.toDate().getTime(); // Firestore Timestamp
  return new Date(target).getTime();
}

function diffParts(ms) {
  const clamped = Math.max(ms, 0);
  const s = Math.floor(clamped / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

function Box({ value, label }) {
  return (
    <View style={styles.box}>
      <Text style={styles.boxValue}>{String(value).padStart(2, '0')}</Text>
      <Text style={styles.boxLabel}>{label}</Text>
    </View>
  );
}

export default function CountdownTimer({ targetDate, onExpire, style }) {
  const target = useRef(toMillis(targetDate));
  const [remaining, setRemaining] = useState(target.current - Date.now());
  const firedRef = useRef(false);

  useEffect(() => {
    target.current = toMillis(targetDate);
    setRemaining(target.current - Date.now());
    firedRef.current = false;
  }, [targetDate]);

  useEffect(() => {
    const id = setInterval(() => {
      const left = target.current - Date.now();
      setRemaining(left);
      if (left <= 0 && !firedRef.current) {
        firedRef.current = true;
        onExpire && onExpire();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [onExpire]);

  const { d, h, m, s } = diffParts(remaining);

  if (remaining <= 0) {
    return (
      <View style={[styles.liveWrap, style]}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE NOW</Text>
      </View>
    );
  }

  return (
    <View style={[styles.row, style]}>
      {d > 0 && <Box value={d} label="DAYS" />}
      <Box value={h} label="HRS" />
      <Box value={m} label="MIN" />
      <Box value={s} label="SEC" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  box: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 46,
  },
  boxValue: {
    color: colors.gold,
    fontFamily: typography.display,
    fontSize: 20,
    lineHeight: 22,
  },
  boxLabel: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 9,
    letterSpacing: 1,
    marginTop: 2,
  },
  liveWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,70,85,0.12)',
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.red,
    marginRight: 6,
  },
  liveText: {
    color: colors.red,
    fontFamily: typography.bodyBold,
    fontSize: 12,
    letterSpacing: 1,
  },
});

