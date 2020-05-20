var express = require('express');
var router = express.Router();
var myParser = require("body-parser");
const url = require('url');
const querystring = require('querystring');
const { Sequelize , DataTypes, Op} = require('sequelize');
const {Client, Status} = require("@googlemaps/google-maps-services-js")


const key = "AIzaSyDcIChPg5D9yzbTfVUua6sCU22cEDYSMDM"

/* Db settings */
const sequelize = new Sequelize('Test', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql'
});

try{
  sequelize.authenticate().then(()=> console.log("connection success!"));
}
catch (error) {
  console.error('Unable to connect to the database:', error);
}

/* Models */

const Store = sequelize.define('test',{
  companyname:{
    type: DataTypes.CHAR(5),
    allowNull: true
  },
  companyid:{
    type: DataTypes.NUMBER,
    primaryKey: true
  },
  address1:{
    type: DataTypes.CHAR(5),
    allowNull: true
  },
  city:{
    type: DataTypes.CHAR(5),
    allowNull: true
  },
  state:{
    type: DataTypes.CHAR(5),
    allowNull: true
  },
  zip:{
    type: DataTypes.CHAR(5),
    allowNull: true
  },
  country:{
    type: DataTypes.CHAR(20),
    allowNull: true
  },
  lat:{
    type: DataTypes.DECIMAL(8,4),
    type: true
  },
  lng:{
    type: DataTypes.DECIMAL(8,4),
    allowNull: true
  }
},
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false
})

console.log("store= "+ Store+ "is this undefined?")
/*----------------------------------------------------*/

/*Google maps setup*/

const client = new Client({});
// client.geocode({
//   params:{
//     address: 'GILBERT\'S WRITTEN WO'+" "+'72 CENTER SQUARE',
//     key: key
//   },
//   timeout: 10000,
// }).then((result)=>{
//   if(result.data.status === Status.OK){
//     result.data.results.forEach((location)=> console.log(location.geometry.location));
//   }
//   else console.log(result.data.error_message+ " is this undefined");
// })
// .catch((e)=>{
//   console.log(e+" is this undefined?");
// })


/* GET home page. */
router.get('/', function(req, res, next) {
    let query = req.query;
    let zip = query.zip;
    console.log(zip);
    let responseCoords = [];
    
    Store.findAll({
      attributes: ['companyname', 'address1', 'city', 
      'state', 'country', 'lat', 'lng', 'companyid'  ],
      where:{
        zip:{
          [Op.eq]: zip
        }
      } 
    }).then((result, error)=>{
        result.map((store, index)=>{
          //for each store I want to check if the lat and lng are there!
          //if they aren't there then use google and update!
          if(store.lat === null || store.lng === null){
            console.log('I entered coz no lat/lng')
            client.geocode({
              params:{
                address: store.companyname+' '+store.address1+' '+
                store.city+' '+store.state+' '+store.country,
                key: key
              },
            }).then((result)=>{
              console.log("got the values from google!")
              if(result.data.status === Status.OK){
                let position = result.data.results[0].geometry.location
                console.log(position)
                //updating here!
                Store.update(position, {
                  where:{
                    companyid:{
                      [Op.eq]: store.companyid
                    }
                  }
                }).then((result,error)=>{
                  //pushing here!
                  if(!error) {
                    console.log("successful update")
                    responseCoords.push({companyname: store.companyname, address: store.address1, 
                      city: store.city, state: store.city, country: store.country, lat: position.lat, lng: position.lng});
                    console.log(responseCoords)
                  }//for updation error
                  else{
                    res.send("Updation issue! Contact developer!")
                  }
                }
              )
              }
            })
          }
          else{
            console.log("Lat and lng there!")
            responseCoords.push({companyname: store.companyname, address: store.address1, 
              city: store.city, state: store.city, country: store.country, lat: store.lat, lng: store.lng});
          }
          console.log("here is map iteration : "+ index)
          console.log(responseCoords)
        })
        console.log("I am sending data now!")
        console.log(responseCoords)
        res.send(JSON.stringify(responseCoords))
      })
    });
  // Store.findOne().then((store, error)=>{
  //   //write updation logic here!
    
  //   client.geocode({
  //     params:{
  //       address: store.companyname+" "+store.address1+" "+store.city+" "+store.state+" "+store.zip,
  //       key: key
  //     },
  //     timeout: 10000,
  //   }).then((result)=>{
  //     if(result.data.status === Status.OK){
  //       result.data.results.forEach((location)=> console.log(location.geometry.location));
  //     }
  //     else console.log(result.data.error_message+ " is this undefined");
  //   })
  //   .catch((e)=>{
  //     console.log(e+" is this undefined?");
  //   })
// });


module.exports = router;
