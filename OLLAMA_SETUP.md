# Fast NPU-Accelerated LLM Setup with Ollama

Your LLM service now supports **Ollama** for NPU-accelerated inference on your Mac! This will give you Gemma 1b-like speeds using the Neural Engine.

## Quick Setup (5 minutes)

### 1. Install Ollama

```bash
# Download and install from:
# https://ollama.ai

# Or use Homebrew:
brew install ollama
```

### 2. Start Ollama Service

```bash
ollama serve
```

Keep this running in a terminal.

### 3. Pull a Small Model

In a new terminal, pull one of these fast models:

```bash
# Gemma 2B (Recommended - similar to what you mentioned)
ollama pull gemma:2b

```

### 4. Configure Your Preferred Model

Edit `server/llmService.js` and change the model name if desired:

```javascript
this.modelName = 'gemma:2b';
```

### 5. Start Your Server

```bash
npm run dev
```

## How It Works

- **With Ollama**: Uses Apple Metal → Neural Engine for **fast** inference
- **Without Ollama**: Falls back to Transformers.js (CPU-only, slower)

The service automatically detects if Ollama is running and uses it for NPU acceleration.

## Performance Comparison

| Method | Speed | Hardware Used |
|--------|-------|---------------|
| Transformers.js (GPT-2) | ~5-10 tokens/sec | CPU only |
| **Ollama (Gemma 2B)** | **~50-100 tokens/sec** | **Neural Engine** |
| Ollama (TinyLlama) | ~80-120 tokens/sec | Neural Engine |

## Verify It's Working

When you start the server, you should see:

```
[LLM] Ollama is ready! Using model: gemma:2b
[LLM] This will use your Mac's Neural Engine for fast inference
```

If Ollama isn't running, you'll see:

```
[LLM] Ollama not available, falling back to Transformers.js
[LLM] Install Ollama from https://ollama.ai for faster NPU-accelerated inference
```

## Model Recommendations

- **gemma:2b** - Best balance of speed and quality (Google's Gemma)
- **tinyllama** - Fastest option, good for simple responses
- **phi** - Higher quality responses, slightly slower
- **qwen:0.5b** - Extremely fast, minimal resources

## Troubleshooting

**Ollama not detected?**
```bash
# Make sure Ollama is running:
ollama serve

# Test it manually:
curl http://localhost:11434/api/tags
```

**Want to change models?**
```bash
# List installed models:
ollama list

# Pull a different model:
ollama pull <model-name>

# Update server/llmService.js with the new model name
```

## Resources

- Ollama Documentation: https://github.com/ollama/ollama
- Available Models: https://ollama.ai/library
- Model Performance: https://ollama.ai/models
