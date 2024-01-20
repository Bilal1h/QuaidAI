var express = require('express');
var router = express.Router();
const userModel = require("../models/users");
const websiteModel = require("../models/website");
const passport = require("passport")

router.get('/', function(req, res, next) {
  res.render('index', { title: 'QuaidAi' });
});



router.get('/register', function(req, res) {
  res.render('register', {footer: false,title:"AI"});
});
router.get('/login', function(req, res) {
  res.render('login', {footer: false,title:"AI"});
});



router.get("/edit/:website",isLoggedIn,async function(req,res){
  const user = await userModel
  .findOne({
    username: req.session.passport.user
  })
  const website = await websiteModel.findOne({
    username:req.session.passport.user
  });
  res.render(`edit`,{title:`Edit ${website.title}`,user,website})
})
router.post("/edit/:website",isLoggedIn,async function(req,res){

   await websiteModel.findOneAndUpdate({
    username:req.session.passport.user
  },{
    name: `${req.body.floating_first_name_edit} ` + `${req.body.floating_last_name_edit}`,
    title: req.body.title_edit,
    email: req.body.email_edit,
    about: req.body.floating_about_edit,
    address: req.body.floating_address_edit,
    style:req.body.style_edit
  });
res.redirect("/profile")

})
router.get('/profile',isLoggedIn, async function(req, res) {
  const user = await userModel
  .findOne({
    username: req.session.passport.user
  }).populate("webs")
  const website = await websiteModel.findOne({
    username:req.session.passport.username
  });

  res.render('profile', {footer: true,user,website});

});

router.post("/register",function(req,res){
  const userData = new userModel({
    username:req.body.username,
    name:req.body.name,
    email:req.body.email,
    bio:req.body.bio
  });
  userModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })
})

router.post("/login", passport.authenticate("local",{
  successRedirect:`/profile/`,
  failureRedirect:"/login"
}) ,function(req,res,next){

})
router.get("/logout",function(req,res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get("/profile/:user/:webtitle/:type", isLoggedIn, async function(req, res) {
  const userloggedin = await userModel.findOne({
    username: req.params.user
  });
  const website = await websiteModel.findOne({
    username: req.params.user // Use req.params.user, not userloggedin
  });






  res.render(`./types/${req.params.type}/${req.params.type}`, { title: website.title, userloggedin, website });
});

router.get("/generate",isLoggedIn,async function(req,res){
  const userloggedin = await userModel.findOne({
    username: req.session.passport.user
  });
  res.render("generate",{title:"AI",userloggedin})
})
router.post("/generate", isLoggedIn, async function(req, res) {
  const userloggedin = await userModel.findOne({
    username:req.session.passport.user
  });


  const webmodel = await websiteModel.create({
    username: userloggedin.username,
    name: `${req.body.floating_first_name} ` + `${req.body.floating_last_name}`,
    title: req.body.title,
    email: req.body.email,
    about: req.body.floating_about,
    address: req.body.floating_address,
    user:userloggedin._id,
    style:req.body.style
  });
  userloggedin.webs.push(webmodel._id);
  await userloggedin.save()

res.redirect(`/profile/${userloggedin.username}/${webmodel.title}/${webmodel.style}`)
});
router.get("/delete/:website",isLoggedIn,async function(req,res){

  await websiteModel.findOneAndDelete({
   username:req.session.passport.user
 });
res.redirect("/profile")

})
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login")
}



module.exports = router;
