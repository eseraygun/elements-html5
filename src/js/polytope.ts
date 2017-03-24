export class Vertex {
    position: number[];

    constructor(position: number[] = []) {
        this.position = position;
    }

    static make_zero_dimensional(): Vertex {
        return new Vertex([]);
    }

    static cut_edge(v1: Vertex, v2: Vertex): Vertex | null {
        if (v1.dimension != v2.dimension) {
            throw "unequal vertex dimensions in cut_edge";
        }
        if (v1.dimension == 0) {
            throw "dimensionless vertices in cut_edge";
        }
        let dimension: number = v1.dimension;
        let z1: number = v1.position[dimension - 1];
        let z2: number = v2.position[dimension - 1];
        if (z1 * z2 <= 0) {
            let res: Vertex = new Vertex();
            let denom = (Math.abs(z1) + Math.abs(z2));
            let t1 = Math.abs(z2) / denom;
            let t2 = Math.abs(z1) / denom;
            for (let d: number = 0; d < dimension - 1; ++d) {
                res.position.push(v1.position[d] * t1 + v2.position[d] * t2);
            }
            return res;
        } else {
            return null;
        }
    }

    get dimension(): number {
        return this.position.length;
    }

    promote(z: number): Vertex {
        let res: Vertex = new Vertex(this.position.slice());
        res.position.push(z);
        return res;
    }

    project(targetDimension: number, focalDistance: number): Vertex {
        if (this.dimension <= targetDimension) {
            return this;
        } else {
            let res: Vertex = new Vertex();
            let z: number = this.position[this.dimension - 1];
            for (let i: number = 0; i < this.dimension - 1; ++i) {
                let x: number = focalDistance * this.position[i] / (focalDistance - z);
                res.position.push(x);
            }
            return res.project(targetDimension, focalDistance);
        }
    }
}

export class Polytope {
    vertices: Vertex[];
    elements: number[][][];

    constructor(vertices: Vertex[] = [], elements: number[][][] = []) {
        this.vertices = vertices;
        this.elements = elements;
    }

    static make_zero_dimensional_point(): Polytope {
        return new Polytope([Vertex.make_zero_dimensional()], []);
    }

    get dimension(): number {
        return this.elements.length;
    }

    map(f: (Vertex) => Vertex): Polytope {
        return new Polytope(this.vertices.map(f), this.elements);
    }

    replicate(f1, f2: (Vertex) => Vertex): Polytope {
        let res: Polytope = new Polytope();
        this.vertices.forEach((v: Vertex) => {
            res.vertices.push(f1(v));
            res.vertices.push(f2(v));
        });
        this.elements.forEach((elems: number[][]) => {
            let res_elems: number[][] = [];
            elems.forEach((e: number[]) => {
                res_elems.push(e.map((b: number): number => { return b * 2; }));
                res_elems.push(e.map((b: number): number => { return b * 2 + 1; }));
            });
            res.elements.push(res_elems);
        });
        return res;
    }

    extrude(amount: number): Polytope {
        let res: Polytope = this.replicate(
            (v: Vertex): Vertex => v.promote(-amount),
            (v: Vertex): Vertex => v.promote(amount));
        res.elements.push([]);

        let linking_edges: number[][] = [];
        this.vertices.forEach((_: Vertex, i: number) =>{
            linking_edges.push([i * 2, i * 2 + 1]);
        });
        let offset: number = res.elements[0].length;
        Array.prototype.push.apply(res.elements[0], linking_edges);

        this.elements.forEach((elems: number[][], d: number) => {
            let linking_elems: number[][] = [];
            elems.forEach((e: number[], i: number) => {
                let l: number[] = e.map((b: number): number => offset + b);
                l.push(i * 2);
                l.push(i * 2 + 1);
                linking_elems.push(l);
            });
            offset = res.elements[d + 1].length;
            Array.prototype.push.apply(res.elements[d + 1], linking_elems);
        });

        return res;
    }

    cut(): Polytope {
        let res: Polytope = new Polytope();

        if (this.dimension == 0) {
            return res;
        }

        let cut_elems: number[] = [];
        this.elements[0].forEach((e: number[], i: number) => {
            if (e.length != 2) {
                throw "invalid number of bounding elements: edges must have exactly two bounding elements";
            }
            let c: Vertex | null = Vertex.cut_edge(this.vertices[e[0]], this.vertices[e[1]]);
            if (c !== null) {
                cut_elems[i] = res.vertices.length;
                res.vertices.push(c);
            }
        });

        let cut_elems_prev: number[] = cut_elems;
        cut_elems = [];
        for (let d: number = 1; d < this.dimension; ++d) {
            let elems: number[][] = this.elements[d];
            res.elements.push([]);
            elems.forEach((e: number[], i: number) => {
                let c: number[] = [];
                e.forEach((b: number) => {
                    let k: number | undefined = cut_elems_prev[b];
                    if (k !== undefined) {
                        c.push(k);
                    }
                });
                if (c.length != 0) {
                    if (c.length < d) {
                        throw "not enough bounding elements";
                    }
                    cut_elems[i] = res.elements[d - 1].length;
                    res.elements[d - 1].push(c);
                }
            });
            cut_elems_prev = cut_elems;
            cut_elems = [];
        }

        return res;
    }
}
