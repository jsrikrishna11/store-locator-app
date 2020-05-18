import React , {useState, useEffect} from 'react';
import {usePosition } from 'use-position'
import './App.css';
import {Card, Stack, Text, ThemeProvider} from 'react-ui'
import {tokens, components} from 'react-ui/themes/base'
import {LoadScript, GoogleMap, Marker, InfoWindow} from "@react-google-maps/api"

components.Card = {
  width: 500,
  background: 'white',
  color: '#000',
  border: '1px solid',
  borderColor: '#EEEEEE',
  padding: 5,
  borderRadius: 2,
  boxShadow: 2
}

let ICON ="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
let infoID = 0;
let markID = 0;
let callCounter = 0;
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

  const distance = (position, unit)=>{
    if ((position.lat === centre.lat) && (position.lng === centre.lng)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * position.lat/180;
      var radlat2 = Math.PI * centre.lat/180;
      var theta = position.lng-centre.lng;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit==="K") { dist = dist * 1.609344 }
      if (unit==="N") { dist = dist * 0.8684 }
      return Math.round(dist);
    }
  }
  const sendToNode = () =>{
    console.log("in the even sendToNode")
    const zip = document.querySelector("#zip").value;
    fetch(`http://localhost:3000/?zip=${zip}`).then(res => res.json())
    .then(stores => {
      if(stores.length === 0 && callCounter < 5) {
        callCounter++;
        setTimeout(sendToNode, 1000)
      }
      else if(callCounter < 5) {
        setStores(stores)
        callCounter = 0;
      }
      else{
        console.log("Server Failed!")
      }
    
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
    
    <div >
    {
          stores.map((store,index)=>{
           
                  
                  return(  
            <ThemeProvider tokens={tokens} components={components}>
              <Card>
                <Stack direction="vertical" align="flex-start" key={index}>
                  <Text size={16}>Company Name: {store.companyname}</Text>
                  <Text size={14}>Address: {store.address}</Text>
                  <Text size={14}>City: {store.city}</Text>
                  <Text size={14}>Country: {store.country}</Text>
                  <Text size={14}>Distance: {distance({lat: store.lat, lng: store.lng}, "K")} Km </Text>
                </Stack>
              </Card>
            </ThemeProvider>
                    )
            })
        }
    </div>
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
