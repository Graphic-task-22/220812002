import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { createHouseScene } from './house.js';

// 作业四：星露谷物语风格农场场景
export function createFarmScene() {
    // 创建场景容器
    const container = document.createElement('div');
    container.id = 'farm-scene-container';
    container.style.width = '100%';
    container.style.height = '100vh';
    container.style.position = 'relative';
    
    // 添加到页面
    document.body.appendChild(container);

    // 创建场景、相机和渲染器
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.FogExp2(0x87CEEB, 0.002);

    const camera = new THREE.PerspectiveCamera(
        60, 
        window.innerWidth / window.innerHeight,
        0.1, 
        1000
    );
    camera.position.set(40, 30, 50);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 创建UI容器
    const uiContainer = document.createElement('div');
    uiContainer.style.position = 'absolute';
    uiContainer.style.top = '20px';
    uiContainer.style.left = '20px';
    uiContainer.style.zIndex = '10';
    uiContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    uiContainer.style.padding = '15px';
    uiContainer.style.borderRadius = '10px';
    uiContainer.style.fontFamily = 'Arial, sans-serif';
    uiContainer.style.color = '#333';
    container.appendChild(uiContainer);

    const title = document.createElement('h1');
    title.textContent = '星露谷物语风格农场';
    title.style.margin = '0 0 15px 0';
    title.style.color = '#e76f51';
    uiContainer.appendChild(title);

    const description = document.createElement('p');
    description.textContent = '温馨的小屋、盛开的花朵，还有一只可爱的小猫！';
    description.style.margin = '0 0 15px 0';
    uiContainer.appendChild(description);

    // 添加控制按钮
    const controlsDiv = document.createElement('div');
    controlsDiv.style.display = 'flex';
    controlsDiv.style.gap = '10px';
    controlsDiv.style.flexWrap = 'wrap';
    uiContainer.appendChild(controlsDiv);

    function createControlButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.padding = '8px 15px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.backgroundColor = '#e9c46a';
        button.style.color = '#4a2c2a';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';
        button.style.transition = 'all 0.3s';
        
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#f4a261';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#e9c46a';
        });
        
        button.addEventListener('click', onClick);
        
        return button;
    }

    // 状态变量
    let isDay = true;
    let isRaining = false;
    const raindrops = [];

    const dayNightBtn = createControlButton('切换白天/夜晚', () => {
        isDay = !isDay;
        updateLighting();
    });

    const weatherBtn = createControlButton('切换天气', () => {
        isRaining = !isRaining;
        updateWeather();
    });

    const catBtn = createControlButton('呼唤小猫', () => {
        moveCat();
    });

    controlsDiv.appendChild(dayNightBtn);
    controlsDiv.appendChild(weatherBtn);
    controlsDiv.appendChild(catBtn);

    // 添加性能监视器
    const stats = new Stats();
    stats.showPanel(0);
    container.appendChild(stats.dom);

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(50, 100, 50);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // 创建房屋场景
    const houseScene = createHouseScene();
    scene.add(houseScene);

    // 添加一些树
    function createTree(x, z) {
        const treeGroup = new THREE.Group();
        
        // 树干
        const trunkGeometry = new THREE.CylinderGeometry(1.5, 2, 10, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 5;
        treeGroup.add(trunk);
        
        // 树叶
        const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x3c8d0d });
        
        const leaves1 = new THREE.Mesh(
            new THREE.ConeGeometry(8, 12, 8),
            leavesMaterial
        );
        leaves1.position.y = 15;
        treeGroup.add(leaves1);
        
        const leaves2 = new THREE.Mesh(
            new THREE.ConeGeometry(6, 10, 8),
            leavesMaterial
        );
        leaves2.position.y = 22;
        treeGroup.add(leaves2);
        
        const leaves3 = new THREE.Mesh(
            new THREE.ConeGeometry(4, 8, 8),
            leavesMaterial
        );
        leaves3.position.y = 28;
        treeGroup.add(leaves3);
        
        treeGroup.position.set(x, 0, z);
        return treeGroup;
    }

    scene.add(createTree(-40, -40));
    scene.add(createTree(50, -30));
    scene.add(createTree(40, 40));
    scene.add(createTree(-50, 30));

    // 创建围栏
    function createFence() {
        const fenceGroup = new THREE.Group();
        const fenceMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        
        // 创建围栏桩
        for (let i = -80; i <= 80; i += 10) {
            // 左右两侧
            const post1 = new THREE.Mesh(
                new THREE.CylinderGeometry(0.8, 0.8, 5, 8),
                fenceMaterial
            );
            post1.position.set(i, 2.5, 80);
            fenceGroup.add(post1);
            
            const post2 = new THREE.Mesh(
                new THREE.CylinderGeometry(0.8, 0.8, 5, 8),
                fenceMaterial
            );
            post2.position.set(i, 2.5, -80);
            fenceGroup.add(post2);
            
            // 上下两侧
            if (Math.abs(i) < 80) {
                const post3 = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.8, 0.8, 5, 8),
                    fenceMaterial
                );
                post3.position.set(80, 2.5, i);
                fenceGroup.add(post3);
                
                const post4 = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.8, 0.8, 5, 8),
                    fenceMaterial
                );
                post4.position.set(-80, 2.5, i);
                fenceGroup.add(post4);
            }
        }
        
        // 创建横杆
        for (let i = -80; i <= 80; i += 10) {
            // 水平横杆
            const horizontalBar1 = new THREE.Mesh(
                new THREE.BoxGeometry(10, 0.5, 0.5),
                fenceMaterial
            );
            horizontalBar1.position.set(i + 5, 4.5, 80);
            fenceGroup.add(horizontalBar1);
            
            const horizontalBar2 = new THREE.Mesh(
                new THREE.BoxGeometry(10, 0.5, 0.5),
                fenceMaterial
            );
            horizontalBar2.position.set(i + 5, 4.5, -80);
            fenceGroup.add(horizontalBar2);
            
            // 垂直横杆
            if (Math.abs(i) < 80) {
                const verticalBar1 = new THREE.Mesh(
                    new THREE.BoxGeometry(0.5, 0.5, 10),
                    fenceMaterial
                );
                verticalBar1.position.set(80, 4.5, i + 5);
                fenceGroup.add(verticalBar1);
                
                const verticalBar2 = new THREE.Mesh(
                    new THREE.BoxGeometry(0.5, 0.5, 10),
                    fenceMaterial
                );
                verticalBar2.position.set(-80, 4.5, i + 5);
                fenceGroup.add(verticalBar2);
            }
        }
        
        return fenceGroup;
    }

    scene.add(createFence());

    // 添加一些云朵
    function createCloud(x, y, z) {
        const cloudGroup = new THREE.Group();
        const cloudMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        const sizes = [4, 5, 6, 5, 4];
        const positions = [
            [0, 0, 0],
            [-3, 1, 0],
            [3, 1, 0],
            [-1.5, -1, 0],
            [1.5, -1, 0]
        ];
        
        for (let i = 0; i < sizes.length; i++) {
            const cloudPart = new THREE.Mesh(
                new THREE.SphereGeometry(sizes[i], 8, 8),
                cloudMaterial
            );
            cloudPart.position.set(positions[i][0], positions[i][1], positions[i][2]);
            cloudGroup.add(cloudPart);
        }
        
        cloudGroup.position.set(x, y, z);
        cloudGroup.userData = {
            speed: 0.01 + Math.random() * 0.02
        };
        return cloudGroup;
    }

    const clouds = [
        createCloud(-60, 60, -40),
        createCloud(30, 70, 30),
        createCloud(70, 50, -60),
        createCloud(-20, 65, 70)
    ];

    clouds.forEach(cloud => scene.add(cloud));

    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 更新光照
    function updateLighting() {
        if (isDay) {
            scene.background = new THREE.Color(0x87CEEB);
            scene.fog = new THREE.FogExp2(0x87CEEB, 0.002);
            sunLight.intensity = 1.0;
            ambientLight.intensity = 0.6;
        } else {
            scene.background = new THREE.Color(0x1a1a2e);
            scene.fog = new THREE.FogExp2(0x1a1a2e, 0.001);
            sunLight.intensity = 0.1;
            ambientLight.intensity = 0.2;
        }
    }

    // 更新天气
    function updateWeather() {
        if (isRaining) {
            // 创建雨滴
            for (let i = 0; i < 200; i++) {
                const raindropGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 4);
                const raindropMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0x6495ED,
                    transparent: true,
                    opacity: 0.7
                });
                
                const raindrop = new THREE.Mesh(raindropGeometry, raindropMaterial);
                raindrop.position.set(
                    Math.random() * 180 - 90,
                    100 + Math.random() * 50,
                    Math.random() * 180 - 90
                );
                
                raindrop.rotation.x = Math.PI / 2;
                scene.add(raindrop);
                raindrops.push(raindrop);
            }
        } else {
            // 移除雨滴
            raindrops.forEach(drop => scene.remove(drop));
            raindrops.length = 0;
        }
    }

    // 移动小猫
    function moveCat() {
        const targetX = Math.random() * 80 - 40;
        const targetZ = Math.random() * 80 - 40;
        
        houseScene.traverse(object => {
            if (object.isGroup && object.children.length > 0 && object.children[0].material.map) {
                // 找到小猫组
                object.userData.targetX = targetX;
                object.userData.targetZ = targetZ;
            }
        });
    }

    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        
        // 更新控制器
        controls.update();
        
        // 更新性能监视器
        stats.update();
        
        // 更新房屋场景动画
        if (houseScene.userData && houseScene.userData.animate) {
            houseScene.userData.animate();
        }
        
        // 更新云朵位置
        clouds.forEach(cloud => {
            cloud.position.x += cloud.userData.speed;
            if (cloud.position.x > 100) {
                cloud.position.x = -100;
            }
        });
        
        // 更新雨滴
        if (isRaining) {
            raindrops.forEach(drop => {
                drop.position.y -= 2;
                if (drop.position.y < 0) {
                    drop.position.y = 100 + Math.random() * 50;
                    drop.position.x = Math.random() * 180 - 90;
                    drop.position.z = Math.random() * 180 - 90;
                }
            });
        }
        
        // 移动小猫
        houseScene.traverse(object => {
            if (object.isGroup && object.children.length > 0 && object.children[0].material.map) {
                if (object.userData.targetX !== undefined) {
                    const dx = object.userData.targetX - object.position.x;
                    const dz = object.userData.targetZ - object.position.z;
                    const dist = Math.sqrt(dx * dx + dz * dz);
                    
                    if (dist > 1) {
                        object.position.x += dx * 0.02;
                        object.position.z += dz * 0.02;
                        
                        // 面向移动方向
                        object.rotation.y = Math.atan2(dz, dx) - Math.PI / 2;
                    } else {
                        // 到达目的地后随机看看周围
                        object.rotation.y += (Math.random() - 0.5) * 0.1;
                    }
                } else {
                    // 随机看看周围
                    object.rotation.y += (Math.random() - 0.5) * 0.01;
                }
            }
        });
        
        // 渲染场景
        renderer.render(scene, camera);
    }

    // 窗口大小调整
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 开始动画
    animate();

    // 返回清理函数
    return () => {
        container.remove();
        window.removeEventListener('resize', () => {});
    };
}