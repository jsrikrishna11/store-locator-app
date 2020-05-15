var express = require('express');
var router = express.Router();
var myParser = require("body-parser");
const { Sequelize , DataTypes} = require('sequelize');
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
  let query_result;
  Store.findOne().then((store, error)=>{
    //write updation logic here!
    
    client.geocode({
      params:{
        address: store.companyname+" "+store.address1+" "+store.city+" "+store.state+" "+store.zip,
        key: key
      },
      timeout: 10000,
    }).then((result)=>{
      if(result.data.status === Status.OK){
        result.data.results.forEach((location)=> console.log(location.geometry.location));
      }
      else console.log(result.data.error_message+ " is this undefined");
    })
    .catch((e)=>{
      console.log(e+" is this undefined?");
    })
  
});
});


module.exports = router;
