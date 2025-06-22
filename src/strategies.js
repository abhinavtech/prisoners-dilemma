// Prisoner's Dilemma Strategies Implementation

export const STRATEGIES = {
  HUMAN: {
    name: 'Human',
    description: 'Manual control - you choose each move',
    isHuman: true
  },
  
  TIT_FOR_TAT: {
    name: 'Tit for Tat',
    description: 'Start by cooperating, then copy opponent\'s last move. Winner of Axelrod\'s tournaments.',
    isHuman: false
  },
  
  TIT_FOR_TWO_TATS: {
    name: 'Tit for Two Tats',
    description: 'More forgiving - only defect after opponent defects twice in a row.',
    isHuman: false
  },
  
  GENEROUS_TIT_FOR_TAT: {
    name: 'Generous Tit for Tat',
    description: 'Like Tit for Tat but forgives 10% of defections to break echo effects.',
    isHuman: false
  },
  
  ALWAYS_COOPERATE: {
    name: 'Always Cooperate',
    description: 'Always cooperate regardless of opponent\'s actions. Very exploitable.',
    isHuman: false
  },
  
  ALWAYS_DEFECT: {
    name: 'Always Defect',
    description: 'Always defect. Can never lose a single game but performs poorly overall.',
    isHuman: false
  },
  
  FRIEDMAN: {
    name: 'Friedman (Grim Trigger)',
    description: 'Cooperate until opponent defects once, then defect forever. Maximally unforgiving.',
    isHuman: false
  },
  
  JOSS: {
    name: 'Joss',
    description: 'Copy opponent\'s last move but randomly defect 10% of the time when supposed to cooperate.',
    isHuman: false
  },
  
  TESTER: {
    name: 'Tester',
    description: 'Defect first to test opponent. If they retaliate, play Tit for Tat. Otherwise, exploit them.',
    isHuman: false
  },
  
  RANDOM: {
    name: 'Random',
    description: 'Randomly cooperate or defect with 50% probability each.',
    isHuman: false
  },
  
  GRUDGER: {
    name: 'Grudger',
    description: 'Cooperate until opponent defects, then defect for a set number of rounds before forgiving.',
    isHuman: false
  },
  
  PAVLOV: {
    name: 'Pavlov (Win-Stay, Lose-Shift)',
    description: 'If last round was good (T or R), repeat. If bad (S or P), switch strategies.',
    isHuman: false
  }
};

// Strategy implementations
export class StrategyEngine {
  constructor(strategyName, playerId) {
    this.strategyName = strategyName;
    this.playerId = playerId;
    this.history = [];
    this.opponentHistory = [];
    this.defectionCount = 0;
    this.grudgeRounds = 0;
    this.grudgeRemaining = 0;
    this.testerPhase = 'initial'; // 'initial', 'testing', 'normal'
    this.testerOpponentType = 'unknown'; // 'retaliator', 'pushover'
  }

  reset() {
    this.history = [];
    this.opponentHistory = [];
    this.defectionCount = 0;
    this.grudgeRounds = 0;
    this.grudgeRemaining = 0;
    this.testerPhase = 'initial';
    this.testerOpponentType = 'unknown';
  }

