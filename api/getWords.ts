
import { Word, getWordsParams } from '@/types/types';
import Constants from 'expo-constants';
import { getInstallationId } from '../utilities/getInstallationId';
const { apiUrl, apiKey } = Constants.expoConfig!.extra as { apiUrl: string, apiKey: string };

type GetWordsResponse = { 
    words: Word[];
    lastSet: boolean;
};



export const getWords = async ({ nativeLang, learningLang, difficulty = 'a1', limit, excludeIds, localDatetime, transactionId }: getWordsParams): Promise<GetWordsResponse> => {
    try {
        const installationId = await getInstallationId();
        const response = await fetch(`${apiUrl}/api/words/get-daily?nativeLang=${nativeLang}&learningLang=${learningLang}&difficulty=${difficulty || 'a1'}&limit=${limit}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "api-key": apiKey,
                "transaction-id": transactionId || '',
                "installation-id": installationId || '',
            },
            body: JSON.stringify({ excludeIds, localDatetime }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Unknown error');
        }
        
        const data = await response.json();
        return data;

    } catch (error: any) {
        console.error('Error fetching words:', error.message);
        throw error;
    }
}

export const getWordsCount = async (langCode: string, premium: boolean) => {
    const installationId = await getInstallationId();
    try {
        const response = await fetch(`${apiUrl}/api/words/get-count?langCode=${langCode}&premium=${premium}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "api-key": apiKey,
                "installation-id": installationId || '',
            },
        });
        if (!response.ok) {
            console.error('Failed to fetch words count:', response.statusText);
            throw new Error('Failed to fetch words count');
        }
        
        const data = await response.json();
        return data.count;

    } catch (error) {
        console.error('Error fetching words count:', error);
        throw error;
    }
}
