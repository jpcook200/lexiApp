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
        <Pressable accessibilityLabel={`Choose ${name}`} onPress={ onPress } className={`shadow-sm w-36 h-36 border ${active ? 'border-yellow-500' : 'border-border-light'} ${active ? 'dark:border-orange-500' : 'dark:border-border-dark'} rounded-2xl p-2 justify-center items-center ${active ? 'bg-orange-400' : 'bg-item-light dark:bg-item-dark'}`}>
            <Text className='text-4xl'>{icon}</Text>
            <ThemedText className='text-lg font-bold'>{name}</ThemedText>
        </Pressable>
    )
}

export default LanguageCard