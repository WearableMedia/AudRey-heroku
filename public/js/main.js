//////////////////////////////////////////////////////////////////////////////////
//		Init
//////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////
//		Initialize instagram
//////////////////////////////////////////////////////////////////////////////////
var instagram;
var instagramColor = [];

jQuery("form").submit(function(e) {
  e.preventDefault();
  var handle = $("#handle").val();
  handle = handle.trim();
  $("#handle").val('');
  $("#results").empty();
  if (handle) {
    var url = '/submit/' + handle;
    $.get(url, function(data) {
      console.log(data.fullname);
      // console.log(data.likes);
      // console.log(data.comments);

      instagram = data;

      for (var i = 0; i < data.colors.length; i++) {
        for (var j = 0; j < data.colors[i].length; j++) {
          var newColor = {
            r: data.colors[i][j]._rgb[0],
            g: data.colors[i][j]._rgb[1],
            b: data.colors[i][j]._rgb[2]
          }
          instagramColor.push(newColor);
        }
      }
      console.log(instagramColor);
      $('.jumbotron').html('Thank you ' + data.fullname + ' ! Please enjoy your AudRey');
      setTimeout(function() {
        $('.jumbotron').hide(1000);
      }, 2000);

    });
  }

  return false;
});



// init renderer
var renderer = new THREE.WebGLRenderer({
  // antialias	: true,
  alpha: true
});
renderer.setClearColor(new THREE.Color('lightgrey'), 0)
// renderer.setPixelRatio( 1/2 );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.top = '0px'
renderer.domElement.style.left = '0px'
document.body.appendChild(renderer.domElement);

// array of functions for the rendering loop
var onRenderFcts = [];

// init scene and camera
var scene = new THREE.Scene();


// Create a camera
var camera = new THREE.Camera();
scene.add(camera);

scene.add(new THREE.AmbientLight(0x111111));
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.125);
directionalLight.position.x = Math.random() - 0.5;
directionalLight.position.y = Math.random() - 0.5;
directionalLight.position.z = Math.random() - 0.5;
directionalLight.position.normalize();
scene.add(directionalLight);
pointLight = new THREE.PointLight(0xffffff, 1);
scene.add(pointLight);
//////////////////////////////////////////////////////////////////////////////////
//		Initialize a particleSystem
//////////////////////////////////////////////////////////////////////////////////
var SEPARATION = 0.3,
  AMOUNTX = 5,
  AMOUNTY = 40;
var particles2 = new Array();
var particles3 = new Array();
var count = 0;

////////////////////////////////////////////////////////////////////////////////
//          handle arToolkitSource
////////////////////////////////////////////////////////////////////////////////

var arToolkitSource = new THREEx.ArToolkitSource({
  // to read from the webcam
  sourceType: 'webcam',

  // to read from an image
  // sourceType : 'image',
  // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',

  // to read from a video
  // sourceType : 'video',
  // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
})

arToolkitSource.init(function onReady() {
  onResize()
})

// handle resize
window.addEventListener('resize', function() {
  onResize()
})

function onResize() {
  arToolkitSource.onResize()
  setTimeout(function() {
    console.log("resize");
    arToolkitSource.copySizeTo(renderer.domElement)
    if (arToolkitContext.arController !== null) {
      arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
    }
  }, 2000);

}
////////////////////////////////////////////////////////////////////////////////
//          initialize arToolkitContext
////////////////////////////////////////////////////////////////////////////////


// create atToolkitContext
var arToolkitContext = new THREEx.ArToolkitContext({
  cameraParametersUrl: 'data/camera_para.dat',
  detectionMode: 'mono_and_matrix',
  maxDetectionRate: 30,
  canvasWidth: 80 * 3,
  canvasHeight: 60 * 3,
})
// initialize it
arToolkitContext.init(function onCompleted() {
  // copy projection matrix to camera
  camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
})

// update artoolkit on every frame
onRenderFcts.push(function() {
  if (arToolkitSource.ready === false) return

  arToolkitContext.update(arToolkitSource.domElement)
})


////////////////////////////////////////////////////////////////////////////////
//          Create a ArMarkerControls
////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////
//		marker1
//////////////////////////////////////////////////////////////////////////////////

