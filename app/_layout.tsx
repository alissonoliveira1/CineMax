import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import HeaderWithButton from "@/components/bottonRota";
import { View, TouchableOpacity, Text } from "react-native";
import { QueryClient, QueryClientProvider } from "react-query";
import SearchIcon from "../assets/images/search.svg";
import { MenuProvider } from "@/context/MenuContext";
import { RegisterProvider } from "@/context/RegisterContx";
import { UserProvider } from "@/context/UserContext";
import { auth } from "@/firebaseConfig";
export default function RootLayout() {
  const router = useRouter();
  const user = auth.currentUser;
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
      <RegisterProvider>
        <UserProvider>
          <MenuProvider>
            <Stack>          
              <Stack.Screen name="index" options={{headerShown:false}}/>
              <Stack.Screen name="loginHome" options={{ headerShown: false }} />
    
              <Stack.Screen name="home" options={{ headerShown: false }} />
              <Stack.Screen
                name="cineFlash"
                options={{
                  headerTitle: () => <Logo />,
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
              <Stack.Screen
                name="perfil"
                options={{
                  headerShown: true,
                  title: "Editar perfil",
                  headerTransparent: true,
                  headerTintColor: "#c2c0c0",
                  headerTitleStyle: { fontWeight: "700", fontSize: 22 },
              
                }}
              />
              <Stack.Screen name="register" options={{ headerShown: false }} />
            </Stack>
          </MenuProvider>
        </UserProvider>
      </RegisterProvider>
    </QueryClientProvider>
  );
}
