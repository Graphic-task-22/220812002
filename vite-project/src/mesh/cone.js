// mesh/cone.js
import * as THREE from 'three';

// 圆锥体的参数
const radius = 15;          // 底部半径
const height = 20;         // 高度
const radialSegments = 32; // 径向分段数
const heightSegments = 1;  // 高度分段数
const openEnded = false;   // 是否开口
const thetaStart = 0;      // 起始角度
const thetaLength = Math.PI * 2; // 角度长度

// 创建圆锥体的几何体
const coneGeometry = new THREE.ConeGeometry(
    radius,
    height,
    radialSegments,
    heightSegments,
    openEnded,
    thetaStart,
    thetaLength
);

// 使用 MeshPhongMaterial 创建材质
const coneMaterial = new THREE.MeshPhongMaterial({
    color: 0xB7BEA5, // 颜色
    opacity: 0.8,    // 不透明度
    transparent: true, // 允许透明
});

// 创建网格对象
const cone = new THREE.Mesh(coneGeometry, coneMaterial);

// 设置圆锥体的初始位置
cone.position.set(50, 50, 50);

export default cone;