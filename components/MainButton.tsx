import { ArrowRight } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';
import Text from './ThemedText';

interface MainButtonProps {
    onPress: () => void;
    next?: boolean;
    text: string;
    className?: string;
    accessibilityHint?: string;
    accessibilityLabel?: string;
}

const MainButton = ({ onPress, next, text, className = '', accessibilityHint, accessibilityLabel  }: MainButtonProps) => {

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`bg-primary h-16 w-full flex-row justify-center items-center rounded-lg shadow-sm px-6 ${className}`}
            accessibilityHint={accessibilityHint}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
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
