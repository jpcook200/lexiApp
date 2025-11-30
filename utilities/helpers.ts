import { commonLanguages } from '@/constants/languages';

export const getLanguageFlag = (code: string) => {
    const language = commonLanguages.find(lang => lang.code === code);
    return language ? language.flag : 'Unknown';
}

export const getLanguageName = (code: string) => {
    const language = commonLanguages.find(lang => lang.code === code);
    return language ? language.name : 'Unknown';
}

export function formatSentenceByLanguage(sentence: string, langCode: string): string {
    if (!sentence) return sentence;

    const trimmed = sentence.trim();

    // Capitalize first letter
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

    // Determine the correct punctuation based on language code
    const langFullStopMap: Record<string, string> = {
        en: ".",   // English
        fr: ".",   // French
        es: ".",   // Spanish
        pt: ".",   // Portuguese
        it: ".",   // Italian
        de: ".",   // German
        ru: ".",   // Russian
        hi: "।",   // Hindi
        zh: "。",   // Chinese
        ja: "。",   // Japanese
    };

    const fullStop = langFullStopMap[langCode] || ".";

    // If it already ends with common punctuation, return as-is
    if (/[.!?…।۔።。]$/.test(capitalized)) {
        return capitalized;
    }

    return capitalized + fullStop;
}

export function trimEdgeChars(str:string) {
  return str.replace(/^[/\[\]]+/, '').replace(/[/\[\]]+$/, '');
}



