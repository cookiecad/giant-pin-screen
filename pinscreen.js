const extent_w = 200;
const extent_h = 200;

const thickness = 10;

const pin_tolerance = 0.4;
const pin_d = 7;
const hole_d = pin_d + pin_tolerance;
const pin_h = thickness+6;
const gap = 0.4

const cap_expansion = 4;
const cap_d = pin_d + cap_expansion;
const cap_h = 2;


//Horizontal spacing is the diameter as it's the width of the encompassing circle of the hexagon
const hole_spacing_horizontal = (3/2 * cap_d) / 2  + gap;

//Vertical spacing is the height of the hexagon that is fitting inside the circle
const hole_spacing_vertical = (Math.sqrt(3) * cap_d/2) + gap;

//Make actual width and height multiples in multiples
let border = 10;
const w = Math.floor((extent_w-border) / hole_spacing_horizontal) * hole_spacing_horizontal;
const h = Math.floor((extent_h-border) / hole_spacing_vertical) * hole_spacing_vertical;

const { primitives, booleans } = jscad;


function board() {
  let cube_w = w+border, cube_h = h+border+hole_spacing_vertical;
  const cube = Manifold.cube([cube_w, cube_h, 10], true)
    .translate([w/2 - hole_spacing_horizontal/2,
                h/2 + hole_spacing_vertical/4,
                thickness/2])
  return cube;
}

function pin(pin_d, pin_h) {
  const pin_r = pin_d / 2;
  const cap_r = pin_r + cap_expansion/2;
  let result = Manifold.union([
    Manifold.cylinder(
      cap_h,
      cap_r,
      pin_r,
      6),
    Manifold.cylinder(
      pin_h,
      pin_r,
      pin_r,
      6),
    Manifold.cylinder(
      cap_h,
      pin_r,
      cap_r,
      6).translate([0,0,pin_h-cap_h]),
  ])      
  return result;
}

function makeHolesAndPins() {
  let holes = [];
  let pins = [];
  for (let i = 0; i < w; i += hole_spacing_horizontal) {
      let alternate = (Math.round((i/(hole_spacing_horizontal))) % 2) //1 every other row
      console.log(alternate)
    for (let j = 0; j < h; j += hole_spacing_vertical) {
      holes.push( 
        // Manifold.cylinder(
        //   thickness+5,
        //   hole_d/2,
        //   undefined,
        //   6,
        //   true)
        pin(pin_d + pin_tolerance*2, thickness)
          .translate(
          [i , j + (alternate * hole_spacing_vertical/2),0])
      )
      console.log((j/hole_spacing_vertical), alternate)
      pins.push(
        pin(pin_d, pin_h).translate(
          [i , j + (alternate * hole_spacing_vertical/2),0])
      )      
    }
  }
  return {holes: Manifold.union(...holes), pins: Manifold.union(...pins)};
}

let holesAndPins = makeHolesAndPins();
// let result = [jscad.booleans.subtract(board(), holes())]
let result = Manifold.difference([board() , holesAndPins.holes]);
result = Manifold.union(result, holesAndPins.pins);

// Render the cube
return result;
