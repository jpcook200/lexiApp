import { router, Tabs } from 'expo-router';
import { House, Layers, Settings } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';

export default function TabLayout() {
    const { colorScheme } = useColorScheme();
    
    return (
        <View className="flex-1">
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                    backgroundColor: colorScheme === 'dark' ? '#363636ff' : '#f5fbff',
                    elevation: 0,        // Android shadow
                    shadowOpacity: 0,    // iOS shadow
                    borderTopWidth: 0,   // remove border
                    paddingTop: 10,
                    height: 90,
                },
                tabBarActiveTintColor: '#1c95ffff',
                tabBarShowLabel: false, 
            }}
            >
                <Tabs.Screen
                    name="home"
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            router.replace("/home");
                        },
                    }}
                    options={{
                        title: 'Dashboard',
                        headerShown: false, 
                        tabBarIcon: ({ color }) => <House color={color} size={28} strokeWidth={2.5} pointerEvents='none' />,
                    }}
                />
                <Tabs.Screen
                    name="learn"
                    options={{
                        title: 'Learn',
                        headerShown: false,
                        tabBarIcon: ({ color }) => <Layers color={color} size={28} strokeWidth={2.5} pointerEvents='none' />,
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: 'Settings',
                        headerShown: false,
                        tabBarIcon: ({ color }) => <Settings color={color} size={28} strokeWidth={2.5} pointerEvents='none' />,
                    }}
                />
            </Tabs>
        </View>
    );
}
