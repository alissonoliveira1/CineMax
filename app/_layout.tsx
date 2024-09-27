import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
           <Stack.Screen name="index" options={{  headerShown: false,  statusBarTranslucent:true }} />
           <Stack.Screen name="info" options={{ headerShown:true, title:"" ,statusBarColor:'#010318', headerTransparent:true }} />
    </Stack>
  );
}
