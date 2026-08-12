// components/ClippedCard.js
// The app's signature surface: a panel with a clipped top-right corner and a
// thin gold hairline tracing the cut, like a HUD readout. Used for every
// card in the app so the "tactical panel" language stays consistent.
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon, Line } from 'react-native-svg';
import { colors, radius } from '../theme/theme';

const CUT = 18;

export default function ClippedCard({ children, style, accent = colors.gold, elevated = false }) {
  return (
    <View style={[styles.wrap, style]}>
      <View
        style={[
          styles.body,
          { backgroundColor: elevated ? colors.surfaceAlt : colors.surface },
        ]}
      >
        {children}
      </View>
      {/* corner cut overlay */}
      <Svg width={CUT + 2} height={CUT + 2} style={styles.corner} pointerEvents="none">
        <Polygon points={`0,0 ${CUT},0 ${CUT},${CUT}`} fill={colors.bg} />
        <Line x1={0} y1={0.5} x2={CUT} y2={0.5} stroke={accent} strokeWidth={1.5} />
        <Line x1={CUT - 0.5} y1={0} x2={CUT - 0.5} y2={CUT} stroke={accent} strokeWidth={1.5} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  body: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  corner: {
    position: 'absolute',
    top: -1,
    right: -1,
  },
});

