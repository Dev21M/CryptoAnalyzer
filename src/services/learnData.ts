/**
 * Learn Crypto Educational Curriculum, Searchable Glossary, and Interactive Quizzes
 * Includes English & optional Hindi explanations for beginner accessibility
 */

import { GlossaryTerm, QuizQuestion } from '../types/crypto';

export interface LearnLesson {
  id: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  title: string;
  hindiTitle: string;
  duration: string;
  summary: string;
  hindiSummary: string;
  sections: {
    heading: string;
    hindiHeading?: string;
    body: string;
    hindiBody?: string;
  }[];
}

export const LEARN_LESSONS: LearnLesson[] = [
  {
    id: 'lesson-1',
    level: 'Beginner',
    title: 'What is Cryptocurrency?',
    hindiTitle: 'क्रिप्टोकरेंसी क्या है?',
    duration: '5 min read',
    summary: 'A foundational introduction to digital, cryptographic money operating without central authorities.',
    hindiSummary: 'डिजिटल और क्रिप्टोग्राफिक मुद्रा का परिचय जो बिना किसी केंद्रीय बैंक के संचालित होती है।',
    sections: [
      {
        heading: '1. The Core Concept',
        hindiHeading: '1. मुख्य अवधारणा',
        body: 'A cryptocurrency is digital or virtual currency that is secured by cryptography, making it nearly impossible to counterfeit or double-spend. Unlike traditional fiat currencies issued by governments (such as the US Dollar or Indian Rupee), most cryptocurrencies operate on decentralized networks based on blockchain technology.',
        hindiBody: 'क्रिप्टोकरेंसी एक डिजिटल या आभासी मुद्रा है जो क्रिप्टोग्राफी द्वारा सुरक्षित होती है। यह पारंपरिक मुद्राओं जैसे रुपया या डॉलर से अलग होती है क्योंकि इसे कोई सरकार या केंद्रीय बैंक नियंत्रित नहीं करता है।',
      },
      {
        heading: '2. Why Decentralization Matters',
        hindiHeading: '2. विकेंद्रीकरण (Decentralization) क्यों महत्वपूर्ण है?',
        body: 'Decentralization means no single entity (like a commercial bank or tech conglomerate) controls the network. Transactions are verified by a distributed network of computers (nodes) around the world, ensuring transparent and censorship-resistant transfers.',
        hindiBody: 'विकेंद्रीकरण का अर्थ है कि किसी एक कंपनी या बैंक का नियंत्रण नहीं होता। दुनिया भर के कंप्यूटर नेटवर्क (नोड्स) मिलकर लेन-देन का सत्यापन करते हैं।',
      },
      {
        heading: '3. What Gives Crypto Value?',
        hindiHeading: '3. क्रिप्टोकरेंसी को मूल्य कहाँ से मिलता है?',
        body: 'Cryptocurrency value is determined by open market supply and demand, utility, scarcity (like Bitcoin’s 21M hard cap), network adoption, and technological trust, just like gold or fiat currency.',
        hindiBody: 'क्रिप्टो का मूल्य बाजार की मांग और आपूर्ति, उपयोगिता और इसकी सीमित संख्या (जैसे बिटकॉइन केवल 2.1 करोड़ ही बन सकते हैं) से तय होता है।',
      },
    ],
  },
  {
    id: 'lesson-2',
    level: 'Beginner',
    title: 'What is Bitcoin (BTC)?',
    hindiTitle: 'बिटकॉइन क्या है?',
    duration: '6 min read',
    summary: 'The original digital currency created in 2008 by Satoshi Nakamoto.',
    hindiSummary: '2008 में सातोशी नाकामोतो द्वारा बनाई गई पहली डिजिटल मुद्रा।',
    sections: [
      {
        heading: '1. The Birth of Bitcoin',
        hindiHeading: '1. बिटकॉइन का जन्म',
        body: 'Bitcoin was introduced in a 2008 whitepaper titled "Bitcoin: A Peer-to-Peer Electronic Cash System" by a pseudonymous developer named Satoshi Nakamoto. It was designed in response to the 2008 global banking crisis as a trustless, borderless alternative to government-manipulated money.',
        hindiBody: 'बिटकॉइन की शुरुआत 2008 के वित्तीय संकट के दौरान हुई थी। इसे बिना किसी बैंक या बिचौलिए के सीधे एक व्यक्ति से दूसरे व्यक्ति को भेजने के लिए बनाया गया था।',
      },
      {
        heading: '2. Digital Gold & Scarcity',
        hindiHeading: '2. डिजिटल सोना और सीमित आपूर्ति',
        body: 'Bitcoin has a mathematically capped total supply of 21,000,000 coins. New bitcoins are minted through "mining" at an automatically halving rate every 4 years. This programmatic scarcity makes Bitcoin widely recognized as "Digital Gold".',
        hindiBody: 'बिटकॉइन की कुल सीमा केवल 21 मिलियन (2.1 करोड़) है। हर चार साल में नए बिटकॉइन बनने की गति आधी (Halving) हो जाती है। इसीलिए इसे डिजिटल सोना भी कहा जाता है।',
      },
    ],
  },
  {
    id: 'lesson-3',
    level: 'Beginner',
    title: 'What is Ethereum & Smart Contracts?',
    hindiTitle: 'एथेरियम और स्मार्ट कॉन्ट्रैक्ट्स क्या हैं?',
    duration: '7 min read',
    summary: 'The programmable global computer that powers DeFi, NFTs, and Web3 applications.',
    hindiSummary: 'एक प्रोग्राम करने योग्य वैश्विक कंप्यूटर जो डीफाई और वेब3 को शक्ति प्रदान करता है।',
    sections: [
      {
        heading: '1. Beyond Digital Cash',
        hindiHeading: '1. केवल मुद्रा से आगे',
        body: 'While Bitcoin was built as money, Ethereum was conceived in 2013 by Vitalik Buterin as a decentralized world computer capable of running self-executing code called "smart contracts".',
        hindiBody: 'जहाँ बिटकॉइन डिजिटल पैसे के रूप में बना, वहीं विटालिक बुटेरिन ने एथेरियम को एक विकेंद्रीकृत कंप्यूटर के रूप में बनाया जिस पर कोड और ऍप्लिकेशन्स चल सकते हैं।',
      },
      {
        heading: '2. Smart Contracts Explained',
        hindiHeading: '2. स्मार्ट कॉन्ट्रैक्ट्स क्या होते हैं?',
        body: 'A smart contract is an immutable program stored on the blockchain that automatically executes when predetermined terms and conditions are satisfied, without relying on human intermediaries.',
        hindiBody: 'स्मार्ट कॉन्ट्रैक्ट ऐसे कंप्यूटर प्रोग्राम होते हैं जो शर्तें पूरी होने पर अपने आप काम करते हैं, जैसे कि बिना किसी बैंक के ऋण देना या टोकन स्वैप करना।',
      },
    ],
  },
  {
    id: 'lesson-4',
    level: 'Intermediate',
    title: 'Understanding RSI, MACD & Moving Averages',
    hindiTitle: 'RSI, MACD और मूविंग एवरेज को समझना',
    duration: '8 min read',
    summary: 'Demystifying the most widely used technical indicators for trend and momentum analysis.',
    hindiSummary: 'रुझान और गति का विश्लेषण करने के लिए प्रमुख तकनीकी संकेतकों को सरल भाषा में समझें।',
    sections: [
      {
        heading: '1. Relative Strength Index (RSI)',
        hindiHeading: '1. रिलेटिव स्ट्रेंथ इंडेक्स (RSI)',
        body: 'RSI measures the speed of price movements between 0 and 100. Over 70 indicates heavy buying pressure (potentially overbought/overextended), while below 30 reflects strong selling pressure (potentially oversold/discounted).',
        hindiBody: 'RSI 0 से 100 के बीच गति मापता है। 70 से ऊपर का मतलब है अत्यधिक खरीदारी (Overbought) और 30 से नीचे का मतलब अत्यधिक बिकवाली (Oversold)।',
      },
      {
        heading: '2. Moving Average Convergence Divergence (MACD)',
        hindiHeading: '2. MACD इंडिकेटर',
        body: 'MACD tracks the relationship between two exponential moving averages (typically 12 and 26 periods). A crossover of the MACD line above the signal line indicates positive bullish momentum, while crossing below indicates bearish momentum.',
        hindiBody: 'MACD दो मूविंग एवरेज के बीच के अंतर को दर्शाता है। जब MACD लाइन सिग्नल लाइन को ऊपर पार करती है, तो यह तेजी (Bullish) का संकेत देती है।',
      },
    ],
  },
  {
    id: 'lesson-5',
    level: 'Advanced',
    title: 'Risk Management & Position Sizing',
    hindiTitle: 'जोखिम प्रबंधन और पोजीशन साइजिंग',
    duration: '10 min read',
    summary: 'The single most important discipline that separates professional investors from gamblers.',
    hindiSummary: 'सबसे महत्वपूर्ण वित्तीय अनुशासन जो पेशेवर निवेशकों को नुकसान से बचाता है।',
    sections: [
      {
        heading: '1. The 1-2% Capital Rule',
        hindiHeading: '1. 1-2% पूंजी नियम',
        body: 'Never risk more than 1% to 2% of your total portfolio on any single trade or position. Even in high-conviction ideas, unpredictable market black-swan events can wipe out reckless over-leveraged accounts.',
        hindiBody: 'कभी भी किसी एक ट्रेड में अपनी कुल पूंजी का 1% से 2% से अधिक जोखिम में न डालें। बाजार की अप्रत्याशित गिरावट से बचने का यह अचूक तरीका है।',
      },
      {
        heading: '2. Dollar-Cost Averaging (DCA)',
        hindiHeading: '2. डॉलर-कॉस्ट एवरेजिंग (DCA)',
        body: 'Instead of trying to time market tops and bottoms, DCA involves investing a fixed dollar amount at recurring intervals (daily, weekly, monthly). This mathematically lowers your average purchase price during volatile drawdowns.',
        hindiBody: 'मार्केट को टाइम करने की कोशिश करने के बजाय, हर हफ्ते या महीने एक तय राशि निवेश करना (DCA) आपकी खरीद लागत को संतुलित रखता है।',
      },
    ],
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'g-1',
    term: 'Market Capitalization',
    category: 'Fundamentals',
    definition: 'The total value of all circulating coins of a cryptocurrency, calculated by multiplying current price by circulating supply.',
    hindiDefinition: 'किसी क्रिप्टोकरेंसी के सभी सिक्कों का कुल बाजार मूल्य, जो मौजूदा कीमत और प्रचलन में मौजूद सिक्कों की संख्या को गुणा करके निकाला जाता है।',
    example: 'Bitcoin Price ($77,000) × 19.7M coins = ~$1.5 Trillion Market Cap.',
  },
  {
    id: 'g-2',
    term: 'Circulating Supply',
    category: 'Fundamentals',
    definition: 'The number of cryptocurrency tokens that are currently available to the public and circulating in the market.',
    hindiDefinition: 'क्रिप्टोकरेंसी के वे सिक्के जो वर्तमान में बाजार में सार्वजनिक रूप से खरीदने और बेचने के लिए उपलब्ध हैं।',
    example: 'Bitcoin has ~19.8M circulating out of 21M total maximum.',
  },
  {
    id: 'g-3',
    term: 'Bull Market',
    category: 'Trading',
    definition: 'A prolonged market condition characterized by rising prices, high investor confidence, and sustained buying momentum.',
    hindiDefinition: 'बाजार की वह स्थिति जब कीमतें लगातार बढ़ती हैं और निवेशकों में सकारात्मक उत्साह होता है।',
    example: 'During a bull market, top cryptocurrencies frequently break all-time high price records.',
  },
  {
    id: 'g-4',
    term: 'Bear Market',
    category: 'Trading',
    definition: 'A prolonged market downturn where cryptocurrency prices decline 20% or more from recent peaks, accompanied by widespread negative sentiment.',
    hindiDefinition: 'बाजार की वह स्थिति जब कीमतें लगातार गिरती हैं और बिकवाली का दबाव अधिक होता है।',
    example: 'The 2022 crypto winter saw prices correct 70%+ across the sector.',
  },
  {
    id: 'g-5',
    term: 'RSI (Relative Strength Index)',
    category: 'Technical Analysis',
    definition: 'A momentum oscillator that measures the magnitude of recent price changes on a scale of 0 to 100 to evaluate overbought or oversold conditions.',
    hindiDefinition: '0 से 100 के पैमाने पर चलने वाला एक गति संकेतक जो बताता है कि कोई सिक्का बहुत अधिक खरीदा या बेचा गया है।',
    example: 'An RSI of 78 signals overbought momentum, whereas 25 suggests oversold conditions.',
  },
  {
    id: 'g-6',
    term: 'Support Level',
    category: 'Technical Analysis',
    definition: 'A price level where a downtrend is expected to pause or reverse due to a concentration of buy orders (demand).',
    hindiDefinition: 'वह निचला मूल्य स्तर जहाँ खरीदार सक्रिय होते हैं और कीमत को और नीचे गिरने से रोकते हैं।',
    example: 'Bitcoin found strong support around the $75,000 psychological level.',
  },
  {
    id: 'g-7',
    term: 'Resistance Level',
    category: 'Technical Analysis',
    definition: 'A price ceiling where upward price momentum is expected to face strong selling pressure (supply).',
    hindiDefinition: 'वह ऊपरी मूल्य स्तर जहाँ बिकवाली का दबाव आने से कीमत का ऊपर बढ़ना रुक सकता है।',
    example: 'Ethereum faced technical resistance when attempting to break $2,400.',
  },
  {
    id: 'g-8',
    term: 'Dollar Cost Averaging (DCA)',
    category: 'Trading',
    definition: 'An investment strategy of allocating fixed dollar amounts into an asset on a recurring schedule regardless of price.',
    hindiDefinition: 'नियमित अंतराल (जैसे हर महीने) पर एक निश्चित राशि निवेश करने की रणनीति, चाहे उस समय बाजार ऊपर हो या नीचे।',
    example: 'Buying $50 of Bitcoin every Monday morning for 2 years.',
  },
  {
    id: 'g-9',
    term: 'DeFi (Decentralized Finance)',
    category: 'DeFi',
    definition: 'Financial services (lending, borrowing, trading) built on public blockchains using smart contracts with no centralized intermediaries.',
    hindiDefinition: 'ब्लॉकचेन पर आधारित वित्तीय सेवाएं जो बिना किसी बैंक या कंपनी के सीधे कोड द्वारा संचालित होती हैं।',
    example: 'Uniswap enables peer-to-peer cryptocurrency swapping with automated liquidity pools.',
  },
  {
    id: 'g-10',
    term: 'Cold Wallet (Hardware Wallet)',
    category: 'Security',
    definition: 'A physical cryptographic storage device that keeps private keys completely offline and isolated from internet connectivity.',
    hindiDefinition: 'एक भौतिक उपकरण (पेनड्राइव जैसा) जो आपकी निजी चाबियों को इंटरनेट से दूर ऑफलाइन सुरक्षित रखता है।',
    example: 'Ledger or Trezor hardware wallets used for long-term secure holding.',
  },
  {
    id: 'g-11',
    term: 'Gas Fee',
    category: 'Blockchain',
    definition: 'A fee paid to network validators or miners to process and confirm transactions on a blockchain like Ethereum.',
    hindiDefinition: 'ब्लॉकचेन नेटवर्क पर लेन-देन को पूरा करने और सत्यापित करने के लिए दिया जाने वाला नेटवर्क शुल्क।',
    example: 'Paying a small ETH fee to interact with a decentralized exchange contract.',
  },
  {
    id: 'g-12',
    term: 'Halving',
    category: 'Fundamentals',
    definition: 'An event occurring every 210,000 blocks (roughly 4 years) in Bitcoin where the mining reward per block is cut in half.',
    hindiDefinition: 'बिटकॉइन में हर 4 साल में होने वाली घटना जिसमें नए बनने वाले बिटकॉइन की संख्या आधी कर दी जाती है।',
    example: 'In April 2024, Bitcoin block rewards dropped from 6.25 BTC to 3.125 BTC.',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    difficulty: 'Beginner',
    question: 'What is the mathematically capped maximum total supply of Bitcoin (BTC)?',
    hindiQuestion: 'बिटकॉइन (BTC) की कुल अधिकतम आपूर्ति कितनी सीमित है?',
    options: ['10 Million', '21 Million', '100 Million', 'Unlimited'],
    hindiOptions: ['10 मिलियन (1 करोड़)', '21 मिलियन (2.1 करोड़)', '100 मिलियन (10 करोड़)', 'असीमित'],
    correctIndex: 1,
    explanation: 'Bitcoin was coded by Satoshi Nakamoto with a strict supply cap of 21,000,000 coins to prevent inflationary debasement.',
    hindiExplanation: 'बिटकॉइन को केवल 21 मिलियन सिक्कों तक सीमित रखा गया है ताकि इसमें मुद्रास्फीति से नुकसान न हो।',
  },
  {
    id: 'q-2',
    difficulty: 'Beginner',
    question: 'What is the primary difference between Bitcoin and Ethereum?',
    hindiQuestion: 'बिटकॉइन और एथेरियम के बीच मुख्य अंतर क्या है?',
    options: [
      'Bitcoin is faster than Ethereum',
      'Ethereum is designed as a programmable world computer for smart contracts, while Bitcoin focuses on digital money/gold',
      'Ethereum is completely centralized',
      'Bitcoin was created after Ethereum',
    ],
    hindiOptions: [
      'बिटकॉइन एथेरियम से तेज है',
      'एथेरियम स्मार्ट कॉन्ट्रैक्ट्स चलाने वाला प्रोग्रामेबल कंप्यूटर है, जबकि बिटकॉइन डिजिटल सोने के रूप में कार्य करता है',
      'एथेरियम पूरी तरह केंद्रीकृत है',
      'बिटकॉइन एथेरियम के बाद बनाया गया था',
    ],
    correctIndex: 1,
    explanation: 'Ethereum introduced Turing-complete smart contracts allowing developers to build decentralized applications (dApps), while Bitcoin is optimized as secure digital money.',
    hindiExplanation: 'एथेरियम स्मार्ट कॉन्ट्रैक्ट्स और डीसेंट्रलाइज्ड ऍप्लिकेशन्स चलाने के लिए बनाया गया है।',
  },
  {
    id: 'q-3',
    difficulty: 'Intermediate',
    question: 'If a coin’s 14-period RSI indicator reaches 78, what does this technically suggest?',
    hindiQuestion: 'यदि किसी सिक्के का 14-दिवसीय RSI 78 तक पहुँच जाता है, तो इसका क्या अर्थ है?',
    options: [
      'The asset is completely dead',
      'Buying pressure is strong and the asset may be approaching overbought conditions',
      'The price is guaranteed to double tomorrow',
      'The coin has zero circulating supply',
    ],
    hindiOptions: [
      'सिक्का पूरी तरह बेकार हो गया है',
      'खरीदारी का दबाव मजबूत है और सिक्का ओवरबॉट (Overbought) स्थिति के करीब हो सकता है',
      'कीमत कल दोगुनी होने की गारंटी है',
      'सिक्के की कोई आपूर्ति नहीं है',
    ],
    correctIndex: 1,
    explanation: 'An RSI above 70 indicates substantial recent gains and high buying intensity, suggesting the asset could be due for consolidation or a pullback.',
    hindiExplanation: 'RSI का 70 से ऊपर होना बताता है कि खरीदारी बहुत तेज रही है और भाव थोड़ा सुस्ता सकता है।',
  },
  {
    id: 'q-4',
    difficulty: 'Intermediate',
    question: 'What is the main benefit of Dollar-Cost Averaging (DCA)?',
    hindiQuestion: 'डॉलर-कॉस्ट एवरेजिंग (DCA) का सबसे बड़ा लाभ क्या है?',
    options: [
      'It guarantees you will always buy at the exact lowest bottom',
      'It eliminates trading fees on all exchanges',
      'It reduces timing risk and emotional stress by averaging purchase prices across cycles',
      'It increases your maximum leverage to 100x',
    ],
    hindiOptions: [
      'यह गारंटी देता है कि आप हमेशा सबसे निचले स्तर पर ही खरीदेंगे',
      'यह सभी एक्सचेंजों पर फीस समाप्त कर देता है',
      'यह बाजार के उतार-चढ़ाव में औसत लागत कम करके भावनाओं और समय के जोखिम को घटाता है',
      'यह आपके लेवरेज को 100 गुना बढ़ा देता है',
    ],
    correctIndex: 2,
    explanation: 'DCA spreads purchases over regular time intervals, smoothing out price volatility and removing the psychological temptation to time volatile markets.',
    hindiExplanation: 'नियमित अंतराल पर तय राशि लगाने से उतार-चढ़ाव का तनाव कम होता है और खरीद मूल्य संतुलित रहता है।',
  },
  {
    id: 'q-5',
    difficulty: 'Advanced',
    question: 'Why should sound risk management recommend risking only 1% to 2% of total capital per trade?',
    hindiQuestion: 'पेशेवर जोखिम प्रबंधन में प्रति ट्रेड केवल 1% से 2% पूंजी का जोखिम लेने की सलाह क्यों दी जाती है?',
    options: [
      'To prevent drawdowns and survive consecutive losing streaks without catastrophic capital destruction',
      'Because exchanges do not allow trades larger than 2%',
      'To ensure profits are kept artificially small',
      'Because all cryptocurrencies have fixed volatility',
    ],
    hindiOptions: [
      'ताकि लगातार घाटे के दौर में भी पूंजी बची रहे और खाता कभी खाली न हो',
      'क्योंकि एक्सचेंज 2% से बड़े ट्रेड की अनुमति नहीं देते',
      'ताकि मुनाफा जानबूझकर कम रहे',
      'क्योंकि सभी क्रिप्टो की अस्थिरता निश्चित होती है',
    ],
    correctIndex: 0,
    explanation: 'Limiting risk to 1-2% ensures that even a rare string of 10 consecutive stop-outs leaves over 80-90% of your trading capital intact, enabling mathematical long-term survival.',
    hindiExplanation: '1-2% का नियम यह सुनिश्चित करता है कि लगातार गलत ट्रेड होने पर भी निवेशक का बैंक खाता सुरक्षित रहे।',
  },
];
