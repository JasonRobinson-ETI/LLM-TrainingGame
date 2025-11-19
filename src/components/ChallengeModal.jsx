import React, { useState, useEffect } from 'react';
import DenoiseChallenge from './challenges/DenoiseChallenge';
import AttentionChallenge from './challenges/AttentionChallenge';
import NeuroBurstChallenge from './challenges/NeuroBurstChallenge';
import ClusterRushChallenge from './challenges/ClusterRushChallenge';
import ContextCacheChallenge from './challenges/ContextCacheChallenge';
import WordSplitterChallenge from './challenges/WordSplitterChallenge';
import BiasBreakerChallenge from './challenges/BiasBreakerChallenge';
import HallucinationHunterChallenge from './challenges/HallucinationHunterChallenge';
import VersionChaosChallenge from './challenges/VersionChaosChallenge';
import EthicsEngineChallenge from './challenges/EthicsEngineChallenge';

const ChallengeModal = ({ challenge, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit / 1000);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return; // Don't run timer if already completed
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!completed) {
            setCompleted(true);
            onComplete(false);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [challenge, onComplete, completed]);

  const handleChallengeComplete = (success) => {
    if (!completed) {
      setCompleted(true);
      onComplete(success);
    }
  };

  const renderChallenge = () => {
    if (challenge.type === 'attention') {
      return <AttentionChallenge challenge={challenge} onComplete={handleChallengeComplete} />;
    }
    if (challenge.type === 'neuroburst') {
      return <NeuroBurstChallenge challenge={challenge} onComplete={handleChallengeComplete} />;
    }
    if (challenge.type === 'clusterrush') {
      return <ClusterRushChallenge challenge={challenge} onComplete={handleChallengeComplete} />;
    }
    if (challenge.type === 'contextcache') {
      return <ContextCacheChallenge challenge={challenge} onComplete={handleChallengeComplete} />;
    }
    if (challenge.type === 'wordsplitter') {
      return <WordSplitterChallenge challenge={challenge} onComplete={handleChallengeComplete} />;
    }
    if (challenge.type === 'biasbreaker') {
      return <BiasBreakerChallenge challenge={challenge} onComplete={handleChallengeComplete} />;
    }
    if (challenge.type === 'hallucinationhunter') {
      return <HallucinationHunterChallenge challenge={challenge} onComplete={handleChallengeComplete} />;
    }
    if (challenge.type === 'versionchaos') {
      return <VersionChaosChallenge challenge={challenge} onComplete={handleChallengeComplete} />;
    }
    if (challenge.type === 'ethicsengine') {
      return <EthicsEngineChallenge challenge={challenge} onComplete={handleChallengeComplete} />;
    }
    return <DenoiseChallenge challenge={challenge} onComplete={handleChallengeComplete} />;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div className="card shake" style={{
        maxWidth: '600px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.7)',
        position: 'relative',
        maxHeight: '95vh',
        overflowY: 'auto'
      }}>
        <div style={{
          background: timeLeft <= 10 
            ? 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#1d1d1f',
          padding: 'clamp(12px, 3vw, 16px)',
          borderRadius: '8px',
          marginBottom: 'clamp(12px, 3vw, 20px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          <h2 style={{ 
            margin: 0,
            fontSize: 'clamp(1rem, 4vw, 1.5rem)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>⚡ CHALLENGE ALERT!</h2>
          <div style={{
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            fontWeight: 'bold',
            className: timeLeft <= 10 ? 'pulse' : '',
            flexShrink: 0
          }}>
            {timeLeft}s
          </div>
        </div>

        {renderChallenge()}
      </div>
    </div>
  );
};

export default ChallengeModal;
