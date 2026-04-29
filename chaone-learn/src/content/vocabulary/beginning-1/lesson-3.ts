import type { VocabularyEntry } from "@/lib/types";

/**
 * Vocabulary introduced in Beginning 1, Lesson 3 — The University Campus / 대학 캠퍼스
 */

export const vocabulary: VocabularyEntry[] = [
  // Nouns — places & things
  { slug: "gabang", korean: "가방", english: ["bag"], partOfSpeech: "noun" },
  { slug: "gisuksa", korean: "기숙사", english: ["dormitory"], partOfSpeech: "noun" },
  { slug: "daehakgyo", korean: "대학교", english: ["college", "university"], partOfSpeech: "noun" },
  { slug: "dwi", korean: "뒤", english: ["back", "behind"], partOfSpeech: "noun" },
  { slug: "mit", korean: "밑", english: ["bottom", "below"], partOfSpeech: "noun" },
  { slug: "bakk", korean: "밖", english: ["outside"], partOfSpeech: "noun" },
  { slug: "bilding", korean: "빌딩", english: ["building"], partOfSpeech: "noun" },
  { slug: "seojeom", korean: "서점", english: ["bookstore"], partOfSpeech: "noun" },
  { slug: "sigye", korean: "시계", english: ["clock", "watch"], partOfSpeech: "noun" },
  { slug: "an", korean: "안", english: ["inside"], partOfSpeech: "noun" },
  { slug: "ap", korean: "앞", english: ["front"], partOfSpeech: "noun" },
  { slug: "eodi", korean: "어디", english: ["what place", "where"], partOfSpeech: "noun" },
  { slug: "yeop", korean: "옆", english: ["side", "beside"], partOfSpeech: "noun" },
  { slug: "ucheguk", korean: "우체국", english: ["post office"], partOfSpeech: "noun" },
  { slug: "uija", korean: "의자", english: ["chair"], partOfSpeech: "noun" },
  { slug: "wi", korean: "위", english: ["the top side", "above"], partOfSpeech: "noun" },
  { slug: "chaeksang", korean: "책상", english: ["desk"], partOfSpeech: "noun" },
  { slug: "chaek", korean: "책", english: ["book"], partOfSpeech: "noun" },
  { slug: "haksaenghoegwan", korean: "학생회관", english: ["student center"], partOfSpeech: "noun" },
  { slug: "kaempeoseu", korean: "캠퍼스", english: ["campus"], partOfSpeech: "noun" },
  { slug: "cheung", korean: "층", english: ["floor", "layer"], partOfSpeech: "counter" },
  { slug: "gyeongjehak", korean: "경제학", english: ["economics"], partOfSpeech: "noun" },
  { slug: "gyogwaseo", korean: "교과서", english: ["textbook"], partOfSpeech: "noun" },
  { slug: "gyosil", korean: "교실", english: ["classroom"], partOfSpeech: "noun" },
  { slug: "ban", korean: "반", english: ["class"], partOfSpeech: "noun" },
  { slug: "sajeon", korean: "사전", english: ["dictionary"], partOfSpeech: "noun" },
  { slug: "sigan", korean: "시간", english: ["time"], partOfSpeech: "noun" },
  { slug: "yeoja", korean: "여자", english: ["woman"], partOfSpeech: "noun" },
  { slug: "usan", korean: "우산", english: ["umbrella"], partOfSpeech: "noun" },
  { slug: "jilmun", korean: "질문", english: ["question"], partOfSpeech: "noun" },
  { slug: "jip", korean: "집", english: ["home", "house"], partOfSpeech: "noun" },
  { slug: "keompyuteo", korean: "컴퓨터", english: ["computer"], partOfSpeech: "noun" },
  { slug: "hol", korean: "홀", english: ["hall"], partOfSpeech: "noun" },

  // Verbs
  { slug: "gada", korean: "가다", english: ["to go"], partOfSpeech: "verb" },
  { slug: "insahada", korean: "인사하다", english: ["to greet"], partOfSpeech: "verb", inflectionNotes: "하다 verb: 인사하 + 여요 → 인사해요" },
  { slug: "ilgda", korean: "읽다", english: ["to read"], partOfSpeech: "verb" },

  // Adjectives (existence)
  {
    slug: "itda",
    korean: "있다",
    english: ["to be", "to exist"],
    partOfSpeech: "adjective",
    inflectionNotes: "있다 → 있어요 (irregular polite: ㅆ + 어요 → ㅆ어요, but pronounced 써요 in fast speech, written 있어요)",
  },
  {
    slug: "eopda",
    korean: "없다",
    english: ["to not be", "to not have", "to not exist"],
    partOfSpeech: "adjective",
    inflectionNotes: "없다 → 없어요",
  },

  // Adverbs
  { slug: "maeil", korean: "매일", english: ["every day"], partOfSpeech: "adverb" },
  { slug: "yeolsimhi", korean: "열심히", english: ["diligently"], partOfSpeech: "adverb" },

  // Conjunctions
  { slug: "geuraeseo", korean: "그래서", english: ["so", "therefore"], partOfSpeech: "conjunction" },
  { slug: "geureonde", korean: "그런데", english: ["but", "however"], partOfSpeech: "conjunction" },

  // Particles / Pronouns / Interjections
  {
    slug: "e",
    korean: "에",
    english: ["in", "at", "on"],
    partOfSpeech: "particle",
    inflectionNotes: "Static location particle (contrast 에서 for dynamic location)",
  },
  { slug: "nugu", korean: "누구", english: ["who"], partOfSpeech: "pronoun", inflectionNotes: "누구 + 가 → 누가 (subject particle contraction)" },
  { slug: "jeo-hesitation", korean: "저", english: ["uh"], partOfSpeech: "interjection", inflectionNotes: "Hesitation marker, not the humble pronoun 저" },
];
