import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";

const container = document.getElementById("scene-container");

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050109, 0.07);

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(2.8, 2.6, 6.2);
scene.add(camera);

const ambientLight = new THREE.AmbientLight(0xefd3ff, 0.45);
scene.add(ambientLight);

const moonLight = new THREE.PointLight(0xff7b00, 1.6, 30, 2.4);
moonLight.position.set(-4.5, 5.2, 1.5);
moonLight.castShadow = true;
moonLight.shadow.mapSize.set(1024, 1024);
scene.add(moonLight);

const rimLight = new THREE.DirectionalLight(0x4466ff, 0.6);
rimLight.position.set(3, 6, -2);
rimLight.castShadow = true;
scene.add(rimLight);

const groundGeometry = new THREE.PlaneGeometry(45, 45);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x040007,
  roughness: 0.95,
  metalness: 0.05,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.receiveShadow = true;
ground.rotation.x = -Math.PI / 2;
ground.position.y = -2.2;
scene.add(ground);

const silkAnchor = new THREE.Vector3(-5.2, 4.6, -3.2);

const spiderGroup = new THREE.Group();
const silkGroup = new THREE.Group();
scene.add(spiderGroup);
scene.add(silkGroup);

const spiders = [];
const clock = new THREE.Clock();

class Spider {
  constructor(anchor, destination) {
    this.anchor = anchor.clone();
    this.start = anchor.clone().add(
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.25,
        -Math.random() * 0.3,
        (Math.random() - 0.5) * 0.25
      )
    );
    this.destination = destination.clone();
    this.currentBase = this.start.clone();

    this.progress = 0;
    this.speed = 0.18 + Math.random() * 0.22;
    this.bobPhase = Math.random() * Math.PI * 2;

    this.group = new THREE.Group();
    this.group.position.copy(this.start);
    this.group.userData.spider = this;

    const abdomenMaterial = new THREE.MeshStandardMaterial({
      color: 0x101010,
      roughness: 0.7,
      metalness: 0.3,
    });

    const thoraxMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a0f1f,
      emissive: 0x280a10,
      emissiveIntensity: 0.2,
      roughness: 0.6,
      metalness: 0.25,
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4f3c,
      emissive: 0xff4f3c,
      emissiveIntensity: 1.5,
    });

    const abdomenGeometry = new THREE.SphereGeometry(0.26, 24, 24);
    const abdomen = new THREE.Mesh(abdomenGeometry, abdomenMaterial);
    abdomen.scale.set(1.3, 1.1, 1.6);
    abdomen.castShadow = true;
    abdomen.position.set(0, -0.02, 0.06);
    this.group.add(abdomen);

    const thoraxGeometry = new THREE.SphereGeometry(0.18, 24, 24);
    const thorax = new THREE.Mesh(thoraxGeometry, thoraxMaterial);
    thorax.castShadow = true;
    thorax.position.set(0, -0.05, -0.12);
    this.group.add(thorax);

    const headGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const head = new THREE.Mesh(headGeometry, thoraxMaterial);
    head.position.set(0, -0.04, -0.27);
    head.castShadow = true;
    this.group.add(head);

    const eyeGeometry = new THREE.SphereGeometry(0.03, 8, 8);
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.04, -0.01, -0.33);
    const rightEye = leftEye.clone();
    rightEye.position.x *= -1;
    head.add(leftEye);
    head.add(rightEye);

    this.legs = [];
    this.createLegs(thoraxMaterial);

    this.group.traverse((child) => {
      child.userData.spider = this;
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const silkGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(6);
    silkGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    this.silkPositions = positions;
    this.silkLine = new THREE.Line(
      silkGeometry,
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.55,
        linewidth: 2,
      })
    );
    this.silkLine.userData.spider = this;
    silkGroup.add(this.silkLine);

    this.baseDestination = this.destination.clone();
  }

  createLegs(material) {
    const legMaterial = material.clone();
    legMaterial.roughness = 0.5;
    legMaterial.metalness = 0.4;

    const legGeometry = new THREE.CylinderGeometry(0.02, 0.04, 0.9, 10);
    const legOffsets = [0.18, 0.05, -0.08, -0.21];

    legOffsets.forEach((offset, index) => {
      [1, -1].forEach((side) => {
        const pivot = new THREE.Object3D();
        pivot.position.set(0.08 * side, -0.07, offset);
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.y = -0.4;
        leg.rotation.z = Math.PI / 2;
        leg.scale.set(1, 1, 0.65);
        pivot.add(leg);

        pivot.rotation.z = (Math.PI / 3) * side;
        pivot.rotation.y = (Math.PI / 12) * side;

        this.group.add(pivot);

        this.legs.push({
          pivot,
          side,
          offsetIndex: index,
        });
      });
    });
  }

  update(delta, elapsed) {
    if (this.progress < 1) {
      this.progress = Math.min(1, this.progress + delta * this.speed);
      const eased = easeOutCubic(this.progress);
      this.currentBase.lerpVectors(this.start, this.destination, eased);
    } else {
      this.currentBase.copy(this.destination);
    }

    const bob = Math.sin(elapsed * 2 + this.bobPhase) * 0.07;
    const sway = Math.sin(elapsed * 1.2 + this.bobPhase * 1.6) * 0.12;

    this.group.position.copy(this.currentBase);
    this.group.position.y += bob;
    this.group.rotation.y = sway * 0.25;

    this.animateLegs(elapsed);
    this.updateSilk();
  }

  animateLegs(time) {
    this.legs.forEach((leg) => {
      const wave = Math.sin(time * 2.2 + leg.offsetIndex * 0.9 + this.bobPhase);
      leg.pivot.rotation.y = wave * 0.18 * leg.side;
      leg.pivot.rotation.x = -0.3 + wave * 0.1;
    });
  }

  updateSilk() {
    this.silkPositions[0] = this.anchor.x;
    this.silkPositions[1] = this.anchor.y;
    this.silkPositions[2] = this.anchor.z;
    this.silkPositions[3] = this.group.position.x;
    this.silkPositions[4] = this.group.position.y + 0.2;
    this.silkPositions[5] = this.group.position.z;
    this.silkLine.geometry.attributes.position.needsUpdate = true;
  }

  dispose() {
    silkGroup.remove(this.silkLine);
    this.silkLine.geometry.dispose();
    this.silkLine.material.dispose();
  }
}

function easeOutCubic(t) {
  const p = 1 - Math.max(0, Math.min(1, t));
  return 1 - p * p * p;
}

function createSpiderWeb() {
  const group = new THREE.Group();
  const radialSegments = 14;
  const concentric = 6;
  const radius = 2.4;
  const webMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.55,
  });

  for (let i = 0; i < radialSegments; i++) {
    const angle = (i / radialSegments) * Math.PI * 2;
    const outer = new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    );
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      outer,
    ]);
    const line = new THREE.Line(geometry, webMaterial);
    group.add(line);
  }

  for (let c = 1; c <= concentric; c++) {
    const currentRadius = (c / concentric) * radius;
    const points = [];
    for (let i = 0; i <= radialSegments; i++) {
      const angle = (i / radialSegments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * currentRadius,
          Math.sin(angle) * currentRadius,
          0
        )
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const circle = new THREE.LineLoop(geometry, webMaterial);
    circle.rotation.z = Math.sin(c) * 0.08;
    group.add(circle);
  }

  const anchor = new THREE.Group();
  anchor.add(group);
  anchor.position.copy(silkAnchor);
  anchor.rotation.set(Math.PI / 7, Math.PI / 2.4, 0);
  return anchor;
}

function createMoonGlow() {
  const geometry = new THREE.CircleGeometry(2, 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffae45,
    transparent: true,
    opacity: 0.18,
  });
  const moon = new THREE.Mesh(geometry, material);
  moon.position.set(-6, 6.5, -8);
  moon.rotation.y = Math.PI;
  scene.add(moon);
}

function spawnSpider({ randomizeDestination = true } = {}) {
  const destination = randomizeDestination
    ? new THREE.Vector3(
        -1.4 + Math.random() * 5,
        0.2 + Math.random() * 3.4,
        -1.2 + Math.random() * 2.4
      )
    : new THREE.Vector3(-0.8, 1.1, 0.2);

  const spider = new Spider(silkAnchor, destination);
  spiderGroup.add(spider.group);
  spiders.push(spider);
  return spider;
}

createMoonGlow();
const spiderWeb = createSpiderWeb();
scene.add(spiderWeb);

const initialSpider = spawnSpider({ randomizeDestination: false });
initialSpider.destination.set(-0.8, 1.1, 0.2);
initialSpider.baseDestination = initialSpider.destination.clone();

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let currentHovered = null;
let interactionCount = 0;
let lastInteraction = 0;
const multipliers = [2, 5, 10];
const maxSpiders = 120;

function registerInteraction() {
  if (spiders.length >= maxSpiders) {
    return;
  }

  const now = performance.now();
  if (now - lastInteraction < 350) {
    return;
  }
  lastInteraction = now;

  const multiplier =
    interactionCount < multipliers.length
      ? multipliers[interactionCount]
      : multipliers[multipliers.length - 1];
  interactionCount += 1;

  const currentCount = spiders.length;
  const targetCount = Math.min(maxSpiders, Math.ceil(currentCount * multiplier));
  for (let i = currentCount; i < targetCount; i++) {
    spawnSpider();
  }
}

function findSpiderFromObject(object) {
  let current = object;
  while (current) {
    if (current.userData && current.userData.spider) {
      return current.userData.spider;
    }
    current = current.parent;
  }
  return null;
}

function handlePointer(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(spiderGroup.children, true);
  if (intersects.length) {
    const spider = findSpiderFromObject(intersects[0].object);
    if (spider && spider !== currentHovered) {
      currentHovered = spider;
      registerInteraction();
    }
  } else {
    currentHovered = null;
  }
}

function handleClick(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(spiderGroup.children, true);
  if (intersects.length) {
    registerInteraction();
  }
}

window.addEventListener("pointermove", handlePointer);
window.addEventListener("click", handleClick);

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const elapsed = clock.elapsedTime;

  spiders.forEach((spider) => spider.update(delta, elapsed));

  renderer.render(scene, camera);
}

animate();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener("resize", onWindowResize);
