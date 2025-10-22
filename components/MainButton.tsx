import { ArrowRight } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { TouchableOpacity, View } from 'react-native';
import Text from './ThemedText';

const MainButton = ({ onPress, next, text }: {onPress: () => void, next?: boolean, text: string}) => {
    const { colorScheme } = useColorScheme();
    
    return (
        <TouchableOpacity style={{boxShadow: '0 4px 0 #2889e3ff'}} onPress={onPress} className='bg-primary h-16 w-full flex-row justify-center items-center rounded-lg shadow-lg px-6'>
            <Text className='font-bold text-lg text-white'>{ text }</Text>  
            <View className='absolute right-6'>
                { next && <ArrowRight size={20} color='white'/> }
            </View>
        </TouchableOpacity>
    )
}

export default MainButton