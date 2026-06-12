import React from 'react';
import './Badges.css';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: 'gold' | 'green' | 'pink' | 'blue';
}

export const badgesData: Badge[] = [
  { id: 'first-quiz', title: '最初の一歩', description: 'クイズに1問以上正解する', icon: '🌱', color: 'green' },
  { id: 'streak-3', title: '継続の力', description: 'ストリークを3日以上に伸ばす', icon: '🔥', color: 'gold' },
  { id: 'level-5', title: '急成長', description: 'レベル5に到達する', icon: '🚀', color: 'blue' },
  { id: 'shop-buy', title: 'おしゃれパンダ', description: 'ショップで初めてアイテムを購入する', icon: '🎀', color: 'pink' },
  { id: 'all-correct', title: '百発百中', description: 'クイズレッスンで全問正解（5点）を達成する', icon: '👑', color: 'gold' }
];

interface BadgesProps {
  unlockedBadges: string[];
}

export const Badges: React.FC<BadgesProps> = ({ unlockedBadges }) => {
  return (
    <div className="badges-container">
      <div className="badges-header glass-panel text-center">
        <h2>🏆 アチーブメント & バッジ</h2>
        <p>学習を進めて、特別なバッジをコレクションしましょう！</p>
        <div className="badge-progress-summary">
          <span className="summary-val">{unlockedBadges.length} / {badgesData.length}</span>
          <span className="summary-lbl">獲得済み</span>
        </div>
      </div>

      <div className="badges-grid">
        {badgesData.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          
          return (
            <div 
              key={badge.id} 
              className={`badge-card glass-panel ${isUnlocked ? 'unlocked' : 'locked'} badge-color-${badge.color}`}
            >
              <div className="badge-icon-wrapper">
                <span className="badge-icon">{badge.icon}</span>
                {!isUnlocked && <span className="badge-lock">🔒</span>}
                {isUnlocked && <span className="badge-sparkle">✨</span>}
              </div>
              <div className="badge-info">
                <h3>{badge.title}</h3>
                <p>{badge.description}</p>
                <div className="badge-status-lbl">
                  {isUnlocked ? (
                    <span className="status-unlocked-text">達成済み！</span>
                  ) : (
                    <span className="status-locked-text">ロック中</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
