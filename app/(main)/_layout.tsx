import { Stack } from 'expo-router';
export default function AppLayout(){
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            <Stack.Screen name="checkout" options={{headerShown: false}}/>
            <Stack.Screen name="view-order" options={{headerShown: false}}/>
            {/*<Stack.Screen name="vaccine-records" options={{headerShown: false}}/>*/}
            {/*<Stack.Screen name="edit-childcard" options={{headerShown: false}}/>*/}
            {/*<Stack.Screen name="vaccine-record-list" options={{headerShown: false}}/>*/}
            {/*<Stack.Screen name="about" options={{headerShown: false}}/>*/}
            {/*<Stack.Screen name="dark-mode" options={{headerShown: false}}/>*/}
            {/*<Stack.Screen name="due-list" options={{headerShown: false}}/>*/}
        </Stack>
    )
}
