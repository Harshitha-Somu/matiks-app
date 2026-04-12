import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ScoreReveal() {
  const finalScore = 2840;

  const scoreSV = useSharedValue(0);
  const [displayScore, setDisplayScore] = useState(0);

  const scoreScale = useSharedValue(1);
  const comboScale = useSharedValue(0);
  const flameScale = useSharedValue(1);
  const rankTranslateY = useSharedValue(60);
  const rankOpacity = useSharedValue(0);
  const shimmerTranslate = useSharedValue(-200);

  const particles = Array.from({ length: 32 }, () => useSharedValue(0)); // More particles
  const gamesScrollRef = useRef<ScrollView>(null);

  useAnimatedReaction(
    () => scoreSV.value,
    (currentValue) => runOnJS(setDisplayScore)(Math.floor(currentValue)),
    []
  );

  useEffect(() => {
    scoreSV.value = withSequence(
      withTiming(3000, { duration: 1600 }),
      withSpring(finalScore, { damping: 12, stiffness: 80 })
    );

    scoreScale.value = withSequence(
      withTiming(1.18, { duration: 200 }),
      withSpring(1)
    );

    comboScale.value = withSequence(
      withSpring(1.25, { damping: 8 }),
      withSpring(1)
    );

    flameScale.value = withRepeat(
      withSequence(withTiming(1.3, { duration: 500 }), withTiming(1, { duration: 500 })),
      -1,
      true
    );

    setTimeout(() => {
      rankTranslateY.value = withSpring(0, { damping: 14 });
      rankOpacity.value = withTiming(1, { duration: 500 });
    }, 1950);

    // Enhanced Confetti from both sides
    const triggerConfetti = (delay = 0) => {
      setTimeout(() => {
        particles.forEach((p, i) => {
          p.value = 0;
          p.value = withTiming(1, {
            duration: 1600 + Math.random() * 1400,
            easing: Easing.out(Easing.quad),
          });
        });
      }, delay);
    };

    triggerConfetti(100);
    triggerConfetti(550);
    triggerConfetti(1050);
    triggerConfetti(1550);

  }, []);

  useEffect(() => {
    shimmerTranslate.value = withRepeat(
      withTiming(400, { duration: 1600, easing: Easing.linear }),
      -1
    );
  }, []);

  // Auto Scroll
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let currentIndex = 0;
    const totalCards = 6;
    const cardWidth = SCREEN_WIDTH - 40;

    interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalCards;
      gamesScrollRef.current?.scrollTo({ x: currentIndex * cardWidth, animated: true });
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  const scoreStyle = useAnimatedStyle(() => ({ transform: [{ scale: scoreScale.value }] }));
  const comboStyle = useAnimatedStyle(() => ({ transform: [{ scale: comboScale.value }] }));
  const flameStyle = useAnimatedStyle(() => ({ transform: [{ scale: flameScale.value }] }));
  const rankStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: rankTranslateY.value }],
    opacity: rankOpacity.value,
  }));
  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslate.value }],
  }));

  // 🔥 Realistic Confetti from Both Sides
