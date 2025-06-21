import * as THREE from 'three';

// 加载环境贴图
const textureCube = new THREE.CubeTextureLoader()
    .setPath('./src/assets/textures/') // ✅ 确保路径正确
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'], 
        () => console.log('Texture loaded successfully'),
        undefined,
        (err) => console.error('Texture load error:', err)
    );

export { textureCube };