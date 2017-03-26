/// <reference path="../../typings/index.d.ts" />
import {Polytope, Vertex} from './polytope';
import {render, updateIntersectionObject, updateTransformedObject} from "./rendering";

function rotation(dimension, orientation: string, angle: number): mathjs.Matrix {
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

let mainPolytope = Polytope.make_zero_dimensional_point().extrude(1).extrude(1).extrude(1).extrude(1);
let rot: any = math.eye(mainPolytope.dimension);
let del: any = math.zeros(mainPolytope.dimension);

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
hammertime.on('pan', function(ev) {
    if (ev.pointers.length == 1 && ev.pointers[0].shiftKey == false) {
        rot = math.multiply(rotation(mainPolytope.dimension, 'h', ev.velocityX / 10), rot);
        rot = math.multiply(rotation(mainPolytope.dimension, 'v', ev.velocityY / 10), rot);
    } else {
        del.set([0], del.get([0]) + ev.velocityX / 10);
        del.set([2], del.get([2]) + ev.velocityY / 10);
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

jQuery('.plane-selector').change(function() {
     jQuery(this).serializeObject();
});
