
var DAT = DAT || {};
var objectcube=new Array();

DAT.Globe = function(container, colorFn) {

  colorFn = colorFn || function(x) {
    var c = new THREE.Color();
    c.setHSV( ( 0.6 - ( x * 0.5 ) ), 1.0, 1.0 );
    return c;
  };

  var Shaders = {
    'earth' : {
      uniforms: {
        'texture': { type: 't', value: 0, texture: null }
      },
      vertexShader: [
        'varying vec3 vNormal;',
        'varying vec2 vUv;',
        'void main() {',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
          'vNormal = normalize( normalMatrix * normal );',
          'vUv = uv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform sampler2D texture;',
        'varying vec3 vNormal;',
        'varying vec2 vUv;',
        'void main() {',
          'vec3 diffuse = texture2D( texture, vUv ).xyz;',
          'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
          'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );',
          'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
        '}'
      ].join('\n')
    },
    'atmosphere' : {
      uniforms: {},
      vertexShader: [
        'varying vec3 vNormal;',
        'void main() {',
          'vNormal = normalize( normalMatrix * normal );',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vNormal;',
        'void main() {',
          'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
          'gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;',
        '}'
      ].join('\n')
    }
  };

  var camera, light, scene, sceneAtmosphere, renderer, w, h;
  var vector, mesh, atmosphere, point;

  var overRenderer;

  var imgDir = '/globe/';

  var curZoomSpeed = 0;
  var zoomSpeed = 50;

  var mouse = { x: 0, y: 0 }, mouseOnDown = { x: 0, y: 0 };
  var rotation = { x: 0, y: 0 },
      target = { x: Math.PI*3/2, y: Math.PI / 6.0 },
      targetOnDown = { x: 0, y: 0 };

  var distance = 100000, distanceTarget = 100000;
  var padding = 40;
  var PI_HALF = Math.PI / 2;


				
  function init() {

    container.style.color = '#fff';
    container.style.font = '13px/20px Arial, sans-serif';

    var shader, uniforms, material;
    w = container.offsetWidth || window.innerWidth;
    h = container.offsetHeight || window.innerHeight;

    camera = new THREE.Camera(
        30, w / h, 1, 10000);
    camera.position.z = distance;

    vector = new THREE.Vector3();

    scene = new THREE.Scene();
    sceneAtmosphere = new THREE.Scene();

    var geometry = new THREE.Sphere(200, 40, 30);//the radius of the earth

    shader = Shaders['earth'];
    uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms['texture'].texture = THREE.ImageUtils.loadTexture('./world3.jpg');//imgDir+'world' +'.jpg'

    material = new THREE.MeshShaderMaterial({

          uniforms: uniforms,
          vertexShader: shader.vertexShader,
          fragmentShader: shader.fragmentShader

        });

    mesh = new THREE.Mesh(geometry, material);
    mesh.matrixAutoUpdate = false;
    scene.addObject(mesh);

    shader = Shaders['atmosphere'];//地球外面一层发光的大气层
    uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    material = new THREE.MeshShaderMaterial({

          uniforms: uniforms,
          vertexShader: shader.vertexShader,
          fragmentShader: shader.fragmentShader

        });

    mesh = new THREE.Mesh(geometry, material);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.1;//the width of the atmosphere
    mesh.flipSided = true;
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    sceneAtmosphere.addObject(mesh);
	
	//读出国旗图片，作为cube的表面素材，新建cube的时候贴上去
	map1 = THREE.ImageUtils.loadTexture('./hostFlag/Uruguay_Montevideo_1930.png');
map2 = THREE.ImageUtils.loadTexture('./hostFlag/Italy_Milano_1934.png');
map3 = THREE.ImageUtils.loadTexture('./hostFlag/France_Paris_1938.png');
map4 = THREE.ImageUtils.loadTexture('./hostFlag/Brazil_RiodeJaneiro_1950.png');
map5 = THREE.ImageUtils.loadTexture('./hostFlag/Switzerland_Bern_1954.png');
map6 = THREE.ImageUtils.loadTexture('./hostFlag/Sweden_Stockholm_1958.png');
map7 = THREE.ImageUtils.loadTexture('./hostFlag/Chile_Santiago_1962.png');
map8 = THREE.ImageUtils.loadTexture('./hostFlag/England_London_1966.png');
map9 = THREE.ImageUtils.loadTexture('./hostFlag/Mexico_MexicoCity_1970.png');
map10 = THREE.ImageUtils.loadTexture('./hostFlag/Germany_WestBerlin_1974.png');
map11 = THREE.ImageUtils.loadTexture('./hostFlag/Argentina_BuenosAires_1978.png');
map12 = THREE.ImageUtils.loadTexture('./hostFlag/Spain_Madrid_1982.png');
map13 = THREE.ImageUtils.loadTexture('./hostFlag/Mexico_MexicoCity_1986.png');
map14 = THREE.ImageUtils.loadTexture('./hostFlag/Italy_Milano_1990.png');
map15 = THREE.ImageUtils.loadTexture('./hostFlag/USA_LosAngeles_1994.png');
map16 = THREE.ImageUtils.loadTexture('./hostFlag/France_Paris_1938.png');
map17 = THREE.ImageUtils.loadTexture('./hostFlag/Korea_Hansung_2002.png');
map18 = THREE.ImageUtils.loadTexture('./hostFlag/Japan_Sapporo_2002.png');
map19 = THREE.ImageUtils.loadTexture('./hostFlag/Germany_Berlin_2006.png');
map20 = THREE.ImageUtils.loadTexture('./hostFlag/SouthAfrica_Tshwane_2010.png');
map21 = THREE.ImageUtils.loadTexture('./hostFlag/Brazil_RiodeJaneiro_2014.png');
map22 = THREE.ImageUtils.loadTexture('./hostFlag/Russia_Moscow_2018.png');
map23 = THREE.ImageUtils.loadTexture('./hostFlag/Qatar_Doha_2022.png');


map24 = THREE.ImageUtils.loadTexture('./champion.png');//the cup of champion
map25 = THREE.ImageUtils.loadTexture('./second.png');
map26 = THREE.ImageUtils.loadTexture('./third.png');


//倒着的图片。
map27 = THREE.ImageUtils.loadTexture('./hostFlag/Uruguay_Montevideo_1930_b.png');
map28 = THREE.ImageUtils.loadTexture('./hostFlag/Italy_Milano_1934_b.png');
map29 = THREE.ImageUtils.loadTexture('./hostFlag/France_Paris_1938_b.png');
map30 = THREE.ImageUtils.loadTexture('./hostFlag/Brazil_RiodeJaneiro_1950_b.png');
map31 = THREE.ImageUtils.loadTexture('./hostFlag/Switzerland_Bern_1954_b.png');
map32 = THREE.ImageUtils.loadTexture('./hostFlag/Sweden_Stockholm_1958_b.png');
map33 = THREE.ImageUtils.loadTexture('./hostFlag/Chile_Santiago_1962_b.png');
map34 = THREE.ImageUtils.loadTexture('./hostFlag/England_London_1966_b.png');
map35 = THREE.ImageUtils.loadTexture('./hostFlag/Mexico_MexicoCity_1970_b.png');
map36 = THREE.ImageUtils.loadTexture('./hostFlag/Germany_WestBerlin_1974_b.png');
map37 = THREE.ImageUtils.loadTexture('./hostFlag/Argentina_BuenosAires_1978_b.png');
map38 = THREE.ImageUtils.loadTexture('./hostFlag/Spain_Madrid_1982_b.png');
map39 = THREE.ImageUtils.loadTexture('./hostFlag/Mexico_MexicoCity_1986_b.png');
map40 = THREE.ImageUtils.loadTexture('./hostFlag/Italy_Milano_1990_b.png');
map41 = THREE.ImageUtils.loadTexture('./hostFlag/USA_LosAngeles_1994_b.png');
map42 = THREE.ImageUtils.loadTexture('./hostFlag/France_Paris_1938_b.png');
map43 = THREE.ImageUtils.loadTexture('./hostFlag/Korea_Hansung_2002_b.png');
map44 = THREE.ImageUtils.loadTexture('./hostFlag/Japan_Sapporo_2002_b.png');
map45 = THREE.ImageUtils.loadTexture('./hostFlag/Germany_Berlin_2006_b.png');
map46 = THREE.ImageUtils.loadTexture('./hostFlag/SouthAfrica_Tshwane_2010_b.png');
map47 = THREE.ImageUtils.loadTexture('./hostFlag/Brazil_RiodeJaneiro_2014_b.png');
map48 = THREE.ImageUtils.loadTexture('./hostFlag/Russia_Moscow_2018_b.png');
map49 = THREE.ImageUtils.loadTexture('./hostFlag/Qatar_Doha_2022_b.png');


map50 = THREE.ImageUtils.loadTexture('./champion_b.png');//the cup of champion
map51 = THREE.ImageUtils.loadTexture('./second_b.png');
map52 = THREE.ImageUtils.loadTexture('./third_b.png');

	//var cubeGeometry = new THREE.CubeGeometry(20, 20, 1, 1, 1, 1); 
    geometry = new THREE.Cube(15, 15);//cubeMaterials , null, false, { px: true, nx: true, py: true, ny: true, pz: false, nz: true}
//the size of the banbo  
   
    point = new THREE.Mesh(geometry);
	scene.addObject(point);
	//point.style.display='none';

 
 
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.autoClear = false;
    renderer.setClearColorHex(0x000000, 0.0);
    renderer.setSize(w, h);

    renderer.domElement.style.position = 'absolute';

    container.appendChild(renderer.domElement);

    container.addEventListener('mousedown', onMouseDown, false);

    container.addEventListener('mousewheel', onMouseWheel, false);

    document.addEventListener('keydown', onDocumentKeyDown, false);

    window.addEventListener('resize', onWindowResize, false);

    container.addEventListener('mouseover', function() {
      overRenderer = true;
    }, false);

    container.addEventListener('mouseout', function() {
      overRenderer = false;
    }, false);
  }
  


  addData = function(data, opts) {
    var lat, lng, size, color, i, step, colorFnWrapper;

    opts.animated = opts.animated || false;
    this.is_animated = opts.animated;
    opts.format = opts.format || 'magnitude'; // other option is 'legend'
    console.log(opts.format);
    if (opts.format === 'magnitude') {
      step = 3;
      colorFnWrapper = function(data, i) { return colorFn(data[i+2]); }
    } else if (opts.format === 'legend') {
      step = 4;
      colorFnWrapper = function(data, i) { return colorFn(data[i+3]); }
    } else {
      throw('error: format not supported: '+opts.format);
    }

    if (opts.animated) {
      if (this._baseGeometry === undefined) {
        this._baseGeometry = new THREE.Geometry();
        for (i = 0; i < data.length; i += step) {
          lat = data[i];
          lng = data[i + 1];
          size = data[i + 2];
          color = colorFnWrapper(data,i);
          size = 0;
          addPoint(lat, lng, size, data[i+3], this._baseGeometry);
        }
      }
      if(this._morphTargetId === undefined) {
        this._morphTargetId = 0;
      } else {
        this._morphTargetId += 1;
      }
      opts.name = opts.name || 'morphTarget'+this._morphTargetId;
    }
    var subgeo = new THREE.Geometry();
    for (i = 0; i < data.length; i += step) {
      lat = data[i];
      lng = data[i + 1];
      color = colorFnWrapper(data,i);
      size = data[i + 2];
      size = size*200;
      addPoint(lat, lng, size, data[i+3], subgeo);
    }
    if (opts.animated) {
      this._baseGeometry.morphTargets.push({'name': opts.name, vertices: subgeo.vertices});
    } else {
      this._baseGeometry = subgeo;
    }

  };


  function createPoints() {
    if (this._baseGeometry !== undefined) {
      if (this.is_animated === false) {
        this.points = new THREE.Mesh(this._baseGeometry, new THREE.MeshBasicMaterial({
              color: 0xffffff,
              vertexColors: THREE.FaceColors,
              morphTargets: false
            }));
      } else {
        if (this._baseGeometry.morphTargets.length < 8) {
          console.log('t l',this._baseGeometry.morphTargets.length);
          var padding = 8-this._baseGeometry.morphTargets.length;
          console.log('padding', padding);
          for(var i=0; i<=padding; i++) {
            console.log('padding',i);
            this._baseGeometry.morphTargets.push({'name': 'morphPadding'+i, vertices: this._baseGeometry.vertices});
          }
        }
        this.points = new THREE.Mesh(this._baseGeometry, new THREE.MeshBasicMaterial({
              color: 0xffffff,
              vertexColors: THREE.FaceColors,
              morphTargets: true
            }));
      }
      scene.addObject(this.points);
    }
  }
  
  
  function setMaterial(count){//新建cube并且给不同的cube贴上不同的图，图片要准备正着和倒着两张，才可以在正面和背面都看到正立的国旗

//注意：每个显示图片的元素本都是一个cube，但是为了它能够站立起来，我们把宽度设为0，于是就看到一个立着的平面。虽然意义上这个cube只有2个面，但是实际上贴图时，必须6个面都贴，正面和背面要分别要贴上反着的和正着的图。


//json文件里面4个数据位一组，每组第三个数字是cube的编号，根据不同编号来贴上不同的国旗，  case就是来判断编号的
    var w=20;
	var h=20;
	switch (count){
		
				case 1:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map27 } ),//倒着的
new THREE.MeshLambertMaterial( { map:map27 }),
new THREE.MeshLambertMaterial( { map:map1}),//正着的
new THREE.MeshLambertMaterial( { map:map27 }),
new THREE.MeshLambertMaterial( { map:map1 }),
new THREE.MeshLambertMaterial( { map:map1 })];
				//materialcube = new THREE.MeshLambertMaterial({map:map1});
