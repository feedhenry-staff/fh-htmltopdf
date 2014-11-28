var express=require("express");
var app=express();
var convert=require("./converter");
var mbaasApi = require('fh-mbaas-api');
var mbaasExpress = mbaasApi.mbaasExpress();
var cors = require('cors');
// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys([]));
app.use('/mbaas', mbaasExpress.mbaas);


// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

app.use("/",express.static(__dirname+"/public"));
app.post("/api",function(req,res){
  res.type("pdf");
  convert(req,res,req.query);
});
// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));
app.listen(process.env.FH_PORT || 8001);