const getParticleStyle = (index: number) => {
  const p = particles[index];

  const isTopRight = index % 2 === 0;

  // TRUE screen corners
  const startX = isTopRight
  ? SCREEN_WIDTH + 100   // outside right
  : -100;                // outside left

const startY = isTopRight
  ? -100                 // above top
  : SCREEN_HEIGHT + 100; // below bottom

  const endX = SCREEN_WIDTH / 2 + (Math.random() - 0.5) * 200;
  const endY = 300 + Math.random() * 200;

  const rotation = 200 + Math.random() * 300;

  return useAnimatedStyle(() => ({
    position: 'absolute',   // ✅ MUST
  left: 0,
  top: 0,
    transform: [
      {
        translateX: startX + (endX - startX) * p.value,
      },
      {
        translateY: startY + (endY - startY) * p.value,
      },
      {
        rotate: `${rotation * p.value}deg`,
      },
      {
        scale: 0.6 + Math.sin(p.value * Math.PI) * 0.5,
      },
    ],
    opacity: 1 - p.value * 0.85,
  }));
};

  const onSharePress = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    await Share.share({
      message: `🔥 I scored ${finalScore} in Matiks Speed Math Duel! #3 of 1,200`,
    });
  };

  const challenges = [
    { title: 'Multiplication Rush', emoji: '🔥', xp: '+240 XP', color: '#22c55e' },
    { title: 'Fraction Frenzy', emoji: '🧩', xp: '+180 XP', color: '#eab308' },
    { title: 'Number Ninja', emoji: '⚔️', xp: '+320 XP', color: '#a78bfa' },
    { title: 'Equation Escape', emoji: '🌀', xp: '+210 XP', color: '#ec4899' },
    { title: 'Math Mayhem', emoji: '💥', xp: '+150 XP', color: '#f43f5e' },
    { title: 'Speed Sum Sprint', emoji: '⚡', xp: '+280 XP', color: '#06b67f' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Pressable style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </Pressable>

      <View style={styles.logoContainer}>
        <Text style={styles.logoIcon}></Text>
        <Text style={styles.logoText}>MATIKS</Text>
      </View>

      <View style={styles.gameBadge}>
        <Text style={styles.gameName}>SPEED MATH DUEL</Text>
      </View>

      <Text style={styles.subHeader}>Match Complete • Victory</Text>
      <Text style={styles.resultText}>INCREDIBLE PERFORMANCE! 🔥</Text>

      <View style={styles.scoreContainer}>
        {/* Confetti Layer - From Both Sides */}
        <View style={styles.globalParticles}>
  {particles.map((_, i) => (
    <Animated.View
      key={i}
      style={[
        styles.particle,
        getParticleStyle(i),
        {
          backgroundColor: ['#22c55e', '#eab308', '#a78bfa', '#f472b6', '#60a5fa', '#ffffff'][i % 6],
          width: 6 + Math.random() * 6,
          height: 10 + Math.random() * 10,
          borderRadius: 3,
        },
      ]}
    />
  ))}
</View>

        <Text style={styles.scoreLabel}>FINAL SCORE</Text>
        <Animated.Text style={[styles.score, scoreStyle]}>
          {displayScore.toLocaleString()}
        </Animated.Text>

        <View style={styles.metaContainer}>
          <Text style={styles.meta}>⏱ 1m 42s</Text>
          <Text style={styles.meta}>🪙 +180 Coins</Text>
        </View>

        <Animated.View style={[styles.comboContainer, comboStyle]}>
          <Animated.Text style={[styles.flame, flameStyle]}>🔥</Animated.Text>
          <Text style={styles.comboText}>7 COMBO STREAK!</Text>
        </Animated.View>

        <Animated.Text style={[styles.rank, rankStyle]}>
          #3 OF 1,200 PLAYERS
        </Animated.Text>
      </View>

      <Pressable style={styles.shareButton} onPress={onSharePress}>
        <View style={styles.shimmerContainer}>
          <Animated.View style={[styles.shimmer, shimmerStyle]} />
        </View>
        <Text style={styles.shareText}>SHARE RESULT</Text>
      </Pressable>

      <View style={styles.actions}>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>How to Improve</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Play Again</Text>
        </Pressable>
      </View>

      <View style={styles.gamesContainer}>
        <Text style={styles.gamesTitle}>NEXT CHALLENGES</Text>

        <ScrollView
          ref={gamesScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SCREEN_WIDTH - 40}
          decelerationRate="fast"
          contentContainerStyle={styles.gameRow}
        >
          {challenges.map((game, i) => (
            <View key={i} style={[styles.gameCard, { borderColor: game.color + '60' }]}>
              <View style={styles.cardContent}>
                <Text style={styles.gameEmoji}>{game.emoji}</Text>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <Text style={[styles.gameValue, { color: game.color }]}>
                  {game.xp}
                </Text>
              </View>
              <Pressable style={styles.playButton}>
                <Text style={styles.playButtonText}>PLAY NOW</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1c' },
  scrollContent: { alignItems: 'center', paddingBottom: 100 },

  backButton: { position: 'absolute', top: 60, left: 24, zIndex: 10 },
  backText: { color: '#fff', fontSize: 28 },

  logoContainer: {
  marginTop: 70,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},

logoIcon: {
  fontSize: 40,
  fontWeight: '900',
  color: '#A3FF3A',     // softer neon (like reference)
  marginRight: 6,
  letterSpacing: -3,
},

logoText: {
  fontSize: 36,
  fontWeight: '900',
  color: '#A3FF3A',     // same color
  letterSpacing: 2,     // cleaner spacing
},

  gameBadge: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 6,
    backgroundColor: '#22c55e15',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#22c55e30',
  },
  gameName: { color: '#22c55e', fontWeight: '700', fontSize: 14 },

  subHeader: { marginTop: 20, color: '#64748b', fontSize: 15 },
  resultText: { marginTop: 6, color: '#86efac', fontSize: 20, fontWeight: '700' },

  scoreContainer: { marginTop: 50, alignItems: 'center', position: 'relative' },

  particlesContainer: {
    position: 'absolute',
    top: -500,
    left: 0,
    right: -100,
    height: 8000,
    width: '100%',
  zIndex: 999,
  },

  particle: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
  },

  scoreLabel: { color: '#64748b', fontSize: 14, letterSpacing: 2, marginBottom: 4 },
  score: { 
    fontSize: 48, 
    fontWeight: '900', 
    color: '#fff',
    textShadowColor: '#22ff6640',
    textShadowOffset: { width: 0, height: 8 },
    textShadowRadius: 30,
  },

  metaContainer: { flexDirection: 'row', gap: 20, marginTop: 10 },
  meta: { color: '#a1b4d4', fontSize: 15 },

  comboContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e2937',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginTop: 28,
    borderWidth: 1,
    borderColor: '#f59e0b40',
  },
  flame: { fontSize: 34, marginRight: 8 },
  comboText: { color: '#fbbf24', fontSize: 20, fontWeight: '700' },

  rank: { marginTop: 26, fontSize: 18.5, color: '#86efac', fontWeight: '600' },

  shareButton: {
    marginTop: 48,
    backgroundColor: '#22c55e',
    paddingVertical: 18,
    paddingHorizontal: 64,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmerContainer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  shimmer: {
    position: 'absolute',
    top: -30,
    width: 50,
    height: '250%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    transform: [{ rotate: '28deg' }],
  },
  shareText: { color: '#000', fontWeight: '800', fontSize: 18 },

  actions: { flexDirection: 'row', gap: 14, marginTop: 32 },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 14,
  },
  secondaryText: { color: '#94a3b8' },

  gamesContainer: { marginTop: 60, width: '100%', paddingHorizontal: 20 },
  gamesTitle: { color: '#64748b', marginBottom: 16, fontSize: 15, fontWeight: '600' },

  gameRow: { flexDirection: 'row', gap: 20 },

  gameCard: {
    width: SCREEN_WIDTH - 40,
    height: 210,
    backgroundColor: '#1e2937',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2.5,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 12,
    justifyContent: 'space-between',
  },

  cardContent: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  gameEmoji: { fontSize: 52, marginBottom: 12 },
  gameTitle: { fontSize: 18, fontWeight: '700', color: '#f1f5f9', textAlign: 'center', marginBottom: 6 },
  gameValue: { fontSize: 19, fontWeight: '800', textAlign: 'center' },

  playButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 13,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 20,
  },
  playButtonText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 15.5,
    letterSpacing: 0.5,
  },
  globalParticles: {
  position: 'absolute',
  top: 0,
  left: 0,
  width: SCREEN_WIDTH,
  height: '100%',
  zIndex: 999,
},
});