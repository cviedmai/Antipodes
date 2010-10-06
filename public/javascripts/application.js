var CURRENT = "Current";
var ANTIPODES = "Antipodes";
var where = CURRENT; // Could also be antipodes

function initialize_map(){
  var myOptions = {
    zoom: 4,
    mapTypeControl: true,
    mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
    navigationControl: true,
    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
}

function update_map(){
  if(geo_position_js.init()){
    $('latitude').innerHTML="Receiving...";
    geo_position_js.getCurrentPosition(show_position,function(){$('latitude').innerHTML="Couldn't get location"},{enableHighAccuracy:true});
  }
  else{
    $('latitude').innerHTML="Functionality not available";
  }
}
function update_sunrise(lat, lon){
  new Ajax.Request('/antipodes/sunrise', {
  method:'get',
  parameters: {lat: lat, lon: lon},
  onSuccess: function(transport){
     var json = transport.responseText.evalJSON();
     $('sunrise').innerHTML = "Sunrise: "+json.rise;
     $('sunset').innerHTML = "Sunset: "+json.set;
   }
});
}

function show_position(p){
  // Antipodes coordinates
  var lat;
  var lon;
  if (where == CURRENT){
    lat = p.coords.latitude;
    lon = p.coords.longitude;
  }
  else{ // antipodes
    lat = -1*p.coords.latitude;
    lon = p.coords.longitude > 0 ? p.coords.longitude - 180.0 : p.coords.longitude + 180.0;
  }

  $('latitude').innerHTML = "Latitude: "+lat.toFixed(2);
  $('longitude').innerHTML = "Longitude: "+lon.toFixed(2);
  var pos=new google.maps.LatLng(lat,lon);
  map.setCenter(pos);
  map.setZoom(5);

  var infowindow = new google.maps.InfoWindow({
      content: "<strong>yes</strong>"
  });

  var marker = new google.maps.Marker({
      position: pos,
      map: map,
      title:"This is your " + where + " position."
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });

  update_sunrise(lat, lon);
  get_pictures_yql(lat, lon);
}

function toggle_map (){
  $("mapToggler").innerHTML = where;
  where = where == CURRENT ? ANTIPODES : CURRENT;
  $("pageTitle").innerHTML =  where;
  update_map();
}

Event.observe(window, 'load', function(event) {
  initialize_map();
  update_map();
  Event.observe('mapToggler', 'click', function(event){
    toggle_map();
  })
});

function insert_picture(farmid, serverid, id, secret, name){
  var src = "http://farm"+farmid+".static.flickr.com/"+serverid+"/"+id+"_"+secret+"_b.jpg";
  var img = document.createElement("img");
  img.setAttribute('src', src);
  img.setAttribute('alt', name);
  $("photo").appendChild(img);
}

function get_pictures_yql(lat, lon){
  var BASE_URI = 'http://query.yahooapis.com/v1/public/yql';
  var yql_query = "select * from flickr.photos.search where min_taken_date='2008-09-01' and lat='"+lat+"' and lon='"+lon+"' and radius='20'";

 new Ajax.JSONRequest(BASE_URI, {
    onComplete: function(json){
      $("photo").innerHTML = "";
      var photos = json.query.results;
      if (photos != undefined){
        photo = photos.photo[0]
        insert_picture(photo.farm, photo.server, photo.id, photo.secret, photo.title);
      }
      else{
        $("photo").innerHTML = "No pictures found";
      }
    },
    callbackName: 'callback',
    parameters: {q: yql_query, format: 'json'}
  });

}
