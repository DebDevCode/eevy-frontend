import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import {
  FontAwesome,
  FontAwesome5,
  AntDesign,
  Octicons,
  MaterialCommunityIcons,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage, {
  useAsyncStorage,
} from "@react-native-async-storage/async-storage";
import { addProfilPic, logout } from "../reducers/user";
import * as ImagePicker from "expo-image-picker";
import Stars from "react-native-stars";
import ModalAddBorne1 from "./profil/ModalAddBorne1";
import { editBorneAvailable } from "../reducers/user";
import ModalMyAccount from "./profil/ModalMyAccount";
import ModalHelp from "./profil/ModalHelp";
import ModalFavorites from "./profil/ModalFavorites";
import ModalAddBorne from "./profil/ModalAddBorne";

const ProfilScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const BACKENDURL = useSelector((state) => state.constants.value.BACKENDURL);

  const [modalMyAccountVisible, setModalMyAccountVisible] = useState(false);
  const [modalFavoritesVisible, setModalFavoritesVisible] = useState(false);
  const [modalHelpVisible, setModalHelpVisible] = useState(false);

  const [image, setImage] = useState(null);
  const [hasLibraryPermission, setHasLibraryPermission] = useState(false);
  const [modalLibraryPermissionVisible, setModalLibraryPermissionVisible] =
    useState(null);
  const [modalAddBorneVisible, setModalAddBorneVisible] = useState(false);
  const [modalAdBorneVisible, setModalAdBorneVisible] = useState(false);

  const handleMyAccount = () => {
    setModalMyAccountVisible(!modalMyAccountVisible);
  };

  const handleMyWallet = () => {
    setModalAdBorneVisible(!modalAdBorneVisible);
  };

  const handleFavorites = () => {
    setModalFavoritesVisible(!modalFavoritesVisible);
  };

  const handleAddBorne = () => {
    setModalAddBorneVisible(!modalAddBorneVisible);
  };

  const handleHelp = () => {
    setModalHelpVisible(!modalHelpVisible);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate("SignIn");
  };

  const handleReservation = () => {
    navigation.navigate("Réservation");
  };

  const activateBorne = async () => {
    if (user.chargers.length) {
      for (charger of user.chargers) {
        const newstatus = !charger.available;
        console.log(user.token, user.email, charger._id, newstatus);
        const response = await fetch(
          `${BACKENDURL}/chargers/changeAvailabilityStatus`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: user.token,
              email: user.email,
              charger: charger._id,
              status: newstatus,
            }),
          }
        );

        const data = await response.json();
        if (!data.result) {
          alert(data.error);
        } else {
          dispatch(editBorneAvailable(charger));
        }
      }
    }
  };

  let profilPic;

  if (user.profilPic == "../assets/eevy-logo-2.png") {
    profilPic = (
      <Image
        source={require("../assets/eevy-logo-2.png")}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 50,
          borderColor: "white",
          borderWidth: 1,
        }}
      />
    );
  } else {
    profilPic = (
      <Image
        source={{ uri: user.profilPic }}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 50,
          borderColor: "white",
          borderWidth: 1,
        }}
      />
    );
  }

  const modal = (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalLibraryPermissionVisible}
        onRequestClose={() => {
          setModalLibraryPermissionVisible(!modalLibraryPermissionVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              Vous n'avez pas autorisez l'accès à vos photos 😟
            </Text>

            <TouchableOpacity
              style={styles.btnModal}
              onPress={() => {
                setModalLibraryPermissionVisible(
                  !modalLibraryPermissionVisible
                );
              }}
            >
              <Text style={styles.btnModalTxt}>Retour</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  const pickImage = async () => {
    // const [status, requestPermission] =
    //   ImagePicker.useMediaLibraryPermissions();
    // (async () => {
    //   const { status } = await Camera.requestCameraPermissionsAsync();
    //   setHasPermission(status === "granted");
    // })();

    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasLibraryPermission(status === "granted");
    })();

    if (!hasLibraryPermission) {
      setModalLibraryPermissionVisible(true);
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaType: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        const formData = new FormData();

        formData.append("photoFromFront", {
          uri: result.assets[0].uri,
          name: "profilPic.jpg",
          type: "image/jpeg",
        });

        fetch(`${BACKENDURL}/users/upload`, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data, "route img");
            dispatch(addProfilPic(data.url));

            fetch(`${BACKENDURL}/users/addProfilPic`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                token: user.token,
                profilPic: data.url,
              }),
            })
              .then((res) => res.json())
              .then((data) => console.log(data, "route prfil"));
          });
      }
    }
  };

  if (modalMyAccountVisible) {
    return (
      <ModalMyAccount
        modalMyAccountVisible={modalMyAccountVisible}
        setModalMyAccountVisible={setModalMyAccountVisible}
      />
    );
  } else if (modalAdBorneVisible) {
    return (
      <ModalAdBorne
        modalAdBorneVisible={modalAdBorneVisible}
        setModalAdBorneVisible={setModalAdBorneVisible}
      />
    );
  } else if (modalFavoritesVisible) {
    return (
      <ModalFavorites
        modalFavoritesVisible={modalFavoritesVisible}
        setModalFavoritesVisible={setModalFavoritesVisible}
      />
    );
  } else if (modalAddBorneVisible) {
    return (
      <ModalAddBorne
        modalAddBorneVisible={modalAddBorneVisible}
        setModalAddBorneVisible={setModalAddBorneVisible}
      />
    );
  } else if (modalHelpVisible) {
    return (
      <ModalHelp
        modalHelpVisible={modalHelpVisible}
        setModalHelpVisible={setModalHelpVisible}
      />
    );
  }

  return (
    <View style={styles.container}>
      {modal}
      <View style={styles.userProfil}>
        <View style={styles.userProfilPic}>
          <TouchableOpacity
            style={styles.profilPic}
            onPress={() => pickImage()}
          >
            {profilPic}
          </TouchableOpacity>
        </View>

        <View style={styles.userName}>
          <Text style={styles.userNameTxt}>
            {user.firstName} {user.lastName}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Stars
              spacing={1}
              display={user.rating}
              count={5}
              fullStar={
                <FontAwesome
                  name="star"
                  size={22}
                  style={{ color: "#00D369" }}
                />
              }
              emptyStar={
                <FontAwesome
                  name="star-o"
                  size={22}
                  style={{ color: "#00D369" }}
                />
              }
              halfStar={
                <FontAwesome
                  name="star-half-empty"
                  size={22}
                  style={{ color: "#00D369" }}
                />
              }
            />
            <Text style={styles.rateTxt}>{user.rating}/5</Text>
          </View>
        </View>
      </View>

      <View style={styles.btnsContainer}>
        <View style={styles.btnsView}>
          <MaterialCommunityIcons
            name="account-cog-outline"
            size={36}
            color="#00D369"
            style={styles.icons}
          />
          <TouchableOpacity
            onPress={() => handleMyAccount()}
            style={styles.btn}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Mon compte</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btnsView}>
          <FontAwesome5
            name="piggy-bank"
            size={34}
            color="#00D369"
            style={styles.icons}
          />
          <TouchableOpacity
            onPress={() => handleMyWallet()}
            style={styles.btn}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Mon solde</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btnsView}>
          <AntDesign
            name="heart"
            size={34}
            color="#00D369"
            style={styles.icons}
          />
          <TouchableOpacity
            onPress={() => handleFavorites()}
            style={styles.btn}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Mes favoris</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btnsView}>
          <FontAwesome5
            name="plug"
            size={36}
            color="#00D369"
            style={styles.icons}
          />
          <TouchableOpacity
            onPress={() => handleReservation()}
            style={styles.btn}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Mes réservations</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btnsView}>
          <FontAwesome5
            name="charging-station"
            size={36}
            color="#00D369"
            style={styles.icons}
          />
          <TouchableOpacity
            onPress={() => handleAddBorne()}
            style={styles.btn}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Ajouter une borne</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btnsView}>
          <MaterialCommunityIcons
            name="toggle-switch-off-outline"
            size={38}
            color="#00D369"
            style={styles.icons}
          />
          <TouchableOpacity
            onPress={() => activateBorne()}
            style={styles.btn}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Activer ma borne</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btnsView}>
          <Ionicons
            name="help-circle-outline"
            size={36}
            color="#00D369"
            style={styles.icons}
          />
          <TouchableOpacity
            onPress={() => handleHelp()}
            style={styles.btn}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Aide</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btnsView}>
          <SimpleLineIcons
            name="logout"
            size={32}
            color="#00D369"
            style={styles.icons}
            onPress={() => handleLogout()}
          />
          <TouchableOpacity
            onPress={() => handleLogout()}
            style={styles.btn}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Déconnexion</Text>
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
    justifyContent: "center",
    paddingBottom: 150,
  },

  userProfil: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    height: "20%",
    marginTop: 100,
  },

  userName: {
    width: "50%",
    alignItems: "flex-start",
    justifyContent: "center",
  },

  userNameTxt: { color: "white", fontSize: 20, fontWeight: "600" },

  rateTxt: { color: "white", fontSize: 18, marginLeft: 5 },

  profilPic: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },

  btnsContainer: {
    width: "100%",
    height: "80%",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 10,
  },

  btnsView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },

  btn: {
    borderRadius: 30,
    justifyContent: "center",
    backgroundColor: "#F5F7F6",
    width: "65%",
    height: 40,
    marginRight: 30,
  },

  icons: { marginLeft: 30 },

  button: {
    textAlign: "center",
    backgroundColor: "#F5F7F6",
    height: "6%",
    width: "60%",
    marginTop: "7%",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  textButton: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
  },

  buttonHelp: {
    textAlign: "center",
    backgroundColor: "#F5F7F6",
    height: "6%",
    width: "80%",
    marginTop: "25%",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    marginBottom: "15%",
  },

  image: {
    flexDirection: "row",
    width: "60%",
    justifyContent: "space-around",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalView: {
    width: "85%",
    backgroundColor: "#121F3A",
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 25,
    paddingTop: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },

  btnModal: {
    width: "70%",
    height: 40,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00D369",
  },

  btnModalTxt: { fontSize: 20, fontWeight: "600", color: "white" },
});

export default ProfilScreen;