//
				break;}
				case 2:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map28 } ),
new THREE.MeshLambertMaterial( { map:map28}),
new THREE.MeshLambertMaterial( { map:map2}),
new THREE.MeshLambertMaterial( { map:map28 }),
new THREE.MeshLambertMaterial( { map:map2 }),
new THREE.MeshLambertMaterial( { map:map2 })];
				//materialcube = new THREE.MeshLambertMaterial({map:map2});
				break;}
				case 3:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map29 } ),
new THREE.MeshLambertMaterial( { map:map29 }),
new THREE.MeshLambertMaterial( { map:map3}),
new THREE.MeshLambertMaterial( { map:map29 }),
new THREE.MeshLambertMaterial( { map:map3 }),
new THREE.MeshLambertMaterial( { map:map3 })];
				break;}
				
				case 4:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map30 } ),
new THREE.MeshLambertMaterial( { map:map30}),
new THREE.MeshLambertMaterial( { map:map4}),
new THREE.MeshLambertMaterial( { map:map30 }),
new THREE.MeshLambertMaterial( { map:map4 }),
new THREE.MeshLambertMaterial( { map:map4 })];
			break;}
				case 5:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map31 } ),
new THREE.MeshLambertMaterial( { map:map31 }),
new THREE.MeshLambertMaterial( { map:map5}),
new THREE.MeshLambertMaterial( { map:map31 }),
new THREE.MeshLambertMaterial( { map:map5 }),
new THREE.MeshLambertMaterial( { map:map5 })];
			break;}
				
				case 6:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map32 } ),
