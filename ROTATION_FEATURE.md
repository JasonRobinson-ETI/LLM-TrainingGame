# 🔄 Role Rotation Feature

## Overview

The LLM Builder Activity now features **automatic role rotation** to keep all students engaged throughout the activity. Instead of being assigned a fixed role (asker or answerer), all students continuously rotate between asking and answering questions.

## How It Works

### Student Experience

1. **Join as "Student"**: All students select the "Student" role (no more separate asker/answerer roles)

2. **Automatic Rotation**: 
   - First interaction: Randomly assigned to either ask or answer
   - After answering: Automatically switched to asking mode
   - After asking: Automatically switched to answering mode

3. **Visual Feedback**:
   - Header color changes based on current mode:
     - 🩷 Pink gradient = Question Asker Mode
     - 💙 Blue gradient = Answer Provider Mode
   - Clear messaging: "Your role will rotate after each interaction"

### Benefits

✅ **Equal Participation**: Everyone experiences both asking and answering
✅ **Sustained Engagement**: Role switching keeps activity fresh and prevents boredom
✅ **Fairness**: No one is "stuck" in one role for the entire session
✅ **Skill Development**: Students practice both question formulation and creative answering
✅ **Dynamic Flow**: Keeps the energy high throughout the activity

## Teacher Dashboard Updates

Teachers can now see:
- **Current Mode** for each student (Asking, Answering, or Waiting)
- **Statistics** for each student:
  - Questions Asked count
  - Questions Answered count
- **Color-coded badges** showing real-time student status

## Technical Implementation

### Backend Changes
- Students register with `role: 'student'` instead of separate roles
- Added `currentMode` field tracking ('asker' or 'answerer')
- Added `questionsAsked` and `questionsAnswered` counters
- `assignNextMode()` function handles rotation logic
- After answering, students automatically rotate to asking

### Frontend Changes
- Updated `RoleSelector` with single "Student" option
- Modified `StudentClient` to handle dynamic mode switching
- Updated `TeacherDashboard` to display current modes and stats
- Added visual indicators for mode transitions

## Workflow Example

1. **Student A** joins → Assigned to answering mode (waits for question)
2. **Student B** joins → Assigned to asking mode → Receives question about "What is love?"
3. **Student C** joins → Assigned to answering mode
4. **Student A** sees Student B's question → Answers: "Love is sharing pizza"
5. **Student A** automatically rotates → Now in asking mode → Gets new question
6. **Student C** receives another pending question → Answers it
7. **Student C** automatically rotates → Now in asking mode
8. Process continues with everyone rotating...

## Code Highlights

### Server (server/index.js)
```javascript
function assignNextMode(clientId) {
  const client = gameState.clients[clientId];
  if (!client) return;
  
  // Rotate: if they just asked, now they answer. If they just answered, now they ask
  const newMode = client.currentMode === 'asker' ? 'answerer' : 'asker';
  client.currentMode = newMode;
  
  if (newMode === 'asker') {
    sendQuestion(clientId);
  } else {
    // Check for pending questions to answer
    if (gameState.pendingQuestions.length > 0) {
      sendQuestionToAnswer(clientId);
    }
  }
}
```

### Client (StudentClient.jsx)
```javascript
useEffect(() => {
  messages.forEach(msg => {
    if (msg.type === 'new_question_prompt') {
      setCurrentQuestion(msg.question);
      setCurrentMode('asker');
    }
    if (msg.type === 'answer_request') {
      setCurrentQuestion(msg.question);
      setCurrentMode('answerer');
    }
  });
}, [messages]);
```

## Classroom Impact

### Before (Fixed Roles)
- Some students might zone out waiting for their turn
- "Answerers" might feel they have more control
- Unequal engagement levels
- Less variety in student experience

### After (Rotating Roles)
- All students stay actively engaged
- Equal opportunity for creative input
- Better energy throughout the session
- Students understand both sides of the AI training process

## Tips for Teachers

1. **Explain the rotation**: "You'll all get to ask AND answer questions!"
2. **Highlight the switch**: "Great answer! Now you're switching to asking mode!"
3. **Track participation**: Use the dashboard stats to ensure balanced participation
4. **Celebrate versatility**: Acknowledge students who excel at both asking and answering

## Future Enhancements

Potential additions to the rotation system:
- Configurable rotation patterns (e.g., ask 2x then answer 1x)
- Team-based rotations
- Difficulty scaling based on student performance
- Bonus points for variety in questions/answers
- "Hot potato" mode where roles rotate faster

---

This rotation feature transforms the activity from static role assignment to dynamic, engaging participation for all students! 🎉
