const w = 39;
const h = 30;
const thickness = 10;

const pin_tolerance = 0.5;
const pin_d = 7;
const hole_d = pin_d + pin_tolerance;
const pin_h = thickness+6;
const gap = 0.4

const cap_expansion = 4;
const cap_d = pin_d + cap_expansion;
const cap_h = 2;


//Horizontal spacing is the diameter as it's the width of the encompassing circle of the hexagon
const hole_spacing_horizontal = 3/2 * (cap_d/2)*2 + gap;

//Vertical spacing is the height of the hexagon that is fitting inside the circle
const hole_spacing_vertical = (Math.sqrt(3) * cap_d/2)/2 + gap/2;


const { primitives, booleans } = jscad;


function board() {
  const cube = Manifold.cube([w, h, 10], true).translate([w/2,h/2,thickness/2])
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
  for (let i = 7; i < w-6; i += hole_spacing_horizontal) {
    for (let j = 6; j < h-5; j += hole_spacing_vertical) {
      let alternate = (Math.round((j/hole_spacing_vertical)) % 2) //1 every other row
      holes.push( 
        // Manifold.cylinder(
        //   thickness+5,
        //   hole_d/2,
        //   undefined,
        //   6,
        //   true)
        pin(pin_d + pin_tolerance*2, thickness)
          .translate(
          [i + (alternate * hole_spacing_horizontal/2), j, 0]
        )
        
      )
      console.log((j/hole_spacing_vertical), alternate)
      pins.push(
        pin(pin_d, pin_h).translate(
          [i + (alternate * hole_spacing_horizontal/2), j,0])
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
