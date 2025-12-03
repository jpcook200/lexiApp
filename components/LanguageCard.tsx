import { Pressable, Text } from 'react-native';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';

type LanguageCardProps = {
    icon: string;
    name: string;
    code: string;
    active: boolean;
    onPress: () => void;
}

const LanguageCard = ({ icon, name, code, active, onPress }: LanguageCardProps) => {
    return (
        <ThemedView variant='shaded' className={`shadow-sm w-36 h-36 border ${active ? 'border-yellow-500' : 'border-border-light'} ${active ? 'dark:border-orange-500' : 'dark:border-border-dark'} rounded-2xl ${active ? 'bg-orange-400' : 'bg-item-light dark:bg-item-dark'}`}>
            <Pressable accessibilityLabel={`Choose ${name}`} onPress={ onPress } className='flex-1 p-2 justify-center items-center'>
                <Text className='text-4xl'>{icon}</Text>
                <ThemedText className='text-lg font-bold text-center'>{name}</ThemedText>
            </Pressable>
        </ThemedView>
        
    )
}

export default LanguageCard