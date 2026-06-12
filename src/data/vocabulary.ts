export interface VocabularyItem {
  id: string;
  chinese: string;
  pinyin: string;
  translation: string;
  tone: 1 | 2 | 3 | 4 | 5; // 5 for neutral
  category: 'greeting' | 'food' | 'numbers' | 'travel' | 'conversation';
  example: {
    chinese: string;
    pinyin: string;
    translation: string;
  };
}

export const vocabularyData: VocabularyItem[] = [
  {
    id: '1',
    chinese: '你好',
    pinyin: 'nǐ hǎo',
    translation: 'こんにちは',
    tone: 3, // 3声 + 3声 (一般的に代表して3)
    category: 'greeting',
    example: {
      chinese: '你好！很高兴认识你。',
      pinyin: 'Nǐ hǎo! Hěn gāoxìng rènshi nǐ.',
      translation: 'こんにちは！お会いできて嬉しいです。'
    }
  },
  {
    id: '2',
    chinese: '谢谢',
    pinyin: 'xièxie',
    translation: 'ありがとう',
    tone: 4, // 4声 + 軽声
    category: 'greeting',
    example: {
      chinese: '谢谢你的帮助。',
      pinyin: 'Xièxie nǐ de bāngzhù.',
      translation: '助けてくれてありがとう。'
    }
  },
  {
    id: '3',
    chinese: '再见',
    pinyin: 'zàijiàn',
    translation: 'さようなら',
    tone: 4,
    category: 'greeting',
    example: {
      chinese: '明天再见！',
      pinyin: 'Míngtiān zàijiàn!',
      translation: 'また明日さようなら！'
    }
  },
  {
    id: '4',
    chinese: '好吃',
    pinyin: 'hǎochī',
    translation: '美味しい',
    tone: 3,
    category: 'food',
    example: {
      chinese: '这个小笼包真好吃！',
      pinyin: 'Zhège xiǎolóngbāo zhēn hǎochī!',
      translation: 'この小籠包は本当に美味しい！'
    }
  },
  {
    id: '5',
    chinese: '多少钱',
    pinyin: 'duōshao qián',
    translation: 'いくらですか？',
    tone: 2,
    category: 'travel',
    example: {
      chinese: '老板，这个多少钱？',
      pinyin: 'Lǎobǎn, zhège duōshao qián?',
      translation: 'すみません、これはいくらですか？'
    }
  },
  {
    id: '6',
    chinese: '我',
    pinyin: 'wǒ',
    translation: '私',
    tone: 3,
    category: 'conversation',
    example: {
      chinese: '我是日本人。',
      pinyin: 'Wǒ shì Rìběnrén.',
      translation: '私は日本人です。'
    }
  },
  {
    id: '7',
    chinese: '喜欢',
    pinyin: 'xǐhuan',
    translation: '好き',
    tone: 3,
    category: 'conversation',
    example: {
      chinese: '我喜欢吃中国菜。',
      pinyin: 'Wǒ xǐhuan chī Zhōngguócài.',
      translation: '私は中華料理を食べるのが好きです。'
    }
  },
  {
    id: '8',
    chinese: '不客气',
    pinyin: 'bú kèqi',
    translation: 'どういたしまして',
    tone: 4,
    category: 'greeting',
    example: {
      chinese: '不用谢，不客气。',
      pinyin: 'Búyòngxiè, bú kèqi.',
      translation: 'お礼には及びません、どういたしまして。'
    }
  },
  {
    id: '9',
    chinese: '茶',
    pinyin: 'chá',
    translation: 'お茶',
    tone: 2,
    category: 'food',
    example: {
      chinese: '我想喝热茶。',
      pinyin: 'Wǒ xiǎng hē rè chá.',
      translation: '温かいお茶が飲みたいです。'
    }
  },
  {
    id: '10',
    chinese: '猫',
    pinyin: 'māo',
    translation: '猫',
    tone: 1,
    category: 'conversation',
    example: {
      chinese: '那只猫非常可爱。',
      pinyin: 'Nà zhī māo fēicháng kě\'ài.',
      translation: 'あの猫はとても可愛いです。'
    }
  }
];

