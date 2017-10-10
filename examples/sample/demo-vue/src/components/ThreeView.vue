<template>
  <div>
    <div id="container"></div>
    <div id="blocker"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $              from 'jquery'

//import * as THREE from 'three'
import 'three/TrackballControls'
import 'three/CSS3DRenderer'

const Element = function ( url, x, y, z, ry ) {
  const div = document.createElement( 'div' )
  div.style.width  = WIDTH + 'px'
  div.style.height = HEIGHT + 'px'
  div.style.backgroundColor = '#000'
  const iframe = document.createElement( 'iframe' )
  iframe.style.width  = WIDTH + 'px'
  iframe.style.height = HEIGHT + 'px'
  iframe.style.border = '0px'
  iframe.src = url
  div.appendChild( iframe )
  const object = new THREE.CSS3DObject( div )
  object.position.set( x, y, z )
  object.rotation.y = ry
  return object
}

const WIDTH  = 960
const HEIGHT = 720

export default {
  name: 'three-view',
  data: function() {
    return {
      camera:null,
      scene:null,
      renderer:null,
      controls:null,
    }
  },
  computed: Object.assign({},
    mapGetters({
      state: 'state'
    }),
    {
    }
  ),
  watch: {
    'state.result' (result) {
      console.log('set result')
      this.startThreejs(result)
    },
    'state.init' (flag) {
      console.log(`init:${flag}`)
      if (flag) {
        this.initCamera()
        this.initTrackball()
      }
    }
  },
  mounted() {
    // Block iframe events when dragging camera
    let blocker = document.getElementById( 'blocker' );
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
  },
  methods: {
    startThreejs(result) {
      this.init(result);
      this.animate();
    },
    init(result) {
      const container = document.getElementById( 'container' );
      //dom初期化
      $(container).empty();

      this.scene      = new THREE.Scene();
      const group     = new THREE.Group();
      let   restArray = [];

      // 返却値の型の違いを吸収
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

      this.scene.add( group );
      this.renderer = new THREE.CSS3DRenderer();
      this.renderer.setSize( window.innerWidth, window.innerHeight );
      this.renderer.domElement.style.position = 'absolute';
      this.renderer.domElement.style.top = 50;    //フォーム分下げる

      container.appendChild( this.renderer.domElement );

      this.initCamera();
      this.initTrackball();
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
      this.camera.position.set( 1200, 800, 1000 );
    },
    initTrackball() {
      if (!this.renderer) {
        return;
      }
      //トラックボールをレンダラにのみ反映
      this.controls = new THREE.TrackballControls( this.camera, this.renderer.domElement );
      this.controls.rotateSpeed = 4;
    },
    animate() {
      //animateをループ
      requestAnimationFrame( this.animate );
      this.controls.update();
      this.renderer.render( this.scene, this.camera );
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#blocker {
  position: absolute;
  /* background-color: rgba(255, 0, 0, 0.5); */
  top: 50px;
  left: 0px;
  width: 100%;
  height: 100%;
}
</style>
