
import Constants from 'expo-constants';
const { apiUrl } = Constants.expoConfig!.extra as { apiUrl: string };

type getWordsParams = {
    nativeLang: string;
    learningLang: string;
    difficulty: string;
    limit: number;
    excludeIds?: number[];
}

type Word = {
  id: number;
  native_word: string;
  learning_word: string;
  learning_pronunciation: string;
  native_pronunciation: string;
  part_of_speech: string;
  native_definition: string;
  learning_definition: string;
  learning_difficulty: string;
  learning_sentence: string;
  learning_gender: string;
};

export const getWords = async ({ nativeLang, learningLang, difficulty, limit, excludeIds, localDatetime }: getWordsParams): Promise<Word[]> => {
    try {
        console.log('Fetching words with params:', { nativeLang, learningLang, difficulty, limit, excludeIds, localDatetime });

        const response = await fetch(`${apiUrl}/api/words/get-daily?nativeLang=${nativeLang}&learningLang=${learningLang}&difficulty=${difficulty}&limit=${limit}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ excludeIds, localDatetime }),
        });

        if (!response.ok) {
            // Try to parse the JSON error message
            const errorData = await response.json();
            throw new Error(errorData.error || 'Unknown error');
        }

        const data = await response.json();
        return data;

    } catch (error: any) {
        console.error('Error fetching words:', error.message);
        throw error; // rethrow so your caller can catch it
    }
}
