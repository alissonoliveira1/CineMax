import React, { useEffect, useState, useRef } from "react";
import { memo } from "react";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";

import Menu from "@/components/menu";
import Header from "@/components/header";
import CompHome from "@/components/CompHome";
import CompSeries from "@/components/CompSeries";
import CompFilmes from "@/components/CompFilmes";
import CompSMFamilia from "@/components/CompSMFamilia";
import AplashInicial from "@/components/SplashInicial";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [opcao, setOpcao] = useState("inicio");
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRoda = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setLoading(false);
    };
    loadData();
  }, []);

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
  console.log(opcao);
  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <AplashInicial />
      </View>
    );
  return (
    <SafeAreaView style={styles.container2}>
      <Header scrollY={scrollY} />
      <ScrollView onScroll={scrollRoda}>
        <View style={styles.opcoesSerieFilme}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setOpcao(option.value)}
              style={styles.viewFilmesSeries}
            >
              <Text style={styles.textoFilmesSeries}>{option.label}</Text>
              {opcao === option.value && <View style={styles.highlightBar} />}
            </TouchableOpacity>
          ))}
        </View>
        {renderContent()}
      </ScrollView>
      <Menu />
    </SafeAreaView>
  );
};
export default memo(Index);
const styles = StyleSheet.create({
  highlightBar: {
    marginTop: 5,
    height: 3,
    width: "100%",
    backgroundColor: "#007AFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(5, 7, 32)",
  },

  container2: {
    flex: 1,
    backgroundColor: "rgb(5, 7, 32)",
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
    paddingBottom: 5,
  },
});
