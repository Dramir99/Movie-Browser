import React, { useState , useEffect} from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TextInput, FlatList, TouchableOpacity } from 'react-native';
import {baseLink, key} from './config.json';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// test ID: tt 04 685 69
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Movie Tiles" component={MovieInfo} />
      <Stack.Screen name="Movie Tiles by ID" component={MovieInfoByID} />
    </Stack.Navigator>
  );
}

const AppButton = ({ onPress, title }) => (
  <TouchableOpacity onPress={onPress} style={styles.appButton} >
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
);

function HomeScreen({route, navigation }) {
  const[nameOfMovie,setMovieName] = useState('');

  useEffect(() => {
    setMovieName(route.params?.nameOfMovie ? route.params.nameOfMovie : '');
  }, [route.params]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.viewUserTimerText}>
      <Text style={styles.HomeText}>Search By ID:</Text>
      </View>
      <View style={styles.viewUserTimerText}>
        <TextInput  value={nameOfMovie} onChangeText={(text) => setMovieName(text)} style={styles.userTimerInput} />
        <AppButton onPress={() => {navigation.navigate('Movie Tiles', {
            MovieName: nameOfMovie
          });
          }} title="Search" />
      </View>
    </SafeAreaView>
  );
}
function MovieInfoByID({route}) {
  const MovieID = route.params.MovieID;

  const [isLoading, setLoading] = useState(true);
  const [moviedata, setMovieData] = useState([]);

  const fetchApiCall = async (MovieIDB) => {
    const nameUrl = `${baseLink}?i=${MovieIDB}&apikey=${key}`;
    const response = await fetch(nameUrl);
    const data = await response.json();
    setLoading(false);
    setMovieData(data);
  }

  useEffect( () => {   
    fetchApiCall(MovieID);
  }, []);

  return (

    <SafeAreaView style={styles.safeAreaView}>

      {isLoading ? <Text style={styles.timerText}>Loading...</Text> : 

      ( <View style={styles.viewTimerText}>
          <Image source = {{uri: moviedata.Poster}}style = {styles.ImageSetting}/>
          <View style={styles.MovieInfoText}>
            <Text style={styles.userText}>{moviedata.Title}</Text>
            <Text style={styles.userText}>ID:{moviedata.imdbID}</Text>
            <Text style={styles.userText}>Plot:{moviedata.Plot}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

function MovieInfo({route, navigation}) {

  const MovieName = route.params.MovieName;
  const pages = 10;

  const[pageNum, setPageNum] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const [moviedata, setMovieData] = useState([]);

  const fetchApiCall = async (nameOfMovie, pageNum) => {
    const nameUrl = `${baseLink}?s=${nameOfMovie}&page=${pageNum}&apikey=${key}`;
    const response = await fetch(nameUrl);
    const data = await response.json();
    setLoading(false);
    var newArray = (moviedata).concat(data.Search);
    setMovieData(newArray);
  }

  useEffect( () => { 
    if(pageNum != pages){
      fetchApiCall(MovieName,pageNum);
      setPageNum(pageNum+1)
    }
    
  }, [moviedata]);

  return (

    <SafeAreaView style={styles.safeAreaView}>

      {isLoading ? <Text style={styles.timerText}>Loading...</Text> : 

      ( <View style={{padding:10}}>
          <FlatList
            padding ={30}
            data={moviedata}
            renderItem={({item}) => 
            <View style={styles.viewTimerText}>
              <Image source = {{uri: item.Poster}}style = {styles.ImageSetting}/>
              <View style={styles.MovieInfoText}>
                <Text style={styles.userText}>{item.Title}</Text>
                <AppButton onPress={() => {navigation.navigate('Movie Tiles by ID', {
            MovieID: item.imdbID
          });
          }} title="More Info" />
              </View>
              
            </View>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  ImageSetting: {
    width: 150,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
  },
  viewTimerText: {
    flexDirection: "row",
    paddingBottom: 20,
  },
  viewUserTimerText: {
    flexDirection: "row",
    padding: 5,
    alignItems: 'center'
  },
  MovieInfoText: {
    flexDirection: 'column',
    borderColor: '#ffa500',
    borderWidth: 1,
    flexShrink: 1,
    paddingBottom: 10
  },
  safeAreaView: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#2c3e58',
    justifyContent: 'center',
    alignItems: 'center'
  },
  userText:{
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 10
  },
  HomeText:{
    paddingBottom: 10,
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',    
  },
  timerText: {
    color: '#FFF',
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    flexDirection: "row"
  },
  userTimerInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#3498db',
    height: 35,
    width: '50%',
    fontSize: 20,
    color: '#FFF',
    marginLeft: 30
  },
  appButton: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#f01d71',
  },
  appButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 16,
    textAlign: 'center'
  },
});
