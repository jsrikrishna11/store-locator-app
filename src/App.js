import React , {useState, useEffect} from 'react';
import {usePosition } from 'use-position'
import './App.css';

import {LoadScript, GoogleMap, Marker, InfoWindow} from "@react-google-maps/api"



let ICON ="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
let infoID = 0;
let markID = 0;
/**------------------------------------------------------------------- */

function MarkerWithWindow(props){
  let [notWindowOpen, changeWinState ] = useState(false)
  return(
    <React.Fragment key={markID++}>
    <Marker key={props.store.id} position={props.store.geometry.location}
          icon= {ICON}
          onClick={()=> changeWinState(!notWindowOpen)}
        >
        </Marker>
    {notWindowOpen && <InfoWindow position={props.position} key={props.store.place_id} 
    onCloseClick={()=> changeWinState(false)}>
      <div>
        Name: {props.store.name}<br/>
        Rating : {props.store.rating}<br/>
        Address: {props.store.formatted_address}
      </div>
    </InfoWindow>}
    </React.Fragment>
  
  )
}


function App() {
  let {latitude, longitude} = usePosition()
  let [lat, setLat] = useState()
  let [lng, setLng] = useState() 
  let [stores, setStores] = useState(null)


  useEffect(()=>{
    setLat(latitude)
    setLng(longitude)
    console.log("latitude changed!")
  }, [latitude, longitude])

  const findStores = () =>{
    console.log("I will find stores now!");
    let storename = document.querySelector("#name").value;

    console.log(storename);
    let radius = document.querySelector("#radius").value;
    const HEROKU = "https://cors-anywhere.herokuapp.com/";
    const GOOGLE = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="
    console.log(radius);
    fetch(HEROKU+GOOGLE+`${storename}&location=${latitude},${longitude}&radius=${radius}&key=${process.env.REACT_APP_MAPBOX_TOKEN}`, 
    { headers:{'X-Requested-With':'application/x-yaml'}}).then(respose => respose.json() )
    .then(data =>{
      setStores(data.results)
      console.log("changing stores values")
    } )
  }
  

  if(lat!== undefined || lng !== undefined){
  //if you found any stores!
    if(stores !== null){
      console.log(stores)
      return (
        <>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_MAPBOX_TOKEN}>
      <GoogleMap
      key={123}
        mapContainerStyle={{
          width: '100vmax',
          height: '400px'
        }}
        center={{
          lat: lat,
          lng: lng
        }}
        zoom={13}
        
      >
        <Marker key={"retghnbvcxskmnvbc"}
          position={
            {
              lat: lat,
              lng: lng
            }
          }
        >
        </Marker>
        {
        stores.map((store, index) => {
          return (
        <React.Fragment key={index}>
            <MarkerWithWindow key={store.id} position={store.geometry.location} store={store} />
        </React.Fragment>
        )}
      )}
      </GoogleMap>
    </LoadScript>
        
        <input type={"text"} placeholder={"Enter store here"} id={"name"}/> 
       <input type={"text"} placeholder={"Radius"} id={"radius"}/> 
       <button onClick={findStores} >Find stores</button>
    </>
      )
    }
  return (
    <React.Fragment key={infoID++}>
    {console.log(lat+" "+ lng)}
     

    <LoadScript googleMapsApiKey={process.env.REACT_APP_MAPBOX_TOKEN}>
      <GoogleMap
      
        mapContainerStyle={{
          width: '100vmax',
          height: '400px'
        }}
        center={{
          lat: lat,
          lng: lng
        }}
        zoom={13}
        key={"initContainer"}
      >
        <Marker
          position={
            {
              lat: lat,
              lng: lng
            }
          }
          key={"initYou"}
        >

        </Marker>
      </GoogleMap>
    </LoadScript>
    <input type={"text"} placeholder={"Enter store here"} id={"name"}/> 
    <input type={"text"} placeholder={"Radius"} id={"radius"}/> 
    <button onClick={findStores} id={"findStores"} >Find stores</button>

    </React.Fragment>
  );
  }
  else{
    return "Allow locations please!"
    
  }
}






export default App;
