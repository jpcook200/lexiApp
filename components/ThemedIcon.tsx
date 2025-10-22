import * as LucideIcons from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { View, ViewProps } from 'react-native';

interface ThemedIconProps extends ViewProps {
  name: keyof typeof LucideIcons | string;
  size?: number;
  variant?: 'primary' | 'accent' | 'default';
  className?: string;
}

export default function ThemedIcon({name, size = 24, variant = 'primary', className, ...props}: ThemedIconProps) {
    const { colorScheme } = useColorScheme() || 'light';

    let iconColor = '';
    switch (variant) {
        case 'primary':
            iconColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
            break;
        case 'accent':
            iconColor = colorScheme === 'dark' ? '#FCD34D' : '#FACC15';
            break;
        default:
            iconColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
    }

    const IconComponent = typeof name === 'string' && name in LucideIcons ? (LucideIcons as Record<string, any>)[name] : undefined;
    
    if (!IconComponent) return null;

    return (
        <View className={className} {...props}>
            <IconComponent size={size} color={iconColor} strokeWidth={2.2} />
        </View>
    );
}
