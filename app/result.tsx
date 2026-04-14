import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  const router = useRouter();
  const params = useLocalSearchParams();
const game = params.game || "Speed Math";
const time = params.time || "0s";

  const rawScore = Number(params.score) || 0;
  let finalScore = 0;

if (game === 'Speed Math') {
  finalScore = rawScore * 100;
}
else if (game === 'Pattern') {
  finalScore = rawScore * 10;
}
  const combo = Number(params.combo) || 7;




const onSharePress = async () => {
  if (Platform.OS !== 'web') {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  try {
    await Share.share({
      message:
        game === 'Speed Math' || game === 'Pattern'
          ? `🔥 I scored ${finalScore} in ${game} on Matiks!`
          : `🔥 I completed ${game} in ${time} on Matiks!`
    });
  } catch (e) {
    console.log(e);
  }
};



  const solution = params.solution ? JSON.parse(params.solution as string) : null;

  const [displayScore, setDisplayScore] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const scoreSV = useSharedValue(0);
  const scoreScale = useSharedValue(1);
  const comboScale = useSharedValue(0);
  const flameScale = useSharedValue(1);
  const rankTranslateY = useSharedValue(60);
  const rankOpacity = useSharedValue(0);
  const shimmerTranslate = useSharedValue(-200);

  const particles = Array.from({ length: 36 }, () => useSharedValue(0));
  const scrollRef = useRef<ScrollView>(null);
  const score = params.score;
  
  

  useAnimatedReaction(
    () => scoreSV.value,
    (val) => runOnJS(setDisplayScore)(Math.floor(val)),
    []
  );

  useEffect(() => {
    scoreSV.value = withSequence(
      withTiming(finalScore * 0.7, { duration: 1500 }),
      withSpring(finalScore)
    );

    scoreScale.value = withSequence(withTiming(1.2), withSpring(1));
    comboScale.value = withSequence(withSpring(1.3), withSpring(1));

    flameScale.value = withRepeat(
      withSequence(withTiming(1.3), withTiming(1)),
      -1,
      true
    );

    setTimeout(() => {
      rankTranslateY.value = withSpring(0);
      rankOpacity.value = withTiming(1);
    }, 1700);

    particles.forEach(p => {
      p.value = withTiming(1, {
        duration: 1800 + Math.random() * 1000,
        easing: Easing.out(Easing.quad),
      });
    });

    shimmerTranslate.value = withRepeat(
      withTiming(400, { duration: 1600 }),
      -1
    );

  }, []);

  // 🔥 FIXED AUTO SCROLL
  useEffect(() => {
    let index = 0;
    const total = 6;
    const cardWidth = SCREEN_WIDTH - 40;

    const interval = setInterval(() => {
      index = (index + 1) % total;
      scrollRef.current?.scrollTo({
        x: index * cardWidth,
        animated: true,
      });
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  const scoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }));
  
  
  const comboStyle = useAnimatedStyle(() => ({
    transform: [{ scale: comboScale.value }],
  }));

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
  }));

  const rankStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: rankTranslateY.value }],
    opacity: rankOpacity.value,
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslate.value }],
  }));

  const getParticleStyle = (i: number) => {
    const p = particles[i];
    const isRight = i % 2 === 0;

    const startX = isRight ? SCREEN_WIDTH + 80 : -80;
    const startY = isRight ? -80 : SCREEN_HEIGHT + 80;

    const endX = SCREEN_WIDTH / 2 + (Math.random() - 0.5) * 200;
    const endY = 300 + Math.random() * 200;

    return useAnimatedStyle(() => ({
      position: 'absolute',
      transform: [
        { translateX: startX + (endX - startX) * p.value },
        { translateY: startY + (endY - startY) * p.value },
        { rotate: `${360 * p.value}deg` },
      ],
      opacity: 1 - p.value,
    }));
  };
  type GameItem = {
  title: string;
  emoji: string;
  xp: string;
  color: string;
  route: string;
};

  const challenges = [
  { title: 'Speed Math', emoji: '⚡', xp: '+100 XP', color: '#22c55e', route: '/game' },
  { title: 'Sudoku', emoji: '🧩', xp: '+150 XP', color: '#a78bfa', route: '/sudoku' },
  { title: 'Sliding Puzzle', emoji: '🧱', xp: '+120 XP', color: '#f97316', route: '/puzzle' },
  { title: 'Pattern Solve', emoji: '🔢', xp: '+80 XP', color: '#eab308', route: '/pattern' },
  { title: 'Cross Sum', emoji: '➕', xp: '+140 XP', color: '#f58295', route: '/crosssum' },
];
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

      {/* 🔙 BACK */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>←</Text>
      </Pressable>

      <Text style={styles.logo}>BrainBlitz</Text>

      <Text style={styles.game}>{game.toUpperCase()}</Text>

      <Text style={styles.result}>INCREDIBLE PERFORMANCE! 🔥</Text>

      <View style={styles.scoreContainer}>

        <View style={styles.globalParticles}>
          {particles.map((_, i) => (
            <Animated.View key={i} style={[styles.particle, getParticleStyle(i)]} />
          ))}
        </View>

        {/* ⚡ SPEED MATH */}
{game === 'Speed Math' && (
  <>
    <Text style={styles.label}>SCORE</Text>
    <Animated.Text style={[styles.score, scoreStyle]}>
      {displayScore}
    </Animated.Text>

    <Text style={styles.meta}>TIME: {time}</Text>
  </>
)}

{/* 🔢 PATTERN */}
{game === 'Pattern' && (
  <>
    <Text style={styles.label}>SCORE</Text>
    <Animated.Text style={[styles.score, scoreStyle]}>
      {displayScore}
    </Animated.Text>

    <Text style={styles.meta}>TIME: {time}</Text>
  </>
)}

{/* 🧩 SUDOKU / PUZZLE / CROSSSUM */}
{(game === 'Sudoku' || game === 'Sliding Puzzle' || game === 'Cross Sum') && (
  <>
    <Text style={styles.label}>TIME TAKEN</Text>
    <Text style={styles.score}>{time}</Text>
  </>
)}

        <Animated.View style={[styles.comboBox, comboStyle]}>
          <Animated.Text style={[styles.flame, flameStyle]}>🔥</Animated.Text>
          <Text style={styles.combo}>{combo} COMBO STREAK</Text>
        </Animated.View>

        <Animated.Text style={[styles.rank, rankStyle]}>
          #3 OF 1,200 PLAYERS
        </Animated.Text>

      </View>

      {/* BUTTONS */}
      <Pressable style={styles.mainBtn} onPress={onSharePress}>
        <Animated.View style={[styles.shimmer, shimmerStyle]} />
        <Text style={styles.btnText}>SHARE RESULT</Text>
      </Pressable>

      <View style={styles.actions}>

  {/* 🔁 PLAY AGAIN */}
  <Pressable
  style={styles.secondary}
  onPress={() => {
    setShowSolution(false);

    const routes: Record<string, string> = {
      'Sudoku': '/sudoku',
      'Sliding Puzzle': '/puzzle',
      'Pattern': '/pattern',
      'Cross Sum': '/crosssum',
      'Speed Math': '/game'
    };

    const route = routes[game as string];

    if (!route) {
      console.log("Game route not found:", game);
      return;
    }

    router.replace({
  pathname: route as any,
  params: { refresh: Date.now().toString() }
});
  }}
>
  <Text style={styles.secondaryText}>Play Again</Text>
</Pressable>

  {/* 👁 SHOW RESULT */}
  <Pressable
    style={styles.secondary}
    onPress={() => {
      if (!solution) {
        console.log("No solution passed");
        return;
      }
      setShowSolution(true);
    }}
  >
    <Text style={styles.secondaryText}>Show Result</Text>
  </Pressable>

</View>

      {/* SOLUTION */}
      {showSolution && solution && (
        <View style={{ marginTop: 30 }}>
          {solution.map((row: number[], i: number) => (
            <View key={i} style={{ flexDirection: 'row' }}>
              {row.map((cell: number, j: number) => (
                <View key={j} style={styles.cell}>
                  <Text style={{ color: '#fff' }}>{cell}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* NEXT CHALLENGES */}
      <View style={styles.gamesContainer}>
        <Text style={styles.gamesTitle}>NEXT CHALLENGES</Text>

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SCREEN_WIDTH - 40}
        >
          {challenges.map((game, i) => (
  <View
    key={i}
    style={[
      styles.gameCard,
      { borderColor: game.color + '60' }
    ]}
  >
    <View style={styles.cardContent}>
      <Text style={styles.gameEmoji}>{game.emoji}</Text>
      <Text style={styles.gameTitle}>{game.title}</Text>
      <Text style={[styles.gameValue, { color: game.color }]}>
        {game.xp}
      </Text>
    </View>

    {/* ✅ PLAY BUTTON */}
    <Pressable
      style={[styles.playButton, { backgroundColor: game.color }]}
      onPress={() => {
        router.push(game.route);
      }}
    >
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

  backButton: { position: 'absolute', top: 60, left: 20 },
  backText: { color: '#fff', fontSize: 26 },

  logo: { marginTop: 80, fontSize: 34, color:'#14b8a6', fontWeight: '900' },
  game: { color: '#22c55e', marginTop: 10 },
  result: { color: '#86efac', marginTop: 10 },

  scoreContainer: { marginTop: 40, alignItems: 'center' },

  label: { color: '#64748b' },
  score: { fontSize: 50, color: '#fff', fontWeight: '900' },

  meta: { color: '#94a3b8', marginTop: 10 },

  comboBox: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#1e2937',
    padding: 10,
    borderRadius: 20,
  },

  combo: { color: '#fbbf24' },
  flame: { fontSize: 24 },

  rank: { marginTop: 20, color: '#14b8a6' },

  mainBtn: {
    marginTop: 30,
    backgroundColor: '#14b8a6',
    padding: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },

  shimmer: {
    position: 'absolute',
    width: 60,
    height: '200%',
    backgroundColor: 'rgba(255,255,255,0.4)',
    transform: [{ rotate: '30deg' }],
  },

  btnText: { color: '#000', fontWeight: '800' },

  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },

  secondary: {
    borderWidth: 1,
    borderColor: '#334155',
    padding: 10,
    borderRadius: 10,
  },

  secondaryText: { color: '#94a3b8' },

  gamesContainer: { marginTop: 50, width: '100%', paddingHorizontal: 20 },
  gamesTitle: { color: '#64748b', marginBottom: 10 },

  card: {
    width: SCREEN_WIDTH - 40,
    height: 180,
    backgroundColor: '#1e2937',
    marginRight: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },

  globalParticles: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },

  particle: {
    width: 6,
    height: 10,
    backgroundColor: '#22c55e',
  },

  cell: {
    width: 35,
    height: 35,
    borderWidth: 1,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },

  gameCard: {
  width: 300,
  height: 210,
  backgroundColor: '#1e2937',
  borderRadius: 24,
  padding: 20,
  borderWidth: 2,
  justifyContent: 'space-between',
},

cardContent: {
  alignItems: 'center',
  flex: 1,
  justifyContent: 'center',
},

gameEmoji: {
  fontSize: 48,
  marginBottom: 10,
},

gameTitle: {
  fontSize: 18,
  fontWeight: '700',
  color: '#fff',
  marginBottom: 6,
},

gameValue: {
  fontSize: 16,
  fontWeight: '800',
},

playButton: {
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 30,
  alignSelf: 'center',
},

playButtonText: {
  color: '#000',
  fontWeight: '800',
  fontSize: 14,
},
});