new THREE.MeshLambertMaterial( { map:map32 }),
new THREE.MeshLambertMaterial( { map:map6}),
new THREE.MeshLambertMaterial( { map:map32 }),
new THREE.MeshLambertMaterial( { map:map6 }),
new THREE.MeshLambertMaterial( { map:map6 })];	break;}
				case 7:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map33 } ),
new THREE.MeshLambertMaterial( { map:map33 }),
new THREE.MeshLambertMaterial( { map:map7}),
new THREE.MeshLambertMaterial( { map:map33 }),
new THREE.MeshLambertMaterial( { map:map7 }),
new THREE.MeshLambertMaterial( { map:map7 })];
				break;}
				
				case 8:
			{materialcube =[
new THREE.MeshLambertMaterial( { map:map34 } ),
new THREE.MeshLambertMaterial( { map:map34 }),
new THREE.MeshLambertMaterial( { map:map8}),
new THREE.MeshLambertMaterial( { map:map34 }),
new THREE.MeshLambertMaterial( { map:map8 }),
new THREE.MeshLambertMaterial( { map:map8 })];
			break;}
				case 9:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map35 } ),
new THREE.MeshLambertMaterial( { map:map35 }),
new THREE.MeshLambertMaterial( { map:map9}),
new THREE.MeshLambertMaterial( { map:map35 }),
new THREE.MeshLambertMaterial( { map:map9 }),
new THREE.MeshLambertMaterial( { map:map9 })];
			break;}
				
				case 10:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map36 } ),
