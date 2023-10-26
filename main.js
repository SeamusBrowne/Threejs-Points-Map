<script type="importmap">
	{
		"imports": {
			"three": "../build/three.module.js",
			"three/addons/": "./jsm/"
		}
	}
</script>

import * as THREE from 'three';

import Stats from './jsm/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

	let camera, scene, renderer;
	let stats;

	let controls;

	let mesh;

	function init() {

		const container = document.getElementById( 'container' );

		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setAnimationLoop( render );
		renderer.outputEncoding = THREE.sRGBEncoding;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 0.85;
		container.appendChild( renderer.domElement );

		window.addEventListener( 'resize', onWindowResize );

		stats = new Stats();
		container.appendChild( stats.dom );

		//

		camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 100 );
		camera.position.set( 0, 4, 0 );

		controls = new OrbitControls( camera, container );
		controls.target.set( 0, 1, 0 );
		controls.update();

		const pmremGenerator = new THREE.PMREMGenerator( renderer );

		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0x303030 );
		scene.environment = pmremGenerator.fromScene( new RoomEnvironment() ).texture;


		// materials

		const irelandMaterial = new THREE.MeshPhysicalMaterial( {
			color: 0xffffff, metalness: 0.2, roughness: 0.4, clearcoat: 0.2, clearcoatRoughness: 0.4
		} );

		const pointMaterial = new THREE.PointsMaterial( {
			color: 0x00ff00,
			size: 0.038
		} );

		// Ireland Model

		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath( 'js/libs/draco/gltf/' );

		const loader = new GLTFLoader();
		loader.setDRACOLoader( dracoLoader );

		loader.load( 'models/gltf/irelandLowPoly.glb', function ( gltf ) {

			const irelandModel = gltf.scene.children[ 0 ];

			irelandModel.getObjectByName( 'Ireland' );

			mesh = new THREE.Points(irelandModel.geometry, pointMaterial);
			scene.add(mesh);
			
			// To create a solid map use Mesh instead of Points.

			//mesh = new THREE.Mesh(irelandModel.geometry, pointMaterial);
			//scene.add(mesh);

		} );

	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function render() {


		renderer.render( scene, camera );

		stats.update();

	}

	init();
