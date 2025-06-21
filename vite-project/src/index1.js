import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
// import sphere from './mesh/sphere';
import sphere from './mesh/sphere';
import pointLight from './lights/pointlight';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// import cone from './mesh/cone';
// import plane from './mesh/plane';

const textureLoader = new THREE.TextureLoader();
const starTexture = textureLoader.load('/pictures/snowflake3.png');
const sparkTexture = textureLoader.load('/pictures/snowflake2.png');
const dotTexture = textureLoader.load('/pictures/snowflake1.png');
// const floorTexture = textureLoader.load('./pictures/floor.png'); // 地板贴图

let renderer, camera, scene;
let sprites = []; // 声明为全局变量
let starField;     // 声明为全局变量
// let floorPlane; 

function init() {
    // 场景
    scene = new THREE.Scene();
    console.log('sphere', sphere);

    // 将立方体、球体和点光源添加到场景中
    // scene.add(sphere);
    scene.add(sphere);
    scene.add(pointLight);
    // scene.add(cone);
    // scene.add(plane);


    // // ========== 添加地板 ==========
    // const planeGeometry = new THREE.PlaneGeometry(500, 500);
    // const planeMaterial = new THREE.MeshStandardMaterial({
    //     map: floorTexture,
    //     side: THREE.DoubleSide
    // });
    // floorPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    // floorPlane.rotation.x = -Math.PI / 2;
    // floorPlane.position.y = -10;
    // scene.add(floorPlane);


    // ========== 新增粒子系统 ==========
    sprites = createSprites();    // 创建Sprite粒子
    starField = createStarField(); // 创建星空粒子

    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // 摄像机
    camera = new THREE.PerspectiveCamera(
        75, // 视野角度（FOV）
        window.innerWidth / window.innerHeight, // 长宽比（aspect ratio）
        0.1, // 近截面（near）
        1000 // 远截面（far）
    );

    camera.position.set(100, 100, 100);
    camera.lookAt(0, 0, 0);

    // 渲染器
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 初始化 GUI
    const gui = new GUI();

    // 物体设置
    const objectFolder = gui.addFolder('物体');
    objectFolder.add(sphere.position, 'x', -50, 50).name('立方体 X 坐标');
    objectFolder.add(sphere.position, 'y', -50, 50).name('立方体 Y 坐标');
    objectFolder.add(sphere.position, 'z', -50, 50).name('立方体 Z 坐标');
    objectFolder.add(sphere.rotation, 'x', 0, Math.PI * 2).name('立方体旋转 X');
    objectFolder.add(sphere.rotation, 'y', 0, Math.PI * 2).name('立方体旋转 Y');
    objectFolder.add(sphere.rotation, 'z', 0, Math.PI * 2).name('立方体旋转 Z');

    // 材质设置
    const materialFolder = gui.addFolder('材质');
    materialFolder.addColor(sphere.material, 'color').name('立方体颜色');
    materialFolder.add(sphere.material, 'transparent').name('是否透明');
    materialFolder.add(sphere.material, 'opacity', 0, 1).name('透明度');
    materialFolder.addColor(sphere.material, 'specular').name('高光颜色');

    // 光源设置
    const lightFolder = gui.addFolder('光源');

    // 环境光
    const ambientLightFolder = lightFolder.addFolder('环境光');
    ambientLightFolder.addColor(ambientLight, 'color').name('环境光颜色');
    ambientLightFolder.add(ambientLight, 'intensity', 0, 2).name('环境光强度');

    // 点光源
    const pointLightFolder = lightFolder.addFolder('点光源');
    pointLightFolder.addColor(pointLight, 'color').name('点光源颜色');
    pointLightFolder.add(pointLight, 'intensity', 0, 2).name('点光源强度');
    pointLightFolder.add(pointLight.position, 'x', -50, 50).name('点光源 X 坐标');
    pointLightFolder.add(pointLight.position, 'y', -50, 50).name('点光源 Y 坐标');
    pointLightFolder.add(pointLight.position, 'z', -50, 50).name('点光源 Z 坐标');

    // 重置按钮
    const settings = {
        setDefault: () => {
            sphere.position.set(0, 0, 0);
            sphere.rotation.set(0, 0, 0);
            sphere.material.color.set(0xffffff);
            sphere.material.transparent = true;
            sphere.material.opacity = 0.8;
            sphere.material.specular.set(0xfcfcfc);
            ambientLight.color.set(0xffffff);
            ambientLight.intensity = 1;
            pointLight.color.set(0xffffff);
            pointLight.intensity = 1;
            pointLight.position.set(27.6, 12.2, 23.4);
        },
        clear: () => {
            sphere.position.set(0, 0, 0);
            sphere.rotation.set(0, 0, 0);
            sphere.material.color.set(0xffffff);
            sphere.material.transparent = true;
            sphere.material.opacity = 0.8;
            sphere.material.specular.set(0xfcfcfc);
            ambientLight.color.set(0xffffff);
            ambientLight.intensity = 1;
            pointLight.color.set(0xffffff);
            pointLight.intensity = 1;
            pointLight.position.set(27.6, 12.2, 23.4);
        },
    };
    gui.add(settings, 'setDefault').name('重置到默认值');
    gui.add(settings, 'clear').name('清除设置');
}

window.onresize = function () {
    if (!renderer) return;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
};

function initHelper() {
    // // 辅助坐标轴
    // const axesHelper = new THREE.AxesHelper(50);
    // scene.add(axesHelper);

    // 设置相机控件轨道控制器OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', () => renderer.render(scene, camera));

    // // 添加一个辅助网格地面
    // const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
    // scene.add(gridHelper);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    // ========== 新增粒子动画 ==========
    starField.rotation.x += 0.001;
    sprites.forEach(sprite => {
        sprite.position.y += 0.1;
        // 循环位置
        if(sprite.position.y > 500) sprite.position.y = -500;
    });
}

function initStats() {
    const stats = new Stats();
    document.body.appendChild(stats.domElement);
    function render() {
        stats.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    render();
}

// ========== 新增粒子创建函数 ==========
function createSprites() {
    const sprites = [];
    for(let i = 0; i < 200; i++) {
        const material = new THREE.SpriteMaterial({
            map: Math.random() > 0.5 ? starTexture : sparkTexture,
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        const sprite = new THREE.Sprite(material);
        sprite.position.set(
            Math.random() * 1000 - 500,
            Math.random() * 1000 - 500,
            Math.random() * 1000 - 500
        );
        sprite.scale.set(2, 2, 1);
        scene.add(sprite);
        sprites.push(sprite);
    }
    return sprites;
}

function createStarField() {
    const geometry = new THREE.BufferGeometry();
    const count = 100000;
    const positions = new Float32Array(count * 3);

    for(let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 2000;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particles = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
            size: 1.2,
            map: dotTexture,
            color: 0x88aaff,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })
    );
    scene.add(particles);
    return particles;
}

// ========== 初始化流程 ==========
init();
initHelper();
initStats();
animate();