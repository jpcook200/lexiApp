import { ChevronLeft, ChevronRight, ChevronUp, Fingerprint } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

type GestureType = 'swipeLR' | 'swipeUp' | 'tap';

interface GestureIndicatorProps {
    type?: GestureType;
    color?: string;
    size?: number;
}

const GestureIndicator: React.FC<GestureIndicatorProps> = ({
    type = 'swipeLR',
    color = 'black',
    size = 50,
}) => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (type === 'swipeLR' || type === 'swipeUp') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(anim, {
                        toValue: type === 'swipeLR' ? 10 : -10, // left/right or up
                        duration: 500,
                        easing: Easing.inOut(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 500,
                        easing: Easing.inOut(Easing.quad),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }

        if (type === 'tap') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 700,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 700,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [type]);

    if (type === 'swipeLR') {
        return (
            <View className="justify-center items-center mt-8 space-x-6">
                <Animated.View style={{ transform: [{ translateX: Animated.multiply(anim, -1) }] }} className="flex-row space-x-1">
                    <ChevronLeft size={size} color={color} />
                    <ChevronLeft size={size} color={color} />
                </Animated.View>
                <Animated.View style={{ transform: [{ translateX: anim }] }} className="flex-row space-x-1">
                    <ChevronRight size={size} color={color} />
                    <ChevronRight size={size} color={color} />
                </Animated.View>
            </View>
        );
    }

    if (type === 'swipeUp') {
        return (
            <Animated.View style={{ transform: [{ translateY: anim }] }} className="justify-center">
                <ChevronUp size={size} color={color} />
                <ChevronUp size={size} color={color} />
            </Animated.View>
        );
    }

    if (type === 'tap') {
        return (
            <Animated.View
                style={{
                    transform: [
                        {
                            scale: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.1],
                            }),
                        },
                    ],
                }}
                className="flex-row justify-center items-center"
            >
                <Fingerprint size={size} color={color} />
            </Animated.View>
        );
    }

    return null;
};

export default GestureIndicator;

