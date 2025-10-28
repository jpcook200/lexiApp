
import { Word, getWordsParams } from '@/types/types';
import Constants from 'expo-constants';
const { apiUrl } = Constants.expoConfig!.extra as { apiUrl: string };

type GetWordsResponse = { 
    words: Word[];
    lastSet: boolean;
};

export const getWords = async ({ nativeLang, learningLang, difficulty = 'a1', limit, excludeIds, localDatetime }: getWordsParams): Promise<GetWordsResponse> => {
    try {
        console.log('Fetching words with params:', { nativeLang, learningLang, difficulty, limit, excludeIds, localDatetime });

        const response = await fetch(`${apiUrl}/api/words/get-daily?nativeLang=${nativeLang}&learningLang=${learningLang}&difficulty=${difficulty || 'a1'}&limit=${limit}`, {
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
