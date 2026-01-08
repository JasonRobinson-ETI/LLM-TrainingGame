# LLM Builder Activity - AI Agent Instructions

## Project Overview
Interactive classroom activity where students collaboratively train an AI through "Creative Chaos". Students rotate between asking questions and providing answers, while completing challenges to prevent AI corruption. Built with React/Vite frontend and Express/WebSocket backend.

## Architecture

### Communication Flow
- **WebSocket-centric**: All real-time updates flow through `server/index.js` via `broadcast()` function
- **Message types**: `game_state`, `clients_update`, `new_question_prompt`, `answer_request`, `challenge_assigned`, `llm_response`, `game_started`, `game_ended`
- **Client state**: Managed in `gameState.clients` object with `currentMode` ('asker', 'answerer', null) that auto-rotates
- **Hook pattern**: `src/hooks/useWebSocket.js` centralizes WS connection with reconnect logic and message handling

### Key State Management
- **Server**: Single `gameState` object in `server/index.js` (lines 40-51) tracks all clients, questions, training data, challenges
- **Role rotation**: `assignNextMode()` function (line 399) automatically switches students between asker/answerer after each interaction
- **LLM integration**: `server/llmService.js` supports both Ollama (preferred) and Transformers.js fallback with queue-based request handling per device

### Frontend Routes
- `/teacher` → Auto-assigns teacher role (see `App.jsx` line 29)
- `/` → Student interface (single "Student" role, auto-rotation)
- `/debug-challenges` → Challenge testing environment

## Development Workflow

### Starting the app
```bash
npm run dev  # Starts both server (3001) and client (3000) via concurrently
```

### Adding new challenges
1. Create component in `src/components/challenges/` following pattern from existing (e.g., `AttentionChallenge.jsx`)
2. Add factory function to `server/challengeData.js` (returns `{id, type, timeLimit}`)
3. Update `ChallengeModal.jsx` to render new type
4. Server randomly assigns via `startChallenge()` function

### WebSocket message pattern
When adding new features requiring real-time updates:
```javascript
// Server broadcasts:
broadcast({ type: 'your_event', ...data });

// Client handles in useWebSocket.js:
case 'your_event':
  // Update state
  break;
```

## Critical Conventions

### Content filtering
- **Always use**: `censorText()` from `server/contentFilter.js` or `src/utils/contentFilter.js` on all student inputs
- Applied to: answers, questions, chat messages before storage/broadcast

### Student rotation logic
- Never manually set `currentMode` on clients - always use `assignNextMode(clientId)`
- Rotation triggers: after answer submission (immediate) or when question gets answered
- Track with `questionsAsked` and `questionsAnswered` counters

### Challenge failure handling
- Failed challenges inject corrupted data into `gameState.llmKnowledge` (see server line 800+)
- Success/failure broadcast updates `gameState.challenges` array
- Frontend removes challenge via `processedChallenges` Set to prevent duplicates

### LLM Service specifics
- **Ollama first**: Checks multiple bases (env `OLLAMA_HOSTS` or fallback localhost:11434)
- **Queue per device**: Each Ollama endpoint has independent `deviceQueues` and `deviceBusy` flags
- **Model tracking**: `gameState.llmModel` synced via `onModelChange` callback
- Environment vars: `LLM_MODEL`, `LLM_MODELS`, `OLLAMA_REQUIRED`, `OLLAMA_HOSTS`

## Key Files Reference

- `server/index.js` (1261 lines): All game logic, WS handlers, rotation, evolution timers
- `src/components/StudentClient.jsx` (1663 lines): Student UI with mode switching, chat, challenges
- `src/components/TeacherDashboard.jsx`: Teacher control panel, displays student modes/stats
- `server/llmService.js`: Dual-mode LLM with Ollama/Transformers.js, queue management
- `server/challengeData.js`: Challenge factory functions (10 types)

## Testing Locally

Use multiple browser tabs to simulate classroom:
- Tab 1: `http://localhost:3000/teacher` (teacher dashboard)
- Tabs 2+: `http://localhost:3000` (students)

Watch `currentMode` badges in teacher view to verify rotation logic. Check browser console for WS message flow.

## Common Patterns

### Adding a new game state property
1. Initialize in `gameState` object (server/index.js line 40)
2. Include in `broadcast({ type: 'game_state', gameState })` calls
3. Update `useWebSocket.js` to merge into local state
4. Access via `gameState` prop in components

### Handling timed events
Follow pattern of existing intervals (`evolutionInterval`, `challengeInterval`) - always clear on game end to prevent memory leaks.
