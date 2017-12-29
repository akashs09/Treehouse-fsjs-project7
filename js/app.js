/* required modules */
const Twit = require('twit');
const config = require('../config.js');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const T = new Twit(config);


app.use(bodyParser.urlencoded({ extended: false}));
app.use('/static', express.static('public'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false}));
app.use('/static', express.static('public'));
app.set('view engine', 'pug');

let background_image = '';
let screen_name = '';
let vm = {};
function getHours(date){
  const d = new Date();
  const f = new Date(date);
  let hours = Math.abs(d - f) / 36e5;
  return Math.round(hours);
}

const getRecentTweets=(req,res,next)=>{
  T.get('statuses/user_timeline', {count: 5}, (err,tweets,response)=>{
    if(err) return next(err);
    req.tweets=tweets;
    next();
  });
}


const getRecentFollowersData=(req,res,next)=>{
  T.get('friends/list', {count: 5}, (err,followers,response)=>{
    if(err) return next(err);
    req.followers=followers;
    next();
  });
}

const getRecentDirectMessages=(req,res,next)=>{
  T.get('direct_messages/sent', {count: 5}, (err,Dms,response)=>{
    if(err) return next(err);
    req.Dms=Dms;
    next();
  });
}

app.get('/', getRecentTweets, getRecentFollowersData, getRecentDirectMessages, (req, res, next) => {
  vm = { tweets:req.tweets, friends:req.followers.users, dms:req.Dms };
  vm.screen_name=vm.tweets[0].user.screen_name;
  vm.background_image=vm.tweets[0].user.profile_banner_url;
  vm.profile_pic=vm.tweets[0].user.profile_image_url_https;
  vm.name=vm.tweets[0].user.name;
  // vm.date_tweeted=getHours(vm.tweets[0].user.created_at);
  for (let i = 0; i < 5; i++) {
    vm.tweets[i].created_at=getHours(vm.tweets[i].created_at);

  }
  // console.log(req.Dms);
  vm.followers_count=vm.tweets[0].user.friends_count;
  background_image:vm.screen_name;
  screen_name:vm.background_image;
  res.render('everything', vm);
});

app.post('/', (req,res,next) => {
  T.post('statuses/update', {status: req.body.tweet},(err,data,response) => {
    err? next(err):
      getRecentTweets;
      getRecentFollowersData;
      getRecentDirectMessages;
      vm = { tweets:req.tweets, friends:req.followers.users, dms:req.Dms };
      console.log(req.followers.users);
      vm.screen_name=vm.tweets[0].user.screen_name;
      vm.background_image=vm.tweets[0].user.profile_banner_url;
      vm.profile_pic=vm.tweets[0].user.profile_image_url_https;
      vm.name=vm.tweets[0].user.name;
      // vm.date_tweeted=getHours(vm.tweets[0].user.created_at);
      for (let i = 0; i < 5; i++) {
        vm.tweets[i].created_at=getHours(vm.tweets[i].created_at);

      }
      // console.log(req.Dms);
      vm.followers_count=vm.tweets[0].user.friends_count;
      background_image:vm.screen_name;
      screen_name:vm.background_image;
      res.render('everything', vm);
})});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status).render('error',{screen_name:screen_name,background_image:background_image});
});

app.listen(3000, () => console.log('The application is running on localhost:3000!'));
