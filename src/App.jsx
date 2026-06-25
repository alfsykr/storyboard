import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, ArrowLeft, Play, Sparkles, BookOpen, 
  UserCheck, Heart, GraduationCap, Award, HelpCircle, 
  Gamepad2, Download, CheckSquare, CheckCircle2,
  Volume2, VolumeX, Eye, Mail, Briefcase, User, Home
} from 'lucide-react';
import './App.css';

// Components
import RefleksiSikap from './components/RefleksiSikap';
import KuisInteraktif from './components/KuisInteraktif';
import TanggaOptimisme from './components/TanggaOptimisme';
import KumpulkanSemangat from './components/KumpulkanSemangat';
import PuzzleKesuksesan from './components/PuzzleKesuksesan';

// Inline Confetti Canvas Particle Component
const ConfettiEffect = () => {
  const canvasRef = React.useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight || 450;

    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444'];
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height - 20,
      r: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.05 + 0.02,
      tiltAngle: 0,
      speed: Math.random() * 2 + 1.5
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += p.speed;
        p.x += Math.sin(p.tiltAngle) * 0.5;
        p.tilt = Math.sin(p.tiltAngle) * 5;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      const active = particles.some(p => p.y < canvas.height);
      if (active) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} className="confetti-canvas-overlay" />;
};

