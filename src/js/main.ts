/// <reference path="../../typings/index.d.ts" />

import {Polytope, Vertex} from './polytope';

const f: number = 3.73;

function project(v: Vertex): THREE.Vector3 {
    if (v.dimension <= 3) {
        return new THREE.Vector3(
            v.position[0] || 0,
            v.position[1] || 0,
            v.position[2] || 0
        );
    } else {
        let res: Vertex = new Vertex();
        let z: number = v.position[v.dimension - 1];
        for (let i: number = 0; i < v.dimension - 1; ++i) {
            let x: number = f * v.position[i] / (f - z);
            res.position.push(x);
        }
        return project(res);
    }
}

function makeGeometry(polytope: Polytope, project: (Vertex) => any): THREE.Geometry {
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

function rotation(dimension, d1, d2: number, angle: number): mathjs.Matrix {
    let res: mathjs.Matrix = math.eye(dimension);
    res.set([d1, d1], Math.cos(angle));
    res.set([d2, d2], Math.cos(angle));
    res.set([d1, d2], -Math.sin(angle));
    res.set([d2, d1], Math.sin(angle));
    return res;
}

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

window.addEventListener('resize', onWindowResize, false);
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);
document.body.appendChild(renderer.domElement);

let mainPolytope = Polytope.make_zero_dimensional_point().extrude(1).extrude(1).extrude(1).extrude(1);

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

let start: number = Date.now();
function render() {
    requestAnimationFrame(render);

    let time: number = Date.now() - start;
    let rot: mathjs.Matrix = rotation(mainPolytope.dimension, 2, 3, time / 1000);

    let transformedPolytope = mainPolytope.map((v: Vertex): Vertex => {
        let position = (math.flatten(math.multiply(rot, v.position)) as any).toArray();
        return new Vertex(position);
    });
    transformedObject.geometry = makeGeometry(transformedPolytope, project);
    transformedObject.geometry.verticesNeedUpdate = true;
    transformedObject.geometry.lineDistancesNeedUpdate = true;

    let intersectionPolytope = transformedPolytope.cut();
    intersectionObject.geometry = makeGeometry(intersectionPolytope, project);
    intersectionObject.geometry.verticesNeedUpdate = true;
    intersectionObject.geometry.lineDistancesNeedUpdate = true;

    renderer.render(scene, camera);
}
render();

function requestFullScreen(element) {
    let method =
        element.requestFullscreen ||
        element.webkitRequestFullscreen ||
        element.mozRequestFullScreen ||
        element.msRequestFullscreen;
    if (method) {
        method.call(element);
    }
}

function exitFullScreen() {
    let method =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.mozCancelFullScreen ||
        document.msExitFullscreen;
    if (method) {
        method.call(document);
    }
}

function isFullScreen(): boolean {
    let field =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullScreenElement;
    if (field) {
        return field;
    } else {
        return false;
    }
}

document.getElementById("full-screen").addEventListener("click", () => {
    if (isFullScreen()) {
        exitFullScreen();
    } else {
        requestFullScreen(document.body);
    }
});
