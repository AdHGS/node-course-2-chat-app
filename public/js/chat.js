var socket = io();

function scrollToBottom() {
var messages = jQuery('#messages');
var newMessage = messages.children('li:last-child');

var clientHeight = messages.prop('clientHeight');
var scrollTop = messages.prop('scrollTop');
var scrollHeight = messages.prop('scrollHeight');
var newMessageHeight = newMessage.innerHeight();
var lastMessageHeight = newMessage.prev().innerHeight();

if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
  messages.scrollTop(scrollHeight);
}
}


socket.on('connect', function() {
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function(err) {
      if (err){
        alert(err); //bs modal / jsreact
        window.location.href = '/';
      }else{
        console.log('No error');
      }
    });
  });


socket.on('disconnect', function() {
  console.log('Disconnected from server!');

});

socket.on('updateUserList', function(users) {
var ol = jQuery('<ol></ol>');
users.forEach(function (user) {
  ol.append(jQuery('<li class="li_all" id="li_'+user+'"></li>').text(user));
  })
  jQuery('#users').html(ol);
  });

document.getElementById('messageBox').addEventListener('keyup',function(e){
    if (e.which == 13) this.blur();
});

document.addEventListener("visibilitychange", function() {
if (document.visibilityState == "hidden"){
  socket.on('notification', function(){
    // alert('jeff')
    // console.log('jeff')
  });
}
});


  $("#messageBox").focus(function() {
    socket.emit('isTyping')
    });
  $("#messageBox").focusout(function () {
    socket.emit('notTyping')
  });

socket.on('newMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('H:mm:ss a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('isTyping', function(name) {
  if($('#img_'+name).length){
    $("#img_"+name).attr("src","/images/33.gif");
    console.log('updating img')
  }else{
  jQuery('#li_'+name).append('<img class="img_all" id="img_'+name+'" src="/images/33.gif"/>')
    console.log('creating img')
  }
})

socket.on('notTyping', function(name) {
jQuery('#img_'+name).attr('src', '');
})
socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('H:mm:ss a');
    var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
     });
     jQuery('#messages').append(html);
       scrollToBottom();
   });

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    text: messageTextbox.val()
  }, function () {
messageTextbox.val('')
  })
})

var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
   locationButton.attr("disabled", true)
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser. Please upgrade.');
  }
  navigator.geolocation.getCurrentPosition(function(position) {
  socket.emit('createLocationMessage', {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  });
  setTimeout(function(){
  locationButton.attr("disabled", false) //.text('timeout') etc...
}, 10000);
  }, function() {
  alert('Unable to fetch location.');
  setTimeout(function(){
  locationButton.attr("disabled", false) //.text('timeout') etc...
}, 10000);
});
});
