// components/NewsTicker.js
// Auto-scrolling marquee of tournament updates, fed by
// /tournamentInfo/ticker { messages: string[] } in Firestore.
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { colors, typography } from '../theme/theme';

const { width: SCREEN_W } = Dimensions.get('window');

export default function NewsTicker({ messages = [] }) {
  const translateX = useRef(new Animated.Value(SCREEN_W)).current;
  const text = messages.length ? messages.join('     ●     ') : 'Loading tournament updates…';
  const [textWidth, setTextWidth] = useState(SCREEN_W);

  useEffect(() => {
    translateX.setValue(SCREEN_W);
    const distance = SCREEN_W + textWidth;
    const anim = Animated.loop(
      Animated.timing(translateX, {
        toValue: -textWidth,
        duration: distance * 18,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [textWidth, text]);

  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>NEWS</Text>
      </View>
      <View style={styles.viewport}>
        <Animated.Text
          onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
          style={[styles.text, { transform: [{ translateX }] }]}
          numberOfLines={1}
        >
          {text}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    height: 34,
  },
  badge: {
    backgroundColor: colors.gold,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  badgeText: {
    fontFamily: typography.displaySemi,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.bg,
  },
  viewport: {
    flex: 1,
    overflow: 'hidden',
    height: '100%',
    justifyContent: 'center',
  },
  text: {
    color: colors.textSecondary,
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    position: 'absolute',
    whiteSpace: 'nowrap',
  },
});

