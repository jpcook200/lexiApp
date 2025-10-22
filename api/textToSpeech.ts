import Constants from 'expo-constants';
const { apiUrl } = Constants.expoConfig!.extra as { apiUrl: string };

import { Audio } from 'expo-av';

export const textToSpeech = async (text: string, lang: string) => {
    try {
        const response = await fetch(`${apiUrl}/api/words/text-to-speech`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

        const dataUri = `data:audio/mp3;base64,${base64}`;

        const { sound } = await Audio.Sound.createAsync({ uri: dataUri });
        
        await sound.playAsync();
        return sound;

    } catch (error) {
        console.error('Error in textToSpeech:', error);
        throw error;
    }
};
