import { Image, View } from 'react-native';
import ThemedText from './ThemedText';
 
const Logo = () => {
    return (
        <View className='flex-row items-center'>
            <Image
                source={require('@/assets/images/logo-icon.png')}
                style={{ width: 30, height: 30, resizeMode: 'contain' }}
            />
            <ThemedText className='text-3xl font-black text-primary ml-1'>Lexigram</ThemedText>
        </View>
    )
}

export default Logo