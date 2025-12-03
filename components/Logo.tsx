import { Image, View } from 'react-native';
import ThemedText from './ThemedText';
 
const Logo = ({ width = 30, height = 30, scale = 1, gap = 1 }: { width?: number, height?: number, scale?: number, gap?: number}) => {
    return (
        <View className='flex-row items-center'>
            <Image
                source={require('@/assets/images/logo-icon.png')}
                style={{ width: width, height: height, resizeMode: 'contain', transform: [{ scale: scale }] }}
                accessibilityLabel='App Logo'
                alt='Logo'
            />
            <ThemedText style={{transform: [{ scale: scale }], marginStart: gap }} className='text-3xl font-black text-primary'>Lexigram</ThemedText>
        </View>
    )
}

export default Logo