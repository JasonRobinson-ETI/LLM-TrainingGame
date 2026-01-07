import React from 'react';

const LLMDisplay = ({ gameState }) => {
  // Use the training data length to create a unique key that changes when content updates
  // This ensures the animation restarts whenever new Q&A pairs are added
  const animationKey = `${gameState?.trainingData?.length || 0}-${gameState?.llmKnowledge?.length || 0}`;
  
  // Calculate animation duration based on number of items
  // ~5 seconds per item to maintain consistent scroll speed
  const itemCount = gameState?.llmKnowledge?.length || 0;
  const animationDuration = Math.max(15, itemCount * 5); // Minimum 15s, scales with items
  
  return (
    <div className="card" style={{ 
      padding: '20px',
      flex: 1,
      minHeight: 0,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1d1d1f', letterSpacing: '-0.02em' }}>
            AI Mind
          </h2>
          {gameState?.evolutionCount > 0 && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '13px',
              color: '#1d1d1f',
              fontWeight: '500',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}>
              Gen {gameState.evolutionCount}
            </div>
          )}
        </div>
        <div style={{
          fontSize: '14px',
          color: '#86868b',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ opacity: 0.7 }}>Base Model:</span>
          <span style={{ 
            color: '#1d1d1f',
            background: 'rgba(255, 255, 255, 0.5)',
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '13px',
            fontFamily: 'monospace'
          }}>
            {gameState?.llmModel || 'gemma3:270m'}
          </span>
        </div>
      </div>

      <style>
        {`
          @keyframes scrollKnowledge {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-50%);
            }
          }
          .knowledge-scroll-${itemCount} {
            animation: scrollKnowledge ${animationDuration}s linear infinite;
          }
          .knowledge-scroll-${itemCount}:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      {/* Scrolling Session Activity */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.7)',
        boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.7)',
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ fontSize: '15px', fontWeight: '500', marginBottom: '12px', color: '#1d1d1f', flexShrink: 0 }}>
          Session Activity
        </div>
        {gameState?.llmKnowledge && gameState.llmKnowledge.length > 0 ? (
          <div style={{
            flex: 1,
            overflowY: 'hidden',
            overflowX: 'hidden',
            position: 'relative',
            maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
          }}>
            <div 
              key={animationKey}
              className={`knowledge-scroll-${itemCount}`} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {/* Original list */}
              {gameState.llmKnowledge.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.7)',
                    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.7)'
                  }}
                >
                  <div style={{ fontSize: '13px', color: '#1d1d1f', marginBottom: '4px', fontWeight: '500' }}>
                    <strong>Q:</strong> {item.q}
                  </div>
                  <div style={{ fontSize: '13px', color: '#86868b' }}>
                    <strong>A:</strong> {item.a}
                  </div>
                </div>
              ))}
              {/* Duplicate list for seamless loop */}
              {gameState.llmKnowledge.map((item, idx) => (
                <div
                  key={`${idx}-duplicate`}
                  style={{
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.7)',
                    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.7)'
                  }}
                >
                  <div style={{ fontSize: '13px', color: '#1d1d1f', marginBottom: '4px', fontWeight: '500' }}>
                    <strong>Q:</strong> {item.q}
                  </div>
                  <div style={{ fontSize: '13px', color: '#86868b' }}>
                    <strong>A:</strong> {item.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            minHeight: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '17px',
            textAlign: 'center',
            fontStyle: 'italic',
            color: '#86868b'
          }}>
            I know nothing yet. Feed me knowledge!
          </div>
        )}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr', 
        gap: '16px',
        flexShrink: 0
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.7)',
          boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.7)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '13px', opacity: 0.6, color: '#1d1d1f' }}>Knowledge Base</div>
          <div style={{ fontSize: '20px', fontWeight: '600', marginTop: '4px', color: '#1d1d1f' }}>
            {gameState?.llmKnowledge?.length || 0} items
          </div>
        </div>
      </div>
    </div>
  );
};

export default LLMDisplay;
