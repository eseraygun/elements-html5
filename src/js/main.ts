/// <reference path="../../typings/index.d.ts" />
import {Polytope, Vertex} from './polytope';
import {render, updateIntersectionObject, updateTransformedObject} from "./rendering";

function rotation(dimension, d1, d2: number, angle: number): mathjs.Matrix {
    let res: mathjs.Matrix = math.eye(dimension);
    res.set([d1, d1], Math.cos(angle));
    res.set([d2, d2], Math.cos(angle));
    res.set([d1, d2], -Math.sin(angle));
    res.set([d2, d1], Math.sin(angle));
    return res;
}

let mainPolytope = Polytope.make_zero_dimensional_point().extrude(1).extrude(1).extrude(1);
let rot: mathjs.Matrix = math.eye(mainPolytope.dimension);

let start: number = Date.now();
function handleAnimationFrame() {
    requestAnimationFrame(handleAnimationFrame);

    let time: number = Date.now() - start;

    let transformedPolytope = mainPolytope.map((v: Vertex): Vertex => {
        let position = (math.flatten(math.multiply(rot, v.position)) as any).toArray();
        return new Vertex(position);
    });
    updateTransformedObject(transformedPolytope);

    let intersectionPolytope = transformedPolytope.cut();
    updateIntersectionObject(intersectionPolytope);

    render();
}
requestAnimationFrame(handleAnimationFrame);

declare let Hammer: any;
let hammertime = new Hammer(document.body, {});
hammertime.get('pan').set({direction: Hammer.DIRECTION_ALL});
hammertime.on('pan', function(ev) {
    rot = math.multiply(rotation(mainPolytope.dimension, 0, 2, -ev.velocityX / 10), rot);
    rot = math.multiply(rotation(mainPolytope.dimension, 1, 2, ev.velocityY / 10), rot);
});

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
        document['mozCancelFullScreen'] ||
        document['msExitFullscreen'];
    if (method) {
        method.call(document);
    }
}

function isFullScreen(): boolean {
    let field =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document['mozFullScreenElement'] ||
        document['msFullScreenElement'];
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