export interface QuizQuestion {
  id: string;
  type: 'pinyin' | 'translation' | 'tone' | 'arrange';
  chinese: string;
  question: string;
  options: string[];
  correctAnswer: string;
  audioText: string;
  hint?: string;
  arrangeWords?: string[]; // for 'arrange' quiz type
}

export const generateQuizQuestions = (): QuizQuestion[] => {
  // シャッフル用ヘルパー
  const shuffle = <T>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const questions: QuizQuestion[] = [];

  vocabularyData.forEach((item) => {
    // 1. ピンインあてクイズ
    const incorrectPinyins = vocabularyData
      .filter((v) => v.id !== item.id)
      .map((v) => v.pinyin);
    const pinyinOptions = shuffle([item.pinyin, ...incorrectPinyins.slice(0, 3)]);
    
    questions.push({
      id: `pinyin-${item.id}`,
      type: 'pinyin',
      chinese: item.chinese,
      question: `「${item.chinese}」の正しいピンインを選んでください。`,
      options: pinyinOptions,
      correctAnswer: item.pinyin,
      audioText: item.chinese,
      hint: `意味は「${item.translation}」です。`
    });

    // 2. 意味あてクイズ
    const incorrectTranslations = vocabularyData
      .filter((v) => v.id !== item.id)
      .map((v) => v.translation);
    const transOptions = shuffle([item.translation, ...incorrectTranslations.slice(0, 3)]);

    questions.push({
      id: `trans-${item.id}`,
      type: 'translation',
      chinese: item.chinese,
      question: `「${item.chinese}」(${item.pinyin}) の日本語訳を選んでください。`,
      options: transOptions,
      correctAnswer: item.translation,
      audioText: item.chinese
    });

    // 3. 声調あてクイズ
    if (item.tone >= 1 && item.tone <= 4) {
      questions.push({
        id: `tone-${item.id}`,
        type: 'tone',
        chinese: item.chinese,
        question: `「${item.chinese}」の最初の漢字（または主な音節）の正しい声調を選んでください。`,
        options: ['第一声 (ˉ)', '第二声 (ˊ)', '第三声 (ˇ)', '第四声 (ˋ)'],
        correctAnswer: ['第一声 (ˉ)', '第二声 (ˊ)', '第三声 (ˇ)', '第四声 (ˋ)'][item.tone - 1],
        audioText: item.chinese,
        hint: `ピンイン表記は「${item.pinyin}」です。`
      });
    }

    // 4. 並べ替えクイズ (一部の項目のみ)
    if (item.example) {
      // 簡易的な文章分割 (スペースなどで区切る)
      // 例: "我是日本人" -> ["我", "是", "日本人"]
      // 例データに基づく固定の並べ替え
      let arrangeWords: string[] = [];
      let answer = '';
      
      if (item.id === '1') {
        arrangeWords = ['你好！', '很高兴', '认识你。'];
        answer = '你好！很高兴认识你。';
      } else if (item.id === '4') {
        arrangeWords = ['这个', '小笼包', '真好吃！'];
        answer = '这个小笼包真好吃！';
      } else if (item.id === '6') {
        arrangeWords = ['我', '是', '日本人。'];
        answer = '我是日本人。';
      }

      if (arrangeWords.length > 0) {
        questions.push({
          id: `arrange-${item.id}`,
          type: 'arrange',
          chinese: item.chinese,
          question: `次の単語を正しく並べ替えて、「${item.example.translation}」という文章を作ってください。`,
          options: [], // arrange のため options は不使用
          arrangeWords: shuffle(arrangeWords),
          correctAnswer: answer,
          audioText: item.example.chinese
        });
      }
    }
  });

  return shuffle(questions);
};
