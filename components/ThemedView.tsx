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
            bgClass = colorScheme === 'dark' ? 'bg-item-dark' : 'bg-item-light';
            break;
        default:
            bgClass = colorScheme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
    }

    return (
        <View style={variant === 'shaded' ? { boxShadow: `inset -3px -3px 0 0 ${colorScheme === 'dark' ? '#0000002c' : '#b7b7b727'}` } : {}} className={`${bgClass} ${className}`} {...props}>
            {children}
        </View>
    );
}
