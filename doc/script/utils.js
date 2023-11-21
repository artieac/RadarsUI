
function polar_to_cartesian(r,t) {
  //radians to degrees, requires the t*pi/180
  var x = r * Math.cos((t*Math.PI/180));
  var y = r * Math.sin((t*Math.PI/180));
  return [x,y];
}

function cartesian_to_raster(x,y, w, h) {
  var rx = w/2 + x;
  var ry = h/2 + y;
  return [rx,ry];
}

function raster_to_cartesian(rx,ry, w, h) {
  var x = rx - w/2;
  var y = ry - h/2;
  return [x,y];
}

function polar_to_raster(r,t, w, h) {
  console.log("r-" + r + "::t-" + t + "::w-" + w + "::h-" + h);
  var xy= polar_to_cartesian(r,t, w, h);
  return cartesian_to_raster(xy[0], xy[1], w, h);
}