new THREE.MeshLambertMaterial( { map:map36 }),
new THREE.MeshLambertMaterial( { map:map10}),
new THREE.MeshLambertMaterial( { map:map36 }),
new THREE.MeshLambertMaterial( { map:map10 }),
new THREE.MeshLambertMaterial( { map:map10 })];
			break;}
				case 11:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map37 } ),
new THREE.MeshLambertMaterial( { map:map37 }),
new THREE.MeshLambertMaterial( { map:map11}),
new THREE.MeshLambertMaterial( { map:map37 }),
new THREE.MeshLambertMaterial( { map:map11 }),
new THREE.MeshLambertMaterial( { map:map11 })];
			break;}
				
				case 12:
				{	materialcube =[
new THREE.MeshLambertMaterial( { map: map38 } ),
new THREE.MeshLambertMaterial( { map:map38 }),
new THREE.MeshLambertMaterial( { map:map12}),
new THREE.MeshLambertMaterial( { map:map38 }),
new THREE.MeshLambertMaterial( { map:map12 }),
new THREE.MeshLambertMaterial( { map:map12 })];
				break;}
				case 13:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map39 } ),
new THREE.MeshLambertMaterial( { map:map39 }),
new THREE.MeshLambertMaterial( { map:map13}),
new THREE.MeshLambertMaterial( { map:map39 }),
new THREE.MeshLambertMaterial( { map:map13 }),
new THREE.MeshLambertMaterial( { map:map13 })];
			break;}
				case 14:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map40 } ),
