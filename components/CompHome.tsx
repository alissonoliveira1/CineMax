import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ImageDestaque from "@/components/ImageDestaque";
import CategoryList from "@/components/Generos";
import ListDestaque from "@/components/ListDestaque";

const CompHome = () => {
  return (
    <View>
        <ImageDestaque  type={'movie'}  />
          <View style={styles.containerCapa}>
            <Text style={styles.text}>Destaque da semana</Text>
            <ListDestaque type="movie" />
            </View>
            <View style={styles.containerCapa}>
              
            <Text style={styles.text}>Destaque da semana</Text>
            <CategoryList genreId={16} type="movie" /></View>
          
            <View style={styles.containerCapa}>
              
            <Text style={styles.text}>Destaque da semana</Text>
            <CategoryList genreId={10759} type="tv" /></View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerCapa: {
    marginBottom: 15,
  },
  text: {
    color: "white",
    marginVertical: 10,
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default CompHome;