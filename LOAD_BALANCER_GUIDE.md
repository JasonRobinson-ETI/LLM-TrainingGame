# Load Balancer Usage Guide

## Overview
The Load Balancer dynamically manages queue capacity for each Ollama device based on TPS (tokens per second) performance. It uses a configurable ratio to determine how many concurrent requests each device can handle.

**NEW**: The load balancer now includes **intelligent question routing** - it analyzes question complexity and routes simple questions to slower devices while routing complex questions to faster devices, optimizing resource utilization.

## Default Configuration
- **TPS Ratio**: 100 TPS = 1 person in queue
- **Examples**:
  - 400 TPS device → Max 4 people in queue
  - 250 TPS device → Max 2 people in queue  
  - 100 TPS device → Max 1 person in queue
  - 50 TPS device → Max 1 person in queue (minimum)

## Question Complexity Analysis

The load balancer automatically analyzes each question and classifies it:

### Simple Questions (→ Slower Devices)
- **Yes/No questions**: "Is the sky blue?", "Can dogs fly?"
- **Simple definitions**: "What is a cat?", "Define photosynthesis"
- **Estimated tokens**: 10-25
- **Routing**: Sent to slowest available device

### Medium Complexity (→ Mid-tier Devices)
- **Math problems**: "What is 45 + 67?", "Calculate 10% of 200"
- **General questions**: "What time is it?", "Name three colors"
- **Estimated tokens**: 30-50
- **Routing**: Sent to mid-tier device

### Complex Questions (→ Fastest Devices)
- **Why/How questions**: "Why is the sky blue?", "How does photosynthesis work?"
- **Explanations**: "Explain quantum mechanics", "Describe the water cycle"
- **Comparisons**: "Compare cats and dogs", "What's the difference between RNA and DNA?"
- **Estimated tokens**: 100+
- **Routing**: Sent to fastest available device

### Routing Logic Example

With 3 devices:
- Device A: 400 TPS (fastest)
- Device B: 180 TPS (mid-tier)
- Device C: 95 TPS (slowest)

Questions are routed:
- "Is water wet?" → **Device C** (simple yes/no)
- "What is 5 + 3?" → **Device B** (medium math)
- "Explain how photosynthesis works" → **Device A** (complex explanation)

This ensures fast devices aren't wasted on simple questions, and slow devices aren't overwhelmed by complex ones!

## How It Works

### 1. Automatic Initialization
The load balancer is automatically integrated into `llmService.js`. When the server starts:
1. All Ollama devices are benchmarked
2. Devices are ranked by TPS performance
3. Queue capacities are calculated for each device
4. Total system capacity is logged
5. Greedy algorithm is enabled by default

### 2. Request Assignment Strategy (Greedy Algorithm)

The load balancer uses a **greedy algorithm** that makes the locally optimal choice by calculating expected completion time for each device:

**Completion Time Formula:**
```
completion_time = (queue_size × avg_tokens_per_request) / device_tps + estimated_tokens / device_tps
```

**Algorithm Steps:**
1. **Analyze question** to estimate token count (simple: 10-25, medium: 30-50, complex: 100+)
2. **Calculate completion time** for each device based on:
   - Current queue length
   - Device speed (TPS)
   - Estimated tokens needed
3. **Select device with minimum completion time**
4. **Tie-breaker**: Prefer idle devices over busy ones

