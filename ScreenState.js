// components/ScreenState.js
// Shared loading / empty / error states so every Firestore-backed screen
// looks consistent instead of a bare spinner or blank white flash.
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme/theme';

export function LoadingState({ label = 'Loading…' }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.gold} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export function EmptyState({ title = 'Nothing here yet', subtitle }) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function ErrorState({ message = 'Something went wrong.' }) {
  return (
    <View style={styles.center}>
      <Text style={[styles.title, { color: colors.red }]}>Connection lost</Text>
      <Text style={styles.subtitle}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  label: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontFamily: typography.body,
    fontSize: 13,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: typography.displaySemi,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 12,
    textAlign: 'center',
  },
});

