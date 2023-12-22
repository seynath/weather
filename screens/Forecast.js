import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Modal,
  Button,
} from "react-native";

import { ChevronDoubleDownIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { ChevronDoubleRightIcon, MapPinIcon } from "react-native-heroicons/solid";
import { useCallback, useState } from "react";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "../api/weather.js";
import { useEffect } from "react";

const theme = { bgWhite: (opacity) => `rgba(255,255,255,${opacity})` };

export default function Home() {
  const [forecast, setForecast] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({}); //{current:{},forecast:{}


  // When we enter a location get the weather forecast for that location

  const handleLocation = (item) => {
    setLocations([]);
    setShowSearch(false);
    fetchWeatherForecast({ city: item.name, days: 7 }).then((res) => {
      console.log(res);
      setWeather(res);
    });
  };

  const handleSearch = (loc) => {
    if (loc.length > 2) {
      fetchLocations({ city: loc }).then((res) => {
        setLocations(res);
      });
    }
  };

  //When application first render, useeffect will call the fetchMyWeatherData function and give the default data
  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    let city = "Colombo";
    fetchWeatherForecast({
      city,
      days: "7",
    })
      .then((data) => {
        // console.log('got data: ',data.forecast.forecastday);
        setWeather(data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  //debounce function is used to call the handleSearch function after 1200ms
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
  const { location, current } = weather;
  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {/* <Image
      source={require("../assets/colorkit.png")}
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      resizeMode="cover"
      /> */}
    <ScrollView>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <View
          style={[
            styles.searchPanel,
            {
              backgroundColor: showSearch ? theme.bgWhite(0.2) : "transparent",
            },
          ]}
        >
          {showSearch ? (
            <TextInput
              onChangeText={handleTextDebounce}
              placeholder="Search"
              placeholderTextColor={"#008585"}
              className=" rounded-full pl-6 h-10 flex-1 text-lg"
              style={{ color: "#008585" }}
            />
          ) : null}

          <TouchableOpacity
            style={{ backgroundColor: theme.bgWhite(0.3) }}
            className="p-3 m-1 rounded-full"
            onPress={() => setShowSearch(!showSearch)}
          >
            <MagnifyingGlassIcon size="20" color="#008585" />
          </TouchableOpacity>
        </View>

        {/* Search Results */}
        {locations.length > 0 && showSearch ? (
          <View className=" absolute mt-14 z-50 left-0 right-0 bg-slate-200 rounded-3xl">
            {locations.map((loc, index) => {
              let showBorder = index + 1 != locations.length;
              let borderClass = showBorder
                ? " border-b-2 border-b-gray-400"
                : "";

              return (
                <TouchableOpacity
                  key={index}
                  className={"p-3 flex-row justify-start z-50 " + borderClass}
                  style={{ zIndex: 70 }}
                  onPress={() => {
                    handleLocation(loc);
                    // setLocation([]);
                    // setShowSearch(false);
                  }}
                >
                  <MapPinIcon size={20} color={"brown"} />
                  <Text className="ml-5 text-lg">
                    {loc.name}, {loc.country}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
      </View>

      {/* Current DEtails */}
      <View style={styles.crntWeather}>
        <View style={{ flex: 2 }}>
          <Image
            //source={require("./assets/storm.jpg")}
            source={{ uri: "https:" + current?.condition.icon }}
            style={[styles.imageWheather, { width: 200, height: 200 }]}
          />
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ color: "#008585", fontSize: 30, fontWeight: "bold" }}>
            {location?.name},
          </Text>
          <Text style={{ color: "#008585", fontSize: 20, fontWeight: "bold" }}>
            {location?.country}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 40, alignItems: "center", flex: 1 }}>
          <Text style={{ color: "#008585", fontSize: 30, fontWeight: "bold" }}>
            {current?.temp_c}°c
          </Text>
          <Text
            style={{
              color: "#008585",
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {current?.condition.text}
          </Text>
        </View>
      </View>

      {/* Future Days */}
      <View style={[styles.future]}>
        <View
          style={{
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              color: "#008585",
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
              justifyContent: "center",
            }}
          >
            Next Week Report
          </Text>


            {/* //this Pressable event show the forecast of next week by Modal */}
          <Pressable
          style={{ flex:1,minHeight:90, alignItems: "center", width: "100%", paddingHorizontal: 20,
        borderWidth: 2,
        marginVertical: 15,
        justifyContent:"center",
        borderColor: "#74a892",
        borderRadius: 20,

        }}
          onPress={() => {
            setForecast(!forecast);
          }}
        >
          
            <Text style={{ color: "#008585", fontSize: 30, fontWeight: "bold" }}>
              Next Week Forecast <ChevronDoubleRightIcon size={20} color="#008585" />

            
            </Text>
          
        </Pressable>
        </View>




        {/* Forecast Modal */}

        <Modal
          visible={forecast}
          onRequestClose={() => {
            setForecast(!forecast);
          }}
          animationType="slide"
        >
          <View style={{ flex: 1,backgroundColor:"#9ABEAF" }}>
           
          
              <ScrollView
                contentContainerStyle={{
                  paddingHorizontal: 10,
                  paddingVertical: 30,

                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                //className="mt-30"
                showsHorizontalScrollIndicator={false}
              >
                {weather?.forecast?.forecastday?.map((item, index) => {
                  const date = new Date(item.date);
                  const options = { weekday: "long" };
                  let dayName = date.toLocaleDateString("en-US", options);
                  dayName = dayName.split(",")[0];

                  return (
                    <View
                      key={index}
                      style={{
                        backgroundColor: theme.bgWhite(0.2),
                        borderRadius: 20,
                        padding: 10,
                        paddingHorizontal: 30,
                        width: 340,
                        marginVertical: 5,
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                        borderWidth: 2,
                        borderColor: "#74a892",
                      }}
                    >
                      <Image
                        source={{ uri: "https:" + item?.day?.condition?.icon }}
                        style={{ width: 50, height: 50 }}
                      />
                      <Text
                        style={{
                          color: "#008585",
                          fontSize: 20,
                          fontWeight: "bold",
                        }}
                      >
                        {dayName}
                      </Text>
                      <Text style={{color:"#008585",fontSize:20,fontWeight:"bold"}}>
                        {item?.day?.avgtemp_c}&#176;
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
              <Button
                title="Close"
                onPress={() => {
                  setForecast(!forecast);
                }}
                color="#74a892"
                height="50"
                

              />
              
            
          </View>
        </Modal>

  
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}


//this is the style sheet for the Forecast
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b8e0d4",
    paddingTop: 40,
    justifyContent: "space-between",
  },
  searchBar: {
    flex: 1,
    position: "relative",
    marginHorizontal: 20,
  },
  searchPanel: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    justifyContent: "flex-end",
  },
  crntWeather: {
    flex: 4,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.bgWhite(0.2),
    borderRadius: 50,
    marginHorizontal: 20,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#74a892",
    minHeight: 100,
    marginVertical:30,
    paddingVertical:30,
  },
  future: {
    flex: 2,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

