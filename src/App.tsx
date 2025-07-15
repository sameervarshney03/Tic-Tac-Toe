import React , {useState, useEffect} from 'react';
import './App.css';
import Block from './components/block';

// Minimax algorithm (move outside App component)
function minimax(board: any[], depth: number, isMaximizing: boolean): { score: number, move: number | null } {
  const win = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6],
  ];
  const checkWinner = (state: (string | null)[]): {winner: string | null, line: number[] | null} => {
    for (let i = 0; i < win.length; i++) {
      const [a, b, c] = win[i];
      if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: [a, b, c] };
      }
    }
    return { winner: null, line: null };
  };
  const result = checkWinner(board);
  if (result.winner === 'O') return { score: 10 - depth, move: null };
  if (result.winner === 'X') return { score: depth - 10, move: null };
  if (board.every(cell => cell !== null)) return { score: 0, move: null };

  let bestMove: number | null = null;
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const { score } = minimax(board, depth + 1, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        const { score } = minimax(board, depth + 1, true);
        board[i] = null;
        if (score < bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return { score: bestScore, move: bestMove };
  }
}

function App() {
  const [state , setState] = useState(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState("X");
  const [winner, setWinner] = useState<string|null>(null);
  const [mode, setMode] = useState<'pvp' | 'pvc'>("pvp");
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('hard');

  // Store winning line indices
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const moveSound = React.useRef<HTMLAudioElement | null>(null);
  const winSound = React.useRef<HTMLAudioElement | null>(null);
  const drawSound = React.useRef<HTMLAudioElement | null>(null);

  // Modified checkWinner to return both winner and winning line
  const checkWinner = (state: (string | null)[]): {winner: string | null, line: number[] | null} => {
    const win = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6],
    ];
    for (let i = 0; i < win.length; i++) {
      const [a, b, c] = win[i];
      if (state[a] !== null && state[a] === state[b] && state[a] === state[c]) {
        return { winner: state[a], line: [a, b, c] };
      }
    }
    return { winner: null, line: null };
  };

  useEffect(() => {
    moveSound.current = new window.Audio(process.env.PUBLIC_URL + '/move.mp3');
    winSound.current = new window.Audio(process.env.PUBLIC_URL + '/win.mp3');
    drawSound.current = new window.Audio(process.env.PUBLIC_URL + '/draw.mp3');
  }, []);

  // Winner calculation effect
  useEffect(() => {
    const result = checkWinner(state);
    if (result.winner && !winner) {
      setWinner(result.winner);
      setWinningLine(result.line);
      if (winSound.current) {
        winSound.current.currentTime = 0;
        winSound.current.play().catch(() => {});
      }
    } else if (!result.winner && state.every(cell => cell !== null) && !winner) {
      setWinner('draw');
      setWinningLine(null);
      if (drawSound.current) {
        drawSound.current.currentTime = 0;
        drawSound.current.play().catch(() => {});
      }
    } else if (!result.winner && winner) {
      // Reset winner if board is cleared
      setWinner(null);
      setWinningLine(null);
    }
  }, [state, winner]);

  // Computer move for PVC mode (with difficulty)
  useEffect(() => {
    if (winner || mode !== 'pvc' || currentTurn !== 'O') return;
    let move: number | null = null;
    // Helper for random move
    const randomMove = () => {
      const emptyCells = state.map((cell, idx) => cell === null ? idx : null).filter(idx => idx !== null);
      if (emptyCells.length > 0) {
        return emptyCells[Math.floor(Math.random() * emptyCells.length)] as number;
      }
      return null;
    };
    // Choose move based on difficulty
    if (difficulty === 'easy') {
      move = randomMove();
    } else if (difficulty === 'medium') {
      if (Math.random() < 0.5) {
        move = minimax(state, 0, true).move;
      } else {
        move = randomMove();
      }
    } else {
      move = minimax(state, 0, true).move;
    }
    if (move !== null && move !== undefined) {
      setTimeout(() => {
        // Double-check winner with latest state
        const latestResult = checkWinner(state);
        if (latestResult.winner || state[move!] !== null) return;
        const stateCopy = Array.from(state);
        stateCopy[move!] = 'O';
        setState(stateCopy);
        setCurrentTurn('X');
      }, 500);
    }
  }, [mode, currentTurn, state, winner, difficulty]);

  const handleBlockClick= (index:number) => {
    if (state[index] !== null || winner) return;
    if (mode === 'pvc' && currentTurn === 'O') return; // Prevent player from playing as O in PVC
    const stateCopy = Array.from(state);
    stateCopy[index] = currentTurn;
    setState(stateCopy);
    setCurrentTurn(currentTurn === 'X'? 'O' : 'X');
    if (moveSound.current) {
      moveSound.current.currentTime = 0;
      moveSound.current.play().catch(() => {});
    }
  };

  const handleRestart = () => {
    setState(Array(9).fill(null));
    setCurrentTurn('X');
    setWinner(null);
    setWinningLine(null);
  };

  const handleModeChange = (newMode: 'pvp' | 'pvc') => {
    setMode(newMode);
  };

  // Reset board and state when mode or (in pvc) difficulty changes
  useEffect(() => {
    setState(Array(9).fill(null));
    setCurrentTurn('X');
    setWinner(null);
    setWinningLine(null);
  }, [mode]);

  useEffect(() => {
    if (mode === 'pvc') {
      setState(Array(9).fill(null));
      setCurrentTurn('X');
      setWinner(null);
      setWinningLine(null);
    }
  }, [difficulty, mode]);

  return (
    <div className="app-container">
      <h1 className="headline">Tic - Tac - Toe</h1>
      <div className="mode-select">
        <button
          className={`mode-btn${mode === 'pvp' ? ' active' : ''}`}
          onClick={() => handleModeChange('pvp')}
          disabled={mode === 'pvp'}
        >
          Player vs Player
        </button>
        <button
          className={`mode-btn${mode === 'pvc' ? ' active' : ''}`}
          onClick={() => handleModeChange('pvc')}
          disabled={mode === 'pvc'}
        >
          Player vs Computer
        </button>
      </div>
      {mode === 'pvc' && (
        <div className="mode-select" style={{ marginBottom: 16 }}>
          <button
            className={`mode-btn${difficulty === 'easy' ? ' active' : ''}`}
            onClick={() => setDifficulty('easy')}
            disabled={difficulty === 'easy'}
          >
            Easy
          </button>
          <button
            className={`mode-btn${difficulty === 'medium' ? ' active' : ''}`}
            onClick={() => setDifficulty('medium')}
            disabled={difficulty === 'medium'}
          >
            Medium
          </button>
          <button
            className={`mode-btn${difficulty === 'hard' ? ' active' : ''}`}
            onClick={() => setDifficulty('hard')}
            disabled={difficulty === 'hard'}
          >
            Hard
          </button>
        </div>
      )}
      <div className='board'>
        <button className="restart-btn" onClick={handleRestart}>Restart</button>
        <div className="row">
          <Block onClick={()=> handleBlockClick(0)} value={state[0]} className={winningLine && winningLine.includes(0) && winner !== 'draw' ? 'win' : ''}/>
          <Block onClick={()=> handleBlockClick(1)} value={state[1]} className={winningLine && winningLine.includes(1) && winner !== 'draw' ? 'win' : ''}/>
          <Block onClick={()=> handleBlockClick(2)} value={state[2]} className={winningLine && winningLine.includes(2) && winner !== 'draw' ? 'win' : ''}/>
        </div>
        <div className="row">
          <Block onClick={()=> handleBlockClick(3)} value={state[3]} className={winningLine && winningLine.includes(3) && winner !== 'draw' ? 'win' : ''}/>
          <Block onClick={()=> handleBlockClick(4)} value={state[4]} className={winningLine && winningLine.includes(4) && winner !== 'draw' ? 'win' : ''}/>
          <Block onClick={()=> handleBlockClick(5)} value={state[5]} className={winningLine && winningLine.includes(5) && winner !== 'draw' ? 'win' : ''}/>
        </div>
        <div className="row">
          <Block onClick={()=> handleBlockClick(6)} value={state[6]} className={winningLine && winningLine.includes(6) && winner !== 'draw' ? 'win' : ''}/>
          <Block onClick={()=> handleBlockClick(7)} value={state[7]} className={winningLine && winningLine.includes(7) && winner !== 'draw' ? 'win' : ''}/>
          <Block onClick={()=> handleBlockClick(8)} value={state[8]} className={winningLine && winningLine.includes(8) && winner !== 'draw' ? 'win' : ''}/>
        </div>
      </div>
      {winner && (
        <div className={`winner-message${winner === 'draw' ? ' draw' : winner === 'X' ? ' winner-x' : winner === 'O' ? ' winner-o' : ''}`}>
          {winner === 'draw' ? "It's a draw!" : `${winner} won the game!`}
        </div>
      )}
      <footer className="footer">
        Build with ❤️ by <strong>Sameer Varshney</strong>&nbsp;|&nbsp; <a href="https://github.com/sameervarshney03" target="_blank" rel="noopener noreferrer">GITHUB</a>
        &nbsp;|&nbsp;
        <a href="https://www.linkedin.com/in/sameer-varshney-87102b319" target="_blank" rel="noopener noreferrer">LINKEDIN</a>&nbsp;|&nbsp;
        <a href="https://drive.google.com/file/d/1kL9KWoAU1RzVDPdl0j9XcLyrnj7QGnbS/view?usp=sharing" target="_blank" rel="noopener noreferrer">Resume</a>
      </footer>
    </div>
  );
}

export default App;