/*
var markerRoot1 = new THREE.Group
// markerRoot1.name = 'marker1'
scene.add(markerRoot1)
var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
  type: 'barcode',
  barcodeValue: 23
})

// build a smoothedControls
var smoothedRoot1 = new THREE.Group()
smoothedRoot1.name = "marker1"
scene.add(smoothedRoot1)
var smoothedControls1 = new THREEx.ArSmoothedControls(smoothedRoot1, {
  lerpPosition: 0.4,
  lerpQuaternion: 0.3,
  lerpScale: 1,
})
*/
// smoothedRoot1.add(particle);


//////////////////////////////////////////////////////////////////////////////////
//		marker2
//////////////////////////////////////////////////////////////////////////////////

var markerRoot2 = new THREE.Group
scene.add(markerRoot2)
var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot2, {
  type: 'barcode',
  barcodeValue: 29 //front top right
})

var smoothedRoot2 = new THREE.Group()
smoothedRoot2.name = 'marker2'
scene.add(smoothedRoot2)
var smoothedControls2 = new THREEx.ArSmoothedControls(smoothedRoot2, {
  lerpPosition: 0.4,
  lerpQuaternion: 0.3,
  lerpScale: 1,
})




var n = 0;
for (var i = 0; i < AMOUNTX; i++) {
  for (var j = 0; j < AMOUNTY; j++) {
    var geometry = new THREE.SphereGeometry(0.08, 48, 24);
    var material = new THREE.MeshNormalMaterial();
    var sphere = particles2[n++] = new THREE.Mesh(geometry, material);
    sphere.position.x = i * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
    sphere.position.z = j * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
    //sphere.position.y=0.5;
    smoothedRoot2.add(sphere);

    //console.log(particles);
    //
  }
}

//////////////////////////////////////////////////////////////////////////////////
//		marker3
//////////////////////////////////////////////////////////////////////////////////

var markerRoot3 = new THREE.Group
scene.add(markerRoot3)
var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot3, {
  type: 'barcode',
  barcodeValue: 31  //back right
})

var smoothedRoot3 = new THREE.Group()
smoothedRoot3.name = 'marker3'
scene.add(smoothedRoot3)
var smoothedControls3 = new THREEx.ArSmoothedControls(smoothedRoot3, {
  lerpPosition: 0.4,
  lerpQuaternion: 0.3,
  lerpScale: 1,
})


var n = 0;
for (var i = 0; i < AMOUNTX; i++) {
  for (var j = 0; j < AMOUNTY; j++) {
    var geometry = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    var material = new THREE.MeshNormalMaterial();
    var sphere = particles3[n++] = new THREE.Mesh(geometry, material);
    sphere.position.x = i * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
    sphere.position.z = j * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
    //sphere.position.y=0.5;
    smoothedRoot3.add(sphere);

    //console.log(particles);
    //
  }
}



