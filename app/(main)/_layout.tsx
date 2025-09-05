import { Stack } from 'expo-router';
export default function AppLayout(){
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            <Stack.Screen name="checkout" options={{headerShown: false}}/>
            <Stack.Screen name="view-order" options={{headerShown: false}}/>
            <Stack.Screen name="manage-items" options={{headerShown: false}}/>
            <Stack.Screen name="categories" options={{headerShown: false}}/>
            <Stack.Screen name="items" options={{headerShown: false}}/>
            {/*<Stack.Screen name="about" options={{headerShown: false}}/>*/}
            {/*<Stack.Screen name="dark-mode" options={{headerShown: false}}/>*/}
            {/*<Stack.Screen name="due-list" options={{headerShown: false}}/>*/}
        </Stack>
    )
}
