import ThemedIcon from '@/components/ThemedIcon';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutAnimation, Platform, ScrollView, TouchableOpacity, UIManager, View } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const faqs = () => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const { t } = useTranslation();

    const faqs = [
        {
            question: t("faq_how_it_works_q"),
            answer: t("faq_how_it_works_a"),
        },
        {
            question: t("faq_progress_tracking_q"),
            answer: t("faq_progress_tracking_a"),
        },
        {
            question: t("faq_missed_day_q"),
            answer: t("faq_missed_day_a"),
        },
        {
            question: t("faq_incomplete_words_q"),
            answer: t("faq_incomplete_words_a"),
        },
        {
            question: t("faq_how_to_practice_q"),
            answer: t("faq_how_to_practice_a"),
        },
        {
            question: t("faq_word_selection_q"),
            answer: t("faq_word_selection_a"),
        },
        {
            question: t("faq_feedback_q"),
            answer: t("faq_feedback_a"),
        },
        {
            question: t("faq_offline_q"),
            answer: t("faq_offline_a"),
        },
    ];

    const toggleAccordion = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(prev => (prev === index ? null : index));
    };

    return (
        <ThemedView className="flex-1 bg-item-light dark:bg-item-dark px-4 pt-4">
            <ScrollView showsVerticalScrollIndicator={false}>
                <ThemedText className="text-4xl font-bold mb-6">{ t("faqs") }</ThemedText>
                {faqs.map((faq, index) => (
                    <View key={index} className="mb-4 border-b border-border-light dark:border-border-dark">
                        <TouchableOpacity accessibilityLabel='Open Question' onPress={() => toggleAccordion(index)} className="py-5 flex-row items-center">
                            <ThemedText className="text-lg font-bold flex-1 pr-4">{faq.question}</ThemedText>
                            <ThemedIcon name="ChevronDown" />
                        </TouchableOpacity>
                        {expandedIndex === index && (
                            <ThemedText variant="subtext" className="text-base pb-3">{faq.answer}</ThemedText>
                        )}
                    </View>
                ))}
            </ScrollView>
        </ThemedView>
    );
};

export default faqs;
