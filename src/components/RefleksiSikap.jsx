import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

export default function RefleksiSikap({ page, onNext, onPrev, reflectionData, setReflectionData }) {
  // Page 9: Text Reflection
  const [hasFailed, setHasFailed] = useState(reflectionData.hasFailed || '');
  const [failureResponse, setFailureResponse] = useState(reflectionData.failureResponse || '');

  // Page 10: Attitude Sorting
  const attitudes = [
    { id: 'opt1', text: 'Saya akan mencoba lagi', category: 'OPTIMIS' },
    { id: 'opt2', text: 'Saya belajar dari kesalahan', category: 'OPTIMIS' },
    { id: 'opt3', text: 'Saya berdoa dan berusaha', category: 'OPTIMIS' },
    { id: 'pes1', text: 'Saya menyerah', category: 'TIDAK OPTIMIS' },
    { id: 'pes2', text: 'Saya menyalahkan orang lain', category: 'TIDAK OPTIMIS' },
    { id: 'pes3', text: 'Saya tidak mau mencoba', category: 'TIDAK OPTIMIS' },
  ];

  const [sortedItems, setSortedItems] = useState(reflectionData.sortedItems || {
    unassigned: attitudes,
    optimis: [],
    tidakOptimis: []
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAllCorrect, setIsAllCorrect] = useState(false);

  // Handle Halaman 9 Submit
  const handleSavePage9 = () => {
    setReflectionData(prev => ({
      ...prev,
      hasFailed,
      failureResponse
    }));
    onNext();
  };

  // Drag and Drop support
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDrop = (e, targetCategory) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    moveItem(itemId, targetCategory);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  // Click-to-place support (very important for touch/mobile devices)
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleColumnClick = (targetCategory) => {
    if (selectedItem) {
      moveItem(selectedItem.id, targetCategory);
      setSelectedItem(null);
    }
  };

  const moveItem = (itemId, targetCategory) => {
    let itemToMove = null;
    
    // Search item in all columns
    const cleanUnassigned = sortedItems.unassigned.filter(i => {
      if (i.id === itemId) { itemToMove = i; return false; }
      return true;
    });
    const cleanOptimis = sortedItems.optimis.filter(i => {
      if (i.id === itemId) { itemToMove = i; return false; }
      return true;
    });
    const cleanTidakOptimis = sortedItems.tidakOptimis.filter(i => {
      if (i.id === itemId) { itemToMove = i; return false; }
      return true;
    });

    if (!itemToMove) return;

    const newOptimis = targetCategory === 'optimis' ? [...cleanOptimis, itemToMove] : cleanOptimis;
    const newTidakOptimis = targetCategory === 'tidakOptimis' ? [...cleanTidakOptimis, itemToMove] : cleanTidakOptimis;
    const newUnassigned = targetCategory === 'unassigned' ? [...cleanUnassigned, itemToMove] : cleanUnassigned;

    setSortedItems({
      unassigned: newUnassigned,
      optimis: newOptimis,
      tidakOptimis: newTidakOptimis
    });
    setShowFeedback(false);
  };

  // Reset Sorting
  const resetSorting = () => {
    setSortedItems({
      unassigned: attitudes,
      optimis: [],
      tidakOptimis: []
    });
    setShowFeedback(false);
    setIsAllCorrect(false);
  };

  // Validate Sorting
  const validateSorting = () => {
    if (sortedItems.unassigned.length > 0) {
      setShowFeedback(true);
      setIsAllCorrect(false);
      return;
    }

    const optimisCorrect = sortedItems.optimis.every(item => item.category === 'OPTIMIS');
    const tidakOptimisCorrect = sortedItems.tidakOptimis.every(item => item.category === 'TIDAK OPTIMIS');

    setShowFeedback(true);
    if (optimisCorrect && tidakOptimisCorrect) {
      setIsAllCorrect(true);
      setReflectionData(prev => ({
        ...prev,
        sortedItems,
        sortingCompleted: true
      }));
    } else {
      setIsAllCorrect(false);
    }
  };

  if (page === 11) {
    return (
      <div className="reflection-container animated-fade">
        <div className="card-header-edu">
          <span className="badge-title">Halaman 11 - Refleksi Diri</span>
          <h2>Pernahkah Kamu Mengalami Kegagalan?</h2>
          <p className="subtitle">Bagikan pengalamanmu secara jujur. Tidak ada jawaban salah.</p>
        </div>

        <div className="reflection-body">
          <div className="question-block">
            <p className="question-label">Apakah kamu pernah mengalami kegagalan?</p>
            <div className="radio-group-horizontal">
              <label className={`radio-label ${hasFailed === 'Ya' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="hasFailed"
                  value="Ya"
                  checked={hasFailed === 'Ya'}
                  onChange={(e) => setHasFailed(e.target.value)}
                />
                <span className="custom-radio"></span>
                Ya, Pernah
              </label>
              <label className={`radio-label ${hasFailed === 'Tidak' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="hasFailed"
                  value="Tidak"
                  checked={hasFailed === 'Tidak'}
                  onChange={(e) => {
                    setHasFailed(e.target.value);
                    setFailureResponse('');
                  }}
                />
                <span className="custom-radio"></span>
                Tidak, Belum Pernah
              </label>
            </div>
          </div>

          {hasFailed === 'Ya' && (
            <div className="textarea-block animated-fade">
              <p className="question-label">Apa yang kamu lakukan saat menghadapi kegagalan tersebut?</p>
              <textarea
                value={failureResponse}
                onChange={(e) => setFailureResponse(e.target.value)}
                placeholder="Tuliskan ceritamu di sini..."
                rows={5}
                className="reflection-textarea"
              />
            </div>
          )}

          {hasFailed === 'Tidak' && (
            <div className="textarea-block animated-fade">
              <p className="question-label">Jika suatu hari nanti kamu menghadapi kegagalan, apa yang akan kamu lakukan?</p>
              <textarea
                value={failureResponse}
                onChange={(e) => setFailureResponse(e.target.value)}
                placeholder="Tuliskan rencanamu di sini..."
                rows={5}
                className="reflection-textarea"
              />
            </div>
          )}
        </div>

        <div className="card-footer-edu">
          <button onClick={onPrev} className="btn btn-secondary">Kembali</button>
          <button 
            onClick={handleSavePage9} 
            className="btn btn-primary"
            disabled={!hasFailed || !failureResponse.trim()}
          >
            Lanjut <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Page 10: Sorting Game
  return (
    <div className="reflection-container animated-fade">
      <div className="card-header-edu">
        <span className="badge-title">Halaman 12 - Mengelompokkan Sikap</span>
        <h2>Tumbuhkan Sikap Optimisme</h2>
        <p className="subtitle">
          Seret sikap di bawah ini ke kolom yang tepat, atau <strong>klik kartu lalu klik kolom tujuan</strong>.
        </p>
      </div>

      <div className="sorting-board">
        {/* Source Cards Pool */}
        <div className="source-pool-container">
          <h3>Sikap & Pikiran:</h3>
          <div className="source-pool">
            {sortedItems.unassigned.length === 0 ? (
              <p className="empty-message">Semua sikap sudah dimasukkan. Silakan periksa jawabanmu!</p>
            ) : (
              sortedItems.unassigned.map(item => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onClick={() => handleItemClick(item)}
                  className={`attitude-card ${selectedItem?.id === item.id ? 'selected' : ''}`}
                >
                  {item.text}
                </div>
              ))
            )}
          </div>
          {selectedItem && (
            <p className="click-instruction animated-pulse">
              Pilih kolom tujuan: <strong>OPTIMIS</strong> atau <strong>TIDAK OPTIMIS</strong>.
            </p>
          )}
        </div>

        {/* Target Columns */}
        <div className="target-columns">
          {/* Column Optimis */}
          <div
            onDragOver={allowDrop}
            onDrop={(e) => handleDrop(e, 'optimis')}
            onClick={() => handleColumnClick('optimis')}
            className="drop-column optimis-column"
          >
            <div className="column-header">
              <span className="indicator-dot green"></span>
              <h4>OPTIMIS</h4>
            </div>
            <div className="column-body">
              {sortedItems.optimis.length === 0 ? (
                <div className="drop-placeholder">Letakkan di sini</div>
              ) : (
                sortedItems.optimis.map(item => (
                  <div
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveItem(item.id, 'unassigned');
                    }}
                    className="attitude-card placed-card"
                    title="Klik untuk membatalkan"
                  >
                    {item.text}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column Tidak Optimis */}
          <div
            onDragOver={allowDrop}
            onDrop={(e) => handleDrop(e, 'tidakOptimis')}
            onClick={() => handleColumnClick('tidakOptimis')}
            className="drop-column tidak-optimis-column"
          >
            <div className="column-header">
              <span className="indicator-dot red"></span>
              <h4>TIDAK OPTIMIS</h4>
            </div>
            <div className="column-body">
              {sortedItems.tidakOptimis.length === 0 ? (
                <div className="drop-placeholder">Letakkan di sini</div>
              ) : (
                sortedItems.tidakOptimis.map(item => (
                  <div
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveItem(item.id, 'unassigned');
                    }}
                    className="attitude-card placed-card"
                    title="Klik untuk membatalkan"
                  >
                    {item.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Messages */}
      {showFeedback && (
        <div className={`feedback-alert animated-scale ${isAllCorrect ? 'success' : 'error'}`}>
          {isAllCorrect ? (
            <div className="feedback-content">
              <Sparkles className="icon-success" size={24} />
              <div>
                <strong>Luar biasa!</strong> Kamu berhasil mengelompokkan semua sikap optimis dan tidak optimis dengan tepat.
              </div>
            </div>
          ) : (
            <div className="feedback-content">
              <AlertTriangle className="icon-error" size={24} />
              <div>
                {sortedItems.unassigned.length > 0 ? (
                  <><strong>Ada yang tertinggal!</strong> Silakan masukkan semua kartu ke dalam kolom terlebih dahulu.</>
                ) : (
                  <><strong>Ada pengelompokan yang kurang tepat!</strong> Periksa kembali sikap optimis vs tidak optimis Anda.</>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card-footer-edu">
        <button onClick={onPrev} className="btn btn-secondary">Kembali</button>
        
        <div className="footer-action-buttons">
          <button onClick={resetSorting} className="btn btn-icon btn-outline" title="Reset Urutan">
            <RefreshCw size={18} /> Reset
          </button>
          
          {!isAllCorrect ? (
            <button onClick={validateSorting} className="btn btn-accent">
              Periksa Jawaban
            </button>
          ) : (
            <button onClick={onNext} className="btn btn-primary">
              Lanjut Ke Kuis <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
