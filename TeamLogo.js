// components/TeamLogo.js
// ---------------------------------------------------------------------------
// Teams are represented primarily by their logo, framed in a hexagon —
// reads as a squad "tag" / military insignia rather than a plain avatar.
// `tier` controls the frame color: gold for #1 / winners, cyan for
// live/active, slate as the default.
// ---------------------------------------------------------------------------
import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { colors, typography } from '../theme/theme';

const TIER_COLORS = {
  gold: colors.gold,
  cyan: colors.cyan,
  default: colors.borderLight,
};

function hexPoints(size) {
  const r = size / 2;
  const cx = r;
  const cy = r;
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join(' ');
}

export default function TeamLogo({ uri, size = 56, tier = 'default', style }) {
  const ringColor = TIER_COLORS[tier] || TIER_COLORS.default;
  const inset = 3;

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Polygon points={hexPoints(size)} fill={colors.surfaceAlt} stroke={ringColor} strokeWidth={2} />
      </Svg>
      <View style={{ position: 'absolute', top: inset, left: inset, right: inset, bottom: inset }}>
        {uri ? (
          <Image
            source={{ uri }}
            style={{ width: '100%', height: '100%', borderRadius: size }}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.fallback}>
            <Text style={[styles.fallbackText, { fontSize: size * 0.32 }]}>?</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: 999,
  },
  fallbackText: {
    color: colors.textMuted,
    fontFamily: typography.displaySemi,
  },
});

