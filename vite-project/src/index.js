import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import sphere from './mesh/sphere.js';
import pointLight from './lights/pointlight.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { terrain, updateTerrain } from './demo/mountain.js';
import tunnel from './demo/tunnel.js';
import { createHouseScene } from './demo/house.js';

const textureLoader = new THREE.TextureLoader();
let renderer, camera, scene;
let currentScene = null;

// ================== 作业一：地球旋转贴图加粒子特效 ==================
function initEarthScene() {
    // 场景初始化
    scene = new THREE.Scene();
    currentScene = 'earth';
    
    // 添加地球
    scene.add(sphere);
    
    // 创建粒子系统
    const starTexture = textureLoader.load('/pictures/snowflake3.png');
    const sparkTexture = textureLoader.load('/pictures/snowflake2.png');
    const dotTexture = textureLoader.load('/pictures/snowflake1.png');
    
    const sprites = createSprites(starTexture, sparkTexture);
    const starField = createStarField(dotTexture);
    
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    
    // 点光源
    scene.add(pointLight);

    // 摄像机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    // 渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 初始化 GUI
    const gui = new GUI();
    
    // 地球设置
    const earthFolder = gui.addFolder('地球设置');
    earthFolder.add(sphere.position, 'x', -50, 50).name('X 坐标');
    earthFolder.add(sphere.position, 'y', -50, 50).name('Y 坐标');
    earthFolder.add(sphere.position, 'z', -50, 50).name('Z 坐标');
    earthFolder.add(sphere.rotation, 'x', 0, Math.PI * 2).name('旋转 X');
    earthFolder.add(sphere.rotation, 'y', 0, Math.PI * 2).name('旋转 Y');
    earthFolder.add(sphere.rotation, 'z', 0, Math.PI * 2).name('旋转 Z');

    // 材质设置
    const materialFolder = gui.addFolder('材质');
    materialFolder.addColor(sphere.material, 'color').name('颜色');
    materialFolder.add(sphere.material, 'transparent').name('透明');
    materialFolder.add(sphere.material, 'opacity', 0, 1).name('透明度');
    materialFolder.addColor(sphere.material, 'specular').name('高光颜色');

    // 光源设置
    const lightFolder = gui.addFolder('光源');
    
    // 环境光
    const ambientLightFolder = lightFolder.addFolder('环境光');
    ambientLightFolder.addColor(ambientLight, 'color').name('颜色');
    ambientLightFolder.add(ambientLight, 'intensity', 0, 2).name('强度');
    
    // 点光源
    const pointLightFolder = lightFolder.addFolder('点光源');
    pointLightFolder.addColor(pointLight, 'color').name('颜色');
    pointLightFolder.add(pointLight, 'intensity', 0, 2).name('强度');
    pointLightFolder.add(pointLight.position, 'x', -50, 50).name('X 坐标');
    pointLightFolder.add(pointLight.position, 'y', -50, 50).name('Y 坐标');
    pointLightFolder.add(pointLight.position, 'z', -50, 50).name('Z 坐标');

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

    // 动画函数
    function animateEarth() {
        if (currentScene !== 'earth') return;
        
        requestAnimationFrame(animateEarth);
        renderer.render(scene, camera);
        
        // 地球旋转
        sphere.rotation.x += 0.005;
        sphere.rotation.y += 0.01;
        
        // 粒子动画
        starField.rotation.x += 0.001;
        sprites.forEach(sprite => {
            sprite.position.y += 0.1;
            if(sprite.position.y > 500) sprite.position.y = -500;
        });
    }

    // 初始化辅助工具
    initHelper();
    initStats();
    animateEarth();
}

// ================== 作业二：无限隧道 ==================
function initTunnelScene() {
    // 场景初始化
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    currentScene = 'tunnel';
    
    // 添加隧道
    scene.add(tunnel);
    
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    // 摄像机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0);

    // 渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 隧道控制变量
    let cameraIndex = 0;
    let baseSpeed = 1;
    let currentSpeed = baseSpeed;
    let isAutoMoving = true;

    // 初始化 GUI
    const gui = new GUI();
    
    // 隧道控制
    const tunnelFolder = gui.addFolder('隧道控制');
    tunnelFolder.add({ baseSpeed: 1 }, 'baseSpeed', 0.1, 5)
        .name('基础速度')
        .onChange(v => baseSpeed = v);
    tunnelFolder.add({ isAutoMoving: true }, 'isAutoMoving')
        .name('自动移动')
        .onChange(v => isAutoMoving = v);

    // 键盘控制
    document.addEventListener('keydown', (e) => {
        if (currentScene !== 'tunnel') return;
        
        switch(e.code) {
            case 'ArrowDown':
                currentSpeed = baseSpeed * 3; // 加速
                break;
            case 'ArrowUp':  
                currentSpeed = baseSpeed;     // 恢复原速
                break;
            case 'Space':    
                isAutoMoving = !isAutoMoving; // 暂停/继续
                break;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (currentScene !== 'tunnel') return;
        
        if (e.code === 'ArrowDown') {
            currentSpeed = baseSpeed; // 松开减速
        }
    });

    // 动画函数
    function animateTunnel() {
        if (currentScene !== 'tunnel') return;
        
        requestAnimationFrame(animateTunnel);
        
        const points = tunnel.userData?.tubePoints;
        if (points && isAutoMoving) {
            if (cameraIndex < points.length - 2) {
                camera.position.copy(points[cameraIndex]);
                
                // 看向前方点
                const lookAheadIndex = Math.min(cameraIndex + 15, points.length - 1);
                camera.lookAt(points[lookAheadIndex]);
                
                cameraIndex += currentSpeed;
            } else {
                cameraIndex = 0;
            }
        }
        
        renderer.render(scene, camera);
    }

    // 初始化辅助工具
    initHelper();
    initStats();
    animateTunnel();
}

// ================== 作业三：跳动的山脉 ==================
function initMountainScene() {
    // 场景初始化
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    currentScene = 'mountain';
    
    // 添加山脉
    scene.add(terrain);
    
    // 增强光照系统
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);

    // 添加平行光模拟阳光
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(1, 1, 1).normalize();
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // 添加雾效增强景深
    scene.fog = new THREE.FogExp2(0x87CEEB, 0.002);

    // 摄像机设置
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 80, 120);
    camera.lookAt(0, 0, 0);

    // 渲染器设置
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // 添加水面反射
    const waterGeometry = new THREE.PlaneGeometry(500, 500);
    const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x3399ff,
        transparent: true,
        opacity: 0.7,
        metalness: 0.8,
        roughness: 0.1
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -5;
    scene.add(water);

    // 增强动画效果
    let time = 0;
    function animateMountain() {
        if (currentScene !== 'mountain') return;
        
        requestAnimationFrame(animateMountain);
        
        // 增强地形波动效果
        time += 0.01;
        updateTerrain();
        
        // 添加摄像机轻微晃动模拟观察者呼吸
        camera.position.y = 80 + Math.sin(time * 0.5) * 0.5;
        
        // 水面波动
        waterMaterial.opacity = 0.7 + Math.sin(time) * 0.1;
        
        renderer.render(scene, camera);
    }

    // 初始化辅助工具
    initHelper();
    initStats();
    animateMountain();
}

