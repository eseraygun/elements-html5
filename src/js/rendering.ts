/// <reference path="../../typings/index.d.ts" />
import {Polytope, Vertex} from "./polytope";

const focalDistance: number = 5;

function project(v: Vertex): THREE.Vector3 {
    let u = v.project(2, focalDistance);
    let w = v.project(3, focalDistance);
    return new THREE.Vector3(
        u.position[0] || 0,
        u.position[1] || 0,
        u.position[2] || 0);
}

function makeGeometry(polytope: Polytope): THREE.Geometry {
    if (polytope.dimension == 0) {
        return undefined;
    }

    let res = new THREE.Geometry();
    polytope.elements[0].forEach((e: number[]) => {
        res.vertices.push(
            project(polytope.vertices[e[0]]),
            project(polytope.vertices[e[1]])
        );
    });

    return res;
}

let scene = new THREE.Scene();

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);

let radius: number = 4;
let aspectRatio: number = window.innerWidth / window.innerHeight;
let camera = new THREE.OrthographicCamera(-radius * aspectRatio, radius * aspectRatio, radius, -radius, 0.1, 1000);
camera.position.z = 1;

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
}, false);

let transformedObject = new THREE.LineSegments(undefined, new THREE.LineBasicMaterial({
    color: 0x000000,
    linewidth: 1
}));
scene.add(transformedObject);

let intersectionObject = new THREE.LineSegments(undefined, new THREE.LineBasicMaterial({
    color: 0xff0000,
    linewidth: 4
}));
scene.add(intersectionObject);

document.body.appendChild(renderer.domElement);

export function updateTransformedObject(polytope: Polytope) {
    scene.remove(transformedObject);
    transformedObject = new THREE.LineSegments(makeGeometry(polytope), new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 1
    }));
    scene.add(transformedObject);
}

export function updateIntersectionObject(polytope: Polytope) {
    scene.remove(intersectionObject);
    intersectionObject = new THREE.LineSegments(makeGeometry(polytope), new THREE.LineBasicMaterial({
        color: 0xff0000,
        linewidth: 4
    }));
    scene.add(intersectionObject);
}

export function render() {
    renderer.render(scene, camera);
}
