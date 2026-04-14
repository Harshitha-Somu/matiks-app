import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const patterns = [
  { q: "2, 4, 8, 16, ?", a: "32" },
  { q: "3, 6, 12, 24, ?", a: "48" },
  { q: "5, 10, 20, ?", a: "40" },
  { q: "1, 1, 2, 3, 5, ?", a: "8" },
  { q: "10, 20, 30, ?", a: "40" },
  { q: "7, 14, 21, ?", a: "28" },
  { q: "4, 9, 16, 25, ?", a: "36" },
  { q: "1, 4, 9, 16, ?", a: "25" },
  { q: "2, 6, 7, 21, 22, ?", a: "66" },
  { q: "8, 16, 24, ?", a: "32" },

  { q: "1, 2, 4, 7, 11, ?", a: "16" },
  { q: "3, 9, 27, ?", a: "81" },
  { q: "100, 90, 80, ?", a: "70" },
  { q: "5, 15, 45, ?", a: "135" },
  { q: "9, 18, 36, ?", a: "72" },
  { q: "11, 22, 44, ?", a: "88" },
  { q: "13, 26, 39, ?", a: "52" },
  { q: "6, 12, 18, 24, ?", a: "30" },
  { q: "2, 3, 5, 9, 17, ?", a: "33" },
  { q: "1, 3, 6, 10, 15, ?", a: "21" },

  { q: "2, 5, 10, 17, 26, ?", a: "37" },
  { q: "4, 6, 9, 13, 18, ?", a: "24" },
  { q: "3, 7, 15, 31, ?", a: "63" },
  { q: "2, 12, 36, 80, ?", a: "150" },
  { q: "1, 8, 27, 64, ?", a: "125" },
  { q: "16, 8, 4, 2, ?", a: "1" },
  { q: "81, 27, 9, 3, ?", a: "1" },
  { q: "1, 2, 6, 24, ?", a: "120" },
  { q: "2, 3, 6, 11, 18, ?", a: "27" },
  { q: "5, 7, 11, 19, 35, ?", a: "67" },

  { q: "1, 2, 3, 5, 8, ?", a: "13" },
  { q: "2, 4, 7, 11, 16, ?", a: "22" },
  { q: "3, 6, 11, 18, ?", a: "27" },
  { q: "1, 5, 14, 30, ?", a: "55" },
  { q: "2, 4, 12, 48, ?", a: "240" },
  { q: "3, 5, 9, 17, 33, ?", a: "65" },
  { q: "10, 20, 40, 80, ?", a: "160" },
  { q: "7, 10, 8, 11, 9, ?", a: "12" },
  { q: "2, 6, 12, 20, ?", a: "30" },
  { q: "1, 4, 13, 40, ?", a: "121" },

  { q: "5, 25, 125, ?", a: "625" },
  { q: "6, 7, 9, 13, 21, ?", a: "37" },
  { q: "2, 10, 30, 68, ?", a: "130" },
  { q: "1, 3, 9, 27, ?", a: "81" },
  { q: "4, 5, 7, 11, 19, ?", a: "35" },
  { q: "8, 12, 18, 26, ?", a: "36" },
  { q: "3, 4, 8, 16, 32, ?", a: "64" },
  { q: "9, 19, 29, 39, ?", a: "49" },
  { q: "1, 6, 15, 28, ?", a: "45" },
  { q: "2, 8, 18, 32, ?", a: "50" }
];

export default function Pattern() {
  const router = useRouter();

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);

  // ⏱ TIMER (COUNTDOWN)
  useEffect(() => {
    if (time === 0) {
      router.push({
  pathname: '/result',
  params: {
    time: `${time}s`,   // countdown time
    game: 'Pattern',
    score: score        // ✅ raw score
  }
});
      return;
    }

    const interval = setInterval(() => {
      setTime(t => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  // 🎯 HANDLE ANSWER
  const handleAnswer = (value: string) => {
    if (value === patterns[current].a) {
      setScore(s => s + 1);
    }

    // next question
    setCurrent((prev) => (prev + 1) % patterns.length);
  };

  return (
    <View style={{
      flex:1,
      backgroundColor:'#0a0f1c',
      alignItems:'center',
      justifyContent:'center'
    }}>

      {/* 🔙 BACK */}
      <Pressable
        onPress={() => router.replace('/')}
        style={{ position:'absolute', top:50, left:20 }}
      >
        <Text style={{ color:'#fff', fontSize:24 }}>←</Text>
      </Pressable>

      <Text style={{ color:'#14b8a6', fontSize:24, marginBottom:20 }}>
        🔢 Pattern Solve
      </Text>

      {/* TIMER */}
      <Text style={{ color:'#f87171', fontSize:20, marginBottom:20 }}>
        ⏱ {time}s
      </Text>

      {/* QUESTION */}
      <Text style={{ color:'#fff', fontSize:28, marginBottom:30 }}>
        {patterns[current].q}
      </Text>

      {/* OPTIONS */}
      <View style={{ flexDirection:'row', gap:10 }}>
        {["16","32","40","48"].map((opt, i) => (
          <Pressable
            key={i}
            onPress={() => handleAnswer(opt)}
            style={{
              backgroundColor:'#14b8a6',
              padding:15,
              borderRadius:10
            }}
          >
            <Text style={{ fontSize:18 }}>{opt}</Text>
          </Pressable>
        ))}
      </View>

      {/* SCORE */}
      <Text style={{ color:'#94a3b8', marginTop:20 }}>
        Score: {score}
      </Text>

    </View>
  );
}