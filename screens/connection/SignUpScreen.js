import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useRef } from "react";
import * as Progress from "react-native-progress";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../reducers/user";

const SignUp = ({ navigation }) => {
  const [stepNbr, setStepNbr] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const lastNameRef = useRef();
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const telRef = useRef();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const passwordConfirmRef = useRef();
  const [iban, setIban] = useState("");
  const [bicCode, setBicCode] = useState("");
  const bicCodeRef = useRef();
  const [error, setError] = useState("");

  const BACKENDURL = useSelector((state) => state.constants.value.BACKENDURL);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BACKENDURL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          tel,
          iban,
          bicCode,
        }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        dispatch(
          signup({
            firstName,
            lastName,
            tel,
            email,
            iban,
            bicCode,
            token: data.token,
          })
        );
        navigation.navigate("TabNavigator", { screen: "Carte" });
      }
    } catch (error) {
      setError("Erreur de connexion, veuillez réessayer");
    }
  };

  const stepInc = () => {
    if (stepNbr === 0) {
      if (firstName === "" || lastName === "") {
        setError("Veuillez remplir tous les champs");
      } else {
        setError("");
        setStepNbr(stepNbr + 1);
      }
    } else if (stepNbr === 1) {
      if (tel === "" || email === "") {
        setError("Veuillez remplir tous les champs");
      } else {
        setError("");
        setStepNbr(stepNbr + 1);
      }
    } else if (stepNbr === 2) {
      if (password === "" || passwordConfirm === "") {
        setError("Veuillez remplir tous les champs");
      } else {
        setError("");
        setStepNbr(stepNbr + 1);
      }
    } else if (stepNbr === 3) {
      if (iban === "" || bicCode === "") {
        setError("Veuillez remplir tous les champs");
      } else {
        setError("");
        setStepNbr(stepNbr + 1);
      }
    } else if (stepNbr === 4) {
      handleLogin();
    }
  };

  const stepDec = () => {
    if (stepNbr === 0) {
      navigation.navigate("SignIn");
    } else {
      setStepNbr(stepNbr - 1);
    }
  };

  const errorText = error ? (
    <Text style={{ color: "red" }}>{error}</Text>
  ) : null;

  let progressBar;

  let stepTxt;

  let input;

  if (stepNbr === 0) {
    progressBar = 0.2;
    stepTxt = "Commençons par se présenter";
    input = (
      <View style={styles.inputNameContainer}>
        <View style={styles.viewInputName}>
          <Text style={styles.placeholderName}>Prénom</Text>
          <TextInput
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
            style={styles.inputName}
            returnKeyType="next"
            onSubmitEditing={() => {
              lastNameRef.current.focus();
            }}
          />
        </View>

        <View style={styles.viewInputName}>
          <Text style={styles.placeholderName}>Nom</Text>
          <TextInput
            value={lastName}
            onChangeText={(text) => setLastName(text)}
            style={styles.inputName}
            returnKeyType="done"
            ref={lastNameRef}
            onSubmitEditing={() => stepInc()}
          />
        </View>
      </View>
    );
  } else if (stepNbr === 1) {
    progressBar = 0.4;
    stepTxt = "Continuons avec une adresse mail et un numéro de téléphone";
    input = (
      <View style={styles.inputContainer}>
        <View style={styles.viewInput}>
          <Text style={styles.placeholder}>Adresse e-mail</Text>
          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => {
              telRef.current.focus();
            }}
          />
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.placeholder}>Numéro de téléphone</Text>
          <TextInput
            value={tel}
            onChangeText={(text) => setTel(text)}
            style={styles.input}
            keyboardType="phone-pad"
            returnKeyType="done"
            ref={telRef}
            onSubmitEditing={() => stepInc()}
          />
        </View>
      </View>
    );
  } else if (stepNbr === 2) {
    progressBar = 0.6;
    stepTxt = "Puis choisissez un mot de passe robuste";
    input = (
      <View style={styles.inputContainer}>
        <View style={styles.viewInput}>
          <Text style={styles.placeholder}>Mot de passe</Text>
          <TextInput
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            autoCapitalize="none"
            secureTextEntry={true}
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordConfirmRef.current.focus();
            }}
          />
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.placeholder}>Confirmer le mot de passe</Text>
          <TextInput
            value={passwordConfirm}
            onChangeText={(text) => setPasswordConfirm(text)}
            style={styles.input}
            autoCapitalize="none"
            secureTextEntry={true}
            returnKeyType="done"
            ref={passwordConfirmRef}
            onSubmitEditing={() => stepInc()}
          />
        </View>
      </View>
    );
  } else if (stepNbr === 3) {
    progressBar = 0.8;
    stepTxt =
      "Enfin ajoutez vos coordonnées bancaires afin de récupérer vos bénéfices";
    input = (
      <View style={styles.inputContainer}>
        <View style={styles.viewInput}>
          <Text style={styles.placeholder}>Iban</Text>
          <TextInput
            value={iban}
            onChangeText={(text) => setIban(text)}
            style={styles.input}
            returnKeyType="next"
            secureTextEntry={false}
            onSubmitEditing={() => {
              bicCodeRef.current.focus();
            }}
          />
        </View>

        <View style={styles.viewInput}>
          <Text style={styles.placeholder}>Code BIC</Text>
          <TextInput
            value={bicCode}
            onChangeText={(text) => setBicCode(text)}
            style={styles.input}
            secureTextEntry={false}
            returnKeyType="done"
            ref={bicCodeRef}
            onSubmitEditing={() => stepInc()}
          />
        </View>
      </View>
    );
  } else if (stepNbr === 4) {
    progressBar = 1;
    stepTxt = "Compte ajouter avec succès. Bienvenue !";
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconRetour} onPress={() => stepDec()}>
        <MaterialIcons name="keyboard-arrow-left" size={40} color="white" />
      </TouchableOpacity>

      <Progress.Bar
        progress={progressBar}
        width={400}
        style={styles.progress}
        color={"#00D369"}
      />

      <View style={{ width: "90%" }}>
        <Text style={styles.stepTxt}>{stepTxt}</Text>
      </View>

      {input}

      {errorText}

      <TouchableOpacity style={styles.btnContinue} onPress={() => stepInc()}>
        <Text style={styles.btnTxt}>Continuer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121F3A",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  iconRetour: { position: "absolute", left: 10, top: 60 },

  progress: { width: "90%", position: "absolute", top: 120 },

  stepTxt: { color: "white", fontSize: 18, fontWeight: "600" },

  inputContainer: {
    width: "100%",
    height: "30%",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 100,
  },

  viewInput: {
    width: "100%",
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    backgroundColor: "#4FB8FF",
    opacity: 0.6,
    width: "90%",
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

  placeholder: {
    position: "absolute",
    top: -20,
    left: 25,
    color: "#00D369",
    fontWeight: "500",
  },

  placeholderName: {
    position: "absolute",
    top: -20,
    left: 5,
    color: "#00D369",
    fontWeight: "500",
  },

  inputNameContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "90%",
    paddingTop: 20,
    height: "30%",
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

  btnContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    borderColor: "white",
    borderWidth: 2,
  },

  btnContinue: {
    backgroundColor: "#00D369",
    width: "90%",
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
  },

  btnTxt: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
});

export default SignUp;
