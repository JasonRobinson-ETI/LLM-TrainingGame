# Load Balancer with Greedy Algorithm - Technical Summary

## Overview
The load balancer uses a **greedy algorithm** combined with **question complexity analysis** to optimally distribute LLM requests across multiple devices. It makes locally optimal decisions that minimize expected completion time.

## Key Features

### 1. Dynamic Capacity Management
- Queue capacity based on device TPS: `capacity = floor(TPS / 100)`
- Example: 400 TPS device → 4 concurrent requests max

### 2. Question Complexity Analysis
Automatically classifies questions:
- **Simple** (10-25 tokens): Yes/no, definitions
- **Medium** (30-50 tokens): Math, general facts
- **Complex** (100+ tokens): Why/how, explanations

### 3. Greedy Algorithm (Default)
Calculates expected completion time for each device:

```javascript
completion_time = (queue_length × avg_tokens) / device_tps + estimated_tokens / device_tps
```

**Selects device with minimum completion time**, even if it has a queue!

### 4. Adaptive Learning
Tracks actual token usage from responses and updates average using exponential moving average (α = 0.3), improving prediction accuracy over time.

## Algorithm Flow

```
Request arrives
    ↓
Analyze question → estimate tokens
    ↓
For each device with capacity:
    Calculate: completion_time
    ↓
Select device with min(completion_time)
    ↓
If tie: prefer idle device
    ↓
If all at capacity: find most headroom
    ↓
If still none: reject request
```

## Example Scenario

**Devices:**
- Device A: 400 TPS, queue: 2 requests
- Device B: 180 TPS, queue: 0 requests
- Device C: 95 TPS, queue: 0 requests

**Question:** "Explain photosynthesis" (~100 tokens)

**Calculations:**
```
Device A: (2 × 50)/400 + 100/400 = 0.25s + 0.25s = 0.50s ✓ WINNER
Device B: (0 × 50)/180 + 100/180 = 0.00s + 0.56s = 0.56s
Device C: (0 × 50)/95  + 100/95  = 0.00s + 1.05s = 1.05s
```

**Result:** Device A selected despite having a queue because it will finish fastest!

## Advantages Over Simple Routing

| Strategy | Simple Routing | Greedy Algorithm |
|----------|----------------|------------------|
| **Decision basis** | Device speed only | Queue + speed + tokens |
| **Queue awareness** | No | Yes |
| **Optimal selection** | Sometimes | Always (locally) |
| **Load balancing** | Basic | Advanced |
| **Adapts to load** | No | Yes |
| **Utilization** | Good | Optimal |

## Performance Impact

### Before (complexity-based only):
- Fast device: Often idle while processing complex questions
- Slow device: Often idle waiting for simple questions
- Uneven load distribution

### After (greedy algorithm):
- ✅ All devices utilized optimally
- ✅ Minimum average wait time
- ✅ Better throughput
- ✅ Adapts to real-time conditions

## Configuration

```javascript
// Enable greedy (default)
llmService.setGreedyMode(true);

// Disable if you want predictable complexity-based routing
llmService.setGreedyMode(false);

// Adjust TPS ratio
llmService.setTPSRatio(150); // More conservative

// Check config
const config = llmService.getLoadBalancerConfig();
// { useGreedy: true, tpsPerPerson: 100, avgTokensPerRequest: 52.3 }
```

## Trade-offs

### Greedy Algorithm (Recommended)
✅ Optimal performance  
✅ Queue-aware  
✅ Adaptive  
❌ Slightly less predictable  
❌ More complex logic  

### Complexity-Based Routing
✅ Simple and predictable  
✅ Easier to debug  
❌ Suboptimal performance  
❌ Doesn't consider queues  

## Implementation Details

### Files Modified
- `server/loadBalancer.js` - Core algorithm implementation
- `server/llmService.js` - Integration and token tracking
- `LOAD_BALANCER_GUIDE.md` - User documentation

### Key Methods
- `analyzeQuestion()` - Classifies question complexity
- `calculateCompletionTime()` - Greedy time estimation
- `selectDeviceGreedy()` - Optimal device selection
- `updateAverageTokens()` - Adaptive learning
- `selectBestDevice()` - Main routing logic

## Testing

Run the test script to see the greedy algorithm in action:
```bash
node test_routing.js
```

This demonstrates how the algorithm calculates completion times and makes optimal routing decisions under different load scenarios.

## Future Enhancements

Potential improvements:
- [ ] Machine learning model for token prediction
- [ ] Historical performance tracking per device
- [ ] Dynamic TPS ratio adjustment
- [ ] Priority queues for urgent requests
- [ ] Device failure handling and retry logic
- [ ] Real-time performance dashboards
