import React, { useState, useEffect } from 'react';
import { ArrowRight, RefreshCw, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export default function PuzzleKesuksesan({ onNext, onPrev }) {
  const correctOrder = ['step1', 'step2', 'step3', 'step4', 'step5'];

  const milestonesData = [
    { id: 'step1', title: '1. Gagal Seleksi', color: '#ef4444', image: '/images/sad_fikri.webp' },
    { id: 'step2', title: '2. Dinasihati Ibu', color: '#ec4899', image: '/images/ibu_praying.webp' },
    { id: 'step3', title: '3. Bertemu Guru', color: '#3b82f6', image: '/images/guru_hasan.webp' },
    { id: 'step4', title: '4. Berlatih Keras', color: '#f59e0b', image: '/images/solusi_collage.webp' },
    { id: 'step5', title: '5. Lulus Tentara', color: '#10b981', image: '/images/fikri_lulus.webp' }
  ];

  // Helper to shuffle the array
  const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;
    const newArray = [...array];
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
  };

  const [items, setItems] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Initialize with shuffled items
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    let shuffled = shuffle(milestonesData);
    // Ensure it's not accidentally correct initially
    while (shuffled.map(item => item.id).join(',') === correctOrder.join(',')) {
      shuffled = shuffle(milestonesData);
    }
    setItems(shuffled);
    setIsCorrect(false);
    setShowFeedback(false);
    setSelectedIdx(null);
  };

  // Swap item positions
  const swapItems = (i, j) => {
    if (i < 0 || i >= items.length || j < 0 || j >= items.length) return;
    const newItems = [...items];
    const temp = newItems[i];
    newItems[i] = newItems[j];
    newItems[j] = temp;
    setItems(newItems);
    setShowFeedback(false);
    setSelectedIdx(null);
  };

  // Tap to swap mechanism
  const handleItemSelect = (index) => {
    if (selectedIdx === null) {
      setSelectedIdx(index);
    } else {
      swapItems(selectedIdx, index);
    }
  };

  // Verify order
  const checkOrder = () => {
    const currentOrderIds = items.map(item => item.id);
    const correct = currentOrderIds.join(',') === correctOrder.join(',');
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  return (
    <div className="game-card-container animated-fade">
      <div className="card-header-edu">
        <span className="badge-title">Latihan 3 - Puzzle Kesuksesan Fikri</span>
        <h2>Mengurutkan Linimasa Perjuangan</h2>
        <p className="subtitle">
          Susun gambar peristiwa di bawah ini sesuai urutan cerita yang benar (dari kiri ke kanan). 
          <strong> Klik tombol panah ◀ atau ▶</strong> untuk menggeser, atau <strong>klik kartu secara bergantian untuk menukar posisi</strong>.
        </p>
      </div>

      <div className="puzzle-board">
        {/* Shuffled list horizontal flow */}
        <div className="milestones-horizontal-list">
          {items.map((item, index) => {
            const isSelected = selectedIdx === index;
            return (
              <div key={item.id} className="puzzle-item-container">
                <div className="slot-header-num">Langkah {index + 1}</div>
                <div
                  onClick={() => handleItemSelect(index)}
                  className={`puzzle-item-card-grid ${isSelected ? 'selected' : ''}`}
                  style={{ borderTop: `5px solid ${item.color}` }}
                >
                  {/* Visual Image Thumbnail */}
                  <div className="puzzle-image-box">
                    <img src={item.image} alt={item.title} />
                  </div>
                  
                  {/* Label title under the image */}
                  <div className="puzzle-title-label">
                    {item.title}
                  </div>
                  
                  {/* Reordering Controls */}
                  <div className="card-action-controls-horizontal">
                    <button
                      onClick={(e) => { e.stopPropagation(); swapItems(index, index - 1); }}
                      disabled={index === 0}
                      className="arrow-btn-horizontal"
                      title="Geser Kiri"
                    >
                      ◀
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); swapItems(index, index + 1); }}
                      disabled={index === items.length - 1}
                      className="arrow-btn-horizontal"
                      title="Geser Kanan"
                    >
                      ▶
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>


      </div>

      {showFeedback && (
        <div className={`feedback-alert animated-scale ${isCorrect ? 'success' : 'error'}`}>
          {isCorrect ? (
            <div className="feedback-content">
              <Sparkles className="icon-success" size={24} />
              <div>
                <strong>Luar Biasa!</strong> Urutan perjuangan Fikri sudah benar. Proses dan usaha tidak pernah mengkhianati hasil.
              </div>
            </div>
          ) : (
            <div className="feedback-content">
              <AlertTriangle className="icon-error" size={24} />
              <div>
                <strong>Urutan Belum Tepat!</strong> Silakan teliti kembali alur ceritanya. Hubungkan nasihat ibu dan motivasi guru sebelum Fikri berlatih giat.
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card-footer-edu">
        <button onClick={onPrev} className="btn btn-secondary">Kembali</button>
        
        <div className="footer-action-buttons">
          <button onClick={initializeGame} className="btn btn-outline" title="Kocok Ulang">
            <RefreshCw size={16} /> Kocok Ulang
          </button>
          
          {!isCorrect ? (
            <button onClick={checkOrder} className="btn btn-accent">
              Periksa Urutan
            </button>
          ) : (
            <button onClick={onNext} className="btn btn-primary">
              Lanjut ke Halaman Akhir <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
