import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  StyledKeyboardAvoidingViewMain,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup1 } from "../../reducers/user";

const SignUpScreen1 = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const BACKENDURL = useSelector((state) => state.constants.value.BACKENDURL);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (email === "" || password === "") {
      setError("Veuillez remplir tous les champs");
    } else {
      try {
        const response = await fetch(`${BACKENDURL}/users/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            tel: phone,
          }),
        });
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          // await AsyncStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (error) {
        setError("Erreur de connexion, veuillez réessayer");
      }
    }
  };

  const errorText = error ? (
    <Text style={{ color: "red" }}>{error}</Text>
  ) : null;
  const behavior = Platform.OS === "ios" ? "padding" : "height";

  return (
    <KeyboardAvoidingView enabled behavior={behavior} style={styles.container}>
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
            <Text style={styles.placeholder}>Prénom</Text>
            <TextInput
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              style={styles.inputName}
            />
          </View>

          <View style={styles.viewInputName}>
            <Text style={styles.placeholder}>Nom</Text>
            <TextInput
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              style={styles.inputName}
            />
          </View>
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.placeholder}>Numéro de téléphone</Text>
          <TextInput
            value={tel}
            onChangeText={(text) => setTel(text)}
            style={styles.input}
          />
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.placeholder}>Adresse e-mail</Text>
          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.placeholder}>Mot de passe</Text>
          <TextInput
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            autoCapitalize="none"
            secureTextEntry={true}
          />
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.placeholder}>Confirmer le mote de passe</Text>
          <TextInput
            value={passwordConfirm}
            onChangeText={(text) => setPasswordConfirm(text)}
            style={styles.input}
            autoCapitalize="none"
            secureTextEntry={true}
          />
        </View>

        {errorText}
      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignIn")}
          style={styles.btnContinue}
        >
          <Text style={styles.btnTxt}>Retour</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            dispatch(signup1({ firstName, lastName, email, tel, password }));
            navigation.navigate("SignUp2");
          }}
          style={styles.btnContinue}
        >
          <Text style={styles.btnTxt}>Continuer</Text>
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
    backgroundColor: "white",
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  stepNumber2: {
    backgroundColor: "grey",
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  stepTxt: {
    color: "white",
    fontWeight: "500",
    fontSize: 18,
  },

  stepTxt2: { color: "grey", fontSize: 18 },

  stepLine: {
    borderRightWidth: 1,
    borderRightColor: "white",
    height: "16%",
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
    flex: 0.6,
    marginBottom: 50,
  },

  inputNameContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    paddingTop: 20,
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
    marginBottom: 45,
  },
  FlexOne: {
    flex: 1,
  },
});

export default SignUpScreen1;
