import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, XCircle, Award, RefreshCw, AlertCircle } from 'lucide-react';

export default function KuisInteraktif({ page, onNext, onPrev, quizAnswers, setQuizAnswers, onJumpToPage }) {
  const questions = [
    {
      id: 1,
      pageIndex: 10,
      question: "Fikri gagal masuk tentara sebanyak ...",
      options: ["1 kali", "2 kali", "3 kali"],
      correct: "2 kali",
      type: "single"
    },
    {
      id: 2,
      pageIndex: 11,
      question: "Siapa yang selalu mendoakan Fikri?",
      options: ["Teman", "Tetangga", "Ibu"],
      correct: "Ibu",
      type: "single"
    },
    {
      id: 3,
      pageIndex: 12,
      question: "Apa pesan Guru Hasan kepada Fikri?",
      options: ["Menyerah saja", "Bangkit setelah gagal", "Berhenti bermimpi"],
      correct: "Bangkit setelah gagal",
      type: "single"
    },
    {
      id: 4,
      pageIndex: 13,
      question: "Sikap yang menunjukkan optimisme adalah ...",
      options: ["Menangis terus", "Menyerah", "Mencoba kembali"],
      correct: "Mencoba kembali",
      type: "single"
    },
    {
      id: 5,
      pageIndex: 14,
      question: "Keberhasilan Fikri diperoleh karena ... (Pilih semua yang benar)",
      options: ["Disiplin", "Berlatih", "Berdoa", "Mendengarkan nasihat"],
      correct: ["Disiplin", "Berlatih", "Berdoa", "Mendengarkan nasihat"],
      type: "multi"
    }
  ];

  const currentIdx = page - 13; // Halaman 13 is index 0
  const q = questions[currentIdx];

  const [selectedAnswer, setSelectedAnswer] = useState(quizAnswers[q.id] || (q.type === 'multi' ? [] : ''));
  const [isAnswerChecked, setIsAnswerChecked] = useState(!!quizAnswers[q.id]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  // Re-sync with quizAnswers if page changes
  React.useEffect(() => {
    const saved = quizAnswers[q.id];
    if (saved !== undefined) {
      setSelectedAnswer(saved);
      setIsAnswerChecked(true);
      
      // Calculate correctness for saved
      if (q.type === 'single') {
        setIsAnswerCorrect(saved === q.correct);
      } else {
        // Multi select
        const isMatch = saved.length === q.correct.length && saved.every(val => q.correct.includes(val));
        setIsAnswerCorrect(isMatch);
      }
    } else {
      setSelectedAnswer(q.type === 'multi' ? [] : '');
      setIsAnswerChecked(false);
      setIsAnswerCorrect(false);
    }
  }, [page]);

  const handleOptionChange = (option) => {
    if (isAnswerChecked) return; // Locked once checked
    setSelectedAnswer(option);
  };

  const handleCheckboxChange = (option) => {
    if (isAnswerChecked) return; // Locked
    setSelectedAnswer(prev => {
      if (prev.includes(option)) {
        return prev.filter(item => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const checkAnswer = () => {
    if (q.type === 'single') {
      if (!selectedAnswer) return;
      const correct = selectedAnswer === q.correct;
      setIsAnswerCorrect(correct);
      setIsAnswerChecked(true);
      setQuizAnswers(prev => ({ ...prev, [q.id]: selectedAnswer }));
    } else {
      // Multi-choice validation (must match all correct answers)
      if (selectedAnswer.length === 0) return;
      const isMatch = selectedAnswer.length === q.correct.length && selectedAnswer.every(val => q.correct.includes(val));
      setIsAnswerCorrect(isMatch);
      setIsAnswerChecked(true);
      setQuizAnswers(prev => ({ ...prev, [q.id]: selectedAnswer }));
    }
  };

  const handleNext = () => {
    onNext();
  };

  // Determine if next is disabled
  const isCheckDisabled = q.type === 'single' ? !selectedAnswer : selectedAnswer.length === 0;

  return (
    <div className="quiz-container animated-fade">
      <div className="card-header-edu">
        <span className="badge-title">Halaman {page} - Kuis Pilihan Ganda</span>
        <div className="quiz-progress-bullets">
          {questions.map((item, idx) => (
            <div 
              key={item.id} 
              className={`bullet-indicator ${idx === currentIdx ? 'active' : ''} ${quizAnswers[item.id] !== undefined ? 'completed' : ''}`}
            ></div>
          ))}
        </div>
        <h2>{q.question}</h2>
      </div>

      <div className="quiz-body">
        {q.type === 'single' ? (
          <div className="options-stack">
            {q.options.map((option, idx) => {
              let optionClass = "";
              if (isAnswerChecked) {
                if (option === q.correct) {
                  optionClass = "correct-option";
                } else if (selectedAnswer === option) {
                  optionClass = "incorrect-option";
                } else {
                  optionClass = "disabled-option";
                }
              } else if (selectedAnswer === option) {
                optionClass = "selected-option";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionChange(option)}
                  disabled={isAnswerChecked}
                  className={`quiz-option-btn ${optionClass}`}
                >
                  <span className="option-indicator">{String.fromCharCode(65 + idx)}</span>
                  <span className="option-text">{option}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="options-stack">
            {q.options.map((option, idx) => {
              const isChecked = selectedAnswer.includes(option);
              let optionClass = "";
              if (isAnswerChecked) {
                if (q.correct.includes(option)) {
                  optionClass = "correct-option";
                } else if (isChecked) {
                  optionClass = "incorrect-option";
                } else {
                  optionClass = "disabled-option";
                }
              } else if (isChecked) {
                optionClass = "selected-option";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleCheckboxChange(option)}
                  disabled={isAnswerChecked}
                  className={`quiz-option-btn checkbox-style ${optionClass}`}
                >
                  <div className={`checkbox-indicator ${isChecked ? 'checked' : ''}`}>
                    {isChecked && <div className="checkmark">✓</div>}
                  </div>
                  <span className="option-text">{option}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {isAnswerChecked && (
        <div className={`feedback-alert animated-scale ${isAnswerCorrect ? 'success' : 'error'}`}>
          {isAnswerCorrect ? (
            <div className="feedback-content">
              <CheckCircle2 className="icon-success" size={24} />
              <div>
                <strong>Jawaban Benar!</strong> {q.type === 'single' 
                  ? 'Fikri memang ' + q.correct + '.'
                  : 'Hebat! Semua jawaban tersebut adalah kunci sukses Fikri.'
                }
              </div>
            </div>
          ) : (
            <div className="feedback-content">
              <XCircle className="icon-error" size={24} />
              <div>
                <strong>Kurang Tepat.</strong> Jawaban yang benar adalah:{' '}
                {q.type === 'single' ? (
                  <strong>{q.correct}</strong>
                ) : (
                  <strong>{q.correct.join(', ')}</strong>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card-footer-edu">
        <button onClick={onPrev} className="btn btn-secondary">Kembali</button>
        
        {!isAnswerChecked ? (
          <button 
            onClick={checkAnswer} 
            disabled={isCheckDisabled}
            className="btn btn-accent"
          >
            Kunci Jawaban
          </button>
        ) : (
          <button onClick={handleNext} className="btn btn-primary">
            {currentIdx === questions.length - 1 ? 'Lihat Hasil Kuis' : 'Lanjut'} <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
