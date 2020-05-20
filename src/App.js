import React , {useState, useEffect} from 'react';
import {usePosition } from 'use-position'
import './App.css';

import {LoadScript, GoogleMap, Marker, InfoWindow} from "@react-google-maps/api"



let ICON ="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
let infoID = 0;
let markID = 0;
const centre = {
  lat: 42.4072,
  lng: -71.3824
}
/**------------------------------------------------------------------- */

function MarkerWithWindow(props){
  let [isWindowOpen, changeWinState ] = useState(false)
  return(
    <React.Fragment key={markID++}>
    <Marker key={props.store.id} position={props.position}
          icon= {ICON}
          onClick={()=> changeWinState(!isWindowOpen)}
        >
        </Marker>
    {isWindowOpen && <InfoWindow position={props.position} key={infoID++} 
    onCloseClick={()=> changeWinState(false)}>
      <div>
        Name: {props.store.companyname}<br/>
        Address: {props.store.address}<br/>
        City: {props.store.city}<br/>
        State: {props.store.state}
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


  const sendToNode = () =>{

    console.log("in the even sendToNode")
    const zip = document.querySelector("#zip").value;
    fetch(`http://localhost:3000/?zip=${zip}`).then(res => res.json())
    .then(stores => {
      if(stores === []) alert("Please try again now!")
      else setStores(stores)
    
    })

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
        center={centre}
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
            <MarkerWithWindow key={"child"+toString(index)} position={{lat: parseFloat(store.lat), lng: parseFloat(store.lng)}} store={store} />
        </React.Fragment>
        )}
      )}
      </GoogleMap>
    </LoadScript>
        
        <input type={"text"} placeholder={"Zip Code Here"} id={"zip"}/> 
       {/* <input type={"text"} placeholder={"Radius"} id={"radius"}/>  */}
       <button onClick={sendToNode} >Find stores</button>
    </>
      )
    }
  return (
    <React.Fragment key={infoID++}>
      {console.log("rendering")}
    {console.log(lat+" "+ lng)}
     

    <LoadScript googleMapsApiKey={process.env.REACT_APP_MAPBOX_TOKEN}>
      <GoogleMap
      
        mapContainerStyle={{
          width: '100vmax',
          height: '400px'
        }}
        center={centre}
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
    <input type={"text"} placeholder={"Zip Code Here"} id={"zip"}/> 
    {/* <input type={"text"} placeholder={"Radius"} id={"radius"}/>  */}
    <button onClick={sendToNode} id={"findStores"} >Find stores</button>

    </React.Fragment>
  );
  }
  else{
    console.log(latitude, longitude)
    return "Allow locations please!"
    
  }
}






export default App;