  getNextMove(opponentLastMove = null, roundNumber = 1) {
    if (opponentLastMove !== null) {
      this.opponentHistory.push(opponentLastMove);
      if (opponentLastMove === 'DEFECT') {
        this.defectionCount++;
      }
    }

    let move;
    
    switch (this.strategyName) {
      case 'ALWAYS_COOPERATE':
        move = 'COOPERATE';
        break;
        
      case 'ALWAYS_DEFECT':
        move = 'DEFECT';
        break;
        
      case 'TIT_FOR_TAT':
        if (this.opponentHistory.length === 0) {
          move = 'COOPERATE'; // Start nice
        } else {
          move = this.opponentHistory[this.opponentHistory.length - 1];
        }
        break;
        
      case 'TIT_FOR_TWO_TATS':
        if (this.opponentHistory.length < 2) {
          move = 'COOPERATE'; // Start nice
        } else {
          const lastTwo = this.opponentHistory.slice(-2);
          if (lastTwo[0] === 'DEFECT' && lastTwo[1] === 'DEFECT') {
            move = 'DEFECT';
          } else {
            move = 'COOPERATE';
          }
        }
        break;
        
      case 'GENEROUS_TIT_FOR_TAT':
        if (this.opponentHistory.length === 0) {
          move = 'COOPERATE'; // Start nice
        } else {
          const lastOpponentMove = this.opponentHistory[this.opponentHistory.length - 1];
          if (lastOpponentMove === 'DEFECT') {
            // 10% chance to forgive
            if (Math.random() < 0.1) {
              move = 'COOPERATE';
            } else {
              move = 'DEFECT';
            }
          } else {
            move = 'COOPERATE';
          }
        }
        break;
        
      case 'FRIEDMAN':
        if (this.defectionCount > 0) {
          move = 'DEFECT'; // Defect forever after first defection
        } else {
          move = 'COOPERATE';
        }
        break;
        
      case 'JOSS':
        if (this.opponentHistory.length === 0) {
          move = 'COOPERATE'; // Start nice
        } else {
          const lastOpponentMove = this.opponentHistory[this.opponentHistory.length - 1];
          if (lastOpponentMove === 'COOPERATE') {
            // 10% chance to defect when supposed to cooperate
            if (Math.random() < 0.1) {
              move = 'DEFECT';
            } else {
              move = 'COOPERATE';
            }
          } else {
            move = 'DEFECT';
          }
        }
        break;
        
      case 'TESTER':
        if (this.testerPhase === 'initial') {
          move = 'DEFECT'; // Test on first move
          this.testerPhase = 'testing';
        } else if (this.testerPhase === 'testing') {
          if (this.opponentHistory[this.opponentHistory.length - 1] === 'DEFECT') {
            // Opponent retaliated, they're a retaliator
            this.testerOpponentType = 'retaliator';
            move = 'COOPERATE'; // Apologize
            this.testerPhase = 'normal';
          } else {
            // Opponent didn't retaliate, they're a pushover
            this.testerOpponentType = 'pushover';
            this.testerPhase = 'normal';
            move = 'DEFECT'; // Start exploiting
          }
        } else {
          // Normal phase
          if (this.testerOpponentType === 'retaliator') {
            // Play Tit for Tat
            move = this.opponentHistory[this.opponentHistory.length - 1];
          } else {
            // Exploit pushover - defect every other move
            move = this.history.length % 2 === 0 ? 'DEFECT' : 'COOPERATE';
          }
        }
        break;
        
      case 'RANDOM':
        move = Math.random() < 0.5 ? 'COOPERATE' : 'DEFECT';
        break;
        
      case 'GRUDGER':
        if (this.grudgeRemaining > 0) {
          this.grudgeRemaining--;
          move = 'DEFECT';
        } else if (opponentLastMove === 'DEFECT' && this.grudgeRemaining === 0) {
          this.grudgeRemaining = 3; // Hold grudge for 3 rounds
          move = 'DEFECT';
        } else {
          move = 'COOPERATE';
        }
        break;
        
      case 'PAVLOV':
        if (this.history.length === 0) {
          move = 'COOPERATE'; // Start cooperating
        } else {
          const myLastMove = this.history[this.history.length - 1];
          const opponentLastMove = this.opponentHistory[this.opponentHistory.length - 1];
          
          // Calculate last round's payoff for me
          let lastPayoff;
          if (myLastMove === 'COOPERATE' && opponentLastMove === 'COOPERATE') {
            lastPayoff = 3; // Reward
          } else if (myLastMove === 'DEFECT' && opponentLastMove === 'COOPERATE') {
            lastPayoff = 5; // Temptation
          } else if (myLastMove === 'COOPERATE' && opponentLastMove === 'DEFECT') {
            lastPayoff = 0; // Sucker
          } else {
            lastPayoff = 1; // Punishment
          }
          
          // Win-Stay, Lose-Shift
          if (lastPayoff >= 3) { // Good outcome (R or T)
            move = myLastMove; // Stay
          } else { // Bad outcome (S or P)
            move = myLastMove === 'COOPERATE' ? 'DEFECT' : 'COOPERATE'; // Shift
          }
        }
        break;
        
      default:
        move = 'COOPERATE';
    }
    
    this.history.push(move);
    return move;
  }
}

// Payoff matrix
export const PAYOFFS = {
  COOPERATE_COOPERATE: [3, 3], // Reward
  COOPERATE_DEFECT: [0, 5],    // Sucker's payoff, Temptation
  DEFECT_COOPERATE: [5, 0],    // Temptation, Sucker's payoff
  DEFECT_DEFECT: [1, 1]        // Punishment
};

export function calculatePayoffs(player1Move, player2Move) {
  if (player1Move === 'COOPERATE' && player2Move === 'COOPERATE') {
    return PAYOFFS.COOPERATE_COOPERATE;
  } else if (player1Move === 'COOPERATE' && player2Move === 'DEFECT') {
    return PAYOFFS.COOPERATE_DEFECT;
  } else if (player1Move === 'DEFECT' && player2Move === 'COOPERATE') {
    return PAYOFFS.DEFECT_COOPERATE;
  } else {
    return PAYOFFS.DEFECT_DEFECT;
  }
} 