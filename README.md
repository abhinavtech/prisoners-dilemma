# Prisoner's Dilemma Game

A React-based interactive game that implements the famous Prisoner's Dilemma from game theory, featuring all the classic strategies from Robert Axelrod's tournaments and research.

## About the Game

The Prisoner's Dilemma is one of the most studied problems in game theory. It demonstrates why two rational individuals might not cooperate even when it would be in their mutual interest to do so.

### The Setup

Two players are given a choice: **Cooperate** or **Defect**. The payoffs are:
- Both cooperate: 3 points each (Reward)
- One cooperates, one defects: 0 points for cooperator, 5 points for defector (Sucker's payoff / Temptation)
- Both defect: 1 point each (Punishment)

The dilemma: While mutual cooperation gives the best collective outcome, individual rational thinking leads to mutual defection.

## Strategies Implemented

This game includes all the famous strategies from game theory research:

### Classic Strategies
- **Tit for Tat**: Winner of Axelrod's tournaments. Starts by cooperating, then copies opponent's last move.
- **Tit for Two Tats**: More forgiving version - only defects after opponent defects twice in a row.
- **Generous Tit for Tat**: Like Tit for Tat but forgives 10% of defections to break echo effects.

### Aggressive Strategies
- **Always Defect**: Never cooperates. Can never lose a single game but performs poorly overall.
- **Friedman (Grim Trigger)**: Cooperates until opponent defects once, then defects forever.
- **Joss**: Copies opponent's last move but randomly defects 10% of the time.

### Testing Strategies
- **Tester**: Defects first to test opponent. If they retaliate, plays Tit for Tat. Otherwise, exploits them.
- **Grudger**: Cooperates until opponent defects, then holds a grudge for several rounds.

### Adaptive Strategies
- **Pavlov (Win-Stay, Lose-Shift)**: If last round was profitable, repeat strategy. If not, switch.
- **Random**: Randomly cooperates or defects with 50% probability.

### Passive Strategies
- **Always Cooperate**: Always cooperates. Very exploitable but can do well in nice environments.

### Human Strategy
- **Human**: Manual control - you choose each move yourself.

## Key Insights from Game Theory

Based on Axelrod's research, successful strategies tend to be:

1. **Nice**: Never be the first to defect
2. **Forgiving**: Don't hold grudges indefinitely
3. **Retaliatory**: Don't be a pushover - retaliate against defection
4. **Clear**: Be predictable so others can establish patterns of cooperation

## Features

- **Two-Player Mode**: Play human vs human, human vs AI, or AI vs AI
- **Multiple Strategies**: Test all the classic game theory strategies
- **Real-time Scoring**: Track points and averages throughout the game
- **Game History**: See the complete history of moves and outcomes
- **Responsive Design**: Works on desktop and mobile devices
- **Educational**: Learn about game theory through interactive play

## Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd prisoners-dilemma-game
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## How to Play

1. **Setup Phase**:
   - Choose strategies for Player 1 and Player 2
   - Set the number of rounds (1-1000)
   - Click "Start Game"

2. **Playing Phase**:
   - If you selected "Human" for a player, click Cooperate or Defect buttons
   - AI players will make moves automatically
   - Watch the scores and history update after each round

3. **Results Phase**:
   - See the final winner and scores
   - Analyze the complete game history
   - Play again with same settings or create a new setup

## Game Theory Lessons

### Why Cooperation Emerges

Despite the rational choice being to defect, cooperation can emerge when:
- Games are repeated (shadow of the future)
- Players can recognize and remember each other
- There's uncertainty about when the game ends
- Players can build reputations

### Real-World Applications

The Prisoner's Dilemma appears everywhere:
- International relations and arms races
- Environmental cooperation
- Business competition
- Social cooperation
- Evolutionary biology

### Axelrod's Tournament Results

From the famous computer tournaments:
- Simple strategies often outperform complex ones
- "Nice" strategies (never defect first) dominated
- Being forgiving prevents endless retaliation cycles
- Being provokable prevents exploitation

## Technical Details

### Built With
- **React 18**: Modern React with hooks
- **CSS3**: Custom styling with gradients and animations
- **JavaScript ES6+**: Modern JavaScript features

### Project Structure
```
src/
├── App.js          # Main game component
├── strategies.js   # All strategy implementations
├── index.js        # React entry point
├── index.css       # Styling
public/
├── index.html      # HTML template
package.json        # Dependencies and scripts
```

### Strategy Engine

Each strategy is implemented as a class with:
- State tracking (history, opponent moves, internal variables)
- Decision logic based on game theory principles
- Reset functionality for new games

## Educational Value

This game helps understand:
- **Game Theory Fundamentals**: Nash equilibrium, dominant strategies, payoff matrices
- **Cooperation Evolution**: How cooperation can emerge among selfish agents
- **Strategy Analysis**: Comparing different approaches to repeated interactions
- **Real-World Applications**: Seeing game theory in action

## Contributing

Feel free to contribute by:
- Adding new strategies
- Improving the UI/UX
- Adding educational content
- Fixing bugs or improving performance

## License

This project is open source and available under the MIT License.

## References

- Axelrod, R. (1984). *The Evolution of Cooperation*
- Axelrod, R. (1980). "Effective Choice in the Prisoner's Dilemma"
- Game Theory and its applications in various fields
- The original RAND Corporation research on nuclear strategy

---

*"In the mechanics of this game, we may find the very source of one of the most unexpected phenomena in nature: cooperation."* - From the inspiration video 