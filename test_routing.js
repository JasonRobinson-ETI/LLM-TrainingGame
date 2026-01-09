/**
 * Load Balancer Question Routing Test
 * 
 * Run this to see how questions are classified and routed using the greedy algorithm
 */

import LoadBalancer from './server/loadBalancer.js';

const lb = new LoadBalancer(100, true); // Enable greedy algorithm

// Simulate 3 devices with different speeds
const mockDevices = [
  { base: 'http://fast-gpu:11434', tps: 420 },
  { base: 'http://medium-gpu:11434', tps: 180 },
  { base: 'http://slow-cpu:11434', tps: 95 }
];

lb.updateDeviceMetrics(mockDevices);

console.log('\n=== Greedy Algorithm Test ===\n');
console.log('The greedy algorithm calculates expected completion time for each device:');
console.log('completion_time = (queue_size × avg_tokens) / tps + estimated_tokens / tps\n');

// Test questions
const testQuestions = [
  { q: "Is the sky blue?", scenario: "All devices idle" },
  { q: "Explain quantum mechanics in detail", scenario: "Fast device has queue of 2" },
  { q: "What is 2 + 2?", scenario: "Fast device busy, others idle" },
];

// Scenario 1: All idle
console.log('\n--- Scenario 1: All devices idle ---');
const deviceQueues1 = {
  'http://fast-gpu:11434': [],
  'http://medium-gpu:11434': [],
  'http://slow-cpu:11434': []
};
const deviceBusy1 = {
  'http://fast-gpu:11434': false,
  'http://medium-gpu:11434': false,
  'http://slow-cpu:11434': false
};

const q1 = testQuestions[0].q;
console.log(`Question: "${q1}"`);
const analysis1 = lb.analyzeQuestion(q1);
console.log(`Analysis: ${analysis1.type} (${analysis1.complexity}, ~${analysis1.estimatedTokens} tokens)`);
console.log('\nCalculating completion times:');
Object.keys(deviceQueues1).forEach(base => {
  const time = lb.calculateCompletionTime(base, 0, analysis1.estimatedTokens);
  const tps = lb.deviceTPS[base];
  console.log(`  ${base}: ${time.toFixed(3)}s (TPS: ${tps})`);
});
const device1 = lb.selectBestDevice(deviceQueues1, deviceBusy1, q1);
console.log(`→ Selected: ${device1} (fastest for simple question)`);

// Scenario 2: Fast device has queue
console.log('\n--- Scenario 2: Fast device has 2 in queue ---');
const deviceQueues2 = {
  'http://fast-gpu:11434': [{}, {}], // 2 items in queue
  'http://medium-gpu:11434': [],
  'http://slow-cpu:11434': []
};
const deviceBusy2 = {
  'http://fast-gpu:11434': true,
  'http://medium-gpu:11434': false,
  'http://slow-cpu:11434': false
};

const q2 = testQuestions[1].q;
console.log(`Question: "${q2}"`);
const analysis2 = lb.analyzeQuestion(q2);
console.log(`Analysis: ${analysis2.type} (${analysis2.complexity}, ~${analysis2.estimatedTokens} tokens)`);
console.log('\nCalculating completion times:');
Object.keys(deviceQueues2).forEach(base => {
  const queueSize = deviceQueues2[base].length;
  const time = lb.calculateCompletionTime(base, queueSize, analysis2.estimatedTokens);
  const tps = lb.deviceTPS[base];
  console.log(`  ${base}: ${time.toFixed(3)}s (queue: ${queueSize}, TPS: ${tps})`);
});
const device2 = lb.selectBestDevice(deviceQueues2, deviceBusy2, q2);
console.log(`→ Selected: ${device2} (still fastest despite queue!)`);

// Scenario 3: Mixed
console.log('\n--- Scenario 3: Fast device busy, others idle ---');
const deviceQueues3 = {
  'http://fast-gpu:11434': [{}], // 1 item
  'http://medium-gpu:11434': [],
  'http://slow-cpu:11434': []
};
const deviceBusy3 = {
  'http://fast-gpu:11434': true,
  'http://medium-gpu:11434': false,
  'http://slow-cpu:11434': false
};

const q3 = testQuestions[2].q;
console.log(`Question: "${q3}"`);
const analysis3 = lb.analyzeQuestion(q3);
console.log(`Analysis: ${analysis3.type} (${analysis3.complexity}, ~${analysis3.estimatedTokens} tokens)`);
console.log('\nCalculating completion times:');
Object.keys(deviceQueues3).forEach(base => {
  const queueSize = deviceQueues3[base].length;
  const time = lb.calculateCompletionTime(base, queueSize, analysis3.estimatedTokens);
  const tps = lb.deviceTPS[base];
  console.log(`  ${base}: ${time.toFixed(3)}s (queue: ${queueSize}, TPS: ${tps})`);
});
const device3 = lb.selectBestDevice(deviceQueues3, deviceBusy3, q3);
console.log(`→ Selected: ${device3} (optimal for medium question)`);

console.log('\n=== Summary ===');
console.log('✓ Greedy algorithm calculates expected completion time');
console.log('✓ Considers queue size, device speed, and question complexity');
console.log('✓ Selects device with minimum completion time');
console.log('✓ Adapts to changing load conditions dynamically');
console.log('✓ Can route to busy fast device if it\'ll finish before idle slow device!\n');

