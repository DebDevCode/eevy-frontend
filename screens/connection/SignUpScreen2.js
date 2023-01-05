import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup2 } from "../../reducers/user";
import * as Progress from "react-native-progress";

const SignUpScreen2 = ({ navigation }) => {
  const [titulaireCompteFirstName, setTitulaireCompteFirstName] = useState("");
  const [titulaireCompteLastName, setTitulaireCompteLastName] = useState("");
  const [iban, setIban] = useState("");
  const [bicCode, setBicCode] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const BACKENDURL = useSelector((state) => state.constants.value.BACKENDURL);

  const handleLogin = async () => {
    if (iban === "" || bicCode === "") {
      setError("Veuillez remplir tous les champs");
    } else {
      const response = await fetch(`${BACKENDURL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          tel: user.tel,
          IBAN: iban,
          BIC: bicCode,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data.result) {
        dispatch(
          signup2({
            iban,
            bicCode,
            token: data.token,
          })
        );
        navigation.navigate("TabNavigator", { screen: "Carte" });
      } else {
        setError(data.error);
      }
    }
  };

  const errorText = error ? (
    <Text style={{ color: "red", marginTop: 20 }}>{error}</Text>
  ) : null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Progress.Bar progress={0.8} width={100} />
      <View style={styles.stepContainer}>
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text>1</Text>
          </View>
          <Text style={styles.stepTxt}>Informations personnelle</Text>
        </View>
        <View style={styles.stepLine}></View>
        <View style={styles.step}>
          <View style={styles.stepNumber2}>
            <Text>2</Text>
          </View>
          <Text style={styles.stepTxt2}>Informations de paiement</Text>
        </View>
      </View>
      <View style={styles.informationsContainer}>
        <View style={styles.inputNameContainer}>
          <View style={styles.viewInputName}>
            {/* <Text style={styles.placeholder}>Prénom du titulaire</Text>
            <TextInput
              value={titulaireCompteFirstName}
              onChangeText={(text) => setTitulaireCompteFirstName(text)}
              style={styles.inputName}
            />
          </View>

      <View style={styles.viewInputName}>
        <Text style={styles.placeholder}>Nom du titulaire</Text>
        <TextInput
          value={titulaireCompteLastName}
          onChangeText={(text) => setTitulaireCompteLastName(text)}
          style={styles.inputName}
        /> */}
          </View>
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.placeholder}>Iban</Text>
          <TextInput
            value={iban}
            onChangeText={(text) => setIban(text)}
            style={styles.input}
          />
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.placeholder}>Code BIC</Text>
          <TextInput
            value={bicCode}
            onChangeText={(text) => setBicCode(text)}
            style={styles.input}
          />
        </View>

        {errorText}
      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignUp1")}
          style={styles.btnContinue}
        >
          <Text style={styles.btnTxt}>Retour</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleLogin();
          }}
          style={styles.btnContinue}
        >
          <Text style={styles.btnTxt}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121F3A",
    alignItems: "center",
    justifyContent: "space-around",
  },

  progressBar: { width: "90%" },

  stepContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    flex: 0.4,
  },

  step: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    margin: 20,
  },

  stepNumber: {
    backgroundColor: "#00D369",
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  stepNumber2: {
    backgroundColor: "white",
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  stepTxt: {
    color: "#00D369",
    fontWeight: "500",
    fontSize: 18,
  },

  stepTxt2: { color: "white", fontSize: 18 },

  stepLine: {
    borderRightWidth: 1,
    borderRightColor: "#00D369",
    height: "20%",
    position: "absolute",
    left: 34,
  },

  informationsContainer: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
    borderRadius: 10,
    padding: 20,
  },

  inputNameContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    paddingTop: 30,
  },

  viewInput: {
    width: "100%",
  },

  viewInputName: { width: "48%" },

  inputName: {
    width: "100%",
    backgroundColor: "#4FB8FF",
    height: 45,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    opacity: 0.6,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 30,
  },

  input: {
    backgroundColor: "#4FB8FF",
    opacity: 0.6,
    width: "100%",
    height: 45,
    padding: 10,
    fontWeight: "500",
    fontSize: 16,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginBottom: 30,
  },

  lastInput: {
    backgroundColor: "#4FB8FF",
    opacity: 0.6,
    width: "100%",
    height: 45,
    padding: 10,
    fontWeight: "500",
    fontSize: 16,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },

  placeholder: {
    position: "absolute",
    top: -20,
    left: 2,
    color: "#00D369",
    fontWeight: "500",
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
    marginTop: 60,
  },
});

export default SignUpScreen2;