//////////////////////////////////////////////////////////////////////////////////
//		marker4
//////////////////////////////////////////////////////////////////////////////////
/*
var markerRoot4 = new THREE.Group
scene.add(markerRoot4)
var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot4, {
  type: 'barcode',
  barcodeValue: 23
})

var smoothedRoot4 = new THREE.Group()
smoothedRoot4.name = 'marker4'
scene.add(smoothedRoot4)
var smoothedControls4 = new THREEx.ArSmoothedControls(smoothedRoot4, {
  lerpPosition: 0.4,
  lerpQuaternion: 0.3,
  lerpScale: 1,
})


var geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
var material = new THREE.MeshNormalMaterial();
var meshKnot4 = new THREE.Mesh(geometry, material);
meshKnot4.position.y = 0.5
smoothedRoot4.add(meshKnot4);



//////////////////////////////////////////////////////////////////////////////////
//		marker5
//////////////////////////////////////////////////////////////////////////////////

var markerRoot5 = new THREE.Group
scene.add(markerRoot5)
var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot5, {
  type: 'barcode',
  barcodeValue: 27
})

var smoothedRoot5 = new THREE.Group()
smoothedRoot5.name = 'marker5'
scene.add(smoothedRoot5)
var smoothedControls5 = new THREEx.ArSmoothedControls(smoothedRoot5, {
  lerpPosition: 0.4,
  lerpQuaternion: 0.3,
  lerpScale: 1,
})


var geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
var material = new THREE.MeshNormalMaterial();
var meshKnot5 = new THREE.Mesh(geometry, material);
meshKnot5.position.y = 0.5
smoothedRoot5.add(meshKnot5);



//////////////////////////////////////////////////////////////////////////////////
//		marker6
//////////////////////////////////////////////////////////////////////////////////

var markerRoot6 = new THREE.Group
scene.add(markerRoot6)
var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot6, {
  type: 'barcode',
  barcodeValue: 30
})

var smoothedRoot6 = new THREE.Group()
smoothedRoot6.name = 'marker6'
scene.add(smoothedRoot6)
var smoothedControls6 = new THREEx.ArSmoothedControls(smoothedRoot6, {
  lerpPosition: 0.4,
  lerpQuaternion: 0.3,
  lerpScale: 1,
})


var geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
var material = new THREE.MeshNormalMaterial();
var meshKnot6 = new THREE.Mesh(geometry, material);
meshKnot6.position.y = 0.5
smoothedRoot6.add(meshKnot6);


//////////////////////////////////////////////////////////////////////////////////
//		marker7
//////////////////////////////////////////////////////////////////////////////////

var markerRoot7 = new THREE.Group
scene.add(markerRoot7)
var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot7, {
  type: 'barcode',
  barcodeValue: 31
})

var smoothedRoot7 = new THREE.Group()
smoothedRoot7.name = 'marker7'
scene.add(smoothedRoot7)
var smoothedControls7 = new THREEx.ArSmoothedControls(smoothedRoot7, {
  lerpPosition: 0.4,
  lerpQuaternion: 0.3,
  lerpScale: 1,
})


var geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
var material = new THREE.MeshNormalMaterial();
var meshKnot7 = new THREE.Mesh(geometry, material);
meshKnot7.position.y = 0.5
smoothedRoot7.add(meshKnot7);
//////////////////////////////////////////////////////////////////////////////////
//		marker8
//////////////////////////////////////////////////////////////////////////////////

var markerRoot8 = new THREE.Group
scene.add(markerRoot8)
var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot8, {
  type: 'barcode',
  barcodeValue: 37
})

var smoothedRoot8 = new THREE.Group()
smoothedRoot8.name = 'marker8'
scene.add(smoothedRoot8)
var smoothedControls8 = new THREEx.ArSmoothedControls(smoothedRoot8, {
  lerpPosition: 0.4,
  lerpQuaternion: 0.3,
  lerpScale: 1,
})


var geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
var material = new THREE.MeshNormalMaterial();
var meshKnot8 = new THREE.Mesh(geometry, material);
meshKnot8.position.y = 0.5
smoothedRoot8.add(meshKnot8);
//////////////////////////////////////////////////////////////////////////////////
//		marker9
//////////////////////////////////////////////////////////////////////////////////

var markerRoot9 = new THREE.Group
scene.add(markerRoot9)
var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot9, {
  type: 'barcode',
  barcodeValue: 45
})

var smoothedRoot9 = new THREE.Group()
smoothedRoot9.name = 'marker9'
scene.add(smoothedRoot9)
var smoothedControls9 = new THREEx.ArSmoothedControls(smoothedRoot9, {
  lerpPosition: 0.4,
  lerpQuaternion: 0.3,
  lerpScale: 1,
})


var geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
var material = new THREE.MeshNormalMaterial();
var meshKnot9 = new THREE.Mesh(geometry, material);
meshKnot9.position.y = 0.5
smoothedRoot9.add(meshKnot9);
//////////////////////////////////////////////////////////////////////////////////
//		marker10
//////////////////////////////////////////////////////////////////////////////////

var markerRoot10 = new THREE.Group
scene.add(markerRoot10)
var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot10, {
  type: 'barcode',
  barcodeValue: 46
})

var smoothedRoot10 = new THREE.Group()
smoothedRoot10.name = 'marker10'
scene.add(smoothedRoot10)
var smoothedControls10 = new THREEx.ArSmoothedControls(smoothedRoot10, {
  lerpPosition: 0.4,
  lerpQuaternion: 0.3,
  lerpScale: 1,
})


var geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
var material = new THREE.MeshNormalMaterial();
var meshKnot10 = new THREE.Mesh(geometry, material);
meshKnot10.position.y = 0.5
smoothedRoot10.add(meshKnot10);
*/
//////////////////////////////////////////////////////////////////////////////////
//		update render
//////////////////////////////////////////////////////////////////////////////////


