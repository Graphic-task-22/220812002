import * as THREE from 'three';

// 创建星露谷物语风格房屋
export function createHouseScene() {
    const scene = new THREE.Group();
    scene.name = "StardewValleyHouse";
    
    // 创建地面
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x88cc44,
        roughness: 0.9
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    scene.add(ground);
    
    // 创建草地纹理效果
    const grassGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    const grassMaterial = new THREE.MeshStandardMaterial({
        color: 0x66bb33,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.rotation.x = -Math.PI / 2;
    scene.add(grass);
    
    // 创建房屋主体
    const houseGeometry = new THREE.BoxGeometry(30, 20, 25);
    const houseMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5deb3,
        roughness: 0.8
    });
    const house = new THREE.Mesh(houseGeometry, houseMaterial);
    house.position.y = 10;
    scene.add(house);
    
    // 创建屋顶
    const roofGeometry = new THREE.ConeGeometry(25, 15, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.7
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 25;
    roof.rotation.y = Math.PI / 4;
    scene.add(roof);
    
    // 创建门
    const doorGeometry = new THREE.BoxGeometry(6, 10, 1);
    const doorMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513
    });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 5, 12.6);
    scene.add(door);
    
    // 创建窗户
    const windowGeometry = new THREE.BoxGeometry(5, 5, 1);
    const windowMaterial = new THREE.MeshStandardMaterial({
        color: 0x87ceeb,
        transparent: true,
        opacity: 0.7
    });
    
    const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
    window1.position.set(-10, 15, 12.6);
    scene.add(window1);
    
    const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
    window2.position.set(10, 15, 12.6);
    scene.add(window2);
    
    // 创建烟囱
    const chimneyGeometry = new THREE.BoxGeometry(4, 15, 4);
    const chimneyMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080
    });
    const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
    chimney.position.set(12, 20, -8);
    scene.add(chimney);
    
    // 创建烟雾粒子
    const smokeParticles = new THREE.Group();
    const smokeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
    });
    
    for (let i = 0; i < 15; i++) {
        const size = 2 + Math.random() * 3;
        const smokeGeometry = new THREE.SphereGeometry(size, 8, 8);
        const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
        
        smoke.position.set(
            12 + Math.random() * 8 - 4,
            30 + i * 3 + Math.random() * 2,
            -8 + Math.random() * 4 - 2
        );
        
        smokeParticles.add(smoke);
    }
    scene.add(smokeParticles);
    
    // 创建花朵
    const flowerGeometry = new THREE.ConeGeometry(1, 3, 6);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x00cc00 });
    const flowerMaterials = [
        new THREE.MeshStandardMaterial({ color: 0xff69b4 }), // 粉色
        new THREE.MeshStandardMaterial({ color: 0xffd700 }), // 黄色
        new THREE.MeshStandardMaterial({ color: 0x9370db }), // 紫色
        new THREE.MeshStandardMaterial({ color: 0xff6347 }), // 红色
    ];
    
    for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 50;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        const y = Math.random() * 2;
        
        // 花茎
        const stem = new THREE.Mesh(flowerGeometry, stemMaterial);
        stem.position.set(x, y, z);
        stem.rotation.x = Math.PI / 2;
        scene.add(stem);
        
        // 花朵
        const flowerColor = flowerMaterials[Math.floor(Math.random() * flowerMaterials.length)];
        const flower = new THREE.Mesh(
            new THREE.SphereGeometry(2, 8, 8),
            flowerColor
        );
        flower.position.set(x, y + 3, z);
        scene.add(flower);
    }
    
 // 创建小猫组
const catGroup = new THREE.Group();
catGroup.name = "catGroup";

