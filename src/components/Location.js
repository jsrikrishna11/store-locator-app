import React, {Component, useState} from 'react'
import {
    withGoogleMap, withScriptjs, GoogleMap, Marker, InfoWindow, Circle
  } from 'react-google-maps'
import mapStyles from '../mapStyles';
import {usePosition} from 'use-position'


// function Map({latitude, longitude}){

//   return(
//     <GoogleMap
//       defaultZoom={14}
//       defaultCenter={{lat: , lng:  }}
//       defaultOptions={{style: mapStyles}}
//       >
//         <Marker
//         position={
//           {
//            lat: ,
//            lng:  
//           }
//         }/>
//         <Circle
//         radius={1500}
//         center={{lat: , lng: }}
//         strokeWeight={5}
//         strokeOpacity={0}
//         />
//       </GoogleMap>
//   )
// }

const MapWrapped = withScriptjs
class Locations extends Component{
    constructor(props){
        super(props);
        this.state= {
            lat: null,
            lng: null
        }
    }
    componentWillMount(){
        console.log("will mount")
        const {
            latitude,
            longitude
        } = usePosition(true);
        console.log(latitude+"  "+ longitude)
    }
    componentWillReceiveProps(){
        console.log("entered wrp")
        this.setState({lat: this.props.latitude, lng: this.props.longitude})
    }
    componentDidUpdate(){
        console.log("did update")
        console.log(this.state)
    }
    render(){
        console.log("rendering again"+this.state.lat)
        return(
            <>
                {this.state.lat}
            </>
        )
    }
}

export default Locations;


