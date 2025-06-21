import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

// 配置参数
const config = {
  size: 300,          // 地形尺寸
  segments: 60,       // 网格密度（平衡性能与细节）
  heightScale: 40,    // 高度缩放
  wireframeColor: 0xFFD700, // 金色网格
  animationSpeed: 0.0005
};

// 1. 初始化噪声和几何体
const noise2D = createNoise2D();
const geometry = new THREE.PlaneGeometry(
  config.size,
  config.size,
  config.segments,
  config.segments
);

// 2. 生成地形高度
const positions = geometry.attributes.position;
const baseHeights = new Float32Array(positions.count);
for (let i = 0; i < positions.count; i++) {
  const x = positions.getX(i);
  const y = positions.getY(i);
  baseHeights[i] = noise2D(x / 100, y / 100) * config.heightScale;
  positions.setZ(i, baseHeights[i]);
}

// 3. 创建镂空网格材质
const material = new THREE.MeshBasicMaterial({
  color: 0x111111,    
  wireframe: true,    
  wireframeLinewidth: 1,
  transparent: true,
  opacity: 0.2        
});

// 4. 创建金色线框
const wireframe = new THREE.LineSegments(
  new THREE.WireframeGeometry(geometry),
  new THREE.LineBasicMaterial({
    color: config.wireframeColor,
    transparent: true,
    opacity: 0.8,
    linewidth: 1
  })
);

// 5. 组合对象
const terrain = new THREE.Group();
terrain.add(new THREE.Mesh(geometry, material));
terrain.add(wireframe);
terrain.rotation.x = -Math.PI / 2;

// 6. 优化动态更新
function updateTerrain() {
  const time = Date.now() * config.animationSpeed;

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const baseZ = baseHeights[i];
    const wave = Math.sin(time + y * 0.05) * 5;
    positions.setZ(i, baseZ + wave);
  }

  positions.needsUpdate = true;

  wireframe.geometry.dispose(); 
  wireframe.geometry = new THREE.WireframeGeometry(geometry);
}



export { terrain, updateTerrain };