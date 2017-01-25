window.onload = function() {

  var width    = 500;
  var height   = 500;

  //シーンの準備
  var scene    = new THREE.Scene();

  //カメラの準備
  var camera   = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 0, 20);

  //レンダラの準備
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  //ライト
  var light = new THREE.DirectionalLight(0xfaaaaa);
  light.position.set(30, 200, 30).normalize();
  scene.add(light);

  var ambient = new THREE.AmbientLight(0x555555);
  scene.add(ambient);

  //モデルの準備
  //読み込めなかったときのエラー処理
  var onError = function (xhr) {
    alert('load error');
  };

  //読み込んでいる時の処理
  var onProgress = function (xhr) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };

  //読み込み
  var loader = new THREE.OBJLoader();
  var obj    = null;
  loader.load('res/3991B842-007A-4A55-B42C-F4453B70C47D.obj', function (object){
    var objmodel = object.clone();
    //objをObject3Dで包む
    obj = new THREE.Object3D();
    obj.add(objmodel);

    //シーンにモデルを追加
    scene.add(obj);

    //描画処理
    render();
  }, onProgress, onError);

  function render() {
    requestAnimationFrame(render);

    obj.rotation.set(
      0,
      obj.rotation.y + .01,
      obj.rotation.z + .01
    );

    renderer.render(scene, camera);
  }
}

