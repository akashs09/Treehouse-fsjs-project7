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

const recent_tweet_params = {
  screen_name: 'sharma_000',
  count: 5
};
T.get('statuses/user_timeline', recent_tweet_params, recentTweetData);
T.get('friends/list',recent_tweet_params,recentFollowersData);
T.get('direct_messages/sent',{count: 5},recentDirectMessages);


const globalObj = {
  tweets:[],
  followers:[],
  directMessages:[]
};

app.get('/', (request, response) => {
  response.render('everything', {globalObj});
});


app.post('/', (request,response) => {
  const tweet = {status: ''};
  tweet.status = request.body.tweet;
  tweeting(tweet);
  setTimeout(refresh, 3000);
/*
The data from the json REST API returns  with newest tweet but not sure why when i call to refresh it does not update client Interface
*/
// response.render('everything', {globalObj});
response.redirect('/');
});
function tweeting(tweet){
  console.log(`tweet post: ${tweet.status}`);
  T.post('statuses/update', tweet);
};
function refresh(){
  T.get('statuses/user_timeline', recent_tweet_params, recentTweetData);
}
function recentTweetData(err, data, response){
  if (err) {
    console.log("Not connected to internet");
  }
  else {
  let recent_tweets = data;
  // console.log(recent_tweets[0].text);
  globalObj.screen_name = recent_tweets[0].user.screen_name;
  globalObj.profile_pic = recent_tweets[0].user.profile_image_url_https;
  globalObj.background_image = recent_tweets[0].user.profile_banner_url;
  globalObj.name = recent_tweets[0].user.name;
  globalObj.followers_count = recent_tweets[0].user.friends_count;
  getHours(recent_tweets[0].user.created_at);


  for (let i = 0; i < recent_tweets.length; i++){
    // console.log(`${i+1}: ${recent_tweets[i].text}`);
    globalObj.tweets.push({
      message: recent_tweets[i].text,
      datetweeted: getHours(recent_tweets[i].created_at),
      num_of_likes: recent_tweets[i].favorite_count,
      num_of_retweets: recent_tweets[i].retweet_count
    });
  }
}
}

function getHours(date){
  const d = new Date();
  const f = new Date(date);
  let hours = Math.abs(d - f) / 36e5;
  return Math.round(hours);
}

const recent_followers_params = {
  screen_name: 'sharma_000',
  count: 5
}

function recentFollowersData(err, data, response){

  let recent_followers = data;

  for (let i = 0; i < recent_followers.users.length; i++){
    globalObj.followers.push({
      follower_name: recent_followers.users[i].name,
      follower_screen_name: recent_followers.users[i].screen_name,
      follower_image_url: recent_followers.users[i].profile_image_url_https
    });
  }
}

function recentDirectMessages(err, data, response){
  let recent_direct_messages = data;
  // console.log(recent_direct_messages);
  for (let i = 0; i < recent_direct_messages.length; i++){
    globalObj.directMessages.push({
      direct_message: recent_direct_messages[i].text,
      created: getHours(recent_direct_messages[i].created_at)
    });
  }
}
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  res.render('error',{globalObj});
});

app.listen(3000, () => {
    console.log('The application is running on localhost:3000!')
});
