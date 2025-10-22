import { commonLanguages } from '@/constants/languages';

export const getLanguageFlag = (code: string) => {
    const language = commonLanguages.find(lang => lang.code === code);
    return language ? language.flag : 'Unknown';
}

export const getLanguageName = (code: string) => {
    const language = commonLanguages.find(lang => lang.code === code);
    return language ? language.name : 'Unknown';
}
