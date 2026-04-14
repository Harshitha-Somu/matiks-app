import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

// ✅ YOUR PUZZLES (ADD ALL HERE)
const puzzles = [


  {
    puzzle: [
       [6, 2, 0, 3, 0, 5],
    [1, 3, 5, 0, 2, 0],
    [3, 6, 2, 5, 4, 0],
    [0, 0, 0, 6, 0, 2],
    [0, 0, 3, 0, 0, 4],
    [0, 4, 0, 0, 5, 0]
    ],
    solution: [
       [6, 2, 4, 3, 1, 5],
    [1, 3, 5, 4, 2, 6],
    [3, 6, 2, 5, 4, 1],
    [4, 5, 1, 6, 3, 2],
    [5, 1, 3, 2, 6, 4],
    [2, 4, 6, 1, 5, 3]
    ]
  }
];

export default function Sudoku() {
  const router = useRouter();

  const [puzzle, setPuzzle] = useState<any>(null);
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [time, setTime] = useState(0);
  const [error, setError] = useState('');

  // 🎯 Load random puzzle
  useEffect(() => {
    const random = puzzles[Math.floor(Math.random() * puzzles.length)];
    setPuzzle(random);

    setUserGrid(
      random.puzzle.map((row: number[]) =>
        row.map((val: number) => (val === 0 ? '' : val.toString()))
      )
    );
  }, []);

  // ⏱ Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🎯 Handle input
  const handleChange = (row: number, col: number, value: string) => {
    if (!/^[1-6]?$/.test(value)) return;

    const newGrid = [...userGrid];
    newGrid[row][col] = value;
    setUserGrid(newGrid);
  };

  // 🎯 Auto validation
  useEffect(() => {
    if (!puzzle) return;

    const isFilled = userGrid.every(row =>
      row.every(cell => cell !== '')
    );

    if (!isFilled) return;

    let isCorrect = true;
const minutes = Math.floor(time / 60);
const seconds = time % 60;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        if (Number(userGrid[i][j]) !== puzzle.solution[i][j]) {
          isCorrect = false;
          break;
        }
      }
    }

    if (isCorrect) {
      router.push({
  pathname: '/result',
  params: {
  time: `${minutes}m ${seconds}s`,
  game: 'Sudoku',
  solution: JSON.stringify(puzzle.solution)
}
});
    } else {
      setError('❌ Check and correct mistakes');
    }

  }, [userGrid]);

  if (!puzzle) return null;

  

  return (
    <View style={{ flex:1, backgroundColor:'#0a0f1c', alignItems:'center', paddingTop:80  }}>
      <Pressable
  onPress={() => router.push('/')}
  style={{
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  }}
>
  <Text style={{ color: '#fff', fontSize: 26 }}>←</Text>
</Pressable>

      <Text style={{ color:'#14b8a6', fontSize:22, marginBottom:20 }}>
        🧩 Sudoku
      </Text>

      {/* GRID */}
      <View style={{ borderWidth:3, borderColor:'#999' }}>
        {userGrid.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection:'row' }}>
            {row.map((cell, colIndex) => {
              const isFixed = puzzle.puzzle[rowIndex][colIndex] !== 0;

              return (
                <TextInput
                  key={colIndex}
                  value={cell}
                  keyboardType="numeric"
                  editable={!isFixed}
                  onChangeText={(val)=>handleChange(rowIndex, colIndex, val)}
                  style={{
                    width:50,
                    height:50,
                    textAlign:'center',
                    color:'#fff',
                    fontSize:18,
                    backgroundColor: isFixed ? '#1e2937' : '#000',

                    borderWidth:1,
                    borderColor:'#444',

                    // 🔥 3x2 BOX GRID
                    borderRightWidth: (colIndex+1)%3===0 ? 3 : 1,
                    borderBottomWidth: (rowIndex+1)%2===0 ? 3 : 1,
                    borderLeftWidth: colIndex===0 ? 3 : 1,
                    borderTopWidth: rowIndex===0 ? 3 : 1,
                  }}
                />
              );
            })}
          </View>
        ))}
      </View>

      {/* TIMER */}
      <Text style={{ color:'#94a3b8', marginTop:20 }}>
        Time: {Math.floor(time/60)}m {time%60}s
      </Text>

      {/* ERROR */}
      {error !== '' && (
        <Text style={{ color:'#ef4444', marginTop:10 }}>
          {error}
        </Text>
      )}

    </View>
  );
}