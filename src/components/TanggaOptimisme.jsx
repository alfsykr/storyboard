import React, { useState } from 'react';
import { Sparkles, Trophy, ShieldAlert, Award, ArrowRight, Play, RefreshCw } from 'lucide-react';

export default function TanggaOptimisme({ onNext, onPrev }) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState('Bantu Fikri mendaki menuju mimpinya!');
  const [msgType, setMsgType] = useState('info'); // 'info', 'success', 'error'
  const [mentalState, setMentalState] = useState('Siap'); // 'Siap', 'Sangat Optimis', 'Cemas', 'Putus Asa'
  const [history, setHistory] = useState([]);

  const totalSteps = 5;

  const stepsData = [
    { id: 'pos_1', text: 'Berlatih fisik', type: 'positive', value: 1, desc: 'Fikri berlari pagi dengan konsisten. Stamina meningkat!' },
    { id: 'pos_2', text: 'Disiplin', type: 'positive', value: 1, desc: 'Fikri merapikan jadwal tidur dan waktu belajarnya.' },
    { id: 'pos_3', text: 'Berdoa', type: 'positive', value: 1, desc: 'Memohon restu Sang Pencipta. Jiwa terasa lebih tenang.' },
    { id: 'pos_4', text: 'Rajin belajar', type: 'positive', value: 1, desc: 'Fikri mempelajari materi tes tertulis secara mendalam.' },
    { id: 'neg_1', text: 'Putus asa', type: 'negative', value: -1, desc: 'Fikri terpaku pada kegagalan masa lalu. Semangatnya merosot.' },
    { id: 'neg_2', text: 'Malas', type: 'negative', value: -1, desc: 'Fikri menunda-nunda latihan dan memilih bermain game berlebihan.' },
    { id: 'neg_3', text: 'Menyerah', type: 'negative', value: -1, desc: 'Berpikir untuk membatalkan pendaftaran. Mental melemah.' },
    { id: 'neg_4', text: 'Tidak percaya diri', type: 'negative', value: -1, desc: 'Merasa minder melihat calon prajurit lainnya yang terlihat tangguh.' }
  ];

  // Helper to get random subset of cards for the active choices
  // We want to ensure at least some positive and negative cards are present
  const [visibleCards, setVisibleCards] = useState(() => {
    const positives = stepsData.filter(c => c.type === 'positive');
    const negatives = stepsData.filter(c => c.type === 'negative');
    // Shuffled pool
    return [...positives.sort(() => 0.5 - Math.random()), ...negatives.sort(() => 0.5 - Math.random())];
  });

  const handleStart = () => {
    setIsPlaying(true);
    setStep(0);
    setMentalState('Siap');
    setMessage('Silakan klik kartu aksi di bawah untuk mendaki tangga!');
    setMsgType('info');
    setHistory([]);
  };

  const handleCardClick = (card) => {
    if (!isPlaying) return;

    let newStep = step;
    let newMental = mentalState;

    if (card.type === 'positive') {
      newStep = Math.min(totalSteps, step + 1);
      setMessage(`+1 Tangga: "${card.text}". ${card.desc}`);
      setMsgType('success');

      // Update mental state based on progress
      if (newStep >= 4) newMental = 'Sangat Optimis';
      else if (newStep >= 2) newMental = 'Optimis';
      else newMental = 'Siap';

    } else {
      newStep = Math.max(0, step - 1);
      setMessage(`Merosot -1: "${card.text}". ${card.desc}`);
      setMsgType('error');

      if (newStep === 0) newMental = 'Putus Asa';
      else if (newStep <= 2) newMental = 'Cemas';
      else newMental = 'Siap';
    }

    setStep(newStep);
    setMentalState(newMental);
    setHistory(prev => [...prev, card]);

    // Reshuffle cards to keep it dynamic
    const positives = stepsData.filter(c => c.type === 'positive').sort(() => 0.5 - Math.random());
    const negatives = stepsData.filter(c => c.type === 'negative').sort(() => 0.5 - Math.random());
    setVisibleCards([...positives, ...negatives]);

    if (newStep === totalSteps) {
      setIsPlaying(false);
      setMessage('Luar biasa! Fikri berhasil mendaki tangga hingga puncak dan menggenggam Bintang Cita-Citanya! 🌟');
      setMsgType('success');
    }
  };

  const resetGame = () => {
    setStep(0);
    setIsPlaying(false);
    setMessage('Bantu Fikri mendaki menuju mimpinya!');
    setMsgType('info');
    setMentalState('Siap');
    setHistory([]);
  };

  // Coordinates for Fikri avatar position on the stairs (0 to 5)
  // Step 0 is bottom left, Step 5 is top right.
  const getFikriStyle = () => {
    // 5 steps. Let's place Fikri at the active step.
    const bottomPercent = 15 + (step * 14.5); // steps go from bottom to top
    const leftPercent = 15 + (step * 13);    // steps go from left to right
    return {
      bottom: `${bottomPercent}%`,
      left: `${leftPercent}%`,
      transform: 'translate(-50%, 0)',
      transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    };
  };

  return (
    <div className="game-card-container animated-fade">
      <div className="card-header-edu">
        <span className="badge-title">Latihan 1 - Game Tangga Optimisme</span>
        <h2>Mendaki Tangga Cita-Cita</h2>
        <p className="subtitle">
          Bantu Fikri mencapai <strong>Bintang Cita-cita</strong>! Klik pada langkah-langkah positif untuk mendaki ke atas. Waspadai hambatan yang bisa membuat Fikri terperosok.
        </p>
      </div>

      <div className="game-layout">
        {/* Game Screen with Stairs */}
        <div className="stairs-screen">
          
          {/* Stars & Goal indicator at the top right */}
          <div className="goal-indicator-star">
            <div className={`star-glow-wrapper ${step === totalSteps ? 'victory-glow' : ''}`}>
              🌟
            </div>
            <div className="goal-label">BINTANG CITA-CITA</div>
          </div>

          {/* Draw Stairs */}
          <div className="stairs-svg-container">
            {/* Stair steps */}
            {[0, 1, 2, 3, 4, 5].map((s) => {
              const stepBottom = 12 + (s * 14.5);
              const stepLeft = 15 + (s * 13);
              return (
                <div 
                  key={s} 
                  className={`stair-step-line ${step === s ? 'active-step' : ''} ${step > s ? 'passed-step' : ''}`}
                  style={{
                    bottom: `${stepBottom}%`,
                    left: `${stepLeft}%`,
                    width: '70px',
                    height: '10px'
                  }}
                >
                  <span className="step-num">{s === 0 ? 'Awal' : s === 5 ? 'Lulus' : `Step ${s}`}</span>
                </div>
              );
            })}
          </div>

          {/* Fikri Character Avatar */}
          <div className="fikri-character-avatar" style={getFikriStyle()}>
            <div className="avatar-graphic">
              {step === totalSteps ? '🧑‍✈️' : step <= 1 ? '🏃' : '💪'}
            </div>
            <div className="avatar-tag">Fikri</div>
          </div>

          {/* Bottom Labels */}
          <div className="bottom-path-label">
            AWAL PERJALANAN
          </div>

          {!isPlaying && step === 0 && (
            <div className="game-overlay-start">
              <button onClick={handleStart} className="btn btn-accent btn-large animated-pulse">
                <Play size={18} /> Mulai Mendaki
              </button>
            </div>
          )}
        </div>

        {/* Control Board & Cards */}
        <div className="game-controls">
          <div className={`game-message-box ${msgType}`}>
            <p>{message}</p>
          </div>

          {isPlaying && (
            <div className="action-cards-grid">
              <h4>Pilih Langkah Fikri:</h4>
              <div className="cards-wrapper">
                {visibleCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className={`action-card ${card.type}`}
                  >
                    <span className="card-symbol">{card.type === 'positive' ? '✓' : '❌'}</span>
                    <span className="card-text">{card.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Stats Panel */}
          <div className="game-stats-panel">
            <div className="stat-box">
              <span className="label">Kemajuan</span>
              <span className="value">{(step / totalSteps) * 100}%</span>
              <div className="mini-progress-bar">
                <div className="fill" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
              </div>
            </div>
            
            <div className="stat-box">
              <span className="label">Mental Fikri</span>
              <span className={`value mental-${mentalState.toLowerCase().replace(' ', '-')}`}>
                {mentalState === 'Siap' && '😊 Siap'}
                {mentalState === 'Optimis' && '✨ Optimis'}
                {mentalState === 'Sangat Optimis' && '🔥 Sangat Optimis'}
                {mentalState === 'Cemas' && '😰 Cemas'}
                {mentalState === 'Putus Asa' && '😢 Putus Asa'}
              </span>
            </div>

            <div className="stat-box">
              <span className="label">Target Akhir</span>
              <span className="value gold-accent">🎖️ Akademi Militer</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-footer-edu">
        <button onClick={onPrev} className="btn btn-secondary">Kembali</button>
        
        <div className="footer-action-buttons">
          {(step > 0 || isPlaying) && (
            <button onClick={resetGame} className="btn btn-outline">
              <RefreshCw size={16} /> Mulai Ulang
            </button>
          )}

          {step === totalSteps && (
            <button onClick={onNext} className="btn btn-primary">
              Mainkan Game Berikutnya <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
