import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Quiz } from './components/Quiz';
import { Flashcards } from './components/Flashcards';
import { Shop } from './components/Shop';
import { Badges } from './components/Badges';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // ユーザーのステータスステート
  const [xp, setXp] = useState<number>(() => Number(localStorage.getItem('panda_xp') || 0));
  const [level, setLevel] = useState<number>(() => Number(localStorage.getItem('panda_level') || 1));
  const [coins, setCoins] = useState<number>(() => Number(localStorage.getItem('panda_coins') || 15));
  const [streak, setStreak] = useState<number>(() => Number(localStorage.getItem('panda_streak') || 0));
  const [lastActiveDate, setLastActiveDate] = useState<string>(() => localStorage.getItem('panda_last_active') || '');
  
  // ショップとアチーブメントのステート
  const [purchasedItems, setPurchasedItems] = useState<string[]>(() => {
    const data = localStorage.getItem('panda_purchased_items');
    return data ? JSON.parse(data) : [];
  });
  const [equippedItems, setEquippedItems] = useState<string[]>(() => {
    const data = localStorage.getItem('panda_equipped_items');
    return data ? JSON.parse(data) : [];
  });
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    const data = localStorage.getItem('panda_unlocked_badges');
    return data ? JSON.parse(data) : [];
  });

  // 日別進捗
  const [quizCountToday, setQuizCountToday] = useState<number>(() => Number(localStorage.getItem('panda_quiz_today') || 0));
  const [cardsCountToday, setCardsCountToday] = useState<number>(() => Number(localStorage.getItem('panda_cards_today') || 0));

  // レベルアップモーダル表示
  const [showLevelUpModal, setShowLevelUpModal] = useState<boolean>(false);
  const [prevLevel, setPrevLevel] = useState<number>(level);

  // データの永続化
  useEffect(() => {
    localStorage.setItem('panda_xp', xp.toString());
    localStorage.setItem('panda_level', level.toString());
    localStorage.setItem('panda_coins', coins.toString());
    localStorage.setItem('panda_streak', streak.toString());
    localStorage.setItem('panda_last_active', lastActiveDate);
    localStorage.setItem('panda_purchased_items', JSON.stringify(purchasedItems));
    localStorage.setItem('panda_equipped_items', JSON.stringify(equippedItems));
    localStorage.setItem('panda_unlocked_badges', JSON.stringify(unlockedBadges));
    localStorage.setItem('panda_quiz_today', quizCountToday.toString());
    localStorage.setItem('panda_cards_today', cardsCountToday.toString());
  }, [xp, level, coins, streak, lastActiveDate, purchasedItems, equippedItems, unlockedBadges, quizCountToday, cardsCountToday]);

  // ストリークのリセット判定 (起動時)
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (lastActiveDate) {
      const lastDate = new Date(lastActiveDate);
      const todayDate = new Date(todayStr);
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        // 1日以上学習があいた場合、ストリークをリセット
        setStreak(0);
      }
    }

    // 日付が変わった場合のデイリーカウンターのリセット
    const lastSavedDate = localStorage.getItem('panda_last_active_date_counter') || '';
    if (lastSavedDate !== todayStr) {
      setQuizCountToday(0);
      setCardsCountToday(0);
      localStorage.setItem('panda_last_active_date_counter', todayStr);
    }
  }, [lastActiveDate]);

  // XP追加・レベルアップ判定
  const addRewards = (earnedXp: number, earnedCoins: number) => {
    setCoins((prev) => prev + earnedCoins);

    // ストリーク更新
    const todayStr = new Date().toISOString().split('T')[0];
    if (lastActiveDate !== todayStr) {
      if (lastActiveDate) {
        const lastDate = new Date(lastActiveDate);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          setStreak((prev) => prev + 1);
        } else {
          setStreak(1);
        }
      } else {
        setStreak(1);
      }
      setLastActiveDate(todayStr);
    }

    // XP更新
    let newXp = xp + earnedXp;
    let currentLvl = level;
    let xpNeeded = currentLvl * 100;

    while (newXp >= xpNeeded) {
      newXp -= xpNeeded;
      currentLvl += 1;
      xpNeeded = currentLvl * 100;
    }

    if (currentLvl > level) {
      setPrevLevel(level);
      setLevel(currentLvl);
      setShowLevelUpModal(true);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('恭喜你升级啦！'); // レベルアップおめでとう！
        utterance.lang = 'zh-CN';
        window.speechSynthesis.speak(utterance);
      }
    }
    setXp(newXp);
  };

  // デイリー進捗カウント
  const incrementQuizzesToday = () => {
    setQuizCountToday((prev) => prev + 1);
  };

  const incrementCardsToday = () => {
    setCardsCountToday((prev) => prev + 1);
  };

  // バッジアンロック判定
  useEffect(() => {
    const badgesToUnlock = [...unlockedBadges];
    let updated = false;

    // 1. 最初の一歩
    if (!badgesToUnlock.includes('first-quiz') && xp > 0) {
      badgesToUnlock.push('first-quiz');
      updated = true;
    }

    // 2. 継続の力
    if (!badgesToUnlock.includes('streak-3') && streak >= 3) {
      badgesToUnlock.push('streak-3');
      updated = true;
    }

    // 3. 急成長
    if (!badgesToUnlock.includes('level-5') && level >= 5) {
      badgesToUnlock.push('level-5');
      updated = true;
    }

    // 4. おしゃれパンダ
    if (!badgesToUnlock.includes('shop-buy') && purchasedItems.length >= 1) {
      badgesToUnlock.push('shop-buy');
      updated = true;
    }

    // 5. 百発百中
    // クイズコンポーネントのレッスン完了時に直接追加します

    if (updated) {
      setUnlockedBadges(badgesToUnlock);
    }
  }, [xp, streak, level, purchasedItems, unlockedBadges]);

  // ショップ購入・装備
  const handleBuyItem = (itemId: string, price: number) => {
    if (coins >= price) {
      setCoins((prev) => prev - price);
      setPurchasedItems((prev) => [...prev, itemId]);
      // 自動的に装備する
      setEquippedItems((prev) => [...prev, itemId]);
    }
  };

  const handleEquipItem = (itemId: string) => {
    setEquippedItems((prev) => [...prev, itemId]);
  };

  const handleUnequipItem = (itemId: string) => {
    setEquippedItems((prev) => prev.filter((id) => id !== itemId));
  };

  // 特殊なクイズ全問正解バッジアンロック関数
  const handleAddRewardsWithQuizScore = (earnedXp: number, earnedCoins: number) => {
    addRewards(earnedXp, earnedCoins);
    
    // もし全問正解（獲得XP = 5問*15XP + 10XPクリアボーナス = 85XP）なら、バッジアンロック
    if (earnedXp === 85 && !unlockedBadges.includes('all-correct')) {
      setUnlockedBadges((prev) => [...prev, 'all-correct']);
    }
  };

  return (
    <div className="app-container">
      {/* グローバルヘッダー */}
      <header className="app-header glass-panel">
        <div className="app-logo" onClick={() => setActiveTab('dashboard')}>
          <span className="logo-panda">🐼</span>
          <div className="logo-text">
            <h1>熊猫漢語</h1>
            <span>PandaLingo</span>
          </div>
        </div>

        <div className="header-status">
          <div className="header-status-item" title="現在のレベル">
            <span className="status-label-top">Lv.{level}</span>
          </div>
          <div className="header-status-item" title="連続学習日数">
            <span>🔥 {streak}日</span>
          </div>
          <div className="header-status-item" title="所持コイン">
            <span>🪙 {coins}</span>
          </div>
        </div>
      </header>

      {/* メインビュー */}
      <main className="app-main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            xp={xp}
            level={level}
            coins={coins}
            streak={streak}
            equippedItems={equippedItems}
            onNavigate={setActiveTab}
            quizCountToday={quizCountToday}
            cardsCountToday={cardsCountToday}
          />
        )}
        {activeTab === 'quiz' && (
          <Quiz
            onAddRewards={handleAddRewardsWithQuizScore}
            onIncrementQuizzesToday={incrementQuizzesToday}
          />
        )}
        {activeTab === 'cards' && (
          <Flashcards
            onAddRewards={addRewards}
            onIncrementCardsToday={incrementCardsToday}
          />
        )}
        {activeTab === 'shop' && (
          <Shop
            coins={coins}
            purchasedItems={purchasedItems}
            equippedItems={equippedItems}
            onBuyItem={handleBuyItem}
            onEquipItem={handleEquipItem}
            onUnequipItem={handleUnequipItem}
          />
        )}
        {activeTab === 'badges' && (
          <Badges
            unlockedBadges={unlockedBadges}
          />
        )}
      </main>

      {/* グローバルナビゲーションバー（フッター固定） */}
      <nav className="app-navbar glass-panel">
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="nav-icon">🐼</span>
          <span className="nav-label">ホーム</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          <span className="nav-icon">🎮</span>
          <span className="nav-label">クイズ</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'cards' ? 'active' : ''}`}
          onClick={() => setActiveTab('cards')}
        >
          <span className="nav-icon">🎴</span>
          <span className="nav-label">カード</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'shop' ? 'active' : ''}`}
          onClick={() => setActiveTab('shop')}
        >
          <span className="nav-icon">👕</span>
          <span className="nav-label">ショップ</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          <span className="nav-icon">🏆</span>
          <span className="nav-label">バッジ</span>
        </button>
      </nav>

      {/* レベルアップモーダル */}
      {showLevelUpModal && (
        <div className="modal-overlay">
          <div className="level-up-modal glass-panel text-center animate-bounce-subtle">
            <h2>✨ LEVEL UP! ✨</h2>
            <div className="level-badge-large">
              <span>Lv.{prevLevel} ➔ Lv.{level}</span>
            </div>
            <p className="level-up-msg">おめでとうございます！パンちゃんもさらに賢くなりました！</p>
            <p className="level-up-reward">🎁 レベルアップボーナス: 🪙 +20 コイン</p>
            <button 
              className="btn-primary" 
              onClick={() => {
                setCoins((prev) => prev + 20);
                setShowLevelUpModal(false);
              }}
            >
              うれしい！
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
