import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";

const ModalPwdForget = (props) => {
  const [email, setEmail] = useState("");
  const [modalPwdResetVisible, setModalPwdResetVisible] = useState(false);

  const modalPwdReset = (
    <View style={styles.container}>
      <Text style={styles.iconReset}>😃</Text>
      <Text style={styles.titleReset}>
        Un email vous a été envoyé afin de réinitialiser votre mot de passe.
      </Text>
      <TouchableOpacity
        onPress={() => {
          props.setModalPwdForgetVisible(!props.modalPwdForgetVisible);
        }}
        style={styles.btnContinue}
      >
        <Text style={styles.btnTxt}>Accueil</Text>
      </TouchableOpacity>
    </View>
  );

  if (modalPwdResetVisible) {
    return modalPwdReset;
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Entrez votre adresse mail :</Text>
        <TextInput
          placeholder="Adresse email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <View style={styles.btnContainer}>
          <TouchableOpacity
            onPress={() =>
              props.setModalPwdForgetVisible(!props.modalPwdForgetVisible)
            }
            style={styles.btnContinue}
          >
            <Text style={styles.btnTxt}>Retour</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalPwdResetVisible(!modalPwdResetVisible);
            }}
            style={styles.btnContinue}
          >
            <Text style={styles.btnTxt}>Réinitialiser</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121F3A",
    alignItems: "center",
    justifyContent: "center",
  },

  title: { fontSize: 20, fontWeight: "500", color: "white" },

  titleReset: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
    marginLeft: 10,
    marginBottom: 20,
    marginTop: 20,
    width: "100%",
  },

  iconReset: { fontSize: 40 },

  input: {
    backgroundColor: "#4FB8FF",
    opacity: 0.6,
    width: "85%",
    height: 45,
    padding: 10,
    fontWeight: "500",
    fontSize: 16,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginBottom: 20,
    marginTop: 20,
  },

  btnContinue: {
    backgroundColor: "#00D369",
    width: "40%",
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },

  btnTxt: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },

  btnContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

export default ModalPwdForget;
