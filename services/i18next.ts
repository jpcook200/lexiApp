import de from '@/locales/de.json';
import en from '@/locales/en.json';
import es from '@/locales/es.json';
import fr from '@/locales/fr.json';
import hi from '@/locales/hi.json';
import it from '@/locales/it.json';
import ja from '@/locales/ja.json';
import pt from '@/locales/pt.json';
import ru from '@/locales/ru.json';
import zh from '@/locales/zh.json';
import * as Localization from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';


export const languageResources = {
    en: { translation: en },
    fr: { translation: fr },
    de: { translation: de },
    it: { translation: it },
    es: { translation: es },
    pt: { translation: pt },
    ru: { translation: ru },
    ja: { translation: ja },
    zh: { translation: zh },
    hi: { translation: hi }
}

const locals = Localization.getLocales();
const languageCode = locals[0]?.languageCode || 'en'

i18next.use(initReactI18next).init({
    lng: languageCode,
    fallbackLng: 'en',
    resources: languageResources,
})

export default i18next;