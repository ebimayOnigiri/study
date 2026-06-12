import React, { useState, useEffect } from 'react';
import { type QuizQuestion, generateQuizQuestions } from '../data/vocabulary';
import './Quiz.css';

interface QuizProps {
  onAddRewards: (xp: number, coins: number) => void;
  onIncrementQuizzesToday: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ onAddRewards, onIncrementQuizzesToday }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // 並べ替えクイズ用ステート
  const [arrangeAnswer, setArrangeAnswer] = useState<string[]>([]);
  const [arrangeOptions, setArrangeOptions] = useState<string[]>([]);

  // 紙吹雪用の簡易エフェクトステート
  const [confettis, setConfettis] = useState<{ id: number; left: number; delay: number }[]>([]);

  useEffect(() => {
    // クイズデータの初期化 (5問ピックアップ)
    const allQuiz = generateQuizQuestions();
    setQuestions(allQuiz.slice(0, 5));
  }, []);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (currentQuestion && currentQuestion.type === 'arrange') {
      setArrangeAnswer([]);
      setArrangeOptions(currentQuestion.arrangeWords || []);
    }
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowHint(false);
  }, [currentIndex, currentQuestion]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // 自動音声再生
  useEffect(() => {
    if (currentQuestion && !quizFinished) {
      speak(currentQuestion.audioText);
    }
  }, [currentIndex, currentQuestion, quizFinished]);

  const triggerConfetti = () => {
    const newConfettis = Array.from({ length: 40 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100, // 0 - 100%
      delay: Math.random() * 0.8
    }));
    setConfettis(newConfettis);
    setTimeout(() => setConfettis([]), 3000);
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(option);
    setIsAnswered(true);
    onIncrementQuizzesToday();

    const correct = option === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      triggerConfetti();
      // ピンポン音の代わりに音声
      speak('对'); // 正解 (duì)
    } else {
      speak('不对'); // 不正解 (bú duì)
    }
  };

  // 並べ替え単語選択
  const handleSelectArrangeWord = (word: string, index: number) => {
    if (isAnswered) return;
    setArrangeAnswer([...arrangeAnswer, word]);
    setArrangeOptions(arrangeOptions.filter((_, i) => i !== index));
  };

  // 並べ替え回答から戻す
  const handleRemoveArrangeWord = (word: string, index: number) => {
    if (isAnswered) return;
    setArrangeOptions([...arrangeOptions, word]);
    setArrangeAnswer(arrangeAnswer.filter((_, i) => i !== index));
  };

  const handleCheckArrangeAnswer = () => {
    if (isAnswered) return;
    
    const userSentence = arrangeAnswer.join('');
    setIsAnswered(true);
    onIncrementQuizzesToday();

    const correct = userSentence === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      triggerConfetti();
      speak('对');
    } else {
      speak('不对');
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      // レッスン完了報酬：正解数に応じたXPとコイン
      const xpGained = score * 15 + 10; // 1問15XP + クリアボーナス10XP
      const coinsGained = score * 5 + 5;  // 1問5コイン + クリアボーナス5コイン
      onAddRewards(xpGained, coinsGained);
    }
  };

  const handleRestart = () => {
    const allQuiz = generateQuizQuestions();
    setQuestions(allQuiz.slice(0, 5));
    setCurrentIndex(0);
    setScore(0);
    setQuizFinished(false);
  };

  if (questions.length === 0) {
    return <div className="quiz-loading">問題を読み込み中...</div>;
  }

  // クイズ結果画面
  if (quizFinished) {
    const xpGained = score * 15 + 10;
    const coinsGained = score * 5 + 5;
    return (
      <div className="quiz-result-card glass-panel text-center">
        <h2>🎉 レッスン完了！</h2>
        <p className="result-sub">素晴らしい学習態度です！</p>
        
        <div className="result-stats">
          <div className="result-stat-box">
            <span className="result-stat-val">{score} / {questions.length}</span>
            <span className="result-stat-lbl">正解数</span>
          </div>
          <div className="result-stat-box reward-xp">
            <span className="result-stat-val">+{xpGained}</span>
            <span className="result-stat-lbl">XP 獲得</span>
          </div>
          <div className="result-stat-box reward-coins">
            <span className="result-stat-val">+{coinsGained}</span>
            <span className="result-stat-lbl">コイン 獲得</span>
          </div>
        </div>

        <div className="result-message">
          {score === questions.length ? (
            <p>🌟 完璧です！全問正解！パンちゃんも大喜びです！</p>
          ) : score >= 3 ? (
            <p>👍 よくできました！この調子で毎日続けましょう！</p>
          ) : (
            <p>💪 練習あるのみ！もう一度挑戦して復習しましょう！</p>
          )}
        </div>

        <div className="result-actions">
          <button className="btn-primary" onClick={handleRestart}>もう一度挑戦する</button>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentIndex) / questions.length) * 100;

  return (
    <div className="quiz-container">
      {/* 紙吹雪エフェクト */}
      {confettis.map((c) => (
        <div 
          key={c.id} 
          className="confetti" 
          style={{ 
            left: `${c.left}%`, 
            animationDelay: `${c.delay}s`,
            backgroundColor: ['#10b981', '#f59e0b', '#ec4899', '#3b82f6'][Math.floor(Math.random() * 4)]
          }} 
        />
      ))}

      {/* プログレスバー */}
      <div className="quiz-progress-wrapper">
        <div className="quiz-progress-track">
          <div className="quiz-progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <span className="quiz-progress-text">{currentIndex + 1} / {questions.length}</span>
      </div>

      {/* 問題カード */}
      <div className="quiz-card glass-panel">
        <div className="quiz-card-header">
          <span className={`quiz-type-badge app-badge app-badge-${
            currentQuestion.type === 'tone' ? 'pink' : currentQuestion.type === 'arrange' ? 'gold' : 'green'
          }`}>
            {currentQuestion.type === 'pinyin' && 'ピンイン選択'}
            {currentQuestion.type === 'translation' && '意味選択'}
            {currentQuestion.type === 'tone' && '声調当て'}
            {currentQuestion.type === 'arrange' && '並べ替えパズル'}
          </span>
          <button className="btn-audio" onClick={() => speak(currentQuestion.audioText)} title="発音を聞く">
            🔊
          </button>
        </div>

        <div className="quiz-chinese-display">
          <h1>{currentQuestion.chinese}</h1>
        </div>

        <p className="quiz-question-text">{currentQuestion.question}</p>

        {/* ヒントボタン */}
        {currentQuestion.hint && (
          <div className="quiz-hint-wrapper">
            {showHint ? (
              <p className="quiz-hint-text">💡 {currentQuestion.hint}</p>
            ) : (
              <button className="btn-hint" onClick={() => setShowHint(true)}>ヒントを見る</button>
            )}
          </div>
        )}

        {/* 回答セクション */}
        <div className="quiz-answer-section">
          {/* 通常の4択クイズ */}
          {currentQuestion.type !== 'arrange' && (
            <div className="quiz-options-grid">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrectOption = option === currentQuestion.correctAnswer;
                
                let optionClass = '';
                if (isAnswered) {
                  if (isCorrectOption) optionClass = 'correct';
                  else if (isSelected) optionClass = 'incorrect';
                  else optionClass = 'disabled';
                }

                return (
                  <button
                    key={idx}
                    className={`quiz-option-btn glass-panel ${optionClass}`}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(option)}
                  >
                    <span className="option-num">{idx + 1}</span>
                    <span className="option-text">{option}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 並べ替えパズル */}
          {currentQuestion.type === 'arrange' && (
            <div className="arrange-quiz-wrapper">
              {/* 回答表示エリア */}
              <div className={`arrange-answer-area ${isAnswered ? (isCorrect ? 'correct' : 'incorrect') : ''}`}>
                {arrangeAnswer.length === 0 && <span className="arrange-placeholder">ここに単語を並べ替えてください</span>}
                {arrangeAnswer.map((word, idx) => (
                  <button 
                    key={idx} 
                    className="arrange-word-card answered"
                    disabled={isAnswered}
                    onClick={() => handleRemoveArrangeWord(word, idx)}
                  >
                    {word}
                  </button>
                ))}
              </div>

              {/* 選択肢エリア */}
              {!isAnswered && (
                <div className="arrange-options-area">
                  {arrangeOptions.map((word, idx) => (
                    <button 
                      key={idx} 
                      className="arrange-word-card option"
                      onClick={() => handleSelectArrangeWord(word, idx)}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              )}

              {/* 判定ボタン */}
              {!isAnswered && (
                <button 
                  className="btn-primary w-full mt-4" 
                  disabled={arrangeAnswer.length === 0}
                  onClick={handleCheckArrangeAnswer}
                >
                  回答を判定する
                </button>
              )}
            </div>
          )}
        </div>

        {/* 回答後のフィードバック＆ネクストボタン */}
        {isAnswered && (
          <div className={`quiz-feedback-box ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="feedback-message">
              <span>{isCorrect ? '🎉 正解！' : '❌ 残念！'}</span>
              {!isCorrect && (
                <p className="correct-explanation">正解: {currentQuestion.correctAnswer}</p>
              )}
            </div>
            <button className="btn-primary animate-bounce-subtle" onClick={handleNext}>
              {currentIndex + 1 === questions.length ? '結果を見る' : '次の問題へ ➔'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
