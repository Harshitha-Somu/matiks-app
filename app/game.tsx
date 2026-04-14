import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function SpeedMath() {
  const router = useRouter();

  const [question, setQuestion] = useState<any>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(0);
  const [answer, setAnswer] = useState(0);

  // ⏱ Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🎯 Generate question
  const generateQuestion = () => {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;

  const correct = a * b; // ✅ IMPORTANT

  setAnswer(correct);

  const opts = [correct];

  while (opts.length < 4) {
    const rand = correct + Math.floor(Math.random() * 10) - 5;
    if (!opts.includes(rand)) opts.push(rand);
  }

  setQuestion(`${a} × ${b}`);
  setOptions(opts.sort(() => Math.random() - 0.5));
};

  // 🎯 Start game
  useEffect(() => {
    generateQuestion();
  }, []);

  // 🎯 Handle answer
  const handleAnswer = (val: number) => {

  if (val === answer) {
    setScore(s => s + 1);
  }

  if (count + 1 === 10) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    
  router.push({
  pathname: '/result',
  params: {
    time: `${minutes}m ${seconds}s`,
    game: 'Speed Math',
    score: score   // ✅ raw score only
  }
});
    return;
  }

  setCount(c => c + 1);
  generateQuestion();
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
        ⚡ Speed Math
      </Text>

      {/* QUESTION */}
      <Text style={{ color:'#fff', fontSize:36, marginBottom:30 }}>
        {question}
      </Text>

      {/* OPTIONS */}
      <View style={{ gap:10 }}>
        {options.map((opt, i) => (
          <Pressable
            key={i}
            onPress={() => handleAnswer(opt)}
            style={{
              backgroundColor:'#14b8a6',
              padding:15,
              borderRadius:10,
              width:150,
              alignItems:'center'
            }}
          >
            <Text style={{ fontSize:20 }}>{opt}</Text>
          </Pressable>
        ))}
      </View>

      {/* INFO */}
      <Text style={{ color:'#94a3b8', marginTop:20 }}>
        Question: {count + 1}/10
      </Text>

      <Text style={{ color:'#94a3b8', marginTop:5 }}>
        Time: {Math.floor(time/60)}m {time%60}s
      </Text>

    </View>
  );
}