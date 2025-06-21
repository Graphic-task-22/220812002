import * as THREE from 'three';


const geometry = new THREE.PlaneGeometry(200,100,100,100);
//纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();
const texture = texLoader.load('./src/assets/earth_day_4096.jpg');




// 给一个材质，让它有颜色
const material = new THREE.MeshPhongMaterial({
  color: 0xA6A99A,
  opacity: 1,
  transparent: false,
  side: THREE.DoubleSide, // 允许双面渲染
  map: texture,//map表示材质的颜色贴图属性
});


const plane = new THREE.Mesh(geometry, material);
plane.position.y = -1; // 抬高一点，避免与其他物体重叠


export default plane;