new THREE.MeshLambertMaterial( { map:map40 }),
new THREE.MeshLambertMaterial( { map:map14}),
new THREE.MeshLambertMaterial( { map:map40 }),
new THREE.MeshLambertMaterial( { map:map14 }),
new THREE.MeshLambertMaterial( { map:map14 })];
			break;}
				
				case 15:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map41 } ),
new THREE.MeshLambertMaterial( { map:map41 }),
new THREE.MeshLambertMaterial( { map:map15}),
new THREE.MeshLambertMaterial( { map:map41 }),
new THREE.MeshLambertMaterial( { map:map15 }),
new THREE.MeshLambertMaterial( { map:map15 })];
			break;}
				case 16:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map42 } ),
new THREE.MeshLambertMaterial( { map:map42 }),
new THREE.MeshLambertMaterial( { map:map16}),
new THREE.MeshLambertMaterial( { map:map42 }),
new THREE.MeshLambertMaterial( { map:map16 }),
new THREE.MeshLambertMaterial( { map:map16 })];
			break;}
				
				case 17:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map43 } ),
new THREE.MeshLambertMaterial( { map:map43 }),
new THREE.MeshLambertMaterial( { map:map17}),
new THREE.MeshLambertMaterial( { map:map43 }),
new THREE.MeshLambertMaterial( { map:map17 }),
new THREE.MeshLambertMaterial( { map:map17 })];
			break;}
				case 18:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map44 } ),
new THREE.MeshLambertMaterial( { map:map44 }),
new THREE.MeshLambertMaterial( { map:map18}),
new THREE.MeshLambertMaterial( { map:map44 }),
new THREE.MeshLambertMaterial( { map:map18 }),
new THREE.MeshLambertMaterial( { map:map18 })];	
			break;}
				case 19:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map45 } ),
new THREE.MeshLambertMaterial( { map:map45 }),
new THREE.MeshLambertMaterial( { map:map19}),
new THREE.MeshLambertMaterial( { map:map45 }),
new THREE.MeshLambertMaterial( { map:map19 }),
new THREE.MeshLambertMaterial( { map:map19})];
			break;}
				case 20:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map46 } ),
new THREE.MeshLambertMaterial( { map:map46 }),
new THREE.MeshLambertMaterial( { map:map20}),
new THREE.MeshLambertMaterial( { map:map46 }),
new THREE.MeshLambertMaterial( { map:map20 }),
new THREE.MeshLambertMaterial( { map:map20 })];
			break;}
				case 21:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map47 } ),
new THREE.MeshLambertMaterial( { map:map47 }),
new THREE.MeshLambertMaterial( { map:map21}),
new THREE.MeshLambertMaterial( { map:map47 }),
new THREE.MeshLambertMaterial( { map:map21 }),
new THREE.MeshLambertMaterial( { map:map21 })];
			break;}
				case 22:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map48 } ),
new THREE.MeshLambertMaterial( { map:map48 }),
new THREE.MeshLambertMaterial( { map:map22}),
new THREE.MeshLambertMaterial( { map:map48 }),
new THREE.MeshLambertMaterial( { map:map22 }),
new THREE.MeshLambertMaterial( { map:map22 })];
			break;}
				case 23:
			{materialcube =[
new THREE.MeshLambertMaterial( { map: map49 } ),
new THREE.MeshLambertMaterial( { map:map49 }),
new THREE.MeshLambertMaterial( { map:map23}),
new THREE.MeshLambertMaterial( { map:map49 }),
new THREE.MeshLambertMaterial( { map:map23 }),
new THREE.MeshLambertMaterial( { map:map23 })];	
			break;}
				case 24:
				{//alert("championship");
					materialcube =[
new THREE.MeshLambertMaterial( { map: map50 } ),
new THREE.MeshLambertMaterial( { map:map50 }),
new THREE.MeshLambertMaterial( { map:map24}),
new THREE.MeshLambertMaterial( { map:map50 }),
new THREE.MeshLambertMaterial( { map:map24 }),
new THREE.MeshLambertMaterial( { map:map24 })];	
					break;
					}
					case 25:
				{materialcube =[
new THREE.MeshLambertMaterial( { map: map51 } ),
new THREE.MeshLambertMaterial( { map:map51 }),
new THREE.MeshLambertMaterial( { map:map25}),
new THREE.MeshLambertMaterial( { map:map51 }),
new THREE.MeshLambertMaterial( { map:map25 }),
new THREE.MeshLambertMaterial( { map:map25 })];	
				w=10;
				h=10;
					break;
					}
					case 26:
				{materialcube =[
new THREE.MeshLambertMaterial( { map: map52 } ),
new THREE.MeshLambertMaterial( { map:map52 }),
new THREE.MeshLambertMaterial( { map:map26}),
new THREE.MeshLambertMaterial( { map:map52 }),
new THREE.MeshLambertMaterial( { map:map26 }),
new THREE.MeshLambertMaterial( { map:map26 })];	
				w=10;
				h=10;
					break;
					}
				
		}
		
		
   			 geometry = new THREE.Cube(w,0,1,1,1,1,materialcube);//设置cube元素宽为0
