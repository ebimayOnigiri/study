import React, { useState } from 'react';
import './Dashboard.css';
import pandaImg from '../assets/panda_character.png';

interface DashboardProps {
  xp: number;
  level: number;
  coins: number;
  streak: number;
  equippedItems: string[];
  onNavigate: (tab: string) => void;
  quizCountToday: number;
  cardsCountToday: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  xp,
  level,
  coins,
  streak,
  equippedItems,
  onNavigate,
  quizCountToday,
  cardsCountToday,
}) => {
  const [isPandaBouncing, setIsPandaBouncing] = useState(false);

  const xpNeeded = level * 100;
  const xpPercentage = Math.min((xp / xpNeeded) * 100, 100);

  const quizTarget = 3;
  const cardTarget = 5;

  const handlePandaClick = () => {
    setIsPandaBouncing(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance('你好！今天也要加油哦！');
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
    setTimeout(() => setIsPandaBouncing(false), 1000);
  };

  return (
    <div className="dashboard-container">
      {/* ヒーローセクション（アセット画像パンダを中央配置） */}
      <section className="panda-hero glass-panel text-center">
        <div 
          className={`panda-avatar-wrapper ${isPandaBouncing ? 'panda-bounce' : ''}`}
          onClick={handlePandaClick}
          title="タップして挨拶しよう！"
        >
          {/* 超かわいい赤ちゃんパンダの画像 */}
          <img src={pandaImg} alt="パンちゃん" className="panda-char-img" />

          {/* 着せ替えアイテムの絶対配置レイヤー */}
          {equippedItems.includes('red-hat') && (
            <div className="accessory-layer hat-layer">
              <svg viewBox="0 0 100 50" className="accessory-svg">
                <path d="M 5 40 Q 50 5 95 40 L 90 48 Q 50 33 10 48 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
                <circle cx="50" cy="15" r="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              </svg>
            </div>
          )}
          {equippedItems.includes('crown') && (
            <div className="accessory-layer crown-layer">
              <svg viewBox="0 0 60 40" className="accessory-svg">
                <polygon points="5,30 10,5 30,20 50,5 55,30" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
                <circle cx="10" cy="5" r="2.5" fill="#ef4444" />
                <circle cx="30" cy="20" r="2.5" fill="#3b82f6" />
                <circle cx="50" cy="5" r="2.5" fill="#ef4444" />
              </svg>
            </div>
          )}
          {equippedItems.includes('glasses') && (
            <div className="accessory-layer glasses-layer">
              <svg viewBox="0 0 100 40" className="accessory-svg">
                <g stroke="#3b82f6" strokeWidth="4.5" fill="none" strokeLinecap="round">
                  <circle cx="25" cy="20" r="16" />
                  <circle cx="75" cy="20" r="16" />
                  <line x1="41" y1="20" x2="59" y2="20" />
                  <path d="M 9 20 Q -3 10 -7 20" />
                  <path d="M 91 20 Q 103 10 107 20" />
                </g>
              </svg>
            </div>
          )}
          {equippedItems.includes('sunglasses') && (
            <div className="accessory-layer sunglasses-layer">
              <svg viewBox="0 0 100 40" className="accessory-svg">
                <g fill="#0f172a" stroke="#475569" strokeWidth="2">
                  <path d="M 5 15 Q 25 10 42 18 L 40 32 Q 22 37 5 30 Z" />
                  <path d="M 58 18 Q 75 10 95 15 L 95 30 Q 78 37 60 32 Z" />
                  <line x1="42" y1="18" x2="58" y2="18" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
                </g>
              </svg>
            </div>
          )}
          {(() => {
            const equippedBowtie = equippedItems.find(item => item.startsWith('bowtie'));
            if (!equippedBowtie) return null;

            let color1 = '#ff758c';
            let color2 = '#ff7eb3';
            let strokeColor = '#db2777';
            let shadowColor = '#be185d';
            let gradId = 'bowtieGrad-pink';

            if (equippedBowtie === 'bowtie-blue') {
              color1 = '#60a5fa';
              color2 = '#3b82f6';
              strokeColor = '#1d4ed8';
              shadowColor = '#1e3a8a';
              gradId = 'bowtieGrad-blue';
            } else if (equippedBowtie === 'bowtie-yellow') {
              color1 = '#fcd34d';
              color2 = '#f59e0b';
              strokeColor = '#b45309';
              shadowColor = '#78350f';
              gradId = 'bowtieGrad-yellow';
            } else if (equippedBowtie === 'bowtie-red') {
              color1 = '#f87171';
              color2 = '#dc2626';
              strokeColor = '#991b1b';
              shadowColor = '#7f1d1d';
              gradId = 'bowtieGrad-red';
            }

            return (
              <div className="accessory-layer bowtie-layer">
                <svg viewBox="0 0 60 30" className="accessory-svg">
                  <defs>
                    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={color1} />
                      <stop offset="100%" stopColor={color2} />
                    </linearGradient>
                    <linearGradient id="bowtieCenterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#f1f5f9" />
                    </linearGradient>
                  </defs>
                  {/* 左リボン */}
                  <path d="M 27 15 C 13 4, 3 8, 3 15 C 3 22, 13 26, 27 15 Z" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="2.5" />
                  {/* 右リボン */}
                  <path d="M 33 15 C 47 4, 57 8, 57 15 C 57 22, 47 26, 33 15 Z" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="2.5" />
                  {/* ひだ線 */}
                  <path d="M 10 13 Q 18 15 24 15" fill="none" stroke={shadowColor} strokeWidth="2" strokeLinecap="round" />
                  <path d="M 50 13 Q 42 15 36 15" fill="none" stroke={shadowColor} strokeWidth="2" strokeLinecap="round" />
                  {/* 結び目 */}
                  <circle cx="30" cy="15" r="7" fill="url(#bowtieCenterGrad)" stroke={strokeColor} strokeWidth="2.5" />
                </svg>
              </div>
            );
          })()}
          {equippedItems.includes('bamboo') && (
            <div className="accessory-layer bamboo-layer">
              <svg viewBox="0 0 30 60" className="accessory-svg">
                <rect x="11" y="5" width="8" height="50" rx="3" fill="#10b981" stroke="#047857" strokeWidth="1" />
                <path d="M 19 15 Q 33 10 29 23 Z" fill="#10b981" />
                <path d="M 3 25 Q -11 20 -7 33 Z" fill="#10b981" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="panda-status">
          <h2>パンちゃん <span className="level-badge">Lv. {level}</span></h2>
          <p className="panda-greeting">「ニーハオ！一緒に中国語を学ぼう！」</p>
          
          <div className="xp-bar-container">
            <div className="xp-bar-header">
              <span>XP</span>
              <span>{xp} / {xpNeeded}</span>
            </div>
            <div className="xp-track">
              <div className="xp-fill animate-pulse-glow" style={{ width: `${xpPercentage}%` }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* ステータスカードグリッド */}
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon streak-icon">🔥</div>
          <div className="stat-info">
            <span className="stat-value">{streak} 日</span>
            <span className="stat-label">連続学習ストリーク</span>
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-icon coin-icon">🪙</div>
          <div className="stat-info">
            <span className="stat-value">{coins}</span>
            <span className="stat-label">パンダコイン</span>
          </div>
          <button className="btn-shop-shortcut" onClick={() => onNavigate('shop')}>ショップへ ➔</button>
        </div>
      </div>

      {/* デイリーミッション */}
      <section className="daily-quests glass-panel">
        <h3>🎯 今日のミッション</h3>
        <div className="quest-list">
          <div className={`quest-item ${quizCountToday >= quizTarget ? 'completed' : ''}`}>
            <div className="quest-status-icon">
              {quizCountToday >= quizTarget ? '✅' : '⏳'}
            </div>
            <div className="quest-details">
              <h4>クイズに3問挑戦する</h4>
              <p>進捗: {quizCountToday} / {quizTarget}</p>
            </div>
            {quizCountToday < quizTarget ? (
              <button className="btn-primary btn-sm" onClick={() => onNavigate('quiz')}>挑戦する</button>
            ) : (
              <span className="quest-reward">+10 🪙</span>
            )}
          </div>

          <div className={`quest-item ${cardsCountToday >= cardTarget ? 'completed' : ''}`}>
            <div className="quest-status-icon">
              {cardsCountToday >= cardTarget ? '✅' : '⏳'}
            </div>
            <div className="quest-details">
              <h4>フラッシュカードを5回めくる</h4>
              <p>進捗: {cardsCountToday} / {cardTarget}</p>
            </div>
            {cardsCountToday < cardTarget ? (
              <button className="btn-secondary btn-sm" onClick={() => onNavigate('cards')}>めくる</button>
            ) : (
              <span className="quest-reward">+10 🪙</span>
            )}
          </div>
        </div>
      </section>

      {/* クイックスタートボタン */}
      <div className="quick-actions">
        <button className="btn-primary btn-lg" onClick={() => onNavigate('quiz')}>
          <span>🎮</span> クイズゲームをはじめる
        </button>
        <button className="btn-secondary btn-lg" onClick={() => onNavigate('cards')}>
          <span>🎴</span> フラッシュカードで覚える
        </button>
      </div>
    </div>
  );
};
