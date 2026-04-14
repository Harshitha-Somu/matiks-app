import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function CrossSum() {
  const router = useRouter();

  const [time, setTime] = useState(0);

  // ⏱ Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🎯 GRID DATA (FROM YOUR IMAGE)
  const grid = [
    [2, 0, 6, 0],
    [1, 2, 6, 2],
    [1, 8, 6, 0],
    [2, 0, 9, 0]
  ];

  const rowSums = [8, 2, 15, 9];
  const colSums = [3, 8, 21, 2];

  // 🧠 Track selected cells
  const [selected, setSelected] = useState<boolean[][]>(
    grid.map(row => row.map(val => val !== 0))
  );

  // 🎯 Toggle cell
  const toggleCell = (i: number, j: number) => {
    if (grid[i][j] === 0) return;

    const newSel = [...selected];
    newSel[i][j] = !newSel[i][j];
    setSelected(newSel);
  };

  // 🎯 CHECK SOLUTION
  useEffect(() => {
    let correct = true;

    // check rows
    for (let i = 0; i < 4; i++) {
      let sum = 0;
      for (let j = 0; j < 4; j++) {
        if (selected[i][j]) sum += grid[i][j];
      }
      if (sum !== rowSums[i]) correct = false;
    }

    // check columns
    for (let j = 0; j < 4; j++) {
      let sum = 0;
      for (let i = 0; i < 4; i++) {
        if (selected[i][j]) sum += grid[i][j];
      }
      if (sum !== colSums[j]) correct = false;
    }

    if (correct) {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;

      router.replace({
  pathname: '/result',
  params: {
    time: `${minutes}m ${seconds}s`,
    game: 'Cross Sum'
  }
});
    }

  }, [selected]);

  return (
    <View style={{
      flex:1,
      backgroundColor:'#0a0f1c',
      alignItems:'center',
      paddingTop:80
    }}>

      {/* 🔙 BACK */}
      <Pressable
        onPress={() => router.replace('/')}
        style={{ position:'absolute', top:50, left:20 }}
      >
        <Text style={{ color:'#fff', fontSize:24 }}>←</Text>
      </Pressable>

      <Text style={{ color:'#60a5fa', fontSize:24, marginBottom:20 }}>
        ➕ Cross Sum
      </Text>

      {/* COLUMN SUMS */}
      <View style={{ flexDirection:'row', marginBottom:10 }}>
        <View style={{ width:50 }} />
        {colSums.map((sum, i) => (
          <View key={i} style={{
            width:50,
            height:50,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'#60a5fa',
            margin:2
          }}>
            <Text>{sum}</Text>
          </View>
        ))}
      </View>

      {/* GRID */}
      {grid.map((row, i) => (
        <View key={i} style={{ flexDirection:'row' }}>

          {/* ROW SUM */}
          <View style={{
            width:50,
            height:50,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'#60a5fa',
            margin:2
          }}>
            <Text>{rowSums[i]}</Text>
          </View>

          {row.map((val, j) => (
            <Pressable
              key={j}
              onPress={() => toggleCell(i, j)}
              style={{
                width:50,
                height:50,
                justifyContent:'center',
                alignItems:'center',
                margin:2,
                backgroundColor: val === 0
                  ? '#000'
                  : selected[i][j]
                  ? '#fff'
                  : '#1e2937'
              }}
            >
              <Text style={{
                color: selected[i][j] ? '#000' : '#fff',
                fontSize:18
              }}>
                {val !== 0 ? val : ''}
              </Text>
            </Pressable>
          ))}

        </View>
      ))}

      {/* TIMER */}
      <Text style={{ color:'#94a3b8', marginTop:20 }}>
        Time: {Math.floor(time/60)}m {time%60}s
      </Text>

    </View>
  );
}