export default function App() {
  const [page, setPage] = useState(1);
  const totalPages = 22;

  // Audio simulation state (Narration texts)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Halaman 4 Interactive: Thought Popping
  const [poppedThoughts, setPoppedThoughts] = useState([]);
  const negativeThoughts = [
    { id: 't1', text: '❌ Aku tidak bisa.' },
    { id: 't2', text: '❌ Aku selalu gagal.' },
    { id: 't3', text: '❌ Tidak ada harapan.' }
  ];

  // Halaman 7 Interactive: Solutions Checklist
  const [checkedSolutions, setCheckedSolutions] = useState({
    disciplin: false,
    training: false,
    studying: false,
    praying: false,
    listening: false
  });

  // Halaman 9 & 10 Reflection Data
  const [reflectionData, setReflectionData] = useState({
    hasFailed: '',
    failureResponse: '',
    sortedItems: null,
    sortingCompleted: false
  });

  // Halaman 11-15 Quiz Data
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSummary, setQuizSummary] = useState({ score: 0, checked: false });

  // Halaman 19: Final reflection inputs
  const [citaCita, setCitaCita] = useState('');
  const [langkah1, setLangkah1] = useState('');
  const [langkah2, setLangkah2] = useState('');
  const [langkah3, setLangkah3] = useState('');

  // plan saved state
  const [isPlanSaved, setIsPlanSaved] = useState(false);

  // Audio player reference
  const audioRef = React.useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/Guy Manor - Longing.mp3');
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.play().catch(err => {
          console.log("Audio playback blocked by browser security policy. Click play button first:", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlayingAudio]);

  // Auto-pause audio on slide change
  useEffect(() => {
    setIsPlayingAudio(false);
  }, [page]);

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  // Jump to specific slide of a section
  const handleTabClick = (section) => {
    switch (section) {
      case 'kisah':
        setPage(1);
        break;
      case 'refleksi':
        setPage(11);
        break;
      case 'kuis':
        setPage(13);
        break;
      case 'latihan':
        setPage(18); // Game 1
        break;
      case 'pengembang':
        setPage(22);
        break;
      default:
        break;
    }
  };

  // Check which tab should be active
  const getActiveTab = () => {
    if (page >= 1 && page <= 10) return 'kisah';
    if (page === 11 || page === 12) return 'refleksi';
    if (page >= 13 && page <= 17) return 'kuis';
    if (page >= 18 && page <= 20) return 'latihan';
    if (page === 21) return 'selesai';
    return 'pengembang';
  };

  // Progress Bar Percentage
  const getProgressPercentage = () => {
    return ((page - 1) / (totalPages - 1)) * 100;
  };

  // Pop negative thought
  const handlePopThought = (id) => {
    if (!poppedThoughts.includes(id)) {
      setPoppedThoughts(prev => [...prev, id]);
    }
  };

  // Reset thought popping
  const handleResetThoughts = () => {
    setPoppedThoughts([]);
  };

  // Solution checklist toggles
  const handleSolutionToggle = (key) => {
    setCheckedSolutions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isAllSolutionsChecked = Object.values(checkedSolutions).every(val => val === true);

  // Calculate Quiz Score
  const calculateQuizScore = () => {
    const questions = [
      { id: 1, correct: "2 kali", type: "single" },
      { id: 2, correct: "Ibu", type: "single" },
      { id: 3, correct: "Bangkit setelah gagal", type: "single" },
      { id: 4, correct: "Mencoba kembali", type: "single" },
      { id: 5, correct: ["Disiplin", "Berlatih", "Berdoa", "Mendengarkan nasihat"], type: "multi" }
    ];

    let correctCount = 0;
    questions.forEach(q => {
      // Robust key lookup supporting string serialized keys
      const answer = quizAnswers[q.id] !== undefined ? quizAnswers[q.id] : quizAnswers[String(q.id)];
      if (answer !== undefined && answer !== null) {
        if (q.type === 'single') {
          if (String(answer).trim().toLowerCase() === String(q.correct).trim().toLowerCase()) {
            correctCount++;
          }
        } else {
          if (Array.isArray(answer)) {
            const isMatch = answer.length === q.correct.length && answer.every(val => q.correct.includes(val));
            if (isMatch) correctCount++;
          }
        }
      }
    });

    return correctCount * 20; // 5 questions, 20 points each
  };



  return (
    <div className="app-container">
      
      {/* Top Navbar */}
      <header className="navbar-edu">
        <div className="nav-brand">
          <h1>Optimis Menuju Impian</h1>
          <div className="nav-sub">Media Pembelajaran Interaktif Kesetaraan Paket B - Fase D</div>
        </div>

        <nav className="nav-tabs">
          <button 
            onClick={() => handleTabClick('kisah')} 
            className={`nav-tab-btn ${getActiveTab() === 'kisah' ? 'active' : ''}`}
          >
            Kisah Fikri
          </button>
          <button 
            onClick={() => handleTabClick('refleksi')} 
            className={`nav-tab-btn ${getActiveTab() === 'refleksi' ? 'active' : ''}`}
          >
            Refleksi Diri
          </button>
          <button 
            onClick={() => handleTabClick('kuis')} 
            className={`nav-tab-btn ${getActiveTab() === 'kuis' ? 'active' : ''}`}
          >
            Kuis Evaluasi
          </button>
          <button 
            onClick={() => handleTabClick('latihan')} 
            className={`nav-tab-btn ${getActiveTab() === 'latihan' ? 'active' : ''}`}
          >
            Latihan Game
          </button>
          <button 
            onClick={() => handleTabClick('pengembang')} 
            className={`nav-tab-btn ${getActiveTab() === 'pengembang' ? 'active' : ''}`}
          >
            Pengembang
          </button>
        </nav>

        <div className="nav-actions">
          <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>
            Slide {page} / {totalPages}
          </span>
        </div>
      </header>

      {/* Progress Bar Indicator */}
      <div className="progress-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>

      {/* Interactive Page Container */}
      <main className="story-workspace">
        
        {/* HALAMAN 1: COVER */}
        {page === 1 && (
          <div className="cover-layout animated-fade">
            <div className="cover-bg-art"></div>
            <div className="cover-content">
              <div className="badge-title">SPNF SKB KOTA BUKITTINGGI</div>
              <h1>OPTIMIS MENUJU IMPIAN</h1>
              <p>"Gagal bukan akhir dari perjalanan."</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
                <button onClick={handleNext} className="btn btn-accent btn-large animated-pulse">
                  <Play size={18} fill="white" /> Mulai Kisah
                </button>
              </div>

              <div className="metadata-footer">
                <p><strong>Mata Pelajaran: Pemberdayaan (Fase D)</strong></p>
                <p>Unit: Kepercayaan Diri | Sub Unit: Rasa Optimis</p>
                <p>Program: Pendidikan Kesetaraan Paket B</p>
                <p style={{ marginTop: '5px' }}>Oleh: WAHYUNI, S.Pd. M.Pd, SPNF SKB KOTA BUKITTINGGI</p>
              </div>
            </div>
          </div>
        )}

        {/* HALAMAN 2: MENYAPA WARGA BELAJAR */}
        {page === 2 && (
          <div className="storyboard-split animated-fade">
            <div className="story-visual-side">
              <img src="/images/cover_running.png" alt="Tutor Menyapa Warga Belajar" />
            </div>
            <div className="story-narration-side">
              <div className="narration-header">
                <span className="badge-title">Halaman 2 - Menyapa Warga Belajar</span>
                <h2>Assalamu'alaikum Warahmatullahi Wabarakatuh</h2>
              </div>
              
              <div className="narration-content">
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-light)', marginBottom: '15px' }}>
                  Halo Warga Belajar Paket B 👋
                </p>
                <p style={{ fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '20px' }}>
                  Selamat datang pada pembelajaran interaktif <strong>"Rasa Optimis"</strong>.
                </p>
                <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '25px', color: 'var(--color-text-dark)' }}>
                  Hari ini kita akan belajar bagaimana membangun kepercayaan diri melalui sikap optimis dalam menghadapi kegagalan dan tantangan hidup.
                </p>

                <div className="dialog-container" style={{ marginTop: '15px' }}>
                  <div className="dialog-bubble guru" style={{ borderLeftColor: 'var(--color-accent)' }}>
                    <div className="dialog-speaker" style={{ color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span>👩‍🏫</span> Tutor Virtual
                    </div>
                    <p style={{ fontStyle: 'italic', fontWeight: 600, fontSize: '1.05rem', marginTop: '5px' }}>
                      "Setiap kegagalan bukanlah akhir perjalanan, tetapi awal dari kesempatan baru."
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-footer-edu">
                <button onClick={handlePrev} className="btn btn-secondary">Kembali</button>
                <button onClick={handleNext} className="btn btn-accent animated-pulse">
                  Lanjut <Play size={14} fill="white" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HALAMAN 3: PANDUAN PENGGUNAAN MEDIA */}
        {page === 3 && (
          <div className="storyboard-split animated-fade">
            <div className="story-visual-side" style={{ padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#0f2b48', color: 'white', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', borderBottom: '2px solid var(--color-accent)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontFamily: 'var(--font-title)' }}>
                <span>🎮</span> Ikon Pembelajaran
              </h3>
              
              <div className="icons-guide-grid" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                <div className="icon-guide-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 15px', backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                  <div style={{ fontSize: '1.3rem', width: '36px', height: '36px', backgroundColor: 'var(--color-primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏠</div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Home</span>
                </div>
                
                <div className="icon-guide-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 15px', backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                  <div style={{ fontSize: '1.3rem', width: '36px', height: '36px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔊</div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Audio</span>
                </div>

                <div className="icon-guide-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 15px', backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                  <div style={{ fontSize: '1.3rem', width: '36px', height: '36px', backgroundColor: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➡️</div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Next</span>
                </div>

                <div className="icon-guide-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 15px', backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                  <div style={{ fontSize: '1.3rem', width: '36px', height: '36px', backgroundColor: '#64748b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⬅️</div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Back</span>
                </div>

                <div className="icon-guide-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 15px', backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                  <div style={{ fontSize: '1.3rem', width: '36px', height: '36px', backgroundColor: 'var(--color-success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎮</div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Game</span>
                </div>
              </div>
            </div>
            
            <div className="story-narration-side">
              <div className="narration-header">
                <span className="badge-title">Halaman 3 - Panduan Penggunaan Media</span>
                <h2>Cara Menggunakan Media</h2>
              </div>
              
              <div className="narration-content">
                <div className="instruction-steps-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                  <div className="instruction-step-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 18px', backgroundColor: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #3b82f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ color: '#3b82f6', fontWeight: 800, fontSize: '1.2rem' }}>1.</div>
                    <div style={{ fontSize: '0.98rem', color: 'var(--color-text-dark)', lineHeight: '1.4' }}>
                      Klik tombol <strong>Next</strong> untuk berpindah halaman.
                    </div>
                  </div>

                  <div className="instruction-step-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 18px', backgroundColor: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid var(--color-accent)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '1.2rem' }}>2.</div>
                    <div style={{ fontSize: '0.98rem', color: 'var(--color-text-dark)', lineHeight: '1.4' }}>
                      Klik ikon <strong>audio</strong> untuk mendengarkan narasi.
                    </div>
                  </div>

                  <div className="instruction-step-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 18px', backgroundColor: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #8b5cf6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ color: '#8b5cf6', fontWeight: 800, fontSize: '1.2rem' }}>3.</div>
                    <div style={{ fontSize: '0.98rem', color: 'var(--color-text-dark)', lineHeight: '1.4' }}>
                      Klik <strong>objek yang aktif</strong>.
                    </div>
                  </div>

                  <div className="instruction-step-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 18px', backgroundColor: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid var(--color-success)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ color: 'var(--color-success)', fontWeight: 800, fontSize: '1.2rem' }}>4.</div>
                    <div style={{ fontSize: '0.98rem', color: 'var(--color-text-dark)', lineHeight: '1.4' }}>
                      Kerjakan <strong>kuis dan permainan</strong>.
                    </div>
                  </div>

                  <div className="instruction-step-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 18px', backgroundColor: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid var(--color-primary-light)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ color: 'var(--color-primary-light)', fontWeight: 800, fontSize: '1.2rem' }}>5.</div>
                    <div style={{ fontSize: '0.98rem', color: 'var(--color-text-dark)', lineHeight: '1.4' }}>
                      Isi <strong>refleksi</strong> pada akhir pembelajaran.
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer-edu" style={{ marginTop: '20px' }}>
                <button onClick={handlePrev} className="btn btn-secondary">Kembali</button>
                <button onClick={handleNext} className="btn btn-accent animated-pulse">
                  Mulai Belajar <Play size={14} fill="white" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HALAMAN 4: TUJUAN PEMBELAJARAN */}
        {page === 4 && (
          <div className="storyboard-split animated-fade">
            <div className="story-visual-side">
              {/* Image from public/images/cover_running.png */}
              <img src="/images/cover_running.png" alt="Fikri berlari pagi di bawah matahari terbit" />
            </div>
            <div className="story-narration-side">
              <div className="narration-header">
                <span className="badge-title">Halaman 4 - Tujuan Pembelajaran</span>
                <h2>Tujuan Pembelajaran Kita Hari Ini</h2>
              </div>
              
              <div className="narration-content">
                <p style={{ marginBottom: '15px', fontWeight: 600 }}>
                  Setelah menyelesaikan modul pembelajaran interaktif ini, kamu diharapkan mampu:
                </p>
                <div className="goals-list">
                  <div className="goal-item">
                    <CheckCircle2 className="goal-check" size={20} />
                    <span className="goal-text">Mengenali pentingnya rasa percaya diri dalam kehidupan sehari-hari.</span>
                  </div>
                  <div className="goal-item">
                    <CheckCircle2 className="goal-check" size={20} />
                    <span className="goal-text">Menunjukkan sikap optimis dan berani saat menghadapi kegagalan.</span>
                  </div>
                  <div className="goal-item">
                    <CheckCircle2 className="goal-check" size={20} />
                    <span className="goal-text">Menjelaskan pentingnya peran doa orang tua serta bimbingan guru/pendidik dalam mencapai keberhasilan.</span>
                  </div>
                  <div className="goal-item">
                    <CheckCircle2 className="goal-check" size={20} />
                    <span className="goal-text">Menyusun rencana dan langkah konkret untuk mencapai cita-cita pribadi.</span>
                  </div>
                </div>
              </div>

              <div className="card-footer-edu">
                <button onClick={handlePrev} className="btn btn-secondary">Kembali</button>
                <button onClick={handleNext} className="btn btn-primary">Mulai Cerita <ArrowRight size={18} /></button>
              </div>
            </div>
          </div>
        )}

        {/* HALAMAN 5: CERITA 1 (Gagal Seleksi) */}
        {page === 5 && (
          <div className="storyboard-split animated-fade">
            <div className="story-visual-side">
              <img src="/images/sad_fikri.png" alt="Fikri melihat pengumuman kelulusan" />
            </div>
            <div className="story-narration-side">
              <div className="narration-header">
                <span className="badge-title">Halaman 5 - Kegagalan Kedua</span>
                <h2>"Aku gagal lagi, Bu..."</h2>
              </div>

              <div className="narration-content">
                <p className="narration-quote">
                  "Hasil seleksi penerimaan Bintara TNI Angkatan Darat telah diumumkan. Nama Fikri tidak tercantum di daftar kelulusan."
                </p>
                <p>
                  Hari itu terasa runtuh bagi Fikri. Ini adalah kegagalan kedua kalinya dalam seleksi masuk tentara. Mimpi yang ia pupuk sejak kecil rasanya semakin menjauh dan sulit digapai.
                </p>
                
                <div className="audio-description-bar">
                  <button 
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="btn btn-secondary btn-icon"
                    style={{ padding: '6px 12px' }}
                  >
                    {isPlayingAudio ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <span>
                    {isPlayingAudio ? '🔊 Sedang memutar: Musik Latar Melankolis & Suara Desah Sedih Fikri...' : '🔇 Klik tombol untuk menyalakan audio narasi cerita.'}
                  </span>
                </div>
              </div>

              <div className="card-footer-edu">
                <button onClick={handlePrev} className="btn btn-secondary">Kembali</button>
                <button onClick={handleNext} className="btn btn-primary">Lanjut <ArrowRight size={18} /></button>
              </div>
            </div>
          </div>
        )}

        {/* HALAMAN 6: CERITA 2 (Konflik Batin) */}
        {page === 6 && (
          <div className="storyboard-split animated-fade">
            <div className="story-visual-side">
              <img src="/images/sad_fikri.png" alt="Fikri merenung di teras rumah malam hari" />
            </div>
            <div className="story-narration-side">
              <div className="narration-header">
                <span className="badge-title">Halaman 6 - Konflik Batin</span>
                <h2>Pikiran Negatif Fikri</h2>
              </div>

              <div className="narration-content">
                <p>
                  Fikri duduk sendirian di teras rumah. Angin malam berembus dingin, mewakili kehampaan hatinya. Ia merasa masa depannya hancur dan ia mulai meragukan kemampuannya sendiri:
                </p>
                <p className="narration-quote">"Apakah aku memang ditakdirkan tidak mampu?"</p>
                
                <div className="thought-interact-box">
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fca5a5', marginBottom: '10px' }}>
                    👉 Ketuk pikiran negatif di bawah untuk menyingkirkannya dari kepala Fikri:
                  </p>
                  
                  <div className="floating-thoughts-container">
                    {negativeThoughts.map(t => {
                      const isPopped = poppedThoughts.includes(t.id);
                      return (
                        <div
                          key={t.id}
                          onClick={() => handlePopThought(t.id)}
                          className={`thought-bubble ${isPopped ? 'popped' : ''}`}
                        >
                          {t.text}
                        </div>
                      );
                    })}
                  </div>

                  {poppedThoughts.length === negativeThoughts.length ? (
                    <div className="positive-mind-glow animated-scale">
                      <Sparkles size={20} className="icon-success" />
                      <strong>Fikiran Negatif Disingkirkan!</strong>
                      <p style={{ fontSize: '0.8rem', color: '#a7f3d0', marginTop: '5px' }}>
                        Fikri mulai sadar pikiran buruk tidak akan mengubah apa pun. Pikiran optimis harus ditumbuhkan!
                      </p>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Tersisa {negativeThoughts.length - poppedThoughts.length} pikiran negatif untuk disingkirkan.
                    </p>
                  )}
                </div>
              </div>

              <div className="card-footer-edu">
                <button onClick={handlePrev} className="btn btn-secondary">Kembali</button>
                <div className="footer-action-buttons">
                  {poppedThoughts.length > 0 && (
                    <button onClick={handleResetThoughts} className="btn btn-outline">Ulangi</button>
                  )}
                  <button 
                    onClick={handleNext} 
                    className="btn btn-primary"
                    disabled={poppedThoughts.length < negativeThoughts.length}
                  >
                    Lanjut <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HALAMAN 7: KONFLIK (Doa Ibu) */}
        {page === 7 && (
          <div className="storyboard-split animated-fade">
            <div className="story-visual-side">
              <img src="/images/ibu_praying.png" alt="Ibu Fikri berdoa dengan cahaya hangat di malam hari" />
            </div>
            <div className="story-narration-side">
              <div className="narration-header">
                <span className="badge-title">Halaman 7 - Doa & Harapan Ibu</span>
                <h2>Ketulusan Hati Ibu</h2>
              </div>

              <div className="narration-content">
                <p>
                  Malam kian larut. Sayup-sayup Fikri mendengar suara ibunya yang sedang berdoa dengan khusyuk di kamar. 
                  Cahaya lampu yang hangat menerangi keikhlasan di wajah sang ibu.
                </p>
                <p>
                  Setelah selesai berdoa, Ibu menghampiri Fikri yang terlihat putus asa. Dengan sentuhan lembut di bahunya, Ibu berkata:
                </p>
                <p className="narration-quote">
                  "Nak, kegagalan ini bukanlah tanda bahwa kamu harus berhenti berjuang. Kadang, Allah sedang mempersiapkanmu untuk menjadi pribadi yang lebih kuat sebelum mimpi indahmu terwujud."
                </p>
              </div>

              <div className="card-footer-edu">
                <button onClick={handlePrev} className="btn btn-secondary">Kembali</button>
                <button onClick={handleNext} className="btn btn-primary">Lanjut <ArrowRight size={18} /></button>
              </div>
            </div>
          </div>
        )}

        {/* HALAMAN 8: PENDIDIK MEMBERI MOTIVASI */}
        {page === 8 && (
          <div className="storyboard-split animated-fade">
            <div className="story-visual-side">
              <img src="/images/guru_hasan.png" alt="Guru Hasan menasihati Fikri" />
            </div>
            <div className="story-narration-side">
              <div className="narration-header">
                <span className="badge-title">Halaman 8 - Motivasi Pendidik</span>
                <h2>Nasihat Guru Hasan</h2>
              </div>

              <div className="narration-content">
                <p>
                  Keesokan harinya, Fikri mengunjungi Guru Hasan di sekolah. Guru Hasan adalah pendidik yang selalu menjadi panutan Fikri.
                  Mendengar cerita Fikri, beliau tersenyum dan memberikan tantangan mental:
                </p>
                
                <div className="dialog-container">
                  <div className="dialog-bubble guru">
                    <div className="dialog-speaker">Guru Hasan</div>
                    "Jika seorang calon tentara sudah menyerah bahkan sebelum ia diterjunkan ke medan pertempuran yang sesungguhnya, apakah menurutmu ia pantas menyandang gelar sebagai prajurit?"
                  </div>
                  
                  <div className="dialog-bubble fikri">
                    <div className="dialog-speaker">Fikri</div>
                    (Fikri terdiam sejenak, merenungkan perkataan tajam gurunya...)
                  </div>

                  <div className="dialog-bubble guru">
                    <div className="dialog-speaker">Guru Hasan</div>
                    "Ingat, Fikri. Orang hebat bukanlah orang yang tidak pernah merasakan kegagalan. Tetapi mereka adalah orang yang bangkit berdiri setiap kali mereka terjatuh."
                  </div>
                </div>
              </div>

              <div className="card-footer-edu">
                <button onClick={handlePrev} className="btn btn-secondary">Kembali</button>
                <button onClick={handleNext} className="btn btn-primary">Lanjut <ArrowRight size={18} /></button>
              </div>
            </div>
          </div>
        )}

        {/* HALAMAN 9: SOLUSI */}
        {page === 9 && (
          <div className="storyboard-split animated-fade">
            <div className="story-visual-side">
              <img src="/images/solusi_collage.png" alt="Kolase kegiatan baru Fikri" />
            </div>
            <div className="story-narration-side">
              <div className="narration-header">
                <span className="badge-title">Halaman 9 - Solusi & Rencana Baru</span>
                <h2>Membangun Disiplin Baru</h2>
              </div>

              <div className="narration-content">
                <p>
                  Kata-kata ibunya dan Guru Hasan menyalakan kembali api semangat di jiwa Fikri. Ia sadar, kegagalan sebelumnya adalah bahan evaluasi diri.
                </p>
                <p style={{ marginTop: '10px', fontSize: '0.9rem', fontWeight: 600 }}>
                  👉 Klik semua persiapan disiplin di bawah ini untuk memulai latihan keras Fikri:
                </p>

                <div className="solutions-grid">
                  <div 
                    onClick={() => handleSolutionToggle('disciplin')}
                    className={`solution-card-item ${checkedSolutions.disciplin ? 'checked' : ''}`}
                  >
                    <div className="solution-bullet-box">✓</div>
                    <span>Disiplin Waktu & Jadwal</span>
                  </div>

                  <div 
                    onClick={() => handleSolutionToggle('training')}
                    className={`solution-card-item ${checkedSolutions.training ? 'checked' : ''}`}
                  >
                    <div className="solution-bullet-box">✓</div>
                    <span>Berlatih Fisik Giat</span>
                  </div>

                  <div 
                    onClick={() => handleSolutionToggle('studying')}
                    className={`solution-card-item ${checkedSolutions.studying ? 'checked' : ''}`}
                  >
                    <div className="solution-bullet-box">✓</div>
                    <span>Belajar Lebih Giat</span>
                  </div>

                  <div 
                    onClick={() => handleSolutionToggle('praying')}
                    className={`solution-card-item ${checkedSolutions.praying ? 'checked' : ''}`}
                  >
                    <div className="solution-bullet-box">✓</div>
                    <span>Berdoa & Berserah Diri</span>
                  </div>

                  <div 
                    onClick={() => handleSolutionToggle('listening')}
                    className={`solution-card-item ${checkedSolutions.listening ? 'checked' : ''}`}
                    style={{ gridColumn: '1 / -1' }}
                  >
                    <div className="solution-bullet-box">✓</div>
                    <span>Mendengarkan Nasihat Orang Tua & Guru</span>
                  </div>
                </div>
              </div>

              <div className="card-footer-edu">
                <button onClick={handlePrev} className="btn btn-secondary">Kembali</button>
                <button 
                  onClick={handleNext} 
                  className="btn btn-primary"
                  disabled={!isAllSolutionsChecked}
                >
                  Lanjut <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HALAMAN 10: CERITA AKHIR */}
        {page === 10 && (
          <div className="storyboard-split animated-fade" style={{ position: 'relative' }}>
            <ConfettiEffect />
            <div className="story-visual-side">
              <img src="/images/fikri_lulus.png" alt="Fikri lulus seleksi TNI dengan bahagia" />
            </div>
            <div className="story-narration-side">
              <div className="narration-header">
                <span className="badge-title">Halaman 10 - Akhir Perjuangan</span>
                <h2>Impian Menjadi Kenyataan!</h2>
              </div>

              <div className="narration-content">
                <p className="narration-quote">
                  "Hasil seleksi penerimaan Bintara TNI AD gelombang berikutnya: FIKRI SAPUTRA dinyatakan LULUS."
                </p>
                <p>
                  Air mata bahagia mengalir deras membasahi pipinya. Di pelukannya, sang ibu menangis haru. Guru Hasan yang menyaksikan berdiri bangga.
                </p>
                <p style={{ marginTop: '10px' }}>
                  Fikri berhasil mencapai impian terbesarnya karena satu hal: **Ia menolak untuk menyerah pada kegagalan.** 
                  Ia mengubah kesedihan menjadi bahan bakar semangat optimis yang luar biasa!
                </p>
              </div>

              <div className="card-footer-edu">
                <button onClick={handlePrev} className="btn btn-secondary">Kembali</button>
                <button onClick={handleNext} className="btn btn-accent">Mulai Refleksi Diri <ArrowRight size={18} /></button>
              </div>
            </div>
          </div>
        )}

        {/* HALAMAN 11: REFLEKSI 1 */}
        {page === 11 && (
          <RefleksiSikap 
            page={11}
            onNext={handleNext}
            onPrev={handlePrev}
            reflectionData={reflectionData}
            setReflectionData={setReflectionData}
          />
        )}

        {/* HALAMAN 12: REFLEKSI 2 */}
        {page === 12 && (
          <RefleksiSikap 
            page={12}
            onNext={handleNext}
            onPrev={handlePrev}
            reflectionData={reflectionData}
            setReflectionData={setReflectionData}
          />
        )}

        {/* HALAMAN 13 - 17: KUIS INTERAKTIF */}
        {page >= 13 && page <= 17 && (
          <KuisInteraktif 
            page={page}
            onNext={handleNext}
            onPrev={handlePrev}
            quizAnswers={quizAnswers}
            setQuizAnswers={setQuizAnswers}
          />
        )}

        {/* HALAMAN 18: GAME 1 - TANGGA OPTIMISME */}
        {page === 18 && (
          <TanggaOptimisme 
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}

        {/* HALAMAN 19: GAME 2 - KUMPULKAN SEMANGAT */}
        {page === 19 && (
          <KumpulkanSemangat 
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}

        {/* HALAMAN 20: GAME 3 - PUZZLE KESUKSESAN */}
        {page === 20 && (
          <PuzzleKesuksesan 
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}

        {/* HALAMAN 21: HALAMAN AKHIR */}
        {page === 21 && (
          <div className="final-screen-container animated-fade">
            <div className="card-header-edu">
              <span className="badge-title">Halaman 21 - Halaman Akhir</span>
              <h2>Selamat! Kamu Telah Menyelesaikan Pembelajaran</h2>
              <p className="subtitle">Sekarang, giliranmu merencanakan langkah sukses untuk cita-citamu sendiri.</p>
            </div>

            <div className="final-success-card">
              <div className="final-visual-box">
                <img src="/images/fikri_soldier.png" alt="Fikri mengenakan seragam tentara bersama ibu dan Guru Hasan" />
              </div>
              <div className="final-quotes-box">
                <span className="inspiration-heading">Pesan Inspiratif</span>
                <p className="inspiration-text">
                  "Kegagalan bukan akhir perjalanan. Dengan percaya diri, optimisme, usaha yang sungguh-sungguh, doa orang tua, dan bimbingan pendidik, setiap mimpi dapat menjadi kenyataan."
                </p>
                <div style={{ paddingLeft: '10px', borderLeft: '3px solid var(--color-accent)' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Identitas Media:</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                    Mata Pelajaran: Pemberdayaan (Fase D) | TP: Rasa Optimis<br />
                    Oleh: WAHYUNI, S.Pd. M.Pd, SPNF SKB KOTA BUKITTINGGI
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Challenge Input Form */}
            {!isPlanSaved ? (
              <div className="challenge-box-interactive animated-fade">
                <h3>Tantangan untuk Warga Belajar</h3>
                <p className="challenge-sub">
                  Tuliskan satu cita-cita yang paling ingin kamu capai dan tiga langkah konkret yang akan kamu mulai lakukan sejak hari ini.
                </p>

                <div className="form-grid-challenge">
                  <div className="input-field-group">
                    <label htmlFor="citaCita">Satu Cita-cita yang Ingin Dicapai:</label>
                    <input 
                      type="text" 
                      id="citaCita"
                      className="input-text-style"
                      placeholder="Contoh: Menjadi wirausaha kuliner sukses, menjadi insinyur, dll."
                      value={citaCita}
                      onChange={(e) => setCitaCita(e.target.value)}
                    />
                  </div>

                  <div className="input-field-group">
                    <label htmlFor="langkah1">Langkah 1 (Mulai Hari Ini):</label>
                    <input 
                      type="text" 
                      id="langkah1"
                      className="input-text-style"
                      placeholder="Contoh: Belajar resep masakan tradisional 1 jam setiap hari."
                      value={langkah1}
                      onChange={(e) => setLangkah1(e.target.value)}
                    />
                  </div>

                  <div className="input-field-group">
                    <label htmlFor="langkah2">Langkah 2 (Mulai Hari Ini):</label>
                    <input 
                      type="text" 
                      id="langkah2"
                      className="input-text-style"
                      placeholder="Contoh: Berlatih konsisten bangun pagi pukul 05.00."
                      value={langkah2}
                      onChange={(e) => setLangkah2(e.target.value)}
                    />
                  </div>

                  <div className="input-field-group">
                    <label htmlFor="langkah3">Langkah 3 (Mulai Hari Ini):</label>
                    <input 
                      type="text" 
                      id="langkah3"
                      className="input-text-style"
                      placeholder="Contoh: Meminta doa restu orang tua sebelum belajar."
                      value={langkah3}
                      onChange={(e) => setLangkah3(e.target.value)}
                    />
                  </div>
                </div>

                {/* Slogan Penutup */}
                <div className="slogan-hero-close">
                  <h2>"Aku Bisa, Aku Optimis, Aku Tidak Menyerah!"</h2>
                  <p>🏆 Pegang teguh slogan ini dalam setiap langkah perjuanganmu.</p>
                </div>

                {(!citaCita.trim() || !langkah1.trim() || !langkah2.trim() || !langkah3.trim()) && (
                  <p style={{ color: 'var(--color-danger)', fontSize: '0.9rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '15px' }}>
                    ⚠️ Silakan isi cita-cita dan 3 langkah nyata di atas untuk mengaktifkan rencana sukses!
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                  <button onClick={handlePrev} className="btn btn-secondary">Kembali</button>
                  <button 
                    onClick={() => setIsPlanSaved(true)} 
                    className="btn btn-accent btn-large"
                    disabled={!citaCita.trim() || !langkah1.trim() || !langkah2.trim() || !langkah3.trim()}
                  >
                    <Sparkles size={18} /> Aktifkan Rencana Sukses
                  </button>
                  <button onClick={() => setPage(22)} className="btn btn-outline btn-pengembang-trigger">
                    <img src="/images/Pengembang.png" alt="Pengembang" className="avatar-mini" />
                    <span>Pengembang</span>
                  </button>
                </div>
              </div>
            ) : (
              <div id="printable-area" className="challenge-box-interactive success-plan-activated animated-scale" style={{ position: 'relative', overflow: 'hidden' }}>
                <ConfettiEffect />
                
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <span className="badge-title" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>🎖️ RENCANA SUKSES WARGA BELAJAR AKTIF</span>
                  <h3 style={{ fontSize: '1.8rem', marginTop: '10px', color: 'var(--color-primary)' }}>Kartu Perjuangan Cita-Cita</h3>
                  <p className="challenge-sub">SPNF SKB Kota Bukittinggi • Program Kesetaraan Paket B</p>
                </div>

                <div className="printable-doc-outline" style={{ margin: '10px 0 25px 0', border: '2px solid var(--color-accent)', padding: '20px', borderRadius: '12px', backgroundColor: 'white' }}>
                  <div className="doc-section-block">
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Cita-Cita Mulia Saya:</h4>
                    <p style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--color-primary-light)', padding: '15px', backgroundColor: '#f1f5f9', borderRadius: '8px', marginTop: '8px' }}>
                      🌟 {citaCita}
                    </p>
                  </div>

                  <div className="doc-section-block" style={{ marginTop: '20px' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>3 Langkah Nyata Mulai Hari Ini:</h4>
                    <div className="doc-steps-list" style={{ marginTop: '8px' }}>
                      <div className="doc-step-row" style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', marginBottom: '8px', backgroundColor: '#f8fafc' }}>
                        <strong>Langkah 1:</strong> <span style={{ marginLeft: '10px' }}>{langkah1}</span>
                      </div>
                      <div className="doc-step-row" style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', marginBottom: '8px', backgroundColor: '#f8fafc' }}>
                        <strong>Langkah 2:</strong> <span style={{ marginLeft: '10px' }}>{langkah2}</span>
                      </div>
                      <div className="doc-step-row" style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
                        <strong>Langkah 3:</strong> <span style={{ marginLeft: '10px' }}>{langkah3}</span>
                      </div>
                    </div>
                  </div>

                  <div className="doc-section-block" style={{ marginTop: '20px' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Hasil Kuis Evaluasi Kisah Fikri:</h4>
                    <p style={{ fontSize: '1.05rem', fontWeight: 'bold', color: calculateQuizScore() > 0 ? 'var(--color-success)' : 'var(--color-danger)', padding: '12px', backgroundColor: calculateQuizScore() > 0 ? 'rgba(16, 185, 129, 0.06)' : 'rgba(239, 68, 68, 0.06)', border: calculateQuizScore() > 0 ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '8px', marginTop: '8px' }}>
                      📝 Pemahaman Materi: {calculateQuizScore()} / 100
                    </p>
                    
                    {calculateQuizScore() === 0 && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-danger)', marginTop: '6px', fontWeight: 600 }}>
                        ⚠️ Catatan: Skor Anda masih 0/100. Pastikan Anda telah menjawab kuis di menu "Kuis Evaluasi" dan menekan tombol "Kunci Jawaban" untuk menyimpan jawaban Anda di tiap pertanyaan.
                      </p>
                    )}

                    <div className="quiz-breakdown-box" style={{ marginTop: '12px', fontSize: '0.85rem', padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <p style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>Rincian Jawaban Kuis:</p>
                      <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0 }}>
                        {(() => {
                          const questionsList = [
                            { id: 1, correct: "2 kali", type: "single" },
                            { id: 2, correct: "Ibu", type: "single" },
                            { id: 3, correct: "Bangkit setelah gagal", type: "single" },
                            { id: 4, correct: "Mencoba kembali", type: "single" },
                            { id: 5, correct: ["Disiplin", "Berlatih", "Berdoa", "Mendengarkan nasihat"], type: "multi" }
                          ];
                          return questionsList.map(q => {
                            const answer = quizAnswers[q.id] !== undefined ? quizAnswers[q.id] : quizAnswers[String(q.id)];
                            let statusIcon = "⚪";
                            let statusText = "Belum Dijawab";
                            let statusColor = "#64748b";
                            
                            if (answer !== undefined && answer !== null) {
                              let isMatch = false;
                              if (q.type === 'single') {
                                isMatch = String(answer).trim().toLowerCase() === String(q.correct).trim().toLowerCase();
                              } else {
                                isMatch = Array.isArray(answer) && answer.length === q.correct.length && answer.every(val => q.correct.includes(val));
                              }
                              
                              if (isMatch) {
                                statusIcon = "✅";
                                statusText = "Benar";
                                statusColor = "var(--color-success)";
                              } else {
                                statusIcon = "❌";
                                statusText = q.type === 'single' ? `Salah (Jawaban Anda: "${answer}")` : `Salah (Jawaban kurang lengkap/tepat)`;
                                statusColor = "var(--color-danger)";
                              }
                            }
                            
                            return (
                              <li key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: statusColor, fontWeight: 600 }}>
                                <span>{statusIcon}</span>
                                <span>Soal {q.id}: {statusText}</span>
                              </li>
                            );
                          });
                        })()}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="slogan-hero-close">
                  <h2>"Aku Bisa, Aku Optimis, Aku Tidak Menyerah!"</h2>
                  <p>🏆 Sukses adalah hasil dari persiapan, kerja keras, dan belajar dari kegagalan.</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
                  <button onClick={handlePrev} className="btn btn-secondary">Kembali</button>
                  <button onClick={() => setIsPlanSaved(false)} className="btn btn-outline">
                    Ubah Rencana Sukses
                  </button>
                  <button onClick={() => setPage(22)} className="btn btn-accent btn-pengembang-trigger">
                    <img src="/images/Pengembang.png" alt="Pengembang" className="avatar-mini" />
                    <span>Profil Pengembang</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HALAMAN 22: PROFIL PENGEMBANG */}
        {page === 22 && (
          <div className="pengembang-screen-container animated-fade">
            <div className="pengembang-header-row">
              <button onClick={() => setPage(1)} className="btn btn-accent btn-main-menu">
                <Home size={18} /> MAIN MENU
              </button>
            </div>
            
            <div className="pengembang-card-layout">
              <h2 className="pengembang-main-title">PENGEMBANG</h2>
              
              <div className="pengembang-card-body">
                <div className="pengembang-photo-side">
                  <div className="pengembang-photo-frame">
                    <img src="/images/Pengembang.png" alt="Foto WAHYUNI, S.Pd. M.Pd" />
                  </div>
                </div>
                
                <div className="pengembang-info-side">
                  <div className="info-pill-item">
                    <div className="pill-label">
                      <User size={18} />
                      <span>NAMA</span>
                    </div>
                    <div className="pill-value">
                      WAHYUNI, S.Pd. M.Pd
                    </div>
                  </div>
                  
                  <div className="info-pill-item">
                    <div className="pill-label">
                      <Briefcase size={18} />
                      <span>UNIT KERJA</span>
                    </div>
                    <div className="pill-value">
                      SPNF SKB KOTA BUKITTINGGI
                    </div>
                  </div>
                  
                  <div className="info-pill-item">
                    <div className="pill-label">
                      <Mail size={18} />
                      <span>EMAIL</span>
                    </div>
                    <div className="pill-value">
                      <a href="mailto:ridhawahyuni9173@gmail.com">ridhawahyuni9173@gmail.com</a>
                    </div>
                  </div>
                  
                  <div className="info-pill-item">
                    <div className="pill-label">
                      <Sparkles size={18} />
                      <span>MEDIA SOSIAL</span>
                    </div>
                    <div className="pill-value social-links-row">
                      <div className="social-link-badge">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                        <span>wahyuni ridha</span>
                      </div>
                      <div className="social-link-badge">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><path d="M18 2h-3a5 5 0 0 0 -5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        <span>wahyuni ridha</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer-edu" style={{ marginTop: '20px' }}>
              <button onClick={() => setPage(21)} className="btn btn-secondary">Kembali</button>
            </div>
          </div>
        )}

      </main>

      {/* AI Image Disclaimer Footer */}
      <footer className="footer-edu">
        <span>🤖 Semua gambar pada media pembelajaran ini dibuat menggunakan Kecerdasan Buatan (AI)</span>
      </footer>
    </div>
  );
}

