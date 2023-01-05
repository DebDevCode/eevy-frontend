import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome, FontAwesome5, Octicons } from "@expo/vector-icons";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useFonts } from "expo-font";
import {
  addAllChargersReservations,
  deleteBorne,
  editBorneAvailable,
} from "../reducers/user";

const MaBorneScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
  });

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const BACKEND_URL = useSelector((state) => state.constants.value.BACKENDURL);

  const [hadBorne, setHadBorne] = useState(false);
  const [rate, setRate] = useState(3.5);
  const [isActiveBorne, setIsActiveBorne] = useState(true);
  const [duration, setDuration] = useState(300);
  const [reservationNotFinish, setReservationNotFinish] = useState(true);

  const [seeAllUpcomingReservation, setSeeAllUpcomingReservation] =
    useState(false);

  const [seeAllPastReservation, setSeeAllPastReservation] = useState(false);
  const [modalAllBornesVisible, setModalAllBornesVisible] = useState(false);
  const [borneChoose, setBorneChoose] = useState({
    location: { num: null, street: null, zipCode: null, city: null },
    brand: null,
    power: "",
    plugType: null,
    pricePerHour: null,
    available: false,
    rating: 0,
  });

  useEffect(() => {
    if (user.chargers.length !== 0) {
      setHadBorne(true);
    } else {
      setHadBorne(false);
    }
  }, [user.chargers]);

  useEffect(() => {
    if (user.chargers.length !== 0) {
      setBorneChoose(user.chargers[0]);
      setIsActiveBorne(user.chargers[0].available);
      setRate(user.chargers[0].rating);
      fetch(`${BACKEND_URL}/reservations/charger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          token: user.token,
          charger: user.chargers[0]._id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            dispatch(
              addAllChargersReservations({
                ongoing: data.ongoing,
                past: data.past,
                upcoming: data.upcoming,
              })
            );
          }
        });
    }
  }, [hadBorne]);

  const handleChangeBorneStatus = () => {
    fetch(`${BACKEND_URL}/chargers/changeAvailabilityStatus`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        token: user.token,
        charger: borneChoose._id,
        status: !isActiveBorne,
      }),
    });
  };

  const handleDeleteBorne = () => {
    fetch(`${BACKEND_URL}/chargers/deleteBorne`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        token: user.token,
        chargerId: borneChoose._id,
      }),
    });
  };

  const allBornes = user.chargers.map((borne, i) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
        key={i}
      >
        <TouchableOpacity
          onPress={() => {
            setModalAllBornesVisible(!modalAllBornesVisible);
            setBorneChoose({
              location: {
                num: borne.location.num,
                street: borne.location.street,
                zipCode: borne.location.zipCode,
                city: borne.location.city,
              },
              brand: borne.brand,
              power: borne.power,
              plugType: borne.plugType,
              pricePerHour: borne.pricePerHour,
              available: borne.available,
              rating: borne.rating,
              _id: borne._id,
            });
            setIsActiveBorne(borne.available);
            setRate(borne.rating);
            fetch(`${BACKEND_URL}/reservations/charger`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                token: user.token,
                charger: borne._id,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.result) {
                  dispatch(
                    addAllChargersReservations({
                      ongoing: data.ongoing,
                      past: data.past,
                      upcoming: data.upcoming,
                    })
                  );
                }
              });
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            marginBottom: 10,
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          <FontAwesome5 name="charging-station" size={32} color="#00D369" />
          <View style={{ width: "90%" }}>
            <Text style={{ color: "white", marginLeft: 10 }}>
              {borne.location.num} {borne.location.street},{" "}
              {borne.location.zipCode} {borne.location.city}
            </Text>
            <Text style={{ color: "white", marginLeft: 10 }}>
              {borne.power} Kw
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  });

  const modalAllBornes = (
    <Modal
      animationType="fade"
      transparent={false}
      visible={modalAllBornesVisible}
      onRequestClose={() => {
        setModalAllBornesVisible(!modalAllBornesVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Choisissez votre borne</Text>

          {allBornes}

          <TouchableOpacity
            style={styles.btnContinueModal}
            onPress={() => setModalAllBornesVisible(!modalAllBornesVisible)}
          >
            <Text style={styles.btnTxt}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const reservationOngoingInfos = [];

  if (user.allChargersReservations[0].ongoing.duration !== undefined) {
    reservationOngoingInfos.push(
      <View style={styles.infosContainer}>
        <FontAwesome5 name="plug" size={30} color="#00D369" />
        <View style={{ alignItems: "center", width: "30%" }}>
          <FontAwesome name="user-circle-o" size={24} color="black" />
          <Text style={{ textAlign: "center" }}>
            {user.allChargersReservations[0].ongoing.user}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>{user.allChargersReservations[0].ongoing.userRating}</Text>
            <FontAwesome name="star" size={18} style={{ color: "#00D369" }} />
          </View>
        </View>
        <View style={styles.infos}>
          <Text style={styles.infosTxt}>
            Durée : {user.allChargersReservations[0].ongoing.duration}
          </Text>
          <Text style={styles.infosTxt}>
            Prix : {user.allChargersReservations[0].ongoing.price}
          </Text>
        </View>
      </View>
    );
  } else {
    reservationOngoingInfos.push(
      <Text style={{ textAlign: "center" }}>
        Vous n'avez pas de réservation en cours
      </Text>
    );
  }

  const reservationOngoing = [];

  if (user.allChargersReservations[0].ongoing.duration !== undefined) {
    reservationOngoingInfos.push(
      <View style={styles.viewTimeStamp}>
        <FontAwesome
          name="flash"
          size={24}
          color="#00D369"
          style={{ marginBottom: 10, marginTop: 20 }}
        />
        <CountdownCircleTimer
          initialRemainingTime={
            user.allChargersReservations[0].ongoing.timeToEnd
          }
          isPlaying={reservationNotFinish}
          duration={user.allChargersReservations[0].ongoing.resaTime}
          colors={["#00D369", "#F7B801", "#A30000", "#A30000"]}
          size={140}
          strokeWidth={9}
        >
          {({ remainingTime }) => (
            <Text style={styles.timerTxt}>
              {remainingTime < 10
                ? moment.utc(remainingTime * 1000).format("s[s]")
                : remainingTime < 60
                ? moment.utc(remainingTime * 1000).format("ss[s]")
                : remainingTime < 600
                ? moment.utc(remainingTime * 1000).format("m[m]")
                : remainingTime < 3600
                ? moment.utc(remainingTime * 1000).format("mm[m]")
                : moment.utc(remainingTime * 1000).format("H[h ]mm[m]")}
            </Text>
          )}
        </CountdownCircleTimer>
      </View>
    );
  }

  let iconTriangleUpcoming;

  seeAllUpcomingReservation
    ? (iconTriangleUpcoming = "triangle-up")
    : (iconTriangleUpcoming = "triangle-down");

  const reservationUpcoming = [];

  if (
    iconTriangleUpcoming === "triangle-up" &&
    user.allChargersReservations[0].upcoming.length !== 0
  ) {
    for (let values of user.allChargersReservations[0].upcoming) {
      reservationUpcoming.push(
        <View style={styles.infosView} key={values.id}>
          <View style={styles.line}></View>
          <View style={styles.infosContainer}>
            <FontAwesome5 name="plug" size={30} color="#00D369" />
            <View style={{ alignItems: "center", width: "30%" }}>
              <FontAwesome name="user-circle-o" size={24} color="black" />
              <Text style={{ textAlign: "center" }}>{values.user}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text>{values.userRating}</Text>
                <FontAwesome
                  name="star"
                  size={18}
                  style={{ color: "#00D369" }}
                />
              </View>
            </View>
            <View style={styles.infos}>
              <Text style={styles.infosTxt}>Date : {values.date}</Text>
              <Text style={styles.infosTxt}>Durée : {values.duration}</Text>
              <Text style={styles.infosTxt}>Prix : {values.price}</Text>
            </View>
          </View>
        </View>
      );
    }
  } else if (
    iconTriangleUpcoming === "triangle-down" &&
    user.allChargersReservations[0].upcoming.length !== 0
  ) {
    reservationUpcoming.push(
      <View style={styles.infosView} key={1}>
        <View style={styles.line}></View>
        <View style={styles.infosContainer}>
          <FontAwesome5 name="plug" size={30} color="#00D369" />
          <View
            style={{
              alignItems: "center",
              width: "30%",
            }}
          >
            <FontAwesome name="user-circle-o" size={24} color="black" />
            <Text style={{ textAlign: "center" }}>
              {user.allChargersReservations[0].upcoming[0].user}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>
                {user.allChargersReservations[0].upcoming[0].userRating}
              </Text>
              <FontAwesome name="star" size={18} style={{ color: "#00D369" }} />
            </View>
          </View>
          <View style={styles.infos}>
            <Text style={styles.infosTxt}>
              Date : {user.allChargersReservations[0].upcoming[0].date}
            </Text>
            <Text style={styles.infosTxt}>
              Durée : {user.allChargersReservations[0].upcoming[0].duration}
            </Text>
            <Text style={styles.infosTxt}>
              Prix : {user.allChargersReservations[0].upcoming[0].price}
            </Text>
          </View>
        </View>
      </View>
    );
  } else {
    reservationUpcoming.push(
      <View style={styles.infosView} key={1}>
        <View style={styles.line}></View>
        <Text style={{ textAlign: "center" }}>
          Vous n'avez aucune réservations à venir
        </Text>
      </View>
    );
  }

  let iconTrianglePast;

  seeAllPastReservation
    ? (iconTrianglePast = "triangle-up")
    : (iconTrianglePast = "triangle-down");

  const reservationFinished = [];

  if (
    iconTrianglePast === "triangle-up" &&
    user.allChargersReservations[0].past.length !== 0
  ) {
    for (let values of user.allChargersReservations[0].past) {
      reservationFinished.push(
        <View style={styles.infosView} key={values.id}>
          <View style={styles.line}></View>

          <View style={styles.infosContainer}>
            <FontAwesome5 name="plug" size={30} color="#00D369" />

            <View
              style={{
                alignItems: "center",
                width: "30%",
              }}
            >
              <FontAwesome name="user-circle-o" size={24} color="black" />

              <Text style={{ textAlign: "center" }}>{values.user}</Text>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text>{values.userRating}</Text>

                <FontAwesome
                  name="star"
                  size={18}
                  style={{ color: "#00D369" }}
                />
              </View>
            </View>

            <View style={styles.infos}>
              <Text style={styles.infosTxt}>Date : {values.date}</Text>
              <Text style={styles.infosTxt}>Durée : {values.duration}</Text>
              <Text style={styles.infosTxt}>Prix : {values.price}</Text>
            </View>
          </View>
        </View>
      );
    }
  } else if (user.allChargersReservations[0].past.length !== 0) {
    reservationFinished.push(
      <View style={styles.infosView} key={1}>
        <View style={styles.line}></View>
        <View style={styles.infosContainer}>
          <FontAwesome5 name="plug" size={30} color="#00D369" />
          <View style={{ alignItems: "center", width: "30%" }}>
            <FontAwesome name="user-circle-o" size={24} color="black" />
            <Text style={{ textAlign: "center" }}>
              {user.allChargersReservations[0].past[0].user}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>{user.allChargersReservations[0].past[0].userRating}</Text>
              <FontAwesome name="star" size={18} style={{ color: "#00D369" }} />
            </View>
          </View>
          <View style={styles.infos}>
            <Text style={styles.infosTxt}>
              Date : {user.allChargersReservations[0].past[0].date}
            </Text>
            <Text style={styles.infosTxt}>
              Durée : {user.allChargersReservations[0].past[0].duration}
            </Text>
            <Text style={styles.infosTxt}>
              Prix : {user.allChargersReservations[0].past[0].price}
            </Text>
          </View>
        </View>
      </View>
    );
  } else {
    reservationFinished.push(
      <View style={styles.infosView} key={1}>
        <View style={styles.line}></View>
        <Text style={{ textAlign: "center" }}>
          Vous n'avez aucune réservations passées
        </Text>
      </View>
    );
  }

  if (hadBorne) {
    return (
      <ScrollView>
        <View style={styles.container}>
          {modalAllBornes}
          <TouchableOpacity
            onPress={() => setModalAllBornesVisible(!modalAllBornesVisible)}
            style={styles.btnAllBornes}
          >
            <Text style={styles.btnTxt}>Selectionner une borne</Text>
          </TouchableOpacity>
          <View style={styles.myBornContainer}>
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <FontAwesome5
                name="charging-station"
                size={50}
                color="#00D369"
                style={{ marginBottom: 10 }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <FontAwesome
                  name="star"
                  size={15}
                  style={{ color: "#00D369" }}
                />
                <Text style={styles.rateTxt}>{borneChoose.rating}/5</Text>
              </View>
            </View>

            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "center",
                width: "65%",
                marginLeft: 20,
              }}
            >
              <Text style={styles.powerTxt}>
                Adresse :{" "}
                <Text style={styles.rateTxt}>
                  {borneChoose.location.num} {borneChoose.location.street},{" "}
                  {borneChoose.location.zipCode} {borneChoose.location.city}
                </Text>
              </Text>
              <Text style={styles.powerTxt}>
                Puissance :{" "}
                <Text style={styles.rateTxt}>{borneChoose.power} Kw </Text>
              </Text>
              <Text style={styles.powerTxt}>
                Type de prise :{" "}
                <Text style={styles.rateTxt}>{borneChoose.plugType} Pins</Text>
              </Text>
              <Text style={styles.powerTxt}>
                Prix :{" "}
                <Text style={styles.rateTxt}>
                  {borneChoose.pricePerHour}€/h
                </Text>
              </Text>
            </View>

            <View
              style={{
                alignItems: "center",
              }}
            >
              <Switch
                trackColor={{ false: "#767577", true: "#00D369" }}
                thumbColor={isActiveBorne ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {
                  setIsActiveBorne(!isActiveBorne);
                  dispatch(editBorneAvailable(borneChoose));
                  handleChangeBorneStatus();
                }}
                value={isActiveBorne}
              />
              <TouchableOpacity
                style={{
                  marginTop: 20,
                }}
                onPress={() => {
                  handleDeleteBorne();
                  dispatch(deleteBorne(borneChoose));
                }}
              >
                <FontAwesome name="trash-o" size={40} color="red" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.viewEnCour}>
            <View style={styles.enCour}>
              <Text style={styles.enCourTxt}>Réservation en cours</Text>
            </View>

            <View style={styles.line}></View>
            <View style={styles.infosView}>{reservationOngoingInfos}</View>

            {reservationOngoing}
          </View>

          <View style={styles.viewEnCour}>
            <View style={styles.viewPastReservation}>
              <View style={styles.enCour}>
                <Text style={styles.enCourTxt}>Réservations à venir</Text>
              </View>
              <View style={styles.line}></View>
              <TouchableOpacity
                onPress={() =>
                  setSeeAllUpcomingReservation(!seeAllUpcomingReservation)
                }
              >
                <Octicons name={iconTriangleUpcoming} size={30} color="black" />
              </TouchableOpacity>
            </View>
            {reservationUpcoming}
            <TouchableOpacity
              onPress={() =>
                setSeeAllUpcomingReservation(!seeAllUpcomingReservation)
              }
            >
              <Octicons
                name={iconTriangleUpcoming}
                size={40}
                color="black"
                style={{ textAlign: "center" }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.viewEnCour}>
            <View style={styles.viewPastReservation}>
              <View style={styles.enCour}>
                <Text style={styles.enCourTxt}>Réservations passées</Text>
              </View>
              <TouchableOpacity
                onPress={() => setSeeAllPastReservation(!seeAllPastReservation)}
              >
                <Octicons name={iconTrianglePast} size={30} color="black" />
              </TouchableOpacity>
            </View>
            {reservationFinished}
            <TouchableOpacity
              onPress={() => setSeeAllPastReservation(!seeAllPastReservation)}
            >
              <Octicons
                name={iconTrianglePast}
                size={40}
                color="black"
                style={{ textAlign: "center" }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.noBornTxt}>
          Vous n'avez pas encore ajouté de borne
        </Text>
        <Text style={styles.noBornTxt}>🥲</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profil")}
          style={styles.btnConnect}
        >
          <Text style={styles.btnTxt}>Ajouter une borne</Text>
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
    paddingBottom: 120,
  },

  btnConnect: {
    backgroundColor: "#00D369",
    width: "50%",
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },

  btnAllBornes: {
    backgroundColor: "#00D369",
    width: "60%",
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  btnTxt: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },

  noBornTxt: { fontSize: 18, fontWeight: "600", color: "white", marginTop: 10 },

  myBornContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "92%",
    marginBottom: 20,
    marginTop: 30,
  },

  rateTxt: { color: "white", fontSize: 14, fontWeight: "600", marginLeft: 5 },

  powerTxt: { color: "white", fontSize: 15, fontWeight: "600", marginTop: 5 },

  viewTimeStamp: {
    width: "100%",
    alignItems: "center",
  },

  timerTxt: { fontSize: 25, color: "black" },

  infosContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },

  infosTxt: {
    fontSize: 16,
    fontWeight: "500",
  },

  viewEnCour: {
    width: "90%",
    backgroundColor: "#EDE8E8",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },

  enCour: {
    backgroundColor: "white",
    height: 40,
    width: "75%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  enCourTxt: {
    fontSize: 18,
    fontWeight: "600",
  },

  viewPastReservation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  line: {
    marginTop: 20,
    marginBottom: 30,
    borderBottomColor: "white",
    borderBottomWidth: 2,
  },

  btnTerminer: {
    width: "94%",
    height: 40,
    backgroundColor: "#121F3A",
    marginTop: 20,
    margin: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  timeStamp: {
    width: 120,
    height: 120,
    borderColor: "#00D369",
    borderWidth: 8,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },

  timeStampTxt: {
    fontSize: 20,
    fontWeight: "600",
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

  btnContinueModal: {
    width: "60%",
    height: 40,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00D369",
    marginBottom: 40,
  },
});

export default MaBorneScreen;