//  			  geometry = new THREE.Plane(w,h);
  			  point = new THREE.Mesh(geometry,new THREE.MeshFaceMaterial());//新建元素
			  point.rotation.set(-Math.PI/2, 0, 0);
				scene.addObject(point);//把新建的cube放到场景当中
	}
	
	
//此函数用于根据json文件中前两个数据，即纬度和经度来设置cube在地图上的位置.
  function addPoint(lat, lng, size, i, subgeo) {
 count = i;
 setMaterial(count);
 if(count==14||count==16||count==20||count==13)//如果该国家有曾经办了两场球赛，那么将会把第二个cube稍稍偏移一点位置s
  {
	  lng=lng-5;
	  }
	  if (count==19){
		  lng=lng+8;
		  }
		  if(count==8){
			 lat=lat+3 
			  }
		 
	  //alert(lat+","+lng+","+i);
	  console.log(lat + " " + lng);
    var phi = (90-lat) * Math.PI / 180;
    var theta = (180-lng) * Math.PI / 180;

    point.position.x = 215 * Math.sin(phi) * Math.cos(theta);
    point.position.y = 215 * Math.cos(phi);
    point.position.z = 215 * Math.sin(phi) * Math.sin(theta);
	point.index=i;
	//alert(point.index+"");

    point.lookAt(mesh.position);
	
	
	
	
    point.scale.z = 30 ;//-size// 设置cube和地球表面的距离，30是恰好把底端贴在地球表面

    var i;
    for (i = 0; i < point.geometry.faces.length; i++) {

     // point.geometry.faces[i].color=color;

    }

  //  GeometryUtils.merge(subgeo, point);
  }
  
 function gel(id) {//根据id读出html文件中的元素
	 return document.getElementById(id);}
        
        
