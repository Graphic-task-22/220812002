import * as THREE from 'three';
import { textureCube } from './texture.js';

// 创建PBR材质（MeshStandardMaterial不支持specular属性）
const material = new THREE.MeshStandardMaterial({
    metalness: 1.0,
    roughness: 0.5,
    envMap: textureCube,
    color: new THREE.Color(0xffffff) // ✅ 仅保留支持的属性
});

export { material };