import { Pressable, Text } from 'react-native';
import ThemedText from './ThemedText';

type LanguageCardProps = {
    icon: string;
    name: string;
    code: string;
    active: boolean;
    onPress: () => void;
}

const LanguageCard = ({ icon, name, code, active, onPress }: LanguageCardProps) => {
    return (
        <Pressable onPress={ onPress } className={`w-36 h-36 border ${active ? 'border-accent-light' : 'border-border-light'} ${active ? 'dark:border-accent-dark' : 'dark:border-border-dark'} rounded-2xl p-2 justify-center items-center ${active ? 'bg-yellow-700' : 'bg-item-light dark:bg-item-dark'}`}>
            <Text className='text-4xl'>{icon}</Text>
            <ThemedText className='text-lg font-medium'>{name}</ThemedText>
        </Pressable>
    )
}

export default LanguageCard