**Fallback Strategy** (if greedy can't find capacity):
- Finds device with most headroom below capacity
- Last resort: Rejects request if system completely saturated

**Example:**
```
Question: "Explain photosynthesis" (~100 tokens)

Device A: 400 TPS, queue: 2 requests
  → Time: (2 × 50)/400 + 100/400 = 0.25s + 0.25s = 0.50s ✓ SELECTED

Device B: 180 TPS, queue: 0 requests  
  → Time: (0 × 50)/180 + 100/180 = 0s + 0.56s = 0.56s

Device C: 95 TPS, queue: 0 requests
  → Time: (0 × 50)/95 + 100/95 = 0s + 1.05s = 1.05s

Result: Device A selected despite having a queue because it will finish fastest!
```

### 3. Adaptive Learning
The load balancer tracks actual token usage from completed requests and updates its predictions using an exponential moving average. This makes the greedy algorithm more accurate over time.

### 4. Queue Health Monitoring
Each device's queue is continuously monitored:
- **HEALTHY**: < 50% capacity utilized
- **MODERATE**: 50-75% capacity utilized  
- **HIGH**: 75-100% capacity utilized
- **AT_CAPACITY**: 100%+ capacity utilized

## API Usage

### In llmService.js (already integrated)

```javascript
// Get queue health for all devices
const health = llmService.getQueueHealth();
console.log(health);
// Output:
// {
//   'http://192.168.1.68:11434': {
//     queueSize: 2,
//     capacity: 4,
//     utilization: '50.0%',
//     ranking: 1,
//     status: 'MODERATE'
//   },
//   'http://localhost:11434': {
//     queueSize: 0,
//     capacity: 1,
//     utilization: '0.0%',
//     ranking: 2,
//     status: 'HEALTHY'
//   }
// }

// Get load balancer metrics
const metrics = llmService.getLoadBalancerMetrics();
console.log(metrics);
// Output:
// {
//   devices: 3,
//   totalCapacity: 7,
//   capacityByDevice: {
//     'http://192.168.1.68:11434': 4,
//     'http://192.168.68.25:11434': 2,
//     'http://localhost:11434': 1
//   },
//   rankings: {
//     'http://192.168.1.68:11434': 1,
//     'http://192.168.68.25:11434': 2,
//     'http://localhost:11434': 3
//   }
// }

// Check if system can handle more students
const feasibility = llmService.canHandleAdditionalLoad(5);
console.log(feasibility);
// Output:
// {
//   canHandle: true,
//   currentLoad: 2,
//   totalCapacity: 7,
//   projectedLoad: 7,
//   headroom: 0
// }

// Adjust TPS ratio (fine-tuning)
llmService.setTPSRatio(150); // 150 TPS per person instead of 100

// Enable/disable greedy algorithm
llmService.setGreedyMode(false); // Disable greedy, use complexity-based routing
llmService.setGreedyMode(true);  // Re-enable greedy (default)

// Get load balancer configuration
const config = llmService.getLoadBalancerConfig();
console.log(config);
// Output:
// {
//   useGreedy: true,
//   tpsPerPerson: 100,
//   avgTokensPerRequest: 52.3
// }
```

### In game server (server/index.js)

Add endpoints to expose load balancer stats to teacher dashboard:

```javascript
// Add to WebSocket message handlers or HTTP endpoints

// Send load balancer stats to teacher
function sendLoadBalancerStats() {
  const health = llmService.getQueueHealth();
  const metrics = llmService.getLoadBalancerMetrics();
  
  broadcast({
    type: 'load_balancer_stats',
    health,
    metrics
  });
}

// Check capacity before allowing new students to join
ws.on('message', async (message) => {
  const data = JSON.parse(message);
  
  if (data.type === 'student_join') {
    const feasibility = llmService.canHandleAdditionalLoad(1);
    
    if (!feasibility.canHandle) {
      ws.send(JSON.stringify({
        type: 'join_rejected',
        reason: 'System at capacity. Please try again later.',
        metrics: feasibility
      }));
      return;
    }
    
    // Allow join...
  }
});

// Periodic health updates (every 5 seconds)
setInterval(() => {
  sendLoadBalancerStats();
}, 5000);
```

## Adjusting Performance

### Increase Capacity (More Students Per Device)
```javascript
// Allow 1 person per 80 TPS (increases capacity)
llmService.setTPSRatio(80);
// 400 TPS device now handles 5 people instead of 4
```

### Decrease Capacity (Conservative)
```javascript
// Allow 1 person per 150 TPS (decreases capacity)
llmService.setTPSRatio(150);
// 400 TPS device now handles 2 people instead of 4
```

## Logging

The load balancer provides detailed logging including question analysis and greedy selection:

```
[LoadBalancer] http://192.168.1.68:11434 - Rank #1, TPS: 421.50, Max Queue: 4 people
[LoadBalancer] http://192.168.68.25:11434 - Rank #2, TPS: 180.23, Max Queue: 1 people
[LoadBalancer] http://localhost:11434 - Rank #3, TPS: 95.10, Max Queue: 1 people
[LLM] Load Balancer: 6 total queue slots across 3 devices

[LoadBalancer] Question analysis: complex (high, ~100 tokens)
[LoadBalancer] Greedy selection: http://192.168.1.68:11434 (completion time: 0.50s, TPS: 421.5)
[LLM] Assigning request to http://192.168.1.68:11434 (TPS: 421.5, Queue: 2/4)

[LoadBalancer] Question analysis: yes_no (simple, ~10 tokens)
[LoadBalancer] Greedy selection: http://localhost:11434 (completion time: 0.11s, TPS: 95.1)
[LLM] Assigning request to http://localhost:11434 (TPS: 95.1, Queue: 0/1)

[LLM] All devices at capacity! Rejecting request.
```

## Error Handling

When all devices are at capacity, requests are rejected with:
```javascript
try {
  const response = await llmService.generateResponse(question, trainingData);
} catch (error) {
  // error.message = 'System at capacity. Please try again later.'
  // Handle gracefully - show message to user or retry
}
```

## Performance Tuning Tips

1. **Monitor queue health** regularly to detect bottlenecks
2. **Greedy algorithm** (default) provides optimal performance by minimizing wait times
3. **Disable greedy** if you prefer simpler complexity-based routing: `llmService.setGreedyMode(false)`
4. **Adjust TPS ratio** based on actual classroom size and response times
5. **Add more devices** if `canHandleAdditionalLoad()` frequently returns false
6. **Lower ratio** if students experience long wait times (be more conservative)
7. **Raise ratio** if queues are always empty (be more aggressive)
8. **Watch avg tokens** - it adapts automatically but you can monitor via `getLoadBalancerConfig()`

## Greedy Algorithm Benefits

✅ **Optimal device selection** - mathematically chooses fastest completion time  
✅ **Queue-aware** - considers current load, not just device speed  
✅ **Adaptive** - learns from actual token usage to improve predictions  
✅ **Dynamic** - automatically adjusts to changing conditions  
✅ **Efficient** - maximizes throughput by utilizing all devices optimally  

**When to disable greedy:**
- You want predictable routing (always fast→complex, slow→simple)
- Debugging routing behavior
- Testing specific device assignments

## Integration Checklist

- [x] Load balancer integrated into llmService.js
- [x] Device benchmarking updates load balancer metrics
- [x] Request assignment uses load balancer routing
- [x] Queue capacity enforced per device
- [ ] Teacher dashboard shows load balancer health (optional enhancement)
- [ ] Student join requests check capacity (optional enhancement)
- [ ] Periodic health broadcasts to clients (optional enhancement)
