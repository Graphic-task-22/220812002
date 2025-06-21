import * as THREE from 'three';

// 1. 创建样条曲线
const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-100, 20, 0),
    new THREE.Vector3(-50, 5, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(50, -50, 0),
    new THREE.Vector3(100, 0, 0),
    new THREE.Vector3(150, 50, 0),
    new THREE.Vector3(200, -50, 0),
    new THREE.Vector3(250, 0, 0)
]);

// 获取1000个均匀分布的路径点（关键新增）
const tubePoints = curve.getSpacedPoints(1000);


// 2. 初始化纹理加载器（修复loader未定义错误）
const textureLoader = new THREE.TextureLoader();

// 3. 加载贴图（添加错误处理）
let texture;
try {
    texture = textureLoader.load(
        './src/assets/suidao.jpg',
        (tex) => {
            tex.wrapS = THREE.RepeatWrapping;
            tex.repeat.set(20, 1);
            tex.colorSpace = THREE.SRGBColorSpace;
            console.log('贴图加载成功');
        },
        undefined,
        (err) => console.error('贴图加载失败:', err)
    );
} catch (error) {
    console.error('纹理初始化错误:', error);
    // 创建红色备用材质
    texture = new THREE.Texture();
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 4;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 4, 4);
    texture.image = canvas;
    texture.needsUpdate = true;
}

// 4. 创建管道几何体（修正变量名path->curve）
const tubeGeometry = new THREE.TubeGeometry(
    curve,  // 使用正确的曲线变量
    100,    // 分段数
    10,     // 半径
    50,     // 径向分段数
    false,

);

// 5. 创建材质（优化参数）
const material = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: texture,
    roughness: 0.8,
    metalness: 0.2,
    aoMapIntensity: 0.5
});

// 6. 创建网格对象
const mesh = new THREE.Mesh(tubeGeometry, material);

// 7. 创建组并添加元素
const group = new THREE.Group();
group.add(mesh);
group.name = 'CatmullRomCurve3';

// 8. 添加光照系统
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
group.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
group.add(ambientLight);

// 9. 暴露曲线数据（用于摄像机动画）
group.userData = {
    curve: curve,
    tubePoints: tubePoints // 新增路径点数组
};
export default group;