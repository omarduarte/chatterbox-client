var app = {
  server: 'https://api.parse.com/1/classes/chatterbox'
};
app.init = function() {
  this.fetch();
  //window.setInterval(this.fetch.bind(app), 1000);
};

app.send = function(message) {
$.ajax({
  // always use this url
  url: 'https://api.parse.com/1/classes/chatterbox',
  type: 'POST',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message sent');
  },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message');
  }
});
};

app.fetch = function() {
  $('.messages').children().remove();
  $.ajax({
      // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log(data.results.length);
      for (var i = 0; i < data.results.length; i++) {
        var $message = $('<div></div>').appendTo('.messages');
        $message.addClass('message');
        $('<div></div>').appendTo($message).addClass('username').text(data.results[i].username);
        $('<div></div>').appendTo($message).addClass('text').text(data.results[i].text);
        $('<div></div>').appendTo($message).addClass('time').text(data.results[i].updatedAt);
      }
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message');
    }
  });
};


$( document ).ready(function() {
  app.init();
  $('.submit-username').on('submit', function(event){
    alert('button working');
  });

});

