/// <reference path="../../typings/index.d.ts" />
import {Polytope, Vertex} from "./polytope";

const focalDistance: number = 3.73;

function project(v: Vertex): THREE.Vector3 {
    let w = v.project(3, focalDistance);
    return new THREE.Vector3(
        w.position[0] || 0,
        w.position[1] || 0,
        w.position[2] || 0);
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

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}, false);

let transformedObject = new THREE.LineSegments(undefined, new THREE.LineBasicMaterial({
    color: 0x000000,
    linewidth: 2
}));
scene.add(transformedObject);

let intersectionObject = new THREE.LineSegments(undefined, new THREE.LineBasicMaterial({
    color: 0xff0000,
    linewidth: 4
}));
scene.add(intersectionObject);

document.body.appendChild(renderer.domElement);

export function updateTransformedObject(polytope: Polytope) {
    transformedObject.geometry = makeGeometry(polytope);
    transformedObject.geometry.verticesNeedUpdate = true;
    transformedObject.geometry.lineDistancesNeedUpdate = true;
}

export function updateIntersectionObject(polytope: Polytope) {
    intersectionObject.geometry = makeGeometry(polytope);
    intersectionObject.geometry.verticesNeedUpdate = true;
    intersectionObject.geometry.lineDistancesNeedUpdate = true;
}

export function render() {
    renderer.render(scene, camera);
}
