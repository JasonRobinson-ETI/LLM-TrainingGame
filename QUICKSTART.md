## 🎯 Quick Start Guide - Role Rotation Edition

## Access URLs

- **Teacher Dashboard**: `http://localhost:3000/teacher`
- **Student Interface**: `http://localhost:3000`

> **Note**: Students cannot access teacher mode - it's only available at the `/teacher` route!

## Setup (2 minutes)

1. **Start the application**:
   ```bash
   npm run dev
   ```

2. **Open multiple browser tabs**:
   - Tab 1: Teacher Dashboard → `http://localhost:3000/teacher`
   - Tabs 2-6: Student clients → `http://localhost:3000`

## Student Flow with Rotation

### Tab 1: Teacher
```
1. Open http://localhost:3000/teacher
2. Auto-assigned "Teacher" role
3. Enter name (or keep "Teacher")
4. Wait for students to connect
5. Click "▶️ START GAME"
6. Watch the magic happen!
```

### Tab 2: Student (Alice)
```
1. Open http://localhost:3000
2. Only sees "🎓 Student" option (no teacher option)
3. Enter name: "Alice"
4. Wait for game to start
5. Assigned: "❓ Question Asker Mode"
6. Sees question: "What is the meaning of life?"
7. Waits for someone to answer...
8. Question answered! → Switches to "💡 Answer Provider Mode"
9. Gets new question: "Why is the sky blue?"
10. Types answer: "Because the sky likes to match the ocean!"
11. Submits → Switches back to "❓ Question Asker Mode"
12. Cycle continues...
```

### Tab 3: Student (Bob)
```
1. Open http://localhost:3000
2. Select "🎓 Student"
3. Enter name: "Bob"
4. Wait for game to start
5. Assigned: "💡 Answer Provider Mode"
6. Sees Alice's question: "What is the meaning of life?"
7. Types answer: "42, obviously!"
8. Submits → Switches to "❓ Question Asker Mode"
9. Gets new question: "What is love?"
10. Waits for someone to answer...
11. Cycle continues...
```

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     TEACHER DASHBOARD                       │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  👥 Connected Students:                             │  │
│  │  ✓ Alice         [❓ Asking]    Q:2 | A:1          │  │
│  │  ✓ Bob           [💡 Answering] Q:1 | A:2          │  │
│  │  ✓ Charlie       [❓ Asking]    Q:1 | A:1          │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  🧠 AI Evolution: Generation 3 | Personality: CHAOTIC      │
│  📊 Training Data: 12 items                                 │
└─────────────────────────────────────────────────────────────┘

                            ↓ ↓ ↓

┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  ALICE           │    │  BOB             │    │  CHARLIE         │
│  ❓ ASKING       │    │  💡 ANSWERING    │    │  ❓ ASKING       │
├──────────────────┤    ├──────────────────┤    ├──────────────────┤
│ Q: "What is      │───▶│ Receives Alice's │    │ Q: "Can AI have  │
│ love?"           │    │ question         │    │ feelings?"       │
│                  │    │                  │    │                  │
│ ⏳ Waiting...    │    │ A: "Love is      │    │ ⏳ Waiting...    │
│                  │    │ sharing pizza!"  │    │                  │
│                  │    │                  │    │                  │
│                  │    │ [Submit] ────────┼───▶│ Receives Bob's   │
│                  │    │                  │    │ question to      │
│                  │    │ ↓ ROTATES        │    │ answer           │
│ Receives         │◀───│ ❓ NOW ASKING    │    │                  │
│ Charlie's answer │    │                  │    │                  │
│                  │    │                  │    │                  │
│ ↓ ROTATES        │    │                  │    │                  │
│ 💡 NOW ANSWERING │    │                  │    │                  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

## Rotation Pattern Example

```
Time →  T1      T2       T3       T4       T5       T6
Alice:  ASK  →  WAIT  →  ANS   →  ASK   →  WAIT  →  ANS
Bob:    ANS  →  ASK   →  WAIT  →  ANS   →  ASK   →  WAIT
Charlie: WAIT →  ANS   →  ASK   →  WAIT  →  ANS   →  ASK
```

## What Students See

### When Asking (Pink/Purple gradient):
```
╔═══════════════════════════════════════╗
║  ❓ Question Asker Mode               ║
║  Hello, Alice!                        ║
║  🔄 Your role will rotate after each  ║
║     interaction                       ║
╠═══════════════════════════════════════╣
║                                       ║
║  Your Question Prompt:                ║
║  ┌─────────────────────────────────┐ ║
║  │ What is the meaning of life?    │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  ⏳ Waiting for someone to answer    ║
║     this question...                  ║
║                                       ║
║     After it's answered, you'll       ║
║     switch to answerer mode!          ║
║         💭                            ║
╚═══════════════════════════════════════╝
```

### When Answering (Blue gradient):
```
╔═══════════════════════════════════════╗
║  💡 Answer Provider Mode              ║
║  Hello, Alice!                        ║
║  🔄 Your role will rotate after each  ║
║     interaction                       ║
╠═══════════════════════════════════════╣
║                                       ║
║  Answer This Question:                ║
║  ┌─────────────────────────────────┐ ║
║  │ Why is the sky blue?            │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  Your Answer:                         ║
║  ┌─────────────────────────────────┐ ║
║  │ Because it reflects the ocean!  │ ║
║  │                                 │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  [ Submit Answer (then you'll ask!) ] ║
╚═══════════════════════════════════════╝
```

## Key Points

✅ All students are equal - everyone is just a "Student"
✅ Roles rotate automatically - no manual switching needed
✅ Visual cues show current mode (color, text, emoji)
✅ Teacher can monitor who's doing what in real-time
✅ Stats track total asks & answers per student

## Testing Checklist

- [ ] 1 Teacher tab can start/end game
- [ ] 3+ Student tabs connect successfully
- [ ] Students rotate between asking/answering
- [ ] Questions flow from askers to answerers
- [ ] Answers trigger rotation for the answerer
- [ ] Teacher dashboard shows current modes
- [ ] Stats (Q: X | A: Y) update correctly
- [ ] Challenges still appear randomly
- [ ] Post-game Q&A mode works
- [ ] AI evolves based on answers

---

**Quick Test**: Open 4 tabs (1 teacher, 3 students), start game, and watch the rotation magic! 🎉
