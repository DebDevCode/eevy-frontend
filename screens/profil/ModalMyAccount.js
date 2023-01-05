import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";

const ModalMyAccount = (props) => {
  const user = useSelector((state) => state.user.value);
  return (
    <View style={styles.container}>
      <View style={styles.myAccount}>
        <TouchableOpacity
          style={styles.iconRetour}
          onPress={() =>
            props.setModalMyAccountVisible(!props.modalMyAccountVisible)
          }
        >
          <MaterialIcons name="keyboard-arrow-left" size={40} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Mon compte</Text>

        <View style={{ width: "100%" }}>
          <TouchableOpacity style={styles.info}>
            <Text style={styles.infoTxtTitle}>Nom</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.infoTxt}>{user.lastName}</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.line}></View>

        <View style={{ width: "100%" }}>
          <TouchableOpacity style={styles.info}>
            <Text style={styles.infoTxtTitle}>Prénom</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.infoTxt}>{user.firstName}</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.line}></View>

        <View style={{ width: "100%" }}>
          <TouchableOpacity style={styles.info}>
            <Text style={styles.infoTxtTitle}>Photo de profil</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.infoTxt}></Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.line}></View>

        <View style={{ width: "100%" }}>
          <TouchableOpacity style={styles.info}>
            <Text style={styles.infoTxtTitle}>Date de naissance</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.infoTxt}>{user.birthday}</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.line}></View>

        <View style={{ width: "100%" }}>
          <TouchableOpacity style={styles.info}>
            <Text style={styles.infoTxtTitle}>Téléphone</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.infoTxt}>{user.tel}</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.line}></View>

        <View style={{ width: "100%" }}>
          <TouchableOpacity style={styles.info}>
            <Text style={styles.infoTxtTitle}>Adresse e-mail</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.infoTxt}>{user.email}</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.line}></View>

        <View style={{ width: "100%" }}>
          <TouchableOpacity style={styles.info}>
            <Text style={styles.infoTxtTitle}>Mot de passe</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.line}></View>

        <View style={{ width: "100%" }}>
          <TouchableOpacity style={styles.info}>
            <Text style={styles.infoTxtTitle}>
              Mes informations de paiement
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.line}></View>

        <View style={{ width: "100%" }}>
          <TouchableOpacity style={styles.info}>
            <Text style={styles.infoTxtTitle}>Supprimer le compte</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121F3A",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 150,
  },

  myAccount: {
    marginTop: 70,
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
  },

  iconRetour: { position: "absolute", left: 10, top: -7 },

  title: { fontSize: 22, fontWeight: "600", color: "white", marginBottom: 40 },

  info: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 45,
    width: "100%",
    marginBottom: 10,
    marginTop: 10,
  },

  infoTxtTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginLeft: 10,
  },

  infoTxt: {
    fontSize: 15,
    fontWeight: "600",
    color: "lightgrey",
    marginRight: 10,
  },

  line: {
    width: "95%",
    borderColor: "white",
    borderWidth: 0.5,
  },
});

export default ModalMyAccount;
