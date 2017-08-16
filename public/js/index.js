var socket = io();


function injectForm(theLink) {
  var alphaExp = /^[a-zA-Z]+$/;
  var userRes1 = prompt('Enter your desired username:');
  if (userRes1==null || userRes1=="")
  {
      alert("A username must be chosen!");
      window.location.href=window.location.href
  }
  else if (!userRes1.match(alphaExp))
  {
      alert("Name must contain letters only!")
      window.location.href=window.location.href
  }else{
  userRes = userRes1.toLowerCase().replace(/\b[a-z]/g, function(letter) {
    return letter.toUpperCase();
  })
  var url = window.location.href + 'chat.html?name='+userRes+'&room='+theLink.innerHTML;
  window.location.assign(url);
  return false;// cancel the click
}
}



socket.on('updateRoomList', function(rooms){
  var ul = jQuery('<ul></ul>');
    rooms.forEach(function (room) {
    ul.append(jQuery('<li onclick="return injectForm(this);" class="links_all" id="link_'+room+'"><a href="#"/></li>').text(room));
    })
    jQuery('#roomsContent').html(ul);
});
jQuery(document).ready(function($) {
       $('#chName').keyup(function(event) {
           var textBox = event.target;
           var start = textBox.selectionStart;
           var end = textBox.selectionEnd;
           textBox.value = textBox.value.charAt(0).toUpperCase() + textBox.value.slice(1);
           textBox.setSelectionRange(start, end);
       });
            $('#uName').keyup(function(event) {
              var textBox = event.target;
              var start = textBox.selectionStart;
              var end = textBox.selectionEnd;
              textBox.value = textBox.value.charAt(0).toUpperCase() + textBox.value.slice(1);
              textBox.setSelectionRange(start, end);
          });
      });
      $(function() {


        $('#uName').on('keypress', function (event) {
            var regex = new RegExp("^[a-zA-Z]+$");
            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
            if (!regex.test(key)) {
               event.preventDefault();
               return false;
            }
        });


  $('#chName').on('keypress', function (event) {
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
       event.preventDefault();
       return false;
    }
});

});
