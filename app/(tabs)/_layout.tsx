import { router, Tabs, usePathname } from 'expo-router';
import { House, Layers, Settings } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';

export default function TabLayout() {
    const { colorScheme } = useColorScheme();

    const pathname = usePathname();

    return (
        <View className="flex-1">
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                    backgroundColor: colorScheme === 'dark' ? '#2C2C2C' : '#F2F0EF',
                    elevation: 0,        // Android shadow
                    shadowOpacity: 0,    // iOS shadow
                    borderTopWidth: 0,   // remove border
                    paddingTop: 20,
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
                        tabBarIcon: ({ color }) => <House color={color} size={28} strokeWidth={2} pointerEvents='none' />,
                        tabBarStyle: {
                            backgroundColor: colorScheme === 'dark' ? '#2C2C2C' : '#F2F0EF',
                            elevation: 0,        // Android shadow
                            shadowOpacity: 0,
                            borderTopWidth: pathname === "/home/Practice" ? 0 : 1,
                            borderColor: colorScheme === 'dark' ? '#686f79' : '#d1d1d1',
                            paddingTop: 20,
                            height: 90,
                        }
                    }}
                />
                <Tabs.Screen
                    name="learn"
                    options={{
                        title: 'Learn',
                        headerShown: false,
                        tabBarIcon: ({ color }) => <Layers color={color} size={28} strokeWidth={2} pointerEvents='none' />,
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: 'Settings',
                        headerShown: false,
                        tabBarIcon: ({ color }) => <Settings color={color} size={28} strokeWidth={2} pointerEvents='none' />,
                        tabBarStyle: {
                            backgroundColor: colorScheme === 'dark' ? '#2C2C2C' : '#F2F0EF',
                            elevation: 0,        // Android shadow
                            shadowOpacity: 0,    // iOS shadow
                            borderTopWidth: 1,
                            borderColor: colorScheme === 'dark' ? '#686f79' : '#d1d1d1',
                            paddingTop: 20,
                            height: 90,
                        }
                    }}
                />
            </Tabs>
        </View>
    );
}
