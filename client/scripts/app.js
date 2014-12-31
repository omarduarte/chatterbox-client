var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  username: null,
  roomname: 'No rooms selected',
  roomnames: {},
  friendsOf: {},
  $dropDown: null
};

app.init = function() {
  this.$dropDown = $('.roomnames');
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

app.appendDropdownItem = function(room) {
  var $roomname =  $('<option></option>');
  if (room === this.roomname) {
    $roomname.attr('selected', 'selected');
  }
  $roomname.attr('value',room);
  $roomname.text(room);
  $roomname.appendTo(this.$dropDown);
};

app.populateRoomnamesDropdown = function() {


  this.$dropDown.children().remove();
  this.roomnames['No rooms selected'] = 'No rooms selected';
  for (var room in this.roomnames) {
    this.appendDropdownItem(room);
    // var $roomname =  $('<option></option>');
    // if (room === this.roomname) {
    //   $roomname.attr('selected', 'selected');
    // }
    // $roomname.attr('value',room);
    // $roomname.text(room);
    // $roomname.appendTo($dropDown);
  }
};

app.fetch = function() {
  $('.messages').children().remove();
  var params = {order: '-createdAt'};
  if (this.roomname !== "No rooms selected") {
    params.where = {'roomname': this.roomname};
  }

  $.ajax({
      // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: params,
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
        $('<a href="#"></a>').appendTo($message).addClass('username').text(result.username);
        $('<div></div>').appendTo($message).addClass('text').text(result.text);
        $('<div></div>').appendTo($message).addClass('time').text(result.updatedAt);
      }
      this.populateRoomnamesDropdown();
    }.bind(app),
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message');
    }
  });
};


$(document).ready(function() {
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

  $('.messages').on('click','a.username', function(event){
    if (app.username !== null) {
      var friend = this.text;
      if(!app.friendsOf.hasOwnProperty(app.username)) {
        app.friendsOf[app.username] = {};
      }
      app.friendsOf[app.username][friend] = friend;
    }
  });

  $('.roomnames').on('change', function(event){
    app.roomname = $('.roomnames').val();
    this.fetch();
    this.populateRoomnamesDropdown();
    console.log(app.roomname);
  }.bind(app));

});

// this.roomname === 'string'
// this.roomnames === 'object'

//