function clickclose(){//点击大信息框左上角关闭按钮时响应
	
			document.getElementById('info').style.display='none';
			document.getElementById('closebutton').style.display='none';
			document.getElementById('i_focus').style.display='none';
			}

  function onMouseDown(event) {//监听点击
    event.preventDefault();

    container.addEventListener('mousemove', onMouseMove, false);
    container.addEventListener('mouseup', onMouseUp, false);
    container.addEventListener('mouseout', onMouseOut, false);

    mouseOnDown.x = - event.clientX;
    mouseOnDown.y = event.clientY;

    targetOnDown.x = target.x;
    targetOnDown.y = target.y;
	//alert("fdksl;fjkdsjafkl;");
	
	var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
	var projector = new THREE.Projector();
	projector.unprojectVector( vector, camera );
	var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
	var intersects = ray.intersectScene( scene );
	if ( intersects.length > 0 ) {
		
		
	
	var info = gel('info');//大信息框（鼠标跟随）
		info.style.position = "absolute";
		  	info.style.top = 180 + "px";
           	info.style.right = 0.005*document.getElementById('body').offsetWidth+'px';
			info.style.width = 300 + "px";
			info.style.height = 370 + "px";
	var closebutton = gel('closebutton');//大信息框右上角的关闭按钮
		closebutton.style.background="url(./closebutton2.png)";
		closebutton.style.position = "absolute";
		closebutton.style.height=45+"px";
		closebutton.style.width = 45+"px";
		closebutton.style.left=0.21*document.getElementById('body').offsetWidth+'px';
		closebutton.style.top = 190+"px";
    closebutton.addEventListener('mousedown',clickclose,false);
	var hotpic = gel('i_focus');
	hotpic.style.position = "absolute";
	hotpic.style.left=0.2*document.getElementById('body').offsetWidth+'px';
	var pic0 = gel('pic0');
	var pic1 = gel('pic1');
	var pic2 = gel('pic2');
	var pic3 = gel('pic3');
	var pic4 = gel('pic4');
	
	var text0 = gel('text0');
	var text1 = gel('text1');
	var text2 = gel('text2');
	var text3 = gel('text3');
	var text4 = gel('text4');
	
	var p0 = gel('spic0');
	var p1 = gel('spic1');
	var p2 = gel('spic2');
	var p3 = gel('spic3');
	var p4 = gel('spic4');
	
	var li0 = gel('li0');
	var li1 = gel('li1');
	var li2 = gel('li2');
	var li3 = gel('li3');
	var li4 = gel('li4');
	
	
		


	
	//intersects[0] 就包含了所有cube元素，通过.object.index来判断是哪个cube
	//点击某个cube后，把html文件中原本隐藏的div显示出来，并且根据cube设置内容和根据鼠标位置设置位置。
	
	//这里只判断了德国2006和南非2010两个cube，要加其他cube的监听可以模仿这两个if来实现
	
	if(intersects[ 0 ].object.index==19){//第19个是德国队
		
		  info.style.display='';
			info.innerHTML="&nbsp&nbsp&nbsp<h1>2008年 德国世界杯</h1><br>&nbsp&nbsp&nbsp冠军：&nbsp&nbsp&nbsp意大利·意大利国家男子足球队<br>&nbsp&nbsp&nbsp亚军：&nbsp&nbsp&nbsp德国·德国国家男子足球队<br>&nbsp&nbsp&nbsp季军：&nbsp&nbsp&nb法国·法国国家男子足球队<br>";
		
		 closebutton.style.display='';
	
		
		}
else if(intersects[ 0 ].object.index==20){//2010南非世界杯
		//alert(intersects[ 0 ].object.index );
		
	
    var scene2 = document.querySelectorAll("scene");                               //clear the objects from the scene
    for (var i = 0; i < scene.length; i++) {                                    //loop through to get all object in the scene
    var scene3 =document.getElementById("scene");                                  
    scene.removeChild(scene.childNodes[0]);                                        //remove all specified objects
  }   
  
    
		  info.style.display='';
		
			info.innerHTML="&nbsp&nbsp&nbsp<h1>2010年 南非世界杯</h1><br>&nbsp&nbsp&nbsp冠军：&nbsp&nbsp&nbsp西班牙·西班牙国家男子足球队<br>&nbsp&nbsp&nbsp亚军：&nbsp&nbsp&nbsp荷兰·荷兰国家男子足球队<br>&nbsp&nbsp&nbsp季军：&nbsp&nbsp&nbsp德国·德国国家男子足球队<br><br>2010年，世界杯第一次走进非洲，时隔多年，呜呜祖拉的高分贝音量依然在耳边回响，但你记得的一定不只有呜呜祖拉的尖啸，应该还有勒夫的围巾、章鱼帝的预言，郑大世的眼泪，以及一干豪门球队的落魄身影和斗牛士修成正果的狂欢。";
	
		 hotpic.style.display='';
		 
		 closebutton.style.display='';
		//closebutton.onclick=clickclose(this);
		pic0.src='./2010hotpic/2/pic1.jpg';
		p0.src='./2010hotpic/2/pic1.jpg';
		text0.innerHTML='<a href="http://zqb.cyol.com/content/2010-07/13/content_3321746.htm"><b><u>一次技术对功利的绝杀</u></b></a></br><a href="http://zqb.cyol.com/content/2010-06/23/content_3289941.htm"><b><u>《古典也流行》</u></b></a></br><a href="http://zqb.cyol.com/content/2010-07/09/content_3316586.htm"><b><u>外媒盛赞西班牙踢出漂亮足球</u></b></a></br>';
	//	li0.innerHTML='西班牙首夺世界杯冠军';
		
		pic1.src='./2010hotpic/2/pic1.jpg';
		p1.src='./2010hotpic/2/pic1.jpg';
		text1.innerHTML='<a href="http://zqb.cyol.com/content/2010-07/13/content_3321746.htm"><b><u>一次技术对功利的绝杀</u></b></a></br><a href="http://zqb.cyol.com/content/2010-06/23/content_3289941.htm"><b><u>《古典也流行》</u></b></a></br><a href="http://zqb.cyol.com/content/2010-07/09/content_3316586.htm"><b><u>外媒盛赞西班牙踢出漂亮足球</u></b></a></br>';
	//	li1.innerHTML='西班牙首夺世界杯冠军';
		
		pic2.src='./2010hotpic/3/pic4.jpg';
		p2.src='./2010hotpic/3/pic4.jpg';
		text2.innerHTML='<a href="http://zqb.cyol.com/content/2010-06/12/content_3276546.htm"><b><u>世界杯的光辉岁月</u></b></a></br><a href="http://zqb.cyol.com/content/2010-06/17/content_3281441.htm"><b><u>世界杯成南非实现大国梦的跳板</u></b></a></br><a href="http://zqb.cyol.com/content/2010-07/04/content_3307741.htm"><b><u>南非总统力挺申奥</u></b></a></br>';
	//	li2.innerHTML='世界杯第一次走进非洲';
		
		
		pic3.src='./2010hotpic/4/pic6.jpg';
		p3.src='./2010hotpic/4/pic6.jpg';
		text3.innerHTML='<a href="http://focus.news.163.com/10/0715/10/6BKJ77ID00011SM9_2.html"><b><u>章鱼帝传奇</u></b></a></br><a href="http://worldcup.qq.com/a/20100703/004583.htm"><b><u>“世界上系围巾最好看的男人”勒夫</u></b></a></br><a href="http://zqb.cyol.com/content/2010-06/14/content_3279316.htm"><b><u>南非赛场最强音源于中国制造</u></b></a></br>';
		//li3.innerHTML='南非世界杯的身份标签：呜呜祖拉、章鱼帝、勒夫的围巾';
		 
		 pic4.src='./2010hotpic/5/pic7.jpg';
		p4.src='./2010hotpic/5/pic7.jpg';
		text4.innerHTML='<a href="http://zqb.cyol.com/content/2010-06/15/content_3279891.htm"><b><u>神秘朝鲜队高调迎战五星巴西</u></b></a></br><a href="http://zqb.cyol.com/content/2010-06/17/content_3281431.htm"><b><u>现在我是朝鲜队球迷了</u></b></a></br><a href="http://zqb.cyol.com/content/2010-06/22/content_3287716.htm"><b><u>郑大世不是犀利哥</u></b></a></br>';
	//	li4.innerHTML='神秘朝鲜备受关注，郑大世一哭成名';
		 
		}else {//当点击的不是cube的时候小信息框将会消失
			info.style.display='none';
			hotpic.style.display='none';
			closebutton.style.display='none';}
	}

    container.style.cursor = 'move';
  }

  function onMouseMove(event) {
    mouse.x = - event.clientX;
    mouse.y = event.clientY;

    var zoomDamp = distance/1000;

    target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005 * zoomDamp;
    target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005 * zoomDamp;

    target.y = target.y > PI_HALF ? PI_HALF : target.y;
    target.y = target.y < - PI_HALF ? - PI_HALF : target.y;
  }

  function onMouseUp(event) {
    container.removeEventListener('mousemove', onMouseMove, false);
    container.removeEventListener('mouseup', onMouseUp, false);
    container.removeEventListener('mouseout', onMouseOut, false);
    container.style.cursor = 'auto';
  }

  function onMouseOut(event) {
    container.removeEventListener('mousemove', onMouseMove, false);
    container.removeEventListener('mouseup', onMouseUp, false);
    container.removeEventListener('mouseout', onMouseOut, false);
  }

  function onMouseWheel(event) {
    event.preventDefault();
    if (overRenderer) {
      zoom(event.wheelDeltaY * 0.3);
    }
    return false;
  }

  function onDocumentKeyDown(event) {
    switch (event.keyCode) {
      case 38:
        zoom(100);
        event.preventDefault();
        break;
      case 40:
        zoom(-100);
        event.preventDefault();
        break;
    }
  }

  function onWindowResize( event ) {
    console.log('resize');
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function zoom(delta) {
    distanceTarget -= delta;
    distanceTarget = distanceTarget > 1000 ? 1000 : distanceTarget;
    distanceTarget = distanceTarget < 350 ? 350 : distanceTarget;
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    zoom(curZoomSpeed);

    rotation.x += (target.x - rotation.x) * 0.1;
    rotation.y += (target.y - rotation.y) * 0.1;
    distance += (distanceTarget - distance) * 0.3;

    camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
    camera.position.y = distance * Math.sin(rotation.y);
    camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);

    vector.copy(camera.position);

    renderer.clear();
    renderer.render(scene, camera);
    renderer.render(sceneAtmosphere, camera);
  }

  init();
  this.animate = animate;


  this.__defineGetter__('time', function() {
    return this._time || 0;
  });

  this.__defineSetter__('time', function(t) {
    var validMorphs = [];
    var morphDict = this.points.morphTargetDictionary;
    for(var k in morphDict) {
      if(k.indexOf('morphPadding') < 0) {
        validMorphs.push(morphDict[k]);
      }
    }
    validMorphs.sort();
    var l = validMorphs.length-1;
    var scaledt = t*l+1;
    var index = Math.floor(scaledt);
    for (i=0;i<validMorphs.length;i++) {
      this.points.morphTargetInfluences[validMorphs[i]] = 0;
    }
    var lastIndex = index - 1;
    var leftover = scaledt - index;
    if (lastIndex >= 0) {
      this.points.morphTargetInfluences[lastIndex] = 1 - leftover;
    }
    this.points.morphTargetInfluences[index] = leftover;
    this._time = t;
  });

  this.addData = addData;
  this.createPoints = createPoints;
  this.renderer = renderer;
  this.scene = scene;

  return this;

};
