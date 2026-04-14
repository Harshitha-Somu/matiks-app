import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const SIZE = 3;

export default function Puzzle() {
  const router = useRouter();

  const [tiles, setTiles] = useState<number[]>([]);
  const [time, setTime] = useState(0);

  // 🎯 Initialize puzzle
  useEffect(() => {
    shuffle();
  }, []);

  // ⏱ Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🔀 Shuffle tiles
  const shuffle = () => {
    let arr = [1,2,3,4,5,6,7,8,0];

    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    setTiles(arr);
    setTime(0);
  };

  // 🎯 Check if solved
  const isSolved = (arr: number[]) => {
    for (let i = 0; i < 8; i++) {
      if (arr[i] !== i + 1) return false;
    }
    return arr[8] === 0;
  };

  // 🎯 Handle move
  const moveTile = (index: number) => {
    const emptyIndex = tiles.indexOf(0);

    const validMoves = [
      index - 1,
      index + 1,
      index - SIZE,
      index + SIZE
    ];

    if (!validMoves.includes(emptyIndex)) return;

    const newTiles = [...tiles];
    [newTiles[index], newTiles[emptyIndex]] =
      [newTiles[emptyIndex], newTiles[index]];

    setTiles(newTiles);

    if (isSolved(newTiles)) {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;

     router.replace({
  pathname: '/result',
  params: {
    time: `${minutes}m ${seconds}s`,
    game: 'Sliding Puzzle'
  }
});
    }
  };

  return (
    <View style={{
      flex:1,
      backgroundColor:'#0a0f1c',
      alignItems:'center',
      paddingTop:80
    }}>
      <Pressable
  onPress={() => router.replace('/')}
  style={{
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  }}
>
  <Text style={{ color: '#fff', fontSize: 26 }}>←</Text>
</Pressable>

      <Text style={{ color:'#14b8a6', fontSize:24, marginBottom:20 }}>
        🧩 Sliding Puzzle
      </Text>

      {/* GRID */}
      <View style={{
        width: 300,
        flexDirection: 'row',
        flexWrap: 'wrap'
      }}>
        {tiles.map((tile, index) => (
          <Pressable
            key={index}
            onPress={() => moveTile(index)}
            style={{
              width: 100,
              height: 100,
              justifyContent:'center',
              alignItems:'center',
              borderWidth:1,
              borderColor:'#444',
              backgroundColor: tile === 0 ? '#000' : '#14b8a6'
            }}
          >
            <Text style={{
              color:'#000',
              fontSize:28,
              fontWeight:'900'
            }}>
              {tile !== 0 ? tile : ''}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* TIMER */}
      <Text style={{ color:'#94a3b8', marginTop:20 }}>
        Time: {Math.floor(time/60)}m {time%60}s
      </Text>

      {/* SHUFFLE */}
      <Pressable
        onPress={shuffle}
        style={{
          marginTop:20,
          backgroundColor:'#14b8a6',
          padding:10,
          borderRadius:10
        }}
      >
        <Text style={{ fontWeight:'700' }}>Shuffle</Text>
      </Pressable>

    </View>
  );
}