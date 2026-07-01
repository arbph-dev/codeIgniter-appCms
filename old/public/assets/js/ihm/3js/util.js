// js/ihm/3js/util.js
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

export function getRandomArbitrary(min, max) { return Math.random() * (max - min) + min; }



/*--------------------------------*/
/* 
./assets/img/3js/model3d/bateaux/barco/Barco_obj/Barco.obj
./assets/img/3js/textures/
./assets/img/3js/textures/
./assets/img/3js/textures/

*/
const TEX = [
    { id : 1 , path : '/assets/img/3js/textures/shom11.png' , status : 0 } ,
    { id : 2 , path : '/assets/img/3js/textures/UV_Grid_Sm.jpg' , status : 0 } 
]


/*  ------------------------------------------------------------------------------------------------------------- */

export function getMaterialFromTextures( TEXIDX = 0 )
{
    const T = LoadTexture2( TEXIDX ) 
    const M = new THREE.MeshBasicMaterial( { map: T , side:THREE.DoubleSide} )
    return M
}

function LoadTexture2( TEXIDX = 0 )
{
//.load ( url : String, onLoad : Function, onProgress : Function, onError : Function ) : Texture
 const texture = new THREE.TextureLoader().load(
    TEX[TEXIDX].path , 
    () => { TEX[TEXIDX].status = 2 }, // console.log(TEX) loaded
    () => { TEX[TEXIDX].status = 1 }, //on progres
    () => { TEX[TEXIDX].status = -1 } //error
    );
 //console.log( texture )
 return texture

}

/* ------------------------------------------------------------------------------------------------------------ */

/**
 * charge un bckoground pour une camera 360° - equirectangular
 * @param {*} PATH

./PICS/3js/
'../../media/images/3840px-Esens_Panorama_02.jpeg'
./PICS/3js/skybox/3840px-Esens_Panorama_02.jpeg
./assets/img/3js/
 */

export function loadBackground( PATH = 	'/assets/img/3js/skybox/3840px-Esens_Panorama_02.jpeg' ) 
{
    const equirectangular = new THREE.TextureLoader().load(
        PATH , 
        () => { console.log('status = 2') }, // console.log(TEX) loaded
        () => { console.log('status = 1') }, //on progres
        () => { console.log('status = -1') } //error
        );

    equirectangular.mapping = THREE.EquirectangularReflectionMapping;
    // Things Github Copilot suggested, removing it does not change colors so I thing it's not the problem
//    equirectangular.magFilter = THREE.LinearFilter;
  //  equirectangular.minFilter = THREE.LinearMipMapLinearFilter;
    equirectangular.format = THREE.RGBAFormat;
    //equirectangular.encoding = THREE.sRGBEncoding;
    //equirectangular.anisotropy = 16;
    return equirectangular

    //console.log(SC.scene.background)//pas d'info pertinente
}


export function loadBackground2()
{
    //../../media/
	//const path = "./media/textures/Citadella2/";
	//const path = "./media/textures/DallasW/";
	//const path = "./media/textures/ForbiddenCity/";	
	//const path = "./media/textures/Lycksele3/";
	//const path = "./media/textures/NiagaraFalls3/";
	//const path = "./media/textures/NissiBeach2/";
	//const path = "./media/textures/Ryfjallet/";
//	const path = "./media/textures/Skansen3/";
//	const path = "./media/textures/CNTower/";
//	const path = "./media/textures/GamlaStan/";
//	const path = "./media/textures/GamlaStan2/";
//	const path = "./media/textures/Medborgarplatsen/";
//	const path = "./media/textures/Parliament/";
//	const path = "./media/textures/Roundabout/";
//	const path = "./media/textures/SaintLazarusChurch/";
//	const path = "./media/textures/SaintLazarusChurch2/";
//	const path = "./media/textures/SaintLazarusChurch3/";
//	const path = "./media/textures/Sodermalmsallen/";
//	const path = "./media/textures/Sodermalmsallen2/";
	const path = "/assets/img/3js/skyrect/UnionSquare/"; 
    // ./PICS/3js/skyrect/UnionSquare/

	const format = '.jpg';
	const urls = [
		path + 'posx' + format, path + 'negx' + format,
		path + 'posy' + format, path + 'negy' + format,
		path + 'posz' + format, path + 'negz' + format
		];

	let reflectionCube = new THREE.CubeTextureLoader().load( urls );
	reflectionCube.format = THREE.RGBAFormat;

	return reflectionCube;
    
}









/*  ------------------------------------------------------------------------------------------------------------- */
let St_LoadStat = -1
let St_LoadAdv = 0
let St_LoadCnt = 0
let ColObj = [];

function LoadModelCB_onLoad()
{
	St_LoadStat = 2;//chargement reussi a ces tade :(
	St_LoadAdv = 100.0;
	console.log('LoadModelCB_onLoad', St_LoadStat,St_LoadAdv,St_LoadCnt );
	St_LoadCnt++;
	//loadModelByState();
}


function LoadModelCB_onProgress( xhr )
{
	if ( xhr.lengthComputable ) {
		St_LoadAdv = xhr.loaded / xhr.total * 100;
		console.log( 'onProgress**model ' + Math.round( St_LoadAdv, 2 ) + '% downloaded' );
	}
}


function LoadModelCB_onError( url )
{
	St_LoadStat = 3;
	St_LoadAdv = 0.0;
	console.log('LoadModelCB_onError', St_LoadStat,St_LoadAdv,St_LoadCnt );
	//St_LoadCnt++;
	//loadModelByState();
}


/* ----------------------------------------------------------------------------------------------------------------------- */
/*
	var typeMDL = ColObj[St_LoadCnt].format;
	var typeFND = false;
*/
export function LoadModel_OBJ()
{
		let LM = new THREE.LoadingManager();
		let loader = new OBJLoader( LM );
        let Obj3js

        loader.load( './PICS/3js/model3d/bateaux/barco/Barco_obj/Barco.obj' ,function ( obj ){ Obj3js = obj} , LoadModelCB_onProgress , LoadModelCB_onError);

    	return Obj3js;
}