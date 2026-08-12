// navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import RankScreen from '../screens/RankScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import { colors, typography } from '../theme/theme';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: 'home',
  History: 'time',
  Rank: 'trophy',
  'Match Time': 'calendar',
};

const NavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bgElevated,
    border: colors.border,
    primary: colors.gold,
    text: colors.textPrimary,
  },
};

function TabIcon({ name, focused }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons
        name={focused ? ICONS[name] : `${ICONS[name]}-outline`}
        size={20}
        color={focused ? colors.gold : colors.textMuted}
      />
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer theme={NavTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: colors.bgElevated },
          headerTitleStyle: { fontFamily: typography.displaySemi, color: colors.textPrimary, letterSpacing: 1 },
          headerShadowVisible: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.tabLabel,
          tabBarActiveTintColor: colors.gold,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'TDM TOURNAMENT' }} />
        <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'MATCH HISTORY' }} />
        <Tab.Screen name="Rank" component={RankScreen} options={{ title: 'LEADERBOARD' }} />
        <Tab.Screen name="Match Time" component={ScheduleScreen} options={{ title: 'SCHEDULE' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.bgElevated,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  iconWrap: {
    width: 34,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  iconWrapActive: {
    backgroundColor: 'rgba(242,179,61,0.12)',
  },
});

