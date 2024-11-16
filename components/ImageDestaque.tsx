import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from "react-native";
import React from "react";
import { useContext } from "react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Shadow } from "react-native-shadow-2";
import { AppContext } from "../components/Apimages";
import { useState } from "react";

const { width } = Dimensions.get("window");

export default function ImageDestaque() {
  const router = useRouter();
  const { destaque, coresBackground, logoUrl, genres } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const getGenreNames = (genreIds: number[]) => {
    return genreIds
      .map((id) => genres.find((genre) => genre.id === id)?.name)
      .filter((name) => name)
      .join(" ° ");
  };

  return (
    <View style={styles.container}>
      {destaque.map((movie) => (
        <View style={styles.imageContainer2} key={movie.id}>
          <Shadow
            offset={[0, 0]}
            startColor={`rgb(${coresBackground})`}
            distance={350}
          >
            <ImageBackground
              key={movie.id}
            resizeMode="cover"
          
              style={styles.image2}
              onLoadEnd={() => setLoading(false)}
              onError={() => {
                setError(true);
              }}
              source={{
                uri: `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`,
                cache: "reload",
              }}
            >
            
              {(loading || error) && (
                <View style={styles.placeholder}>
                  <ActivityIndicator size="large" color="#5c5c5c" />
                </View>
              )}
              <View
                style={{ width: width * 0.9, backfaceVisibility: "hidden" }}
              >
                <Shadow
                  offset={[0, 170]}
                  startColor={`rgb(${coresBackground}.534)`}
                  distance={140}
                  paintInside
                >
                  <View style={styles.containerButtonPrincipal}>
                    <View style={styles.vwImg}>
                      {logoUrl !== null ? (
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "space-evenly",
                          }}
                        >
                          <Image
                            source={{ uri: logoUrl }}
                            cachePolicy={"memory"}
                            style={styles.imgLogo}
                          />
                          <Text
                            style={{
                              color: "#ececec",
                              fontSize: 12.5,
                              fontWeight: "500",
                              marginBottom: 5,
                            }}
                          >
                        
                            {getGenreNames(movie.genre_ids.slice(0, 3))}
                          </Text>
                        </View>
                      ) : (
                        <Text style={styles.text}>{movie.name}</Text>
                      )}
                    </View>
                    <View style={styles.containerbutton2}>
                      <View style={styles.buttoninfo}>
                        <Text style={styles.buttontext2}>Assistir</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => router.push(`/info?id=${movie.id}`)}
                      >
                        <View style={styles.buttoninfo2}>
                          <Text style={styles.buttontext}>Informações</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Shadow>
              </View>
            </ImageBackground>
          </Shadow>
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    marginTop: 30,
  },
  imageContainer2: {
    top: 0,
    backgroundColor: "transparent",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  image2: {
    overflow: "hidden",
    justifyContent: "flex-end",
    width: width * 0.9,
    height: 400,
    borderRadius: 10,
    borderStyle: "solid",
    borderColor: "rgb(197, 197, 197)",
    borderWidth: 1,
    zIndex: 1,
    elevation: 10,
  },
  containerButtonPrincipal: {
    justifyContent: "flex-end",
    alignItems: "center",
    width: width * 0.9,
    height: 180,
    zIndex: 50,
    borderRadius: 8,
  },
  vwImg: {
    width: width * 0.9,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  imgLogo: {
    width: 200,
    height: 90,
    resizeMode: "contain",
  },
  containerbutton2: {
    width: width * 0.9,
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  buttoninfo: {
    width: width * 0.39,
    height: 36,
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  buttoninfo2: {
    width: width * 0.39,
    height: 36,
    backgroundColor: "rgba(75, 75, 75, 0.63)",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  buttontext: {
    color: "white",
    fontSize: 16.5,
    fontWeight: "bold",
  },
  buttontext2: {
    color: "black",
    fontSize: 16.5,
    fontWeight: "bold",
  },
  text: {
    color: "white",
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#02082c",
    borderRadius: 5,
  },
});
