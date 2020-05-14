import React , {Component, useState, useEffect} from 'react';
import {usePosition } from 'use-position'
import './App.css';
import {
  withGoogleMap, withScriptjs, GoogleMap, Marker, InfoWindow, Circle
} from 'react-google-maps'

import Locations from './components/Location'
import { wait } from '@testing-library/react';

const mapStyles = {
  width: '100%',
  height: '100%',
};
/**------------------------------------------------------------------- */

const MyMapComponent = withScriptjs(withGoogleMap((props) =>{
  let id = 1;
  let icon ="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"

  return(
  <GoogleMap 
    defaultZoom={13}
    defaultCenter={{ lat: props.latitude, lng: props.longitude}}
  >
    <Marker key={id++} position={{lat:props.latitude, lng: props.longitude}}
      labelStyle={{backgroundColor: "yellow", fontSize: "32px", padding: "16px"}}>
      <div>You!</div>
    </Marker>
    {props.isMarkerShown ? (
      props.stores.map((store) => 
       <Marker key={store.id} position={{ lat: store.geometry.location.lat, lng: store.geometry.location.lng}}
       labelStyle={{backgroundColor: "blue", fontSize: "32px", padding: "16px"}} icon={icon} >
         <div>{store.name}</div>
       </Marker>
    )) : 
      (<></>)
      }
  </GoogleMap>
  )
}
))


function App() {

  let [locationSet, setLocation] = useState(false)
  let {latitude, longitude} = usePosition()
  let [lat, setLat] = useState()
  let [lng, setLng] = useState() 
  let [stores, setStores] = useState(null)
  let [changed, setChanged] = useState(false)


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
    let result;
    fetch(HEROKU+GOOGLE+`${storename}&location=${latitude},${longitude}&radius=${radius}&key=${process.env.REACT_APP_MAPBOX_TOKEN}`, 
    { headers:{'X-Requested-With':'application/x-yaml'}}).then(respose => respose.json() )
    .then(data =>setStores(data.results) )
  }
  
  if(lat!= undefined || lng != undefined){
  
    if(stores != null){
      console.log(stores)
      return (
        <>
        found stores
        {console.log(stores)}
        <MyMapComponent latitude={lat} longitude={lng} isMarkerShown={true} stores={stores}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAPBOX_TOKEN}&
        v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        />
        <input type={"text"} placeholder={"Enter store here"} id={"name"}/> 
       <input type={"text"} placeholder={"Radius"} id={"radius"}/> 
       <button onClick={findStores} >Find stores</button>
        </>
      )
    }
  return (
    <>
    {console.log(lat+" "+ lng)}
      <div style={{ height: '100vh', width: '100%' }}>
      <MyMapComponent latitude={lat} longitude={lng} isMarkerShown={false}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAPBOX_TOKEN}&
        v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
       <input type={"text"} placeholder={"Enter store here"} id={"name"}/> 
       <input type={"text"} placeholder={"Radius"} id={"radius"}/> 
       <button onClick={findStores} >Find stores</button>
    </div>
    </>
  );
  }
  else{
    return "Allow locations please!"
    
  }
}

export default App;
