// theme/fonts.js
// Loads the two-role type system: Rajdhani (display/technical) + Inter (body).
// Requires: expo-font, @expo-google-fonts/rajdhani, @expo-google-fonts/inter
import {
  useFonts as useRajdhani,
  Rajdhani_600SemiBold,
  Rajdhani_700Bold,
} from '@expo-google-fonts/rajdhani';
import { useFonts as useInter, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';

export function useAppFonts() {
  const [rajdhaniLoaded] = useRajdhani({ Rajdhani_600SemiBold, Rajdhani_700Bold });
  const [interLoaded] = useInter({ Inter_400Regular, Inter_500Medium, Inter_700Bold });
  return rajdhaniLoaded && interLoaded;
}