// ================== 作业四：星露谷农场 ==================
function initFarmScene() {
    // 场景初始化
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    currentScene = 'farm';
    
    // 创建房屋场景
    const houseScene = createHouseScene();
    scene.add(houseScene);
    
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // 平行光模拟阳光
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(50, 100, 50);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // 摄像机
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(40, 30, 50);
    camera.lookAt(0, 0, 0);

    // 渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // 初始化 GUI
    const gui = new GUI();
    
    // 农场控制
    const farmFolder = gui.addFolder('农场控制');
    const settings = {
        dayNight: () => {
            const isDay = scene.background.getHex() === 0x87CEEB;
            scene.background = new THREE.Color(isDay ? 0x1a1a2e : 0x87CEEB);
            scene.fog = new THREE.FogExp2(isDay ? 0x1a1a2e : 0x87CEEB, 0.002);
            sunLight.intensity = isDay ? 0.1 : 1.0;
            ambientLight.intensity = isDay ? 0.2 : 0.6;
        },
        weather: () => {
            // 这里可以添加天气切换逻辑
            console.log('天气切换功能');
        },
        callCat: () => {
            // 这里可以添加呼唤小猫逻辑
            console.log('呼唤小猫功能');
        }
    };
    farmFolder.add(settings, 'dayNight').name('白天/夜晚');
    farmFolder.add(settings, 'weather').name('切换天气');
    farmFolder.add(settings, 'callCat').name('呼唤小猫');

    // 动画函数
    function animateFarm() {
        if (currentScene !== 'farm') return;
        
        requestAnimationFrame(animateFarm);
        
        // 更新房屋动画
        houseScene.traverse(child => {
            if (child.userData && child.userData.animate) {
                child.userData.animate();
            }
        });
        
        renderer.render(scene, camera);
    }

    // 初始化辅助工具
    initHelper();
    initStats();
    animateFarm();
}

// ================== 通用工具函数 ==================
function initHelper() {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', () => {
        renderer.render(scene, camera);
    });
    
    // 注释掉坐标轴辅助
    // const axesHelper = new THREE.AxesHelper(50);
    // scene.add(axesHelper);
    
    // 注释掉网格地面辅助
    // const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
    // scene.add(gridHelper);
}

function initStats() {
    const stats = new Stats();
    document.body.appendChild(stats.domElement);
    function render() {
        stats.update();
        requestAnimationFrame(render);
    }
    render();
}

function createSprites(starTexture, sparkTexture) {
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

function createStarField(dotTexture) {
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

// 窗口大小调整
window.onresize = function () {
    if (!renderer) return;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
};

// ================== 场景选择器 ==================
function createSceneSelector() {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '10px';
    container.style.left = '10px';
    container.style.zIndex = '100';
    container.style.backgroundColor = 'rgba(0,0,0,0.7)';
    container.style.padding = '10px';
    container.style.borderRadius = '5px';
    container.style.color = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    
    const title = document.createElement('h3');
    title.textContent = '场景选择';
    title.style.marginTop = '0';
    container.appendChild(title);
    
    const earthBtn = createSceneButton('地球旋转', initEarthScene);
    const tunnelBtn = createSceneButton('无限隧道', initTunnelScene);
    const mountainBtn = createSceneButton('跳动的山脉', initMountainScene);
    const farmBtn = createSceneButton('星露谷农场', initFarmScene);
    
    container.appendChild(earthBtn);
    container.appendChild(tunnelBtn);
    container.appendChild(mountainBtn);
    container.appendChild(farmBtn);
    
    document.body.appendChild(container);
}

function createSceneButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.display = 'block';
    button.style.width = '100%';
    button.style.marginBottom = '5px';
    button.style.padding = '5px';
    button.style.cursor = 'pointer';
    button.style.backgroundColor = '#3498db';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '3px';
    
    button.addEventListener('click', () => {
        // 清除现有场景
        if (renderer) {
            document.body.removeChild(renderer.domElement);
        }
        
        // 初始化新场景
        onClick();
    });
    
    return button;
}

// ================== 主入口 ==================
// 创建场景选择器
createSceneSelector();

// 默认启动地球场景
initEarthScene();