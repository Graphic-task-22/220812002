import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
console.log(THREE);

//创建场景
const scene = new THREE.Scene();
console.log('scene',scene);

//创建立方体
const geometry = new THREE.BoxGeometry(1,1,1);
//材质
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  opacity: 0.5,
  transparent: true,
  });

//网格
// const cube = new THREE.Mesh(geometry,material);

const cubes=[];//数组存储所有cube

for(let i=0;i<10;i++){
  for(let j=0;j<10;j++){
    const cube=new THREE.Mesh(geometry,material);
    cube.position.x=2*i;
    cube.position.z=2*j;
    scene.add(cube);
    cubes.push(cube);
  }
}

//立方体添加到场景中
//scene.add(cube);

//创建透视相机
const camera = new THREE.PerspectiveCamera(
  75,//视野角度
  window.innerWidth/window.innerHeight,//长宽比（aspect ratio）
  0.1,//近截面（near）
  1000// 远截面（far）
);
//设置相机摆放位置
camera.position.set(100,50,50);
//设置相机看向的位置
camera.lookAt(0,0,0);

//点光源：两个参数分别表示光源颜色和光照强度
// 参数1：0xffffff是纯白光,表示光源颜色
// 参数2：1.0,表示光照强度，可以根据需要调整
const pointLight = new THREE.PointLight(0xffffff, 1.0);

pointLight.intensity = 1.0;//光照强度
pointLight.decay = 0.0;//设置光源不随距离衰减

//点光源位置
pointLight.position.set(500, 500, 500);
scene.add(pointLight); //点光源添加到场景中

// 点光源辅助观察
const pointLightHelpler = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelpler);

//创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.render(scene,camera);
document.body.appendChild(renderer.domElement);

//渲染循环
function animate(){
  requestAnimationFrame(animate);
  //立方体旋转
  cubes.forEach(cube =>{
    cube.rotation.x+=0.01;
    cube.rotation.y+=0.01;
  });
  renderer.render(scene,camera);
}
animate();

window.onresize = () => {
  console.log(window.innerHeight, window.innerWidth);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

//添加辅助坐标系
const axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);

// 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
// 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
controls.addEventListener('change', function () {
  renderer.render(scene, camera); //执行渲染操作
}); //监听鼠标、键盘事件

import Stats from 'three/addons/libs/stats.module.js';
//创建stats对象
const stats = new Stats();
//stats.domElement:web页面上输出计算结果,一个div元素，
document.body.appendChild(stats.domElement);
// 渲染函数
function render() {
   //requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间
   stats.update();
   renderer.render(scene, camera);//执行渲染操作
   requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
}
render();