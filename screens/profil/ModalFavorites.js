import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const ModalFavorites = (props) => {
  const user = useSelector((state) => state.user.value);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconRetour}
        onPress={() =>
          props.setModalFavoritesVisible(!props.modalFavoritesVisible)
        }
      >
        <MaterialIcons name="keyboard-arrow-left" size={40} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>Mes favoris</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121F3A",
    alignItems: "center",
    justifyContent: "center",
  },

  iconRetour: { position: "absolute", left: 10, top: 60 },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "white",
    position: "absolute",
    top: 67,
  },
});

export default ModalFavorites;
