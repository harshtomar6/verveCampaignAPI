// Dependencies
let express = require('express');
let router = require('express').Router();
let cryptoJs = require('crypto-js');

//Allow CORS
router.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Expose-Headers','X-auth')

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


const test = true
//Production salt and key get it from payumoney
const SALT = "d5rpUJqp8B"
const MERCHANT_KEY = "Tcsh5kwc"
//test salt and key get it from payumoney
const TEST_SALT = "eCwWELxi"
const TEST_KEY = "gtKFFx"
// hashSequence "key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10";

//function to generate random txnid , 21 characters
function genTxnid(){
  const d = new Date()
  let gentxnid = cryptoJs.SHA256(Math.floor((Math.random()*10)+1).toString()+d.getTime().toString())
  return 'v'+gentxnid.toString().substr(0,20)
}

//get hash as json request 
router.post('/',(req,res)=>{
  console.log(req.body);
  let hashSequence = "key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10"
  hashSequence = hashSequence.split('|')
  let hash= ''

  if(!("txnid" in req.body)){
    req.body.txnid = genTxnid()
  }
  if(test){
      req.body.key = TEST_KEY

  }
  else {
      req.body.key = MERCHANT_KEY
  }
  hashSequence.map((val)=>{
    if(val in req.body)
      hash += req.body[val]
    else
      hash += ''
    hash +='|'
  })
  if(test){
    hash+=TEST_SALT
    req.body.salt=TEST_SALT
  }
  else{
    hash+=SALT
    req.body.salt=SALT
  }


  hash = cryptoJs.SHA512(hash).toString()

  res.send({body:req.body,hash})

})

module.exports = router;