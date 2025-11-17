import { createAudioFile, getAudioFile } from '@/utilities/createDirectory';
import { useAudioPlayer } from 'expo-audio';
import Constants from 'expo-constants';
import { useCallback, useState } from 'react';

const { apiUrl, apiKey } = Constants.expoConfig!.extra as { apiUrl: string, apiKey: string };

export const useTextToSpeech = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [disabledTimer, setDisabledTimer] = useState<number>(0);
    const player = useAudioPlayer();
    
    const speak = useCallback(async (text: string, lang: string): Promise<string | null> => {
        setLoading(true);
        setError(null);
        const fileName = `tts_${text.slice(0, 20)}.mp3`;
        const audioFile = await getAudioFile(fileName, lang);
        if (audioFile) { 
            setLoading(false);
            const fileUri = `${audioFile}`;
            return fileUri;
        }
        try {
            const response = await fetch(`${apiUrl}/api/words/text-to-speech`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': apiKey
                },
                body: JSON.stringify({ text, lang }),
            });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`TTS request failed: ${errText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        let binary = '';
        const chunkSize = 8192;
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
            const chunk = uint8Array.subarray(i, i + chunkSize);
            binary += String.fromCharCode.apply(null, Array.from(chunk));
        }

            const base64 = global.btoa(binary);
            const audioFile = await createAudioFile(base64, fileName, lang);
            return `file://${audioFile}`;
        
        } catch (err: any) {
            console.error('Error in textToSpeech:', err);
            setError(err.message || 'Unknown error');
            return null; 
        } finally {
            setLoading(false);
        }
    }, []);

    const tts = async (text: string, lang: string) => {
        const uri = await speak(text, lang)
        player.replace(uri)
        player.play()
        
    }

    return { speak, loading, error, tts};
};
