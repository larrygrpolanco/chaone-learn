import type { VocabularyEntry } from "@/lib/types";

/**
 * Vocabulary introduced in Beginning 1, Lesson 2 — Korean Language Class / 한국어 수업
 */

export const vocabulary: VocabularyEntry[] = [
  // Nouns
  { slug: "doseogwan", korean: "도서관", english: ["library"], partOfSpeech: "noun" },
  { slug: "sueop", korean: "수업", english: ["course", "class"], partOfSpeech: "noun" },
  { slug: "sukje", korean: "숙제", english: ["homework"], partOfSpeech: "noun" },
  { slug: "sigdang", korean: "식당", english: ["restaurant", "cafeteria"], partOfSpeech: "noun" },
  { slug: "achim", korean: "아침", english: ["breakfast", "morning"], partOfSpeech: "noun" },
  { slug: "chingu", korean: "친구", english: ["friend"], partOfSpeech: "noun" },
  { slug: "keopi", korean: "커피", english: ["coffee"], partOfSpeech: "noun" },
  { slug: "hakgyo", korean: "학교", english: ["school"], partOfSpeech: "noun" },
  { slug: "namja", korean: "남자", english: ["man"], partOfSpeech: "noun" },
  { slug: "naeil", korean: "내일", english: ["tomorrow"], partOfSpeech: "noun" },
  { slug: "siheom", korean: "시험", english: ["test", "exam"], partOfSpeech: "noun" },
  { slug: "yeoksa", korean: "역사", english: ["history"], partOfSpeech: "noun" },
  { slug: "oneul", korean: "오늘", english: ["today"], partOfSpeech: "noun" },
  { slug: "eumsik", korean: "음식", english: ["food"], partOfSpeech: "noun" },
  { slug: "juseu", korean: "주스", english: ["juice"], partOfSpeech: "noun" },
  { slug: "tellebijyeon", korean: "텔레비전", english: ["television"], partOfSpeech: "noun" },

  // Verbs
  { slug: "meokda", korean: "먹다", english: ["to eat"], partOfSpeech: "verb" },
  { slug: "anjda", korean: "앉다", english: ["to sit"], partOfSpeech: "verb" },
  { slug: "alda", korean: "알다", english: ["to know"], partOfSpeech: "verb" },
  {
    slug: "gongbu-hada",
    korean: "공부(하다)",
    english: ["to study"],
    partOfSpeech: "verb",
    inflectionNotes: "하다 verb: 공부하 + 여요 → 공부해요 ( contraction: 하 + 여 → 해)",
  },
  { slug: "mannada", korean: "만나다", english: ["to meet"], partOfSpeech: "verb" },
  {
    slug: "boda",
    korean: "보다",
    english: ["to see", "to watch"],
    partOfSpeech: "verb",
    inflectionNotes: "ㅗ stem: 보 + 아요 → 봐요 (vowel contraction: ㅗ + ㅏ → ㅘ)",
  },
  {
    slug: "sseuda",
    korean: "쓰다",
    english: ["to write"],
    partOfSpeech: "verb",
    inflectionNotes: "ㅡ stem: 쓰 + 어요 → 써요 (으-deletion: ㅡ + 어 → ㅓ with ㅅ strengthening)",
  },
  { slug: "jinaeda", korean: "지내다", english: ["to get along", "to spend time"], partOfSpeech: "verb" },
  {
    slug: "hada",
    korean: "하다",
    english: ["to do"],
    partOfSpeech: "verb",
    inflectionNotes: "하다 → 해요 (하 + 여 → 해 contraction)",
  },

  // Adjectives
  { slug: "gwaenchanta", korean: "괜찮다", english: ["to be all right", "to be okay"], partOfSpeech: "adjective", inflectionNotes: "ㅎ adjective: 괜찮 + 아요 → 괜찮아요" },
  {
    slug: "neolbda",
    korean: "넓다",
    english: ["to be spacious", "to be wide"],
    partOfSpeech: "adjective",
    inflectionNotes: "ㅂ irregular: 넓 + 어요 → 넓어요",
  },
  { slug: "manta", korean: "많다", english: ["to be many", "to be much"], partOfSpeech: "adjective" },
  { slug: "masitta", korean: "맛있다", english: ["to be delicious"], partOfSpeech: "adjective", inflectionNotes: "있다 adjective: 맛있 + 어요 → 맛있어요" },
  {
    slug: "eotteohda",
    korean: "어떻다",
    english: ["to be how"],
    partOfSpeech: "adjective",
    inflectionNotes: "어떻 + 어요 → 어때요 (contraction used in 어때요?)",
  },
  { slug: "jaemiitta", korean: "재미있다", english: ["to be fun", "to be interesting"], partOfSpeech: "adjective", inflectionNotes: "있다 adjective: 재미있 + 어요 → 재미있어요" },
  { slug: "jota", korean: "좋다", english: ["to be good", "to be nice"], partOfSpeech: "adjective" },
  { slug: "maseopda", korean: "맛없다", english: ["to be tasteless"], partOfSpeech: "adjective", inflectionNotes: "없다 adjective: 맛없 + 어요 → 맛없어요" },
  {
    slug: "ssada",
    korean: "싸다",
    english: ["to be cheap"],
    partOfSpeech: "adjective",
    inflectionNotes: "ㅏ stem: 싸 + 아요 → 싸요",
  },
  { slug: "jaemieopda", korean: "재미없다", english: ["to be uninteresting"], partOfSpeech: "adjective", inflectionNotes: "없다 adjective: 재미없 + 어요 → 재미없어요" },
  {
    slug: "keuda",
    korean: "크다",
    english: ["to be big"],
    partOfSpeech: "adjective",
    inflectionNotes: "ㅡ stem: 크 + 어요 → 커요 (으-deletion: ㅡ + 어 → ㅓ)",
  },

  // Adverbs
  { slug: "aju", korean: "아주", english: ["very", "really"], partOfSpeech: "adverb" },
  { slug: "eotteoke", korean: "어떻게", english: ["how"], partOfSpeech: "adverb" },
  { slug: "yojeum", korean: "요즘", english: ["these days"], partOfSpeech: "adverb" },
  { slug: "jal", korean: "잘", english: ["well"], partOfSpeech: "adverb" },
  { slug: "jigeum", korean: "지금", english: ["now"], partOfSpeech: "adverb" },

  // Particles / Conjunctions
  { slug: "deul", korean: "들", english: ["plural particle"], partOfSpeech: "particle" },
  { slug: "eul-reul", korean: "을/를", english: ["object particle"], partOfSpeech: "particle", inflectionNotes: "을 after consonant, 를 after vowel" },
  { slug: "geurigo", korean: "그리고", english: ["and"], partOfSpeech: "conjunction" },

  // Interjections
  { slug: "eo", korean: "어", english: ["oh"], partOfSpeech: "interjection" },
];
