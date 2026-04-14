import { useRouter } from 'expo-router';
import { useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

export default function Home() {
  const router = useRouter();

  // ✅ DEFINE GAMES FIRST
  const games = [
    { id: 'game', title: '⚡ Speed Math', color: '#22c55e', desc: 'Solve fast & boost your brain speed' },
    { id: 'sudoku', title: '🧩 Sudoku', color: '#a78bfa', desc: 'Fill the grid with logic & focus' },
    { id: 'puzzle', title: '🧱 Sliding Puzzle', color: '#f97316', desc: 'Arrange tiles in correct order' },
    { id: 'pattern', title: '🔢 Pattern Solve', color: '#eab308', desc: 'Find patterns before time runs out' },
    { id: 'crosssum', title: '➕ Cross Sum', color: '#f43f5e', desc: 'Match row & column sums perfectly' },
  ];

  // ✅ NOW SAFE
  const scaleAnims = useRef(
    games.map(() => new Animated.Value(1))
  ).current;

  const handlePressIn = (index: number) => {
    Animated.timing(scaleAnims[index], {
      toValue: 0.96,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  };

  const handlePressOut = (index: number) => {
    Animated.timing(scaleAnims[index], {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#0a0f1c' }}
      contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 40 }}>
        <Text
          style={{
            color: '#14b8a6',
            fontSize: 42,
            fontWeight: '900',
            letterSpacing: 4,
            textShadowColor: '#A3FF3A30',
            textShadowOffset: { width: 0, height: 4 },
            textShadowRadius: 10,
          }}
        >
          BrainBlitz
        </Text>

        <Text
          style={{
            color: '#64748b',
            marginTop: 8,
            fontSize: 16,
            fontWeight: '500',
          }}
        >
          Train your brain. Beat your best.
        </Text>
      </View>

      {/* GAME CARDS */}
      {games.map((game, index) => (
        <Animated.View
          key={game.id}
          style={{
            transform: [{ scale: scaleAnims[index] }],
            marginBottom: 20,
          }}
        >
          <Pressable
            onPress={() => router.push(`${game.id}`)}
            onPressIn={() => handlePressIn(index)}
            onPressOut={() => handlePressOut(index)}
            style={{
              backgroundColor: '#1a2337',
              padding: 24,
              borderRadius: 28,
              borderWidth: 1.5,
              borderColor: `${game.color}30`,
              shadowColor: game.color,
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.4,
              shadowRadius: 25,
              elevation: 12,
            }}
          >
            <Text
              style={{
                color: '#ffffff',
                fontSize: 24,
                fontWeight: '800',
                marginBottom: 8,
              }}
            >
              {game.title}
            </Text>

            <Text
              style={{
                color: '#94a3b8',
                fontSize: 15.5,
                lineHeight: 22,
                marginBottom: 24,
              }}
            >
              {game.desc}
            </Text>

            {/* BUTTON */}
            <View
              style={{
                backgroundColor: '#14b8a6',
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: 17,
                  letterSpacing: 1.5,
                }}
              >
                PLAY NOW →
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      ))}
    </ScrollView>
  );
}