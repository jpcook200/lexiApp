export interface Word { 
    id: number;
    word_id: number;
    user_id: number;
    learning_word: string;
    native_word: string;
    learning_difficulty: 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2';
    learned_at: string;
    favourite: 0 | 1;
    learning_gender: string;
    native_definition: string;
    part_of_speech: string;
    learning_definition: string;
    learning_sentence: string;
    learning_pronunciation: string;
    native_pronunciation: string;
    learn_lang: string;
    native_lang: string;
    time_sent?: string;
    learned?: 0 | 1;
}

export interface User { 
    id: number;
    native_lang: string;
    learn_lang: string;
    words_per_day: number;
    onboarding_completed: number;
    reminders_on: 1 | 0;
    difficulty_level: 'a1' | 'a2' | 'a3' | 'b1' | 'b2' | 'c1' | 'c2';
    timezone: string;
    last_set: number;
    last_fetched?: string;
    tutorial_completed: 0 | 1;
    access_level: 'free' | 'pro';
    words_total: number;
}

export interface CountType { 
    count?: number;
}

export interface CompletedType { 
    completed?: number;
}

export interface LearnedCounts {
    today: number;
    pastWeek: number;
    allTime: number;
}

export interface getWordsParams {
    nativeLang: string;
    learningLang: string;
    difficulty: string;
    limit: number;
    excludeIds: number[];
    localDatetime: string;
    transactionId: string | null;
}

export type FiltersType = {
    sortBy: 'dateAdded' | 'alphabetical' | 'difficulty';
    favouritesOnly: boolean;
}

export type StreakRow = {
    id?: number;
    user_id?: number;
    date: string;
    completed: number;
    lang_pair_code?: string;
};

export type StreakCount = {
    longest: number;
    current: number;
    langPair: string;
    lang_pair_code: string;
}