var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  username: null,
  roomname: null,
  roomnames: {}
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
app.clearMessages = function() {

};

app.populateRoomnamesDropdown = function() {
  var $dropDown = $('.roomnames');
  $dropDown.children().remove();
  for (var room in this.roomnames) {
    var escapedRoom = _.escape(room);
    $dropDown.append('<option value="' + escapedRoom +'">' + escapedRoom + '</option>');
  }
};

app.fetch = function() {
  $('.messages').children().remove();
  $.ajax({
      // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: {order: '-createdAt'},
    // data: encodeURIComponent('order=-createdAt'),
    contentType: 'application/json',
    success: function (data) {
      for (var i = 0; i < data.results.length; i++) {
        var result = data.results[i];
        // Populating Roomnames
        var roomname =  result.roomname;
        if (roomname) {
          this.roomnames[roomname] = roomname;
        }

        var $message = $('<div></div>').appendTo('.messages');
        $message.addClass('message');
        $('<div></div>').appendTo($message).addClass('username').text(result.username);
        $('<div></div>').appendTo($message).addClass('text').text(result.text);
        $('<div></div>').appendTo($message).addClass('time').text(result.updatedAt);
      }
    }.bind(app),
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message');
    }
  });
};


$( document ).ready(function() {
  app.init();

  $('.submit-username').on('click', function(event){
    this.username = $('.set-username').val();
  }.bind(app));

  $('.submit-message').on('click', function(event){
    var text = $('.set-message').val();
    var message = {
      'username': this.username,
      'text': text,
      'roomname': this.roomname
    };
    app.send(message);
  }.bind(app));
});

//field to type username
  //store username in app object
    //var username = $('.set-username').val();
    //this.username = username;
//field to type message
  //store message
//call send with newly created message object
