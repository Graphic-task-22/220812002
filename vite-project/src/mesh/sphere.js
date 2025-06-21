import * as THREE from 'three';

// 创建球体几何体
const sphereGeometry = new THREE.SphereGeometry(30, 30, 30);

// 加载基础地球贴图
const texLoader = new THREE.TextureLoader();
const baseTexture = texLoader.load('./src/assets/earth_day_4096.jpg');

// 加载立方体环境贴图（nx/ny/nz/px/py/pz）
const cubeTexture = new THREE.CubeTextureLoader()
  .setPath('./src/assets/textures/') // 贴图目录路径
  .load([
    'px.png', // 右
    'nx.png', // 左
    'py.png', // 上
    'ny.png', // 下
    'pz.png', // 后
    'nz.png'  // 前
  ]);

// 创建包含环境反射的材质
const sphereMaterial = new THREE.MeshPhongMaterial({
  map: baseTexture,       // 基础地球贴图
  envMap: cubeTexture,    // 环境反射贴图（新增的六张贴图）
  color: 0xB7BEA5,        // 底色（与环境光混合）
  opacity: 1,
  transparent: true,
  side: THREE.DoubleSide,
  reflectivity: 0.3,      // 反射强度（0~1）
  combine: THREE.MixOperation // 贴图混合方式
});

// 创建球体网格对象
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

export default sphere;