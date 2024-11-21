import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ImageDestaque from "@/components/ImageDestaque";
import CategoryList from "@/components/Generos";
import ListDestaque from "@/components/ListDestaque";

const CompFilmes = () => {
  return (
    <View>
      <ImageDestaque type={"movie"} />
      <View style={styles.containerCapa}>
        <Text style={styles.text}>Animação</Text>
        <CategoryList genreId={16} type="movie" />
      </View>
      <View style={styles.containerCapa}>
        <Text style={styles.text}>Destaque da semana</Text>
        <ListDestaque type="movie" />
      </View>
      <View style={styles.containerCapa}>
        <Text style={styles.text}>Comédia</Text>
        <CategoryList genreId={35} type="movie" />
      </View>
      <View style={styles.containerCapa}>
        <Text style={styles.text}>Aventura</Text>
        <CategoryList genreId={12} type="movie" />
      </View>
      <View style={styles.containerCapa}>
        <Text style={styles.text}>terror</Text>
        <CategoryList genreId={27} type="movie" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerCapa: {
    marginBottom: 10,
  },
  text: {
    color: "white",
    marginVertical: 10,
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default CompFilmes;
