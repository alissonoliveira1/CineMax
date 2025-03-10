import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import { AppProvider } from '@/components/Apimages'; 
import SearchIcon from "../assets/images/search.svg";
export default function RootLayout() {
  const router = useRouter();
  const Logo = () => {
    return (
      <View
        style={{
          width: "90%",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity onPress={() => router.push(`/search`)}>
          <SearchIcon color={"white"} width={24} height={24} />
        </TouchableOpacity>
      </View>
    );
  };
  const stileHeader = {
    backgroundColor: "rgba(5, 7, 32, 0.089)",
    zIndex: -1,
    position: "relative",
  };
  return (

    <AppProvider>
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, statusBarTranslucent: true }}
      />
      <Stack.Screen
        name="info"
        options={{
          headerTitle: () => <Logo />,
          headerShown: true,
          statusBarTranslucent: true,
          headerTintColor: "white",
          headerStyle: stileHeader,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="VideoPlayer"
        options={{
          statusBarHidden: false,
          statusBarTranslucent: true,
          headerShown: false,
        }}
      />
          <Stack.Screen
        name="search"
        options={{
          statusBarColor:'rgb(5, 7, 32)',
          headerShown: false,
        }}
      />
          <Stack.Screen
        name="infoFilmes"
        options={{
          statusBarColor:'rgb(5, 7, 32)',
          headerShown: false,
        }}
      />
    </Stack>
    </AppProvider>
  
  );
}
