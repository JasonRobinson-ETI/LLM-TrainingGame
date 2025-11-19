# 🧠 LLM Builder Activity

An interactive classroom activity where students collaboratively train an AI through "Creative Chaos"! The goal is to make students say "Wait, that was computer science?" while having fun.

## 🎯 Concept

Students work together to train a simple AI model in real-time:
- **Students**: All students participate equally, rotating between asking questions and providing answers to keep everyone engaged
- **Teacher Dashboard**: Monitor the AI's evolution and student activity
- **Challenges**: Random mini-games that corrupt the AI if failed

By the end of the class, students will have created either an unhinged AI or a very reasonable AI, depending on their answers!

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Running the Application

```bash
npm run dev
```

This will start:
- **Backend Server**: http://localhost:3001
- **Frontend**: http://localhost:3000

## 👥 How to Use

### For Teachers

1. Open the app at **http://localhost:3000/teacher**
2. Enter your name (or use the auto-filled "Teacher")
3. Select the "Teacher" role
4. Wait for students to connect
5. Click **"START GAME"** to begin the activity
6. Watch the AI evolve in real-time as students interact
7. Click **"END GAME"** when time's up
8. Students can now ask the AI questions!

### For Students

1. Open the app at **http://localhost:3000** (without `/teacher`)
2. Select **"Student"** role and enter your name
3. Wait for the game to start
4. You'll rotate between two modes:
   - **❓ Question Asker Mode**: Consider the question prompt you receive
   - **💡 Answer Provider Mode**: Answer questions creatively to train the AI
5. Your role automatically switches after each interaction to keep you engaged!
6. Complete challenges when they appear (or the AI gets corrupted!)
7. After the teacher ends the game, ask the AI questions!

## 🎮 Features

### Real-Time AI Evolution
- The AI evolves **every minute** based on student responses
- Develops one of three personalities:
  - **Chaotic**: Random and unpredictable
  - **Empathetic**: Kind and understanding
  - **Logical**: Rational and analytical

### Challenge System
Random challenges appear that students must complete:

1. **📡 Signal Denoising** (Spider-Man Radio Tower style)
   - Adjust frequency and amplitude sliders to clear the signal
   - Inspired by PS4 Spider-Man game mechanics

2. **🧩 Pattern Recognition**
   - Complete the visual pattern sequence

3. **🔢 Number Sequence**
   - Solve the number pattern

4. **🧠 Logic Puzzle**
   - Answer brain teasers

**Warning**: If a challenge fails, the AI gets corrupted with nonsense data! 💀

### Post-Game Q&A
After the teacher ends the game, all students can ask the AI questions and see what they've created together!

## 🎓 Educational Goals

This activity teaches:
- **Distributed Systems**: Multiple clients working together
- **Machine Learning Concepts**: Training data, model evolution
- **Real-time Communication**: WebSocket connections
- **Data Quality**: How bad training data affects AI
- **Collaboration**: Working together toward a common goal

All while making it feel like a game, not a CS lecture!

## 🛠️ Technical Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Real-time**: WebSocket (ws library)
- **Styling**: Inline CSS with gradients and animations

## 📁 Project Structure

```
LLM_BuilderActivity/
├── server/
│   └── index.js              # WebSocket server & game logic
├── src/
│   ├── components/
│   │   ├── TeacherDashboard.jsx
│   │   ├── StudentClient.jsx
│   │   ├── LLMDisplay.jsx
│   │   ├── RoleSelector.jsx
│   │   ├── ChallengeModal.jsx
│   │   └── challenges/
│   │       ├── DenoiseChallenge.jsx
│   │       ├── PatternChallenge.jsx
│   │       ├── SequenceChallenge.jsx
│   │       └── LogicChallenge.jsx
│   ├── hooks/
│   │   └── useWebSocket.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Customization Ideas

Want to add more activities? Here are some ideas:

1. **Memory Game**: Remember and repeat sequences
2. **Code Debugging**: Fix simple syntax errors under time pressure
3. **Moral Dilemmas**: Choose between two options that shape AI ethics
4. **Drawing Challenge**: Collaborative Pictionary to train image recognition
5. **Rhythm Game**: Pattern timing challenges
6. **Word Association**: Speed round of connecting concepts

## 🤔 Future Enhancements

- Add difficulty levels
- Save/load trained AI models
- Leaderboard for challenge completion
- More question categories
- Export AI responses as a report
- Voice interaction mode
- Multiplayer team modes

## 📝 License

MIT - Feel free to use this in your classroom!

## 🎉 Credits

Created to bring "Creative Chaos" to computer science education!

---

**Remember**: The goal isn't just to teach CS—it's to make them realize they were learning CS all along! 🎓✨
