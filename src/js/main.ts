/// <reference path="../../typings/index.d.ts" />
import {Polytope, Vertex} from './polytope';
import {render, updateIntersectionObject, updateTransformedObject} from "./rendering";

function translation(dimension: number, h: number, v: number): mathjs.Matrix {
    let plane = jQuery('#translate-dialog').serializeObject();
    let d1: number = parseInt(plane['axis-1']);
    let d2: number = parseInt(plane['axis-2']);

    let res: any = math.zeros([dimension]);
    res[d1] = h;
    res[d2] = v;
    return res;
}

function rotation(dimension: number, orientation: string, angle: number): mathjs.Matrix {
    let plane = jQuery('#rotate-' + orientation + '-dialog').serializeObject();
    let d1: number = parseInt(plane['axis-1']);
    let d2: number = parseInt(plane['axis-2']);

    let res: mathjs.Matrix = math.eye(dimension);
    res.set([d1, d1], Math.cos(angle));
    res.set([d2, d2], Math.cos(angle));
    res.set([d1, d2], -Math.sin(angle));
    res.set([d2, d1], Math.sin(angle));
    return res;
}

let mainPolytope = Polytope.makePointInZerothDimension().extrude(1).extrude(1).extrude(1).extrude(1);
let del: any = math.zeros([mainPolytope.dimension]);
let rot: any = math.eye(mainPolytope.dimension);
let startDel: any;
let startRot: any;
let panningMode: string;

function handleAnimationFrame() {
    requestAnimationFrame(handleAnimationFrame);

    let transformedPolytope = mainPolytope.map((v: Vertex): Vertex => {
        let position = (math.flatten(math.add(math.multiply(rot, v.position), del) as any) as any).toArray();
        return new Vertex(position);
    });
    updateTransformedObject(transformedPolytope);

    let intersectionPolytope = transformedPolytope.cut();
    updateIntersectionObject(intersectionPolytope);

    render();
}
requestAnimationFrame(handleAnimationFrame);

let hammertime = new Hammer(document.body, {});
hammertime.get('pan').set({direction: Hammer.DIRECTION_ALL, pointers: 0});
hammertime.on('panstart', function() {
    startRot = rot;
    startDel = del;
    panningMode = 'rotation';
});
hammertime.on('pan', function(ev) {
    let dimension = mainPolytope.dimension;
    if (ev.pointers.length == 1 && ev.pointers[0].shiftKey == false && panningMode == 'rotation') {
        rot = math.multiply(rotation(dimension, 'h', Math.round(ev.deltaX / 10) * Math.PI / 36),
                            startRot);
        rot = math.multiply(rotation(dimension, 'v', Math.round(ev.deltaY / 10) * Math.PI / 36),
                            rot);
    } else {
        del = math.add(translation(dimension, Math.round(ev.deltaX / 10) * 0.1, Math.round(ev.deltaY / 10) * 0.1),
                       startDel);
        panningMode = 'translation';
    }
});

let dialogs = jQuery('.dialog');
let dialogTriggers = jQuery('.dialog-trigger');

jQuery('#full-screen').click(function() {
    jQuery(document.body).fullscreen().toggle();
});

dialogTriggers.click(function() {
    let relatedDialog = jQuery('#' + this.id + '-dialog');
    let mustShow: boolean = relatedDialog.hasClass('hidden');
    dialogs.addClass('hidden');
    dialogTriggers.removeClass('on');
    if (mustShow) {
        relatedDialog.removeClass('hidden');
        jQuery(this).addClass('on');
    }
    return false;
});

jQuery('#about').click(function() {
    window.location.href = 'https://github.com/eseraygun/elements-html5/';
});
