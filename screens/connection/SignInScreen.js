import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import ModalPwdForget from "./ModalPwdForget";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../reducers/user";

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordIsHidden, setPasswordIsHidden] = useState(true);
  const [error, setError] = useState("");
  const [modalPwdForgetVisible, setModalPwdForgetVisible] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const SIGNIN_URL =
    useSelector((state) => state.constants.value.BACKENDURL) + "/users/signin";

  useEffect(() => {
    const checkSession = () => {
      if (user.token) {
        navigation.navigate("TabNavigator", { screen: "Map" });
      }
    };
    checkSession();
  }, []);

  const handleLogin = async () => {
    if (email === "" || password === "") {
      setError("Veuillez remplir tous les champs");
    } else {
      try {
        const response = await fetch(SIGNIN_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await response.json();

        if (!data.result) {
          setError(data.error);
        } else {
          setError("");
          dispatch(login(data.user));
          navigation.navigate("TabNavigator", { screen: "Carte" });
          setPassword("");
        }
      } catch (err) {
        console.log(err);
        setError("Erreur de connexion, veuillez réessayer");
      }
    }
  };

  let iconPwd;

  passwordIsHidden ? (iconPwd = "eye") : (iconPwd = "eye-off");

  if (modalPwdForgetVisible) {
    return (
      <ModalPwdForget
        modalPwdForgetVisible={modalPwdForgetVisible}
        setModalPwdForgetVisible={setModalPwdForgetVisible}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require("../../assets/eevy-logo.png")}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          <View style={styles.signInContainer}>
            <TextInput
              placeholder="Adresse email"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              autoCapitalize="none"
            />
            <View style={styles.inputPwd}>
              <TextInput
                placeholder="Mot de passe"
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={styles.input}
                secureTextEntry={passwordIsHidden}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.iconPwd}
                onPress={() => setPasswordIsHidden(!passwordIsHidden)}
              >
                <Feather name={iconPwd} size={24} color="black" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => setModalPwdForgetVisible(!modalPwdForgetVisible)}
            >
              <Text style={styles.forgetPassword}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
            {error && <Text style={styles.txtError}>{error}</Text>}
            <TouchableOpacity
              onPress={() => handleLogin()}
              style={styles.btnConnect}
            >
              <Text style={styles.btnTxt}>Connexion</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignUp")}
          style={styles.btnNotAlreadyRegistered}
        >
          <Text style={styles.btnTxt}>Pas encore inscrit ?</Text>
        </TouchableOpacity>
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

  image: {
    width: "90%",
    height: 100,
    marginTop: 200,
  },

  keyboardContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },

  signInContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    backgroundColor: "#F5F5F5",
    width: "80%",
    height: 45,
    padding: 10,
    margin: 10,
    borderRadius: 8,
    fontWeight: "500",
    fontSize: 16,
  },

  inputPwd: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },

  iconPwd: {
    position: "absolute",
    right: 50,
    top: "30%",
  },

  forgetPassword: {
    color: "white",
    margin: 10,
  },

  btnConnect: {
    backgroundColor: "#00D369",
    width: "40%",
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    marginBottom: 70,
  },

  btnNotAlreadyRegistered: {
    backgroundColor: "#00D369",
    width: "60%",
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 100,
  },

  btnTxt: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
    // fontFamily: "Roboto",
  },

  txtError: {
    color: "red",
    // fontFamily: "Roboto",
  },
});

export default SignIn;
