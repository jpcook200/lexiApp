import { useColorScheme } from 'nativewind';
import React from 'react';
import { Text, TextProps } from 'react-native';

interface ThemedTextProps extends TextProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'subtext' | 'default';
  className?: string;
}

export default function ThemedText({ children, variant = 'primary', className = '', ...props }: ThemedTextProps) {
    const { colorScheme } = useColorScheme();
    
    let colorClass = '';
    
    switch (variant) {
        case 'primary':
            colorClass = colorScheme === 'dark' ? 'text-text-dark' : 'text-text-light';
            break;
        case 'accent':
            colorClass = 'text-primary'; // same for light/dark
            break;
        case 'subtext':
            colorClass = colorScheme === 'dark' ? 'text-subtext-dark' : 'text-subtext-light';
            break;
        default:
            colorClass = colorScheme === 'dark' ? 'text-white' : 'text-black';
    }

    // Map Tailwind font classes to your custom fonts
    let fontFamily = 'Satoshi-Regular';
    if (className.includes('font-bold')) fontFamily = 'Satoshi-Bold';
    else if (className.includes('font-medium')) fontFamily = 'Satoshi-Medium';
    else if (className.includes('font-light')) fontFamily = 'Satoshi-Light';
    else if (className.includes('font-black')) fontFamily = 'Satoshi-Black';
  

    // Detect italic
    const fontStyle = className.includes('italic') ? 'italic' : 'normal';

    return (
        <Text
        {...props}
        className={`${colorClass} ${className}`}
        style={[{ fontFamily, fontStyle }, props.style]} // apply italic dynamically
        >
            {children}
        </Text>
    );
}
