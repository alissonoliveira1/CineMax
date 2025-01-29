import React, { useState, useRef, memo } from "react";

import { Text, View, ScrollView, SafeAreaView, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import Menu from "@/components/menu";
import Header from "@/components/header";
import CompHome from "@/components/CompHome";
import CompSeries from "@/components/CompSeries";
import CompFilmes from "@/components/CompFilmes";
import CompSMFamilia from "@/components/CompSMFamilia";

import { useRouter } from "expo-router";

const Home = () => {
 
  const [opcao, setOpcao] = useState("inicio");
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const [menuVisible, setMenuVisible] = useState(true);
  const scrollRoda = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
          setMenuVisible(false);
        } else if (currentScrollY < lastScrollY.current) {
          setMenuVisible(true);
        }
        lastScrollY.current = currentScrollY;
      },
    }
  );

  const options = [
    { label: "Inicio", value: "inicio" },
    { label: "Séries", value: "Séries" },
    { label: "Filmes", value: "Filmes" },
    { label: "Crianças & Família", value: "Familia" },
  ];

  const renderContent = () => {
    switch (opcao) {
      case "inicio":
        return <CompHome />;
      case "Filmes":
        return <CompFilmes />;
      case "Séries":
        return <CompSeries />;
      case "Familia":
        return <CompSMFamilia />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container2}>
      <StatusBar translucent />
      <Header scrollY={scrollY} />
      <ScrollView scrollEventThrottle={16} onScroll={scrollRoda}>
        <View style={styles.opcoesSerieFilme}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setOpcao(option.value)}
              style={[
                styles.viewFilmesSeries,
                { borderColor: opcao === option.value ? "#ffffff" : "#747474" },
                { borderWidth: opcao === option.value ? 2 : 1 },
              ]}
            >
              <Text
                style={[
                  styles.textoFilmesSeries,
                  { color: opcao === option.value ? "#ffffff" : "#747474" },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {renderContent()}
      </ScrollView>
      <Menu page={"home"} isVisible={menuVisible} />
    </SafeAreaView>
  );
};

export default memo(Home);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a1104",
  },
  container2: {
    flex: 1,
    backgroundColor: "#0a1104",
  },
  opcoesSerieFilme: {
    flexDirection: "row",
    zIndex: 100,
    justifyContent: "space-evenly",
    marginTop: 90,
  },
  textoFilmesSeries: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  viewFilmesSeries: {
    borderColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    borderWidth: 1,
    borderRadius: 20,
  },
});
