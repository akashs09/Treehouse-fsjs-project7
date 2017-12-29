console.log("client side js attached");



const tweetUpdate = data => {
  console.log(data);
    // if (data.statusCode) {
    //     $('#tweet-textarea').val('');
    //     return $('form').append('<p style= "margin: 0 auto;text-align: center;" >' + data.message + '</p>')
    // }
    // let $oldTweet = $('.app--tweet--list').children().first('li').prop('outerHTML');
    // $('.app--tweet--list').prepend($oldTweet)
    // $newTweet=$('.app--tweet--list').children().first('li');
    // $('#tweet-textarea').val('');
    // $newTweet.find('.app--tweet--timestamp').html(data.date)
    // let avatar = $newTweet.find('.app--avatar').css({'background-image':'url('+data.picture+')'})
    // $newTweet.find('.app--tweet--author').html(avatar).append(data.author);
    // $newTweet.find('p').html(data.message);
    // $newTweet.find('.app--retweet').find('strong').html(data.retweet)
    // $newTweet.find('.app--like').find('strong').html(data.like);
}
// $('form').submit(function (e) {
//     e.preventDefault();
//     console.log($('#tweet-textarea').val());
//     console.log('form button clicked');
//     let $thisForm = $(this);
//     var data = {title: "title"};
// 					// data.title = "title";
// 					// data.message = "message";
//     $.ajax({
//   type: 'POST',
//   data: data,
//       contentType: 'application/json',
//               url: 'http://localhost:3000/endpoint',
//               success: function(data) {
//                   console.log('success');
//                   console.log(data);
//               }
//           });
// });
