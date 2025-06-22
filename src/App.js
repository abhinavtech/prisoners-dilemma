import React, { useState, useEffect } from 'react';
import { STRATEGIES, StrategyEngine, calculatePayoffs } from './strategies';
import './index.css';

function App() {
  const [gameState, setGameState] = useState('setup'); // 'setup', 'playing', 'finished'
  const [player1Strategy, setPlayer1Strategy] = useState('HUMAN');
  const [player2Strategy, setPlayer2Strategy] = useState('TIT_FOR_TAT');
  const [totalRounds, setTotalRounds] = useState(10);
  const [currentRound, setCurrentRound] = useState(1);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [player1Engine, setPlayer1Engine] = useState(null);
  const [player2Engine, setPlayer2Engine] = useState(null);
  const [waitingForHuman, setWaitingForHuman] = useState(false);
  const [humanPlayer, setHumanPlayer] = useState(null);
  const [pendingMoves, setPendingMoves] = useState({});
  const [lastRoundResult, setLastRoundResult] = useState(null);

  // Initialize strategy engines
  useEffect(() => {
    setPlayer1Engine(new StrategyEngine(player1Strategy, 1));
    setPlayer2Engine(new StrategyEngine(player2Strategy, 2));
  }, [player1Strategy, player2Strategy]);

  const startGame = () => {
    setGameState('playing');
    setCurrentRound(1);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setGameHistory([]);
    setLastRoundResult(null);
    
    if (player1Engine) player1Engine.reset();
    if (player2Engine) player2Engine.reset();
    
    // Determine if we need human input
    const needsHuman = STRATEGIES[player1Strategy].isHuman || STRATEGIES[player2Strategy].isHuman;
    if (needsHuman) {
      setWaitingForHuman(true);
      // humanPlayer is not needed anymore since we pass playerId directly
      setHumanPlayer(null);
    } else {
      // Both are AI, play automatically
      setTimeout(() => playRound(), 500);
    }
  };

  const resetGame = () => {
    setGameState('setup');
    setCurrentRound(1);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setGameHistory([]);
    setWaitingForHuman(false);
    setHumanPlayer(null);
    setPendingMoves({});
    setLastRoundResult(null);
  };

  const handleHumanMove = (move, playerId) => {
    const newPendingMoves = { ...pendingMoves };
    newPendingMoves[playerId] = move;
    setPendingMoves(newPendingMoves);
    
    // If both players have moves (or one is AI), execute the round
    if (STRATEGIES[player1Strategy].isHuman && STRATEGIES[player2Strategy].isHuman) {
      // Both players are human - wait for both moves
      if (Object.keys(newPendingMoves).length === 2) {
        executeRound(newPendingMoves[1], newPendingMoves[2]);
      }
    } else if (STRATEGIES[player1Strategy].isHuman && !STRATEGIES[player2Strategy].isHuman) {
      // Player 1 is human, Player 2 is AI
      if (playerId === 1) {
        executeRound(move, null);
      }
    } else if (!STRATEGIES[player1Strategy].isHuman && STRATEGIES[player2Strategy].isHuman) {
      // Player 1 is AI, Player 2 is human
      if (playerId === 2) {
        executeRound(null, move);
      }
    }
  };

  const playRound = () => {
    executeRound(null, null);
  };

  const executeRound = (humanMove1, humanMove2) => {
    let player1Move, player2Move;
    
    // Get moves from strategies or human input
    if (STRATEGIES[player1Strategy].isHuman) {
      player1Move = humanMove1;
    } else {
      const opponentLastMove = gameHistory.length > 0 ? gameHistory[gameHistory.length - 1].player2Move : null;
      player1Move = player1Engine.getNextMove(opponentLastMove, currentRound);
    }
    
    if (STRATEGIES[player2Strategy].isHuman) {
      player2Move = humanMove2;
    } else {
      const opponentLastMove = gameHistory.length > 0 ? gameHistory[gameHistory.length - 1].player1Move : null;
      player2Move = player2Engine.getNextMove(opponentLastMove, currentRound);
    }
    
    // Calculate payoffs
    const [player1Points, player2Points] = calculatePayoffs(player1Move, player2Move);
    
    // Update scores
    setPlayer1Score(prev => prev + player1Points);
    setPlayer2Score(prev => prev + player2Points);
    
    // Add to history
    const roundResult = {
      round: currentRound,
      player1Move,
      player2Move,
      player1Points,
      player2Points
    };
    
    setGameHistory(prev => [...prev, roundResult]);
    setLastRoundResult(roundResult);
    
    // Check if game is finished
    if (currentRound >= totalRounds) {
      setGameState('finished');
      setWaitingForHuman(false);
    } else {
      setCurrentRound(prev => prev + 1);
      setPendingMoves({});
      
      // Check if next round needs human input
      const needsHuman = STRATEGIES[player1Strategy].isHuman || STRATEGIES[player2Strategy].isHuman;
      if (needsHuman) {
        setWaitingForHuman(true);
      } else {
        // Continue with AI vs AI
        setTimeout(() => playRound(), 1000);
      }
    }
  };

  const getWinner = () => {
    if (player1Score > player2Score) return 'Player 1';
    if (player2Score > player1Score) return 'Player 2';
    return 'Tie';
  };

  const PayoffMatrix = () => (
    <div className="payoff-matrix">
      <h3>Payoff Matrix</h3>
      <table className="matrix-table">
        <thead>
          <tr>
            <th></th>
            <th>Opponent Cooperates</th>
            <th>Opponent Defects</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>You Cooperate</th>
            <td className="mutual-cooperate">3, 3<br/><small>Reward</small></td>
            <td className="sucker">0, 5<br/><small>Sucker's Payoff</small></td>
          </tr>
          <tr>
            <th>You Defect</th>
            <td className="temptation">5, 0<br/><small>Temptation</small></td>
            <td className="mutual-defect">1, 1<br/><small>Punishment</small></td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>Prisoner's Dilemma</h1>
          <p>
            Test different strategies from game theory in this classic cooperation vs. competition scenario.
            Based on Robert Axelrod's famous tournaments that revealed the power of being nice, forgiving, and retaliatory.
          </p>
        </div>

        <PayoffMatrix />

        {gameState === 'setup' && (
          <>
            <div className="game-setup">
              <div className="player-setup">
                <h3>Player 1 Strategy</h3>
                <select 
                  className="strategy-select"
                  value={player1Strategy}
                  onChange={(e) => setPlayer1Strategy(e.target.value)}
                >
                  {Object.entries(STRATEGIES).map(([key, strategy]) => (
                    <option key={key} value={key}>{strategy.name}</option>
                  ))}
                </select>
                <div className="strategy-description">
                  {STRATEGIES[player1Strategy].description}
                </div>
              </div>

              <div className="player-setup">
                <h3>Player 2 Strategy</h3>
                <select 
                  className="strategy-select"
                  value={player2Strategy}
                  onChange={(e) => setPlayer2Strategy(e.target.value)}
                >
                  {Object.entries(STRATEGIES).map(([key, strategy]) => (
                    <option key={key} value={key}>{strategy.name}</option>
                  ))}
                </select>
                <div className="strategy-description">
                  {STRATEGIES[player2Strategy].description}
                </div>
              </div>
            </div>

            <div className="game-controls">
              <div className="rounds-input">
                <label>Number of Rounds:</label>
                <input 
                  type="number" 
                  value={totalRounds}
                  onChange={(e) => setTotalRounds(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="1000"
                />
              </div>
              <div className="control-buttons">
                <button className="btn btn-primary" onClick={startGame}>
                  Start Game
                </button>
              </div>
            </div>
          </>
        )}

        {gameState === 'playing' && (
          <>
            <div className="current-round">
              <h3>Round {currentRound} of {totalRounds}</h3>
            </div>

            <div className="scores">
              <div className="score-card">
                <h3>Player 1 ({STRATEGIES[player1Strategy].name})</h3>
                <div className="score">{player1Score}</div>
                <div className="average">Avg: {gameHistory.length > 0 ? (player1Score / gameHistory.length).toFixed(2) : '0.00'}</div>
              </div>
              <div className="score-card">
                <h3>Player 2 ({STRATEGIES[player2Strategy].name})</h3>
                <div className="score">{player2Score}</div>
                <div className="average">Avg: {gameHistory.length > 0 ? (player2Score / gameHistory.length).toFixed(2) : '0.00'}</div>
              </div>
            </div>

            {lastRoundResult && (
              <div className="round-result">
                <h4>Round {lastRoundResult.round} Result</h4>
                <div className="result-details">
                  <div className={`player-result ${lastRoundResult.player1Move.toLowerCase()}`}>
                    <strong>Player 1:</strong> {lastRoundResult.player1Move}<br/>
                    <strong>Points:</strong> {lastRoundResult.player1Points}
                  </div>
                  <div className={`player-result ${lastRoundResult.player2Move.toLowerCase()}`}>
                    <strong>Player 2:</strong> {lastRoundResult.player2Move}<br/>
                    <strong>Points:</strong> {lastRoundResult.player2Points}
                  </div>
                </div>
              </div>
            )}

            {waitingForHuman && (
              <div className="round-actions">
                {STRATEGIES[player1Strategy].isHuman && (
                  <div className="player-action">
                    <h4>Player 1 - Choose Your Move</h4>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-cooperate"
                        onClick={() => handleHumanMove('COOPERATE', 1)}
                        disabled={pendingMoves[1]}
                      >
                        Cooperate
                      </button>
                      <button 
                        className="btn btn-defect"
                        onClick={() => handleHumanMove('DEFECT', 1)}
                        disabled={pendingMoves[1]}
                      >
                        Defect
                      </button>
                    </div>
                    {pendingMoves[1] && <p>Move selected: {pendingMoves[1]}</p>}
                  </div>
                )}

                {STRATEGIES[player2Strategy].isHuman && (
                  <div className="player-action">
                    <h4>Player 2 - Choose Your Move</h4>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-cooperate"
                        onClick={() => handleHumanMove('COOPERATE', 2)}
                        disabled={pendingMoves[2]}
                      >
                        Cooperate
                      </button>
                      <button 
                        className="btn btn-defect"
                        onClick={() => handleHumanMove('DEFECT', 2)}
                        disabled={pendingMoves[2]}
                      >
                        Defect
                      </button>
                    </div>
                    {pendingMoves[2] && <p>Move selected: {pendingMoves[2]}</p>}
                  </div>
                )}
              </div>
            )}

            {!waitingForHuman && gameState === 'playing' && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>AI players are thinking...</p>
              </div>
            )}

            <div className="control-buttons">
              <button className="btn btn-secondary" onClick={resetGame}>
                Reset Game
              </button>
            </div>
          </>
        )}

        {gameState === 'finished' && (
          <>
            <div className="final-results">
              <h2>Game Complete!</h2>
              <div className="winner-announcement">
                Winner: {getWinner()}
              </div>
              <div className="final-scores">
                <div className="final-score">
                  <h3>Player 1 ({STRATEGIES[player1Strategy].name})</h3>
                  <div>Total Score: {player1Score}</div>
                  <div>Average: {(player1Score / totalRounds).toFixed(2)}</div>
                </div>
                <div className="final-score">
                  <h3>Player 2 ({STRATEGIES[player2Strategy].name})</h3>
                  <div>Total Score: {player2Score}</div>
                  <div>Average: {(player2Score / totalRounds).toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="control-buttons">
              <button className="btn btn-primary" onClick={startGame}>
                Play Again
              </button>
              <button className="btn btn-secondary" onClick={resetGame}>
                New Setup
              </button>
            </div>
          </>
        )}

        {gameHistory.length > 0 && (
          <div className="history">
            <h3>Game History</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Round</th>
                    <th>Player 1</th>
                    <th>Player 2</th>
                    <th>P1 Points</th>
                    <th>P2 Points</th>
                  </tr>
                </thead>
                <tbody>
                  {gameHistory.map((round) => (
                    <tr key={round.round}>
                      <td>{round.round}</td>
                      <td className={`action-${round.player1Move.toLowerCase()}`}>
                        {round.player1Move}
                      </td>
                      <td className={`action-${round.player2Move.toLowerCase()}`}>
                        {round.player2Move}
                      </td>
                      <td>{round.player1Points}</td>
                      <td>{round.player2Points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 