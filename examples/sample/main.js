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

  //テクスチャの準備
  var loader   = new THREE.TextureLoader();
  var tex      = loader.load('./res/navico.png');

  //モデルの準備
  //mesh = geometry + material
  //MeshBasicMaterial : 一番シンプルなマテリアル、影がつかない
  //MeshPhongMaterial : ライティングを反映する、ライトの設定が必要
  var geometry = new THREE.BoxBufferGeometry(10, 10, 10);
  var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: tex});
  var mesh     = new THREE.Mesh(geometry, material);

  //シーンにモデルを追加
  scene.add(mesh);

  //描画処理
  render();
  function render() {
    requestAnimationFrame(render);

    mesh.rotation.set(
      0,
      mesh.rotation.y + .01,
      mesh.rotation.z + .01
    );

    renderer.render(scene, camera);
  }
}