onRenderFcts.push(function(delta) {
  //meshKnot1.rotation.x += 0.1
  //meshKnot2.rotation.x += 0.1
  //meshKnot3.rotation.x += 0.1
  /*
  meshKnot4.rotation.x += 0.1
  meshKnot5.rotation.x += 0.1
  meshKnot6.rotation.x += 0.1
  meshKnot7.rotation.x += 0.1
  meshKnot8.rotation.x += 0.1
  meshKnot9.rotation.x += 0.1
  meshKnot10.rotation.x += 0.1
*/
  //console.log(markerRoot1.visible);
  if (markerRoot2.visible) {

  }
  //smoothedControls1.update(markerRoot1);
  smoothedControls2.update(markerRoot2);
  smoothedControls3.update(markerRoot3);
  /*
    smoothedControls4.update(markerRoot4);
    smoothedControls5.update(markerRoot5);
    smoothedControls6.update(markerRoot6);
    smoothedControls7.update(markerRoot7);
    smoothedControls8.update(markerRoot8);
    smoothedControls9.update(markerRoot9);
    smoothedControls10.update(markerRoot10);
    */



})



//////////////////////////////////////////////////////////////////////////////////
//		render the whole thing on the page
//////////////////////////////////////////////////////////////////////////////////
var stats = new Stats();
document.body.appendChild(stats.dom);
// render the scene
onRenderFcts.push(function() {
  var i = 0;


  for (var ix = 0; ix < AMOUNTX; ix++) {
    for (var iy = 0; iy < AMOUNTY; iy++) {

      var curr = i++;
      var particle = particles2[curr];
      var particle3 = particles3[curr];
      if (instagramColor.length > 0) {
        var n = i % instagramColor.length;
        var color = new THREE.Color(instagramColor[n].r / 255, instagramColor[n].g / 255, instagramColor[n].b / 255);
        particle.material = new THREE.MeshBasicMaterial({
          color:color
        });
        // particle.material.color.r = instagramColor[n].r / 255;
        // particle.material.color.g = instagramColor[n].g / 255;
        // particle.material.color.b = instagramColor[n].b / 255;
        particle3.material = new THREE.MeshBasicMaterial({
           transparent: true,
          color: color
        });

        // particle3.material.color.r = instagramColor[n].r / 255;
        // particle3.material.color.g = instagramColor[n].g / 255;
        // particle3.material.color.b = instagramColor[n].b / 255;
      }

      particle.position.y = (Math.sin((ix + count) * 0.3) * 0.5) +
        (Math.sin((iy + count) * 0.5) * 0.5);
      /*CHANGE SHIMMER OF PARTICLES*/
      particle.scale.x = particle.scale.y = particle.scale.z = (Math.sin((ix + count) * 5) + 1) * 0.6 +
        (Math.sin((iy + count) * 0.5) + 1) * 0.6;

      particle3.position.y = (Math.sin((ix + count) * 0.3) * 0.5) +
        (Math.sin((iy + count) * 0.5) * 0.5);
      /*CHANGE SHIMMER OF PARTICLES*/
      particle3.scale.x = particle3.scale.y = particle3.scale.z = (Math.sin((ix + count) * 5) + 1) * 0.6 +
        (Math.sin((iy + count) * 0.5) + 1) * 0.6;

    }
  }

  renderer.render(scene, camera);
  stats.update();
  count += 0.05;
})

// run the rendering loop
var lastTimeMsec = null
requestAnimationFrame(function animate(nowMsec) {
  // keep looping
  requestAnimationFrame(animate);
  // measure time
  lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
  var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
  lastTimeMsec = nowMsec

  // call each update function
  onRenderFcts.forEach(function(onRenderFct) {
    onRenderFct(deltaMsec / 1000, nowMsec / 1000)
  })
})
