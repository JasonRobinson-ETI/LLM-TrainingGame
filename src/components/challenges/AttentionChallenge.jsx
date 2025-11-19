import React, { useState, useEffect } from 'react';

const AttentionChallenge = ({ challenge, onComplete }) => {
  const [phase, setPhase] = useState('intro'); // 'intro', 'active', 'complete'
  const [selectedWords, setSelectedWords] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [scores, setScores] = useState([]);
  
  // Multiple sentence examples
  const sentenceExamples = [
    {
      sentence: "The cat that chased the mouse was tired",
      words: ["The", "cat", "that", "chased", "the", "mouse", "was", "tired"],
      targetWordIndex: 6,
      correctAttentions: [1]
    },
    {
      sentence: "Sarah bought a book and she loved it",
      words: ["Sarah", "bought", "a", "book", "and", "she", "loved", "it"],
      targetWordIndex: 5,
      correctAttentions: [0]
    },
    {
      sentence: "The dog barked because it saw a stranger",
      words: ["The", "dog", "barked", "because", "it", "saw", "a", "stranger"],
      targetWordIndex: 4,
      correctAttentions: [1]
    },
    {
      sentence: "My teacher said that homework helps us learn",
      words: ["My", "teacher", "said", "that", "homework", "helps", "us", "learn"],
      targetWordIndex: 6,
      correctAttentions: [4]
    },
    {
      sentence: "The pizza was delicious so I ate it all",
      words: ["The", "pizza", "was", "delicious", "so", "I", "ate", "it", "all"],
      targetWordIndex: 7,
      correctAttentions: [1]
    }
  ];
  
  const currentChallenge = sentenceExamples[currentRound] || challenge;

  // Inject responsive CSS
  useEffect(() => {
    const styleId = 'attention-challenge-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .attention-word {
          display: inline-block;
          padding: clamp(6px, 1.5vw, 10px) clamp(10px, 2vw, 14px);
          margin: clamp(3px, 0.8vw, 5px);
          border-radius: clamp(6px, 1.5vw, 8px);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: clamp(0.9rem, 2.5vw, 1.1rem);
          font-weight: 500;
          user-select: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .attention-word:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        .attention-word.selected {
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          color: white;
          border-color: #8b5cf6;
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
        }
        
        .attention-word.target {
          background: linear-gradient(135deg, #ec4899 0%, #ef4444 100%);
          color: white;
          border-color: #ec4899;
          font-weight: 700;
          animation: pulse-target 1.5s ease-in-out infinite;
        }
        
        .attention-word.correct {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-color: #10b981;
        }
        
        .attention-word.missed {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          border-color: #f59e0b;
        }
        
        .attention-word.wrong {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border-color: #ef4444;
        }
        
        @keyframes pulse-target {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @media (max-width: 600px) {
          .attention-word {
            padding: 8px 12px;
            margin: 3px;
            font-size: 0.95rem;
          }
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const style = document.getElementById(styleId);
      if (style) style.remove();
    };
  }, []);

  const handleWordClick = (index) => {
    if (submitted) return;
    
    const newSelected = new Set(selectedWords);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedWords(newSelected);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    
    // Calculate accuracy
    const correctAttentions = new Set(currentChallenge.correctAttentions);
    const playerAttentions = selectedWords;
    
    // Count correct selections (intersection)
    const correctSelections = [...playerAttentions].filter(x => correctAttentions.has(x)).length;
    
    // Calculate score: correct selections / total correct needed
    const accuracy = correctAttentions.size > 0 ? correctSelections / correctAttentions.size : 0;
    
    // Track score for this round
    const isCorrect = accuracy > 0.5;
    setScores(prev => [...prev, isCorrect ? 1 : 0]);
    
    console.log('Attention answer:', {
      round: currentRound + 1,
      selected: [...playerAttentions],
      correct: [...correctAttentions],
      correctSelections,
      accuracy: (accuracy * 100).toFixed(0) + '%',
      isCorrect
    });
    
    // Wait to show feedback, then move to next round or complete
    setTimeout(() => {
      if (currentRound + 1 >= 5) {
        // Challenge complete after 5 rounds
        const totalCorrect = [...scores, isCorrect ? 1 : 0].reduce((sum, s) => sum + s, 0);
        const success = totalCorrect > 2; // Majority of 5
        onComplete(success);
      } else {
        // Move to next round
        setCurrentRound(prev => prev + 1);
        setSelectedWords(new Set());
        setSubmitted(false);
      }
    }, 2000);
  };

  const getWordClass = (index) => {
    const classes = ['attention-word'];
    
    if (index === currentChallenge.targetWordIndex) {
      classes.push('target');
      return classes.join(' ');
    }
    
    if (submitted) {
      const correctAttentions = new Set(currentChallenge.correctAttentions);
      const isSelected = selectedWords.has(index);
      const isCorrect = correctAttentions.has(index);
      
      if (isSelected && isCorrect) {
        classes.push('correct');
      } else if (isSelected && !isCorrect) {
        classes.push('wrong');
      } else if (!isSelected && isCorrect) {
        classes.push('missed');
      }
    } else if (selectedWords.has(index)) {
      classes.push('selected');
    }
    
    return classes.join(' ');
  };

  if (phase === 'intro') {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: 'clamp(12px, 3vw, 30px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: 'clamp(12px, 3vw, 20px)',
          padding: 'clamp(20px, 4vw, 40px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(20px, 4vw, 30px)' }}>
            <div style={{ fontSize: 'clamp(2.5rem, 10vw, 4rem)', marginBottom: 'clamp(12px, 3vw, 20px)' }}>
              🎯
            </div>
            <h2 style={{ 
              fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', 
              margin: '0 0 clamp(10px, 2vw, 15px) 0',
              color: 'white',
              fontWeight: 'bold'
            }}>
              Attention Mechanism
            </h2>
            <p style={{ 
              fontSize: 'clamp(0.9rem, 3vw, 1.2rem)', 
              color: '#94a3b8',
              lineHeight: '1.5',
              margin: '0'
            }}>
              Train the model to focus on what matters!
            </p>
          </div>

          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: 'clamp(10px, 2.5vw, 15px)',
            padding: 'clamp(15px, 3vw, 25px)',
            marginBottom: 'clamp(15px, 3vw, 25px)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            textAlign: 'left',
            color: 'white',
            fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
            lineHeight: '1.6'
          }}>
            <p style={{ marginTop: 0 }}><strong style={{ color: '#a78bfa' }}>🎯 Your Mission:</strong> Select words the model should focus on</p>
            <p><strong style={{ color: '#a78bfa' }}>🔍 Target:</strong> The pink highlighted word is the context</p>
            <p><strong style={{ color: '#a78bfa' }}>✅ Select:</strong> Click words that relate to the target</p>
            <p><strong style={{ color: '#a78bfa' }}>✅ Win Condition:</strong> Get majority of selections correct</p>
            <p style={{ marginBottom: 0 }}><strong style={{ color: '#a78bfa' }}>💡 Tip:</strong> Think about semantic relationships</p>
          </div>

          <button
            onClick={() => setPhase('active')}
            style={{
              width: '100%',
              padding: 'clamp(14px, 3vw, 18px)',
              fontSize: 'clamp(1rem, 3.5vw, 1.2rem)',
              fontWeight: 'bold',
              color: 'white',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              border: 'none',
              borderRadius: 'clamp(10px, 2.5vw, 12px)',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              minHeight: '48px',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          >
            🚀 Start Focusing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      userSelect: 'none', 
      maxWidth: '100%', 
      overflow: 'hidden',
      padding: 'clamp(10px, 2vw, 20px)',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
    }}>
      {/* Progress indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
        fontWeight: '600',
        color: '#94a3b8'
      }}>
        <div>Round {currentRound + 1} of 5</div>
        <div>Score: {scores.reduce((sum, s) => sum + s, 0)}/{scores.length}</div>
      </div>

      {/* Title */}
      <h3 style={{ 
        marginBottom: '8px', 
        color: 'white',
        fontSize: 'clamp(1.1rem, 4vw, 1.8rem)',
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: 'clamp(0.5px, 0.2vw, 1px)',
        textTransform: 'uppercase',
        lineHeight: '1.2'
      }}>
        🎯 Pick the related words
      </h3>
      
      <p style={{ 
        marginBottom: '16px', 
        color: '#94a3b8',
        textAlign: 'center',
        fontSize: 'clamp(0.75rem, 2vw, 0.95rem)',
        fontWeight: '500',
        padding: '0 8px',
        lineHeight: '1.4'
      }}>
        Tap the words that help the <span style={{ color: '#ec4899', fontWeight: '700' }}>highlighted word</span> make sense. Tap again to undo.
      </p>

      {/* Sentence with clickable words */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: 'clamp(8px, 2vw, 12px)',
        padding: 'clamp(16px, 4vw, 24px)',
        marginBottom: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        minHeight: 'clamp(120px, 20vh, 180px)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: '1.8'
      }}>
        {currentChallenge.words.map((word, index) => (
          <span
            key={index}
            className={getWordClass(index)}
            onClick={() => handleWordClick(index)}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Instructions */}
      {!submitted && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 'clamp(6px, 1.5vw, 8px)',
          padding: 'clamp(10px, 2vw, 14px)',
          marginBottom: '16px',
          color: '#94a3b8',
          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
          lineHeight: '1.4'
        }}>
          <div style={{ fontWeight: 700, marginBottom: 6, color: '#60a5fa' }}>💡 How it works</div>
          <ul style={{ paddingLeft: '1.1em', margin: 0 }}>
            <li style={{ marginBottom: 4 }}>Look for the glowing word — that's the target.</li>
            <li style={{ marginBottom: 4 }}>Tap 1–3 words that give the target its meaning or that it refers to.</li>
            <li style={{ marginBottom: 4 }}>Tap a word again to undo your pick.</li>
            <li>When you're ready, press <strong style={{ color: 'white' }}>Check answers</strong>.</li>
          </ul>
          <div style={{ marginTop: 8, opacity: 0.9 }}>
            <em>Example:</em> If the highlighted word is <strong style={{ color: 'white' }}>"it"</strong>, you might pick the noun it stands for earlier in the sentence.
          </div>
        </div>
      )}

      {/* Feedback after submission */}
      {submitted && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 'clamp(6px, 1.5vw, 8px)',
          padding: 'clamp(10px, 2vw, 14px)',
          marginBottom: '16px',
          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
          color: '#94a3b8'
        }}>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>● Green</span> = Correct selection
          </div>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>● Orange</span> = You missed this one
          </div>
          <div>
            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>● Red</span> = Wrong selection
          </div>
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={submitted || selectedWords.size === 0}
        style={{
          width: '100%',
          background: submitted 
            ? 'rgba(255, 255, 255, 0.1)'
            : selectedWords.size === 0
            ? 'rgba(255, 255, 255, 0.1)'
            : 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
          color: 'white',
          padding: 'clamp(12px, 2.5vw, 16px)',
          fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
          fontWeight: '700',
          borderRadius: 'clamp(8px, 2vw, 12px)',
          border: submitted || selectedWords.size === 0 ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
          cursor: submitted || selectedWords.size === 0 ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: submitted || selectedWords.size === 0
            ? '0 2px 8px rgba(0,0,0,0.1)' 
            : '0 6px 20px rgba(245, 87, 108, 0.4)',
          transform: 'scale(1)',
          textTransform: 'uppercase',
          letterSpacing: 'clamp(0.5px, 0.2vw, 1px)',
          opacity: submitted || selectedWords.size === 0 ? 0.6 : 1,
          lineHeight: '1.3',
          minHeight: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          if (!submitted && selectedWords.size > 0) {
            e.target.style.transform = 'scale(1.02)';
            e.target.style.boxShadow = '0 8px 28px rgba(245, 87, 108, 0.5)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = submitted || selectedWords.size === 0
            ? '0 2px 8px rgba(0,0,0,0.1)'
            : '0 6px 20px rgba(245, 87, 108, 0.4)';
        }}
      >
        {submitted 
          ? '⏳ Checking...'
          : selectedWords.size === 0
          ? '⚠ Select at least one word'
          : `✅ Check answers (${selectedWords.size} selected)`
        }
      </button>
    </div>
  );
};

export default AttentionChallenge;
