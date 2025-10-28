import { ArrowRight } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { TouchableOpacity, View } from 'react-native';
import Text from './ThemedText';

interface MainButtonProps {
  onPress: () => void;
  next?: boolean;
  text: string;
  className?: string;
}

const MainButton = ({ onPress, next, text, className = '' }: MainButtonProps) => {
  const { colorScheme } = useColorScheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ boxShadow: '0 4px 0 #2889e3ff' }}
      className={`bg-primary h-16 w-full flex-row justify-center items-center rounded-lg shadow-lg px-6 ${className}`}
    >
      <Text className="font-bold text-lg text-white">{text}</Text>
      {next && (
        <View className="absolute right-6">
          <ArrowRight size={20} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default MainButton;
