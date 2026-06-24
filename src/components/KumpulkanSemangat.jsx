import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Play, RefreshCw, Star, ShieldAlert, Award } from 'lucide-react';

export default function KumpulkanSemangat({ onNext, onPrev }) {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [basketX, setBasketX] = useState(50); // percentage (0 to 100)
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('Kumpulkan 100 poin semangat untuk menang!');

  const gameAreaRef = useRef(null);
  const requestRef = useRef(null);
  const lastSpawnTime = useRef(0);

  const positiveItems = [
    { text: 'Optimis', type: 'positive', color: '#f59e0b' },
    { text: 'Berani', type: 'positive', color: '#10b981' },
    { text: 'Disiplin', type: 'positive', color: '#3b82f6' },
    { text: 'Doa Ibu', type: 'positive', color: '#ec4899' },
    { text: 'Motivasi Guru', type: 'positive', color: '#8b5cf6' }
  ];

  const negativeItems = [
    { text: 'Menyerah', type: 'negative', color: '#ef4444' },
    { text: 'Malas', type: 'negative', color: '#f43f5e' },
    { text: 'Putus Asa', type: 'negative', color: '#b91c1c' }
  ];

  // Start the game
  const startGame = () => {
    setScore(0);
    setItems([]);
    setIsPlaying(true);
    setGameOver(false);
    setBasketX(50);
    setMessage('Geser keranjang untuk menangkap bintang positif!');
    lastSpawnTime.current = Date.now();
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft') {
        setBasketX((x) => Math.max(5, x - 8));
      } else if (e.key === 'ArrowRight') {
        setBasketX((x) => Math.min(95, x + 8));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Touch/Mouse drag movement on the game area
  const handleMouseMove = (e) => {
    if (!isPlaying || !gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.min(95, Math.max(5, relativeX)));
  };

  const handleTouchMove = (e) => {
    if (!isPlaying || !gameAreaRef.current || e.touches.length === 0) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const relativeX = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.min(95, Math.max(5, relativeX)));
  };

  // Main game loop
  const updateGame = () => {
    if (!isPlaying) return;

    const now = Date.now();
    
    // 1. Spawn new items every 2.2 seconds (Slower for user-friendliness)
    if (now - lastSpawnTime.current > 2200) {
      const isPositive = Math.random() > 0.35; // 65% chance positive
      const pool = isPositive ? positiveItems : negativeItems;
      const template = pool[Math.floor(Math.random() * pool.length)];
      
      const newItem = {
        id: Math.random().toString(),
        text: template.text,
        type: template.type,
        color: template.color,
        x: 10 + Math.random() * 80, // percentage x
        y: 0, // percentage y
        speed: 0.55 + Math.random() * 0.45 // Slower fall speed (approx 2-3 seconds to reach bottom)
      };
      
      setItems((prev) => [...prev, newItem]);
      lastSpawnTime.current = now;
    }

    // 2. Move items down and check collisions
    setItems((prevItems) => {
      const updated = [];
      let scoreDiff = 0;

      for (let item of prevItems) {
        const nextY = item.y + item.speed;

        // Collision Check: Y is near the basket (basket is at ~90%)
        // Basket width is about 15% of screen width, centered at basketX
        const isNearBasketY = nextY >= 86 && nextY <= 92;
        const isAlignedX = Math.abs(item.x - basketX) < 10;

        if (isNearBasketY && isAlignedX) {
          // Caught item!
          if (item.type === 'positive') {
            scoreDiff += 10;
          } else {
            scoreDiff -= 5;
          }
          continue; // Skip adding to updated (deletes it)
        }

        if (nextY < 100) {
          updated.push({ ...item, y: nextY });
        }
      }

      if (scoreDiff !== 0) {
        setScore((s) => {
          const nextScore = Math.max(0, s + scoreDiff);
          if (nextScore >= 100) {
            setIsPlaying(false);
            setGameOver(true);
            setMessage('Luar biasa! Skor mencapai 100! Fikri memiliki semangat baja! 🏆');
          }
          return nextScore;
        });
      }

      return updated;
    });

    requestRef.current = requestAnimationFrame(updateGame);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, basketX]);

  const resetGame = () => {
    setScore(0);
    setItems([]);
    setIsPlaying(false);
    setGameOver(false);
    setMessage('Kumpulkan 100 poin semangat untuk menang!');
  };

  return (
    <div className="game-card-container animated-fade">
      <div className="card-header-edu">
        <span className="badge-title">Latihan 2 - Game Kumpulkan Semangat</span>
        <h2>Menangkap Bintang Nilai Positif</h2>
        <p className="subtitle">
          Gerakkan keranjang Fikri ke kiri/kanan menggunakan <strong>tombol layar, ketuk-tarik mouse, atau panah keyboard</strong> untuk menangkap bintang positif (+10) dan menghindari rintangan negatif (-5).
        </p>
      </div>

      <div className="game-layout catching-game">
        
        {/* Falling Catch Area */}
        <div 
          ref={gameAreaRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="catching-game-screen"
        >
          {/* Background Stars Decoration */}
          <div className="star-bg-dec">
            <div className="twinkle-star t1">★</div>
            <div className="twinkle-star t2">★</div>
            <div className="twinkle-star t3">★</div>
          </div>

          {/* Falling Items */}
          {items.map((item) => (
            <div
              key={item.id}
              className={`falling-item ${item.type}`}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                backgroundColor: item.color,
                boxShadow: `0 0 10px ${item.color}`
              }}
            >
              {item.type === 'positive' ? '⭐' : '❌'} {item.text}
            </div>
          ))}

          {/* Basket / Collector */}
          <div
            className="basket-collector"
            style={{
              left: `${basketX}%`
            }}
          >
            <div className="basket-mesh">
              <span className="basket-badge">Semangat Fikri</span>
            </div>
          </div>

          {/* Overlay Screens */}
          {!isPlaying && !gameOver && (
            <div className="game-overlay-start">
              <div className="intro-badge">GAME 2</div>
              <button onClick={startGame} className="btn btn-accent btn-large animated-pulse">
                Mulai Menangkap
              </button>
            </div>
          )}

          {gameOver && (
            <div className="game-overlay-victory">
              <div className="victory-crown">👑</div>
              <h3>Misi Selesai!</h3>
              <p>Kamu berhasil melatih semangat dan ketahanan mental Fikri!</p>
              <button onClick={startGame} className="btn btn-accent">
                <RefreshCw size={16} /> Main Lagi
              </button>
            </div>
          )}
        </div>

        {/* Info Board */}
        <div className="game-controls catching-controls">
          <div className="scoreboard-widget">
            <div className="score-label">SKOR SEMANGAT:</div>
            <div className="score-value animated-scale">{score} / 100</div>
            <div className="score-bar-container">
              <div className="score-bar-fill" style={{ width: `${Math.min(100, score)}%` }}></div>
            </div>
          </div>

          <div className="items-legend">
            <h4>Panduan Tangkapan:</h4>
            <div className="legend-row">
              <span className="legend-tag pos">+10 Poin</span>
              <p>Optimis, Berani, Disiplin, Doa Ibu, Motivasi Guru</p>
            </div>
            <div className="legend-row">
              <span className="legend-tag neg">-5 Poin</span>
              <p>Menyerah, Malas, Putus Asa</p>
            </div>
          </div>

          {/* Touch Controls for Mobile */}
          <div className="mobile-touch-buttons">
            <button 
              onMouseDown={() => setBasketX((x) => Math.max(5, x - 15))}
              onTouchStart={() => setBasketX((x) => Math.max(5, x - 15))}
              className="btn btn-secondary touch-control-btn"
            >
              ◀ Kiri
            </button>
            <button 
              onMouseDown={() => setBasketX((x) => Math.min(95, x + 15))}
              onTouchStart={() => setBasketX((x) => Math.min(95, x + 15))}
              className="btn btn-secondary touch-control-btn"
            >
              Kanan ▶
            </button>
          </div>
        </div>
      </div>

      <div className="card-footer-edu">
        <button onClick={onPrev} className="btn btn-secondary">Kembali</button>
        
        <div className="footer-action-buttons">
          {isPlaying && (
            <button onClick={resetGame} className="btn btn-outline">
              Batal
            </button>
          )}

          {gameOver && (
            <button onClick={onNext} className="btn btn-primary">
              Mainkan Game Terakhir <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
