import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import { QueryClient, QueryClientProvider } from "react-query";
import SearchIcon from "../assets/images/search.svg";
import { MenuProvider } from "@/context/MenuContext"; // Importe o MenuProvider se necessário

export default function RootLayout() {
  const router = useRouter();
  const queryClient = new QueryClient();

  const Logo = () => {
    return (
      <View
        style={{
          width: "97%",
          alignItems: "flex-end",
          justifyContent: "space-around",
        }}
      >
        <TouchableOpacity onPress={() => router.push(`/search`)}>
          <SearchIcon color={"white"} width={24} height={24} />
        </TouchableOpacity>
      </View>
    );
  };

  const stileHeader = {
    backgroundColor: "#000000b9",
    zIndex: -1,
    position: "relative",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <MenuProvider> {/* Se precisar do MenuProvider para acesso ao contexto */}
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="cineFlash"
            options={{
              headerTitle: () => <Logo />,
              statusBarStyle: "light",
              statusBarBackgroundColor: "rgb(10, 17, 4)",
              headerShown: true,
              headerTintColor: "white",
              headerStyle: stileHeader,
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="info"
            options={{
              headerTitle: () => <Logo />,
              headerShown: true,
              headerTintColor: "white",
              headerStyle: stileHeader,
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="VideoPlayer"
            options={{
              statusBarHidden: false,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="favoritos"
            options={{
              headerTitle: () => <Logo />,
              headerShown: true,
              headerTintColor: "white",
              headerStyle: stileHeader,
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="search"
            options={{
              statusBarBackgroundColor: "rgb(5, 7, 32)",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="infoFilmes"
            options={{
              headerTitle: () => <Logo />,
              headerShown: true,
              headerTintColor: "white",
              headerStyle: stileHeader,
              headerTransparent: true,
            }}
          />
        </Stack>
      </MenuProvider>
    </QueryClientProvider>
  );
}
