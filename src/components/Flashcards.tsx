import React, { useState } from 'react';
import { vocabularyData } from '../data/vocabulary';
import './Flashcards.css';

interface FlashcardsProps {
  onAddRewards: (xp: number, coins: number) => void;
  onIncrementCardsToday: () => void;
}

export const Flashcards: React.FC<FlashcardsProps> = ({ onAddRewards, onIncrementCardsToday }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [learnedCount, setLearnedCount] = useState(0);

  const currentCard = vocabularyData[currentIndex];

  const speak = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // カード反転を防ぐ
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = (learned: boolean) => {
    setIsFlipped(false);
    onIncrementCardsToday();

    if (learned) {
      setLearnedCount((prev) => prev + 1);
      // カード1枚学習ごとに報酬
      onAddRewards(2, 1); // 2 XP, 1 Coin
    }

    setTimeout(() => {
      if (currentIndex + 1 < vocabularyData.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCompleted(true);
        // 全カード学習完了ボーナス
        onAddRewards(15, 10);
      }
    }, 200); // 反転が戻る時間を見越して少し遅延
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCompleted(false);
    setLearnedCount(0);
  };

  if (completed) {
    return (
      <div className="flashcards-completed glass-panel text-center">
        <h2>🎴 フラッシュカード学習完了！</h2>
        <p className="result-sub">全 {vocabularyData.length} 枚の単語カードをチェックしました！</p>
        
        <div className="completed-stats">
          <div className="completed-stat-box">
            <span className="completed-stat-val">{learnedCount} / {vocabularyData.length}</span>
            <span className="completed-stat-lbl">「覚えた」数</span>
          </div>
          <div className="completed-stat-box reward-xp">
            <span className="completed-stat-val">+{learnedCount * 2 + 15}</span>
            <span className="completed-stat-lbl">合計 XP</span>
          </div>
          <div className="completed-stat-box reward-coins">
            <span className="completed-stat-val">+{learnedCount * 1 + 10}</span>
            <span className="completed-stat-lbl">合計 コイン</span>
          </div>
        </div>

        <button className="btn-primary" onClick={handleRestart}>もう一度学習する</button>
      </div>
    );
  }

  const progressPercentage = ((currentIndex) / vocabularyData.length) * 100;

  return (
    <div className="flashcards-container">
      {/* プログレスバー */}
      <div className="flashcards-progress-wrapper">
        <div className="flashcards-progress-track">
          <div className="flashcards-progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <span className="flashcards-progress-text">{currentIndex + 1} / {vocabularyData.length}</span>
      </div>

      <p className="flashcard-instruction">カードをタップするとめくります。音声を聞いて意味を確認しましょう。</p>

      {/* 3Dカード */}
      <div className={`flashcard-scene`} onClick={handleFlip}>
        <div className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}>
          
          {/* カード表面 */}
          <div className="flashcard-face flashcard-front glass-panel">
            <div className="card-header">
              <span className="app-badge app-badge-green">{currentCard.category.toUpperCase()}</span>
              <span className="flip-hint">タップして翻訳 ➔</span>
            </div>
            
            <div className="card-main">
              <h1 className="card-chinese">{currentCard.chinese}</h1>
              <button className="btn-audio-large" onClick={(e) => speak(currentCard.chinese, e)} title="発音を聞く">
                🔊
              </button>
            </div>
            
            <div className="card-footer">
              <p>発音を聞いて、意味を思い出してください</p>
            </div>
          </div>

          {/* カード裏面 */}
          <div className="flashcard-face flashcard-back glass-panel">
            <div className="card-header">
              <span className="app-badge app-badge-pink">ピンイン・意味</span>
              <span className="flip-hint">➔ タップで戻る</span>
            </div>

            <div className="card-main">
              <h2 className="card-pinyin">{currentCard.pinyin}</h2>
              <h1 className="card-translation">{currentCard.translation}</h1>
              <button className="btn-audio-small" onClick={(e) => speak(currentCard.chinese, e)} title="発音を聞く">
                🔊
              </button>
            </div>

            <div className="card-example-box">
              <div className="example-header">
                <span>例文:</span>
                <button className="btn-audio-mini" onClick={(e) => speak(currentCard.example.chinese, e)}>
                  🔊
                </button>
              </div>
              <p className="example-chinese">{currentCard.example.chinese}</p>
              <p className="example-pinyin">{currentCard.example.pinyin}</p>
              <p className="example-translation">{currentCard.example.translation}</p>
            </div>
          </div>

        </div>
      </div>

      {/* 操作ボタン */}
      <div className="flashcard-actions">
        <button className="btn-secondary" onClick={() => handleNext(false)}>
          ❌ まだ覚えてない
        </button>
        <button className="btn-primary" onClick={() => handleNext(true)}>
          ✅ 覚えた！ (+2 XP)
        </button>
      </div>
    </div>
  );
};
