import React from 'react';
import './Shop.css';
import pandaImg from '../assets/panda_character.png';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: 'hat' | 'glasses' | 'accessory';
}

const shopItemsData: ShopItem[] = [
  { id: 'red-hat', name: '赤い帽子', description: 'おしゃれで暖かいウールの帽子。', price: 30, icon: '🔴', category: 'hat' },
  { id: 'crown', name: 'ゴールドクラウン', description: '最高レベルの学習者にふさわしい王冠。', price: 100, icon: '👑', category: 'hat' },
  { id: 'glasses', name: '青い丸メガネ', description: 'インテリ風の知的なメガネ。', price: 20, icon: '👓', category: 'glasses' },
  { id: 'sunglasses', name: 'サングラス', description: 'ワイルドでかっこいい黒サングラス。', price: 50, icon: '🕶️', category: 'glasses' },
  { id: 'bowtie', name: '蝶ネクタイ (桃)', description: 'フォーマルなピンクの蝶ネクタイ。', price: 15, icon: '🎀', category: 'accessory' },
  { id: 'bowtie-blue', name: '蝶ネクタイ (青)', description: 'さわやかなブルーの蝶ネクタイ。', price: 15, icon: '🎀', category: 'accessory' },
  { id: 'bowtie-yellow', name: '蝶ネクタイ (黄)', description: '元気なイエローの蝶ネクタイ。', price: 15, icon: '🎀', category: 'accessory' },
  { id: 'bowtie-red', name: '蝶ネクタイ (赤)', description: '情熱的なレッドの蝶ネクタイ。', price: 15, icon: '🎀', category: 'accessory' },
  { id: 'bamboo', name: 'おやつの竹', description: 'パンちゃんが大好きな新鮮な竹。', price: 10, icon: '🎋', category: 'accessory' }
];

interface ShopProps {
  coins: number;
  purchasedItems: string[];
  equippedItems: string[];
  onBuyItem: (itemId: string, price: number) => void;
  onEquipItem: (itemId: string) => void;
  onUnequipItem: (itemId: string) => void;
}

export const Shop: React.FC<ShopProps> = ({
  coins,
  purchasedItems,
  equippedItems,
  onBuyItem,
  onEquipItem,
  onUnequipItem,
}) => {

  const handleItemAction = (item: ShopItem) => {
    const isPurchased = purchasedItems.includes(item.id);
    const isEquipped = equippedItems.includes(item.id);

    if (!isPurchased) {
      if (coins >= item.price) {
        onBuyItem(item.id, item.price);
      } else {
        alert('パンダコインが足りません！クイズやカードで貯めましょう。');
      }
    } else {
      if (isEquipped) {
        onUnequipItem(item.id);
      } else {
        onEquipItem(item.id);
      }
    }
  };

  return (
    <div className="shop-container">
      {/* プレビューとコイン情報 */}
      <div className="shop-header glass-panel">
        <div className="shop-info">
          <h2>🐼 パンちゃんのクローゼット</h2>
          <p>コインを使ってパンちゃんをおしゃれにコーディネートしましょう！</p>
          <div className="shop-coin-display">
            <span className="coin-large-icon">🪙</span>
            <span className="coin-large-value">{coins}</span>
            <span className="coin-large-lbl">所持コイン</span>
          </div>
        </div>

        {/* リアルタイムプレビューパンダ */}
        <div className="shop-preview">
          <img src={pandaImg} alt="パンちゃん" className="panda-char-img" />

          {/* 着せ替えレイヤー */}
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
            let gradId = 'bowtieGrad-pink-shop';

            if (equippedBowtie === 'bowtie-blue') {
              color1 = '#60a5fa';
              color2 = '#3b82f6';
              strokeColor = '#1d4ed8';
              shadowColor = '#1e3a8a';
              gradId = 'bowtieGrad-blue-shop';
            } else if (equippedBowtie === 'bowtie-yellow') {
              color1 = '#fcd34d';
              color2 = '#f59e0b';
              strokeColor = '#b45309';
              shadowColor = '#78350f';
              gradId = 'bowtieGrad-yellow-shop';
            } else if (equippedBowtie === 'bowtie-red') {
              color1 = '#f87171';
              color2 = '#dc2626';
              strokeColor = '#991b1b';
              shadowColor = '#7f1d1d';
              gradId = 'bowtieGrad-red-shop';
            }

            return (
              <div className="accessory-layer bowtie-layer">
                <svg viewBox="0 0 60 30" className="accessory-svg">
                  <defs>
                    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={color1} />
                      <stop offset="100%" stopColor={color2} />
                    </linearGradient>
                    <linearGradient id="bowtieCenterGradShop" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#f1f5f9" />
                    </linearGradient>
                  </defs>
                  <path d="M 27 15 C 13 4, 3 8, 3 15 C 3 22, 13 26, 27 15 Z" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="2.5" />
                  <path d="M 33 15 C 47 4, 57 8, 57 15 C 57 22, 47 26, 33 15 Z" fill={`url(#${gradId})`} stroke={strokeColor} strokeWidth="2.5" />
                  <path d="M 10 13 Q 18 15 24 15" fill="none" stroke={shadowColor} strokeWidth="2" strokeLinecap="round" />
                  <path d="M 50 13 Q 42 15 36 15" fill="none" stroke={shadowColor} strokeWidth="2" strokeLinecap="round" />
                  <circle cx="30" cy="15" r="7" fill="url(#bowtieCenterGradShop)" stroke={strokeColor} strokeWidth="2.5" />
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
      </div>

      {/* アイテムグリッド */}
      <div className="shop-grid">
        {shopItemsData.map((item) => {
          const isPurchased = purchasedItems.includes(item.id);
          const isEquipped = equippedItems.includes(item.id);
          const canAfford = coins >= item.price;

          let btnClass = 'btn-secondary';
          let btnText = `🪙 ${item.price} で購入`;

          if (isPurchased) {
            if (isEquipped) {
              btnClass = 'btn-accent';
              btnText = 'はずす';
            } else {
              btnClass = 'btn-primary';
              btnText = '装備する';
            }
          } else if (!canAfford) {
            btnClass = 'btn-disabled-shop';
          }

          return (
            <div key={item.id} className={`shop-item-card glass-panel ${isEquipped ? 'equipped' : ''}`}>
              <div className="shop-item-icon">{item.icon}</div>
              <div className="shop-item-details">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <button 
                className={`shop-action-btn ${btnClass}`}
                onClick={() => handleItemAction(item)}
              >
                {btnText}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
