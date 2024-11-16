import React, { useEffect, useState } from "react";
import { memo } from "react";
import Header from "@/components/header";
import ImageDestaque from "@/components/ImageDestaque";
import ListConteudo from "@/components/ListConteudo";
import AplashInicial from "@/components/SplashInicial";
import Menu from "@/components/menu";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Animated,
} from "react-native";

  const Index = () => {
  const [loading, setLoading] = useState(true);
  const scrollY = new Animated.Value(0);
  
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
          <View style={styles.viewFilmesSeries}>
            <Text style={styles.textoFilmesSeries}>Inicio</Text>
          </View>
          <View style={styles.viewFilmesSeries}>
            <Text style={styles.textoFilmesSeries}>Séries</Text>
          </View>
          <View style={styles.viewFilmesSeries}>
            <Text style={styles.textoFilmesSeries}>Filmes</Text>
          </View>
          <View style={styles.viewFilmesSeries}>
            <Text style={styles.textoFilmesSeries}>Crianças & Familia</Text>
          </View>
        </View>
        <ImageDestaque />

        <ListConteudo />
        
      </ScrollView>
      <Menu/>
    </SafeAreaView>
  );
}
export default memo(Index);
const styles = StyleSheet.create({
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
    borderBottomWidth: 1,
    borderColor: "#ffffff",
    paddingBottom: 5,
  },
});