try {
    // 尝试加载贴图
    const catTexture = new THREE.TextureLoader().load(
        '../assets/textures/cat.png',
        undefined,
        undefined,
        function (error) {
            console.error('小猫贴图加载失败:', error);
            // 加载失败时创建更仿真的备用小猫模型
            createRealisticCat(catGroup);
            console.warn('使用仿真备用小猫模型');
        }
    );
    
    catTexture.colorSpace = THREE.SRGBColorSpace;
    
    const catMaterial = new THREE.MeshBasicMaterial({
        map: catTexture,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    const catGeometry = new THREE.PlaneGeometry(10, 10);
    const cat = new THREE.Mesh(catGeometry, catMaterial);
    catGroup.add(cat);
    console.log('小猫贴图加载成功');
} catch (error) {
    console.error('创建小猫失败:', error);
    // 创建更仿真的备用小猫模型
    createRealisticCat(catGroup);
}

// 将小猫放在房子前面
catGroup.position.set(-15, 5, 15);
catGroup.rotation.y = Math.PI / 4;
scene.add(catGroup);

// 创建更仿真小猫的函数
function createRealisticCat(group) {
    // 清除组内原有内容
    group.clear();
    
    // 猫身体（椭圆体）
    const bodyGeometry = new THREE.SphereGeometry(3, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    bodyGeometry.scale(1.5, 0.8, 1);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        shininess: 30
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 2;
    group.add(body);
    
    // 猫头（球体）
    const headGeometry = new THREE.SphereGeometry(2, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        shininess: 30
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 5, 2);
    group.add(head);
    
    // 猫耳朵（圆锥体）
    const earGeometry = new THREE.ConeGeometry(0.8, 1.5, 32);
    const earMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
    
    // 左耳
    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(-1, 6, 1.5);
    leftEar.rotation.x = -Math.PI / 4;
    leftEar.rotation.z = -Math.PI / 8;
    group.add(leftEar);
    
    // 右耳
    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(1, 6, 1.5);
    rightEar.rotation.x = -Math.PI / 4;
    rightEar.rotation.z = Math.PI / 8;
    group.add(rightEar);
    
    // 猫眼睛（球体）
    const eyeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x0066ff });
    
    // 左眼
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.7, 5.2, 3.8);
    group.add(leftEye);
    
    // 右眼
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.7, 5.2, 3.8);
    group.add(rightEye);
    
    // 猫鼻子（小三角锥）
    const noseGeometry = new THREE.ConeGeometry(0.2, 0.5, 3);
    const noseMaterial = new THREE.MeshPhongMaterial({ color: 0xff9999 });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0, 4.8, 3.9);
    nose.rotation.z = Math.PI;
    group.add(nose);
    
    // 猫腿（圆柱体）
    const legGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
    
    // 前左腿
    const frontLeftLeg = new THREE.Mesh(legGeometry, legMaterial);
    frontLeftLeg.position.set(-1.5, 0.5, 1);
    frontLeftLeg.rotation.x = Math.PI / 6;
    group.add(frontLeftLeg);
    
    // 前右腿
    const frontRightLeg = new THREE.Mesh(legGeometry, legMaterial);
    frontRightLeg.position.set(1.5, 0.5, 1);
    frontRightLeg.rotation.x = Math.PI / 6;
    group.add(frontRightLeg);
    
    // 后左腿
    const backLeftLeg = new THREE.Mesh(legGeometry, legMaterial);
    backLeftLeg.position.set(-1.5, 0.5, -1);
    backLeftLeg.rotation.x = -Math.PI / 6;
    group.add(backLeftLeg);
    
    // 后右腿
    const backRightLeg = new THREE.Mesh(legGeometry, legMaterial);
    backRightLeg.position.set(1.5, 0.5, -1);
    backRightLeg.rotation.x = -Math.PI / 6;
    group.add(backRightLeg);
    
    // 猫尾巴（弯曲圆柱体）
    const tailCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 2, -2),
        new THREE.Vector3(-1, 3, -3),
        new THREE.Vector3(-2, 4, -4),
        new THREE.Vector3(-3, 3, -5)
    ]);
    
    const tailGeometry = new THREE.TubeGeometry(tailCurve, 20, 0.3, 8, false);
    const tailMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    group.add(tail);
    
    // 添加环境光和平行光使模型更立体
    const ambientLight = new THREE.AmbientLight(0x404040);
    group.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    group.add(directionalLight);
}
    // 添加动画功能
    scene.userData = {
        animate: function() {
            // 小猫轻微上下浮动
            catGroup.position.y = 5 + Math.sin(Date.now() * 0.002) * 0.5;
            
            // 烟雾动画
            smokeParticles.children.forEach((particle, index) => {
                particle.position.y += 0.02;
                particle.scale.x *= 1.005;
                particle.scale.y *= 1.005;
                particle.scale.z *= 1.005;
                
                if (particle.position.y > 50) {
                    particle.position.y = 30;
                    particle.scale.set(1, 1, 1);
                }
            });
        }
    };
    
    return scene;
}