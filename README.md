# Elements

Elements is an in-browser tool for visualizing multidimensional objects and their intersections. See it
[live](http://eseraygun.com/elements/)!

Multidimensional objects are represented as [polytopes](https://en.wikipedia.org/wiki/Polytope) where each element is
bounded by lower-dimensional elements (edges by vertices, faces by edges, etc.). The tool projects any object to two
dimensional screen surface using perspective projection to make them visible to the human eye.

The tool also computes the intersection of the object and the hyperplane parallel to the screen. The intersection is
shown in red and it makes even easier to comprehend the real structure of the object.

## Building

To build the web site under `dist` folder, install all the required packages with `npm install` and run `gulp`.

## History

Elements was originally written in Delphi by [Eser Aygün](http://eseraygun.com/) and
[Işık Barış Fidaner](https://yersizseyler.wordpress.com/) as a high school project in 2000. The project won the second
place in a national project contest.

The original report in Turkish and the original executable can be found
[here](https://yersizseyler.wordpress.com/2016/05/13/cok-boyutlu-cisimlerin-izdusumlerinin-ve-arakesitlerinin-alinmasi/).

## Future Work

Currently, the tool only shows a four dimensional hypercube even though the code supports arbitrary polytopes. Other
interesting objects such as three/four dimensional torus, cone and sphere will be added in the future.
