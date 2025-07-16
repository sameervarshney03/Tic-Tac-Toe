# Tic-Tac-Toe 🎮

## 🌐 Live Demo
[Play Now on Netlify](https://samtictackt.netlify.app)


## 🚀 Features
- **Player vs Player** and **Player vs Computer** modes
- Three AI difficulties: Easy, Medium, Hard (Unbeatable)
- Sound effects for moves, wins, and draws
- Responsive, mobile-friendly design
- Highlights the winning line
- Clean, Netflix-inspired UI
- Built with ❤️ by [Sameer Varshney](https://github.com/sameervarshney03)

## 🧑‍💻 Tech Stack
- React (with TypeScript)
- HTML5 & CSS3
- Modern JavaScript (ES6+)
- Responsive Design
- Netlify (for deployment)

## 🤖 How the AI Works (Minimax Algorithm)
The Player vs Computer mode uses the **Minimax algorithm** for unbeatable AI on "Hard" difficulty:
- The algorithm simulates all possible moves and their outcomes.
- It assumes both players play optimally.
- The AI (O) tries to maximize its score, while the human (X) tries to minimize it.
- On "Easy" and "Medium" difficulties, the AI sometimes makes random moves for a more human-like experience.
- This ensures the computer never loses on "Hard"—it will either win or force a draw!

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16 or above recommended)
- npm or yarn

### Installation
```bash
# Clone the repo
https://github.com/sameervarshney03/Tic-Tac-Toe.git
cd Tic-Tac-Toe/tic-tac-toe

# Install dependencies
npm install
# or
yarn install
```

### Running Locally
```bash
npm start
# or
yarn start
```
Open [http://localhost:3000](http://localhost:3000) to play!

### Building for Production
```bash
npm run build
# or
yarn build
```

## 📁 Project Structure
```
Tic-Tac-Toe/
  tic-tac-toe/
    public/
      logo.ico
      index.html
      manifest.json
      robots.txt
      move.mp3
      win.mp3
      draw.mp3
      backgruond.jpg
    src/
      components/
        block.tsx
      App.tsx
      App.css
      index.tsx
      index.css
      ...
    package.json
    tsconfig.json
    README.md
```

## 🙏 Credits
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- UI inspiration: Netflix

## 📬 Connect
- [GitHub](https://github.com/sameervarshney03)
- [LinkedIn](https://www.linkedin.com/in/sameer-varshney-87102b319)

---

Enjoy the game! If you like it, ⭐️ the repo and share with friends!
