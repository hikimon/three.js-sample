(function(){

//----- gurunavi API -----

  var GnaviAPI = {
    search: function(query) {
      var defer = $.Deferred();
      $.ajax({
        url     : 'http://api.gnavi.co.jp/RestSearchAPI/20150630/?callback=?',
        data    : query,
        dataType: 'jsonp',
        success : defer.resolve,
        error   : defer.reject
      });
      return defer.promise();
    }
  };

  var params = {
    keyid       : '',
    format      : 'json',
    freeword    : '',
    //latitude  : 35.670083,
    //longitude : 139.763267,
    hit_per_page: 4,
    offset_page : 1,
    range       : 1
  };

  function showResult(result) {
    if ( result.error ) {
      alert( result.error.message );
      return;
    }
    if ( result.total_hit_count > 0 ) {
      //start three js
      startThreejs(result);
    } else {
      alert( '検索結果が見つかりませんでした。' );
    }
  }

//----- Geolocation API -----

  if(!navigator.geolocation ) {
    alert( 'あなたの端末では、現在位置を取得できません。' ) ;
    return;
  }

  function successFunc(position) {
    //set gnavi api param
    params.latitude  = position.coords.latitude;
    params.longitude = position.coords.longitude;
  }
  function errorFunc(error) {
    var errorMessage = {
      0: '原因不明のエラーが発生しました。',
      1: '位置情報の取得が許可されませんでした。',
      2: '電波状況などで位置情報が取得できませんでした。',
      3: '位置情報の取得に時間がかかり過ぎてタイムアウトしました。',
    };

    alert( errorMessage[error.code] );
  }
  var optionObj = {
    'enableHighAccuracy': false,
    'timeout': 8000,
    'maximumAge': 5000,
  };

  navigator.geolocation.getCurrentPosition(successFunc, errorFunc, optionObj);

//----- Event -----

  var $key      = $('.js--key');
  var $freeword = $('.js--freeword');
  var $page     = $('.js--page');
  $(document).on('click', '.js--apply', function() {
    if (!params.latitude || !params.longitude ) {
      alert('位置情報が取得できていません。');
      return;
    }

    params.keyid       = $key.val();
    params.freeword    = $freeword.val();
    params.offset_page = $page.val();
    $.when(GnaviAPI.search(params))
      .then(function(result){
        showResult(result);
      });
  });

  $(document).on('click', '.js--reset', function() {
    initCamera();
    initTrackball();
  });

  var timer = false;
  $(window).resize(function() {
    if (timer !== false) {
      clearTimeout(timer);
    }
    timer = setTimeout(onWindowResize, 200);
  });

  // Block iframe events when dragging camera
  var blocker = document.getElementById( 'blocker' );
  blocker.style.display = 'none';

  // TrackballControlsがaddEventListenerをつかっているのでこちらもaddEventListenerをつかう
  // かつ、TrackballControlsより先に実行するので、第３引数true
  document.addEventListener( 'mousedown', 
    function (e) { 
      //右クリックの時はメニューを出さない
      if (e.button === 2) {
        return false;
      }
      blocker.style.display = '';
    }, 
    true 
  );
  document.addEventListener( 'mouseup', function () { blocker.style.display = 'none'; }, true );

//----- Threejs -----

  var camera   = null;
  var scene    = null;
  var renderer = null;
  var controls = null;
  var WIDTH    = 960;
  var HEIGHT   = 720;

  initCamera();

  var Element = function ( url, x, y, z, ry ) {

    var div = document.createElement( 'div' );
    div.style.width  = WIDTH + 'px';
    div.style.height = HEIGHT + 'px';
    div.style.backgroundColor = '#000';

    var iframe = document.createElement( 'iframe' );
    iframe.style.width  = WIDTH + 'px';
    iframe.style.height = HEIGHT + 'px';
    iframe.style.border = '0px';
    iframe.src = url;
    div.appendChild( iframe );

    var object = new THREE.CSS3DObject( div );
    object.position.set( x, y, z );
    object.rotation.y = ry;

    return object;
  };

  function initCamera() {
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.set( 1200, 800, 1000 );
  }

  function initTrackball() {
    if (!renderer) {
      return;
    }
    //トラックボールをレンダラにのみ反映
    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 4;
  }

  function init(result) {
    var container = document.getElementById( 'container' );
    //dom初期化
    $(container).empty();

    scene = new THREE.Scene();

    var group     = new THREE.Group();
    var restArray = [];
    //返却値の型の違いを吸収
    if (result.rest instanceof Array) {
      restArray = restArray.concat(result.rest);
    } else {
      restArray.push(result.rest);
    }
    group.add( new Element( restArray[0].url, 0, 0, WIDTH / 2, 0 ) );
    if (restArray[1]) {
      group.add( new Element( restArray[1].url, WIDTH / 2, 0, 0, Math.PI / 2 ) );
    }
    if (restArray[2]) {
      group.add( new Element( restArray[2].url, 0, 0, - WIDTH / 2, Math.PI ) );
    }
    if (restArray[3]) {
      group.add( new Element( restArray[3].url, - WIDTH / 2, 0, 0, - Math.PI / 2 ) );
    }
    group.position.set(0, 200, 0);
    scene.add( group );

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = 50;    //フォーム分下げる
    container.appendChild( renderer.domElement );

    initTrackball();
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function animate() {
    //animateをループ
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
  }

  function startThreejs(result) {
    init(result);
    animate();
  }

})(jQuery);

