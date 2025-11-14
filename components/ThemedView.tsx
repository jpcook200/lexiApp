import { useColorScheme } from 'nativewind';
import React from 'react';
import { View, ViewProps } from 'react-native';

interface ThemedViewProps extends ViewProps {
    children: React.ReactNode;
    variant?: 'default' | 'primary' | 'item' | 'shaded';
    className?: string;
}

export default function ThemedView({ children, variant = 'primary', className = '', ...props }: ThemedViewProps) {
    const { colorScheme } = useColorScheme();

    let bgClass = '';

    switch (variant) {
        case 'primary':
            bgClass = colorScheme === 'dark' ? 'bg-background-dark' : 'bg-background-light';
            break;
        case 'item':
            bgClass = colorScheme === 'dark' ? 'shadow-sm bg-item-dark' : 'shadow-sm bg-item-light';
            break;
        case 'shaded':
            bgClass = colorScheme === 'dark' ? 'bg-shade-dark overflow-hidden' : 'bg-shade-light overflow-hidden';
            break;
        default:
            bgClass = colorScheme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
    }

    return (
        <View className={`${bgClass} ${className} ${(variant === 'shaded' || variant === 'item') &&  'border-2'}`} {...props}>
            {variant === 'shaded' && <View className='absolute bg-item-light dark:bg-item-dark w-full h-full rounded-br-full flex-1 right-0 left-0'></View>}
            {children}
        </View>
    );
}
