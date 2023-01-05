import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  FontAwesome,
  FontAwesome5,
  AntDesign,
  Octicons,
} from "@expo/vector-icons";
import ModalRateReservation from "./ModalRateReservation";

import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import user, { addAllReservation } from "../reducers/user";

const MesRechargesScreen = () => {
  const BACKEND_URL = useSelector((state) => state.constants.value.BACKENDURL);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const [reservationNotFinish, setReservationNotFinish] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/reservations/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        token: user.token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          dispatch(
            addAllReservation({
              ongoing: data.ongoing,
              past: data.past,
              upcoming: data.upcoming,
            })
          );
        }
      });
  }, [user.reservations, reservationNotFinish]);

  const [isFavorite, setIsFavorite] = useState(false);
  const [modalRateVisible, setModalRateVisible] = useState(false);
  const [seeAllUpcomingReservation, setSeeAllUpcomingReservation] =
    useState(false);
  useState(false);
  const [seeAllPastReservation, setSeeAllPastReservation] = useState(false);

  const handleAddFavorite = async () => {
    setIsFavorite(!isFavorite);
    const response = await fetch(`${BACKEND_URL}/users/updateFavorites`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        email: user.email,
        charger: props.borneClicked._id,
      }),
    });
  };

  let iconFav;

  isFavorite ? (iconFav = "heart") : (iconFav = "hearto");

  const reservationOngoing = [];

  if (
    user.allReservations[0].ongoing.duration !== undefined &&
    reservationNotFinish
  ) {
    reservationOngoing.push(
      <View>
        <View style={styles.infosContainer}>
          <FontAwesome5 name="charging-station" size={40} color="#00D369" />
          <View style={styles.infos}>
            <Text style={styles.infosTxtTitle}>
              Adresse :{" "}
              <Text style={styles.infosTxt}>
                {user.allReservations[0].ongoing.address}
              </Text>
            </Text>
            <Text style={styles.infosTxtTitle}>
              Chargeur :{" "}
              <Text style={styles.infosTxt}>
                {user.allReservations[0].ongoing.power} Kw
              </Text>
            </Text>
            <Text style={styles.infosTxtTitle}>
              Durée :{" "}
              <Text style={styles.infosTxt}>
                {user.allReservations[0].ongoing.duration}
              </Text>
            </Text>
            <Text style={styles.infosTxtTitle}>
              Prix :{" "}
              <Text style={styles.infosTxt}>
                {user.allReservations[0].ongoing.price}
              </Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => handleAddFavorite()}>
            <AntDesign name={iconFav} size={32} color="red" />
          </TouchableOpacity>
        </View>

        <View style={styles.viewTimeStamp}>
          <FontAwesome
            name="flash"
            size={24}
            color="#00D369"
            style={{ marginBottom: 10, marginTop: 20 }}
          />
          <CountdownCircleTimer
            onComplete={() => {
              setModalRateVisible(!modalRateVisible);
              setReservationNotFinish(false);
            }}
            initialRemainingTime={user.allReservations[0].ongoing.timeToEnd}
            isPlaying={reservationNotFinish}
            duration={user.allReservations[0].ongoing.resaTime}
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
                  ? moment.utc(remainingTime * 1000).format("m[min]")
                  : remainingTime < 3600
                  ? moment.utc(remainingTime * 1000).format("mm[m]")
                  : moment.utc(remainingTime * 1000).format("H[h ]mm[m]")}
              </Text>
            )}
          </CountdownCircleTimer>
        </View>
      </View>
    );
  } else {
    reservationOngoing.push(
      <View style={styles.infosView}>
        <View style={styles.infosContainer}>
          <Text style={{ textAlign: "center", width: "100%" }}>
            Vous n'avez pas de réservation en cours
          </Text>
        </View>
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
    user.allReservations[0].upcoming.length !== 0
  ) {
    for (let values of user.allReservations[0].upcoming) {
      reservationUpcoming.push(
        <View style={styles.infosView} key={values.id}>
          <View style={styles.line}></View>
          <View style={styles.infosContainer}>
            <FontAwesome5 name="charging-station" size={40} color="#00D369" />
            <View style={styles.infos}>
              <Text style={styles.infosTxtTitle}>
                Adresse : <Text style={styles.infosTxt}>{values.address}</Text>
              </Text>
              <Text style={styles.infosTxtTitle}>
                Chargeur :{" "}
                <Text style={styles.infosTxt}>{values.power} Kw</Text>
              </Text>
              <Text style={styles.infosTxtTitle}>
                Date : <Text style={styles.infosTxt}>{values.date}</Text>
              </Text>
              <Text style={styles.infosTxtTitle}>
                Durée : <Text style={styles.infosTxt}>{values.duration}</Text>
              </Text>
              <Text style={styles.infosTxtTitle}>
                Prix : <Text style={styles.infosTxt}>{values.price}</Text>
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleAddFavorite()}>
              <AntDesign name={iconFav} size={32} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  } else if (
    iconTriangleUpcoming === "triangle-down" &&
    user.allReservations[0].upcoming.length !== 0
  ) {
    reservationUpcoming.push(
      <View style={styles.infosView}>
        <View style={styles.line}></View>
        <View style={styles.infosContainer}>
          <FontAwesome5 name="charging-station" size={40} color="#00D369" />
          <View style={styles.infos}>
            <Text style={styles.infosTxtTitle}>
              Adresse :{" "}
              <Text style={styles.infosTxt}>
                {user.allReservations[0].upcoming[0].address}
              </Text>
            </Text>
            <Text style={styles.infosTxtTitle}>
              Chargeur :{" "}
              <Text style={styles.infosTxt}>
                {user.allReservations[0].upcoming[0].power} Kw
              </Text>
            </Text>
            <Text style={styles.infosTxtTitle}>
              Date :{" "}
              <Text style={styles.infosTxt}>
                {user.allReservations[0].upcoming[0].date}
              </Text>
            </Text>
            <Text style={styles.infosTxtTitle}>
              Durée :{" "}
              <Text style={styles.infosTxt}>
                {user.allReservations[0].upcoming[0].duration}
              </Text>
            </Text>
            <Text style={styles.infosTxtTitle}>
              Prix :{" "}
              <Text style={styles.infosTxt}>
                {user.allReservations[0].upcoming[0].price}
              </Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => handleAddFavorite()}>
            <AntDesign name={iconFav} size={32} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  } else if (user.allReservations[0].upcoming.length === 0) {
    reservationUpcoming.push(
      <View style={styles.infosView}>
        <View style={styles.line}></View>
        <View style={styles.infosContainer}>
          <Text style={{ textAlign: "center", width: "100%" }}>
            Vous n'avez aucune réservations à venir
          </Text>
        </View>
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
    user.allReservations[0].past.length !== 0
  ) {
    for (let values of user.allReservations[0].past) {
      reservationFinished.push(
        <View style={styles.infosView} key={values.id}>
          <View style={styles.line}></View>
          <View style={styles.infosContainer}>
            <FontAwesome5 name="charging-station" size={40} color="#00D369" />
            <View style={styles.infos}>
              <Text style={styles.infosTxtTitle}>
                Adresse : <Text style={styles.infosTxt}>{values.address}</Text>
              </Text>
              <Text style={styles.infosTxtTitle}>
                Chargeur :{" "}
                <Text style={styles.infosTxt}>{values.power} Kw</Text>
              </Text>
              <Text style={styles.infosTxtTitle}>
                Date : <Text style={styles.infosTxt}>{values.date}</Text>
              </Text>
              <Text style={styles.infosTxtTitle}>
                Durée : <Text style={styles.infosTxt}>{values.duration}</Text>
              </Text>
              <Text style={styles.infosTxtTitle}>
                Prix : <Text style={styles.infosTxt}>{values.price}</Text>
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleAddFavorite()}>
              <AntDesign name={iconFav} size={32} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  } else if (user.allReservations[0].past.length !== 0) {
    reservationFinished.push(
      <View style={styles.infosView}>
        <View style={styles.line}></View>
        <View style={styles.infosContainer}>
          <FontAwesome5 name="charging-station" size={40} color="#00D369" />
          <View style={styles.infos}>
            <Text style={styles.infosTxtTitle}>
              Adresse :{" "}
              <Text style={styles.infosTxt}>
                {user.allReservations[0].past[0].address}
              </Text>
            </Text>
            <Text style={styles.infosTxtTitle}>
              Chargeur :{" "}
              <Text style={styles.infosTxt}>
                {user.allReservations[0].past[0].power} Kw
              </Text>
            </Text>
            <Text style={styles.infosTxtTitle}>
              Date :{" "}
              <Text style={styles.infosTxt}>
                {user.allReservations[0].past[0].date}
              </Text>
            </Text>
            <Text style={styles.infosTxtTitle}>
              Durée :{" "}
              <Text style={styles.infosTxt}>
                {user.allReservations[0].past[0].duration}
              </Text>
            </Text>
            <Text style={styles.infosTxtTitle}>
              Prix :{" "}
              <Text style={styles.infosTxt}>
                {user.allReservations[0].past[0].price}
              </Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => handleAddFavorite()}>
            <AntDesign name={iconFav} size={32} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  } else if (user.allReservations[0].past.length === 0) {
    reservationFinished.push(
      <View style={styles.infosView}>
        <View style={styles.line}></View>
        <View style={styles.infosContainer}>
          <Text style={{ textAlign: "center", width: "100%" }}>
            Vous n'avez aucune réservations passées
          </Text>
        </View>
      </View>
    );
  }

  if (modalRateVisible) {
    return (
      <ModalRateReservation
        isFavorite={isFavorite}
        handleAddFavorite={handleAddFavorite}
        modalRateVisible={modalRateVisible}
        setModalRateVisible={setModalRateVisible}
        borneInfos={
          user.allReservations[0].past[user.allReservations[0].past.length - 1]
        }
      />
    );
  } else {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.viewEnCour}>
            <View style={styles.enCour}>
              <Text style={styles.enCourTxt}>Recharge en cours</Text>
            </View>
            <View style={styles.line}></View>
            {reservationOngoing}
          </View>

          <View style={styles.viewEnCour}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={styles.enCour}>
                <Text style={styles.enCourTxt}>Recharges à venir</Text>
              </View>
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
                <Text style={styles.enCourTxt}>Recharges passées</Text>
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
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121F3A",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 120,
  },

  infosContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },

  infosTxtTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
    // fontFamily: "Roboto-Medium",
  },

  infosTxt: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    // fontFamily: "Roboto-Medium",
  },

  infos: { width: "60%" },

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
    // fontFamily: "Roboto",
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

  btnTxt: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    // fontFamily: "Roboto",
  },

  viewTimeStamp: {
    width: "100%",
    alignItems: "center",
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

  timerTxt: {
    fontSize: 25,
    color: "black",
    // fontFamily: "Roboto"
  },
});

export default MesRechargesScreen;
