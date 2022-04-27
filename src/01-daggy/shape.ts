import { absurd } from "fp-ts/lib/function"

export type Coord = {
  x: number,
  y: number,
  z: number
};

export type Line = {
  from: Coord,
  to: Coord
}

// data constructors
export const Coord = (x: number, y: number, z: number): Coord => ({ x, y, z });
export const Line = (from: Coord, to: Coord): Line => ({ from, to });

export const translateCoord = (x: number, y: number, z: number) => (c: Coord) => Coord(c.x + x, c.y + y, c.z + z);


/**
 * @example
 * const origin = Coord(0, 0, 0);
 * const myLine = Line(origin, pipe(origin, translateCoord(2, 4, 6)));
 */

// Sum Type
interface Square {
  readonly _tag: 'Square',
  readonly topleft: Coord,
  readonly bottomright: Coord
}

interface Circle {
  readonly _tag: 'Circle',
  readonly center: Coord,
  readonly radius: number
}

export type Shape = Square | Circle

export const Square = (topleft: Coord) => (bottomright: Coord): Shape => ({
  _tag: 'Square',
  topleft,
  bottomright
})

export const Circle = (center: Coord) => (radius: number): Shape => ({
  _tag: 'Circle',
  center: center,
  radius
})

export const translateShape = (x: number) => (y: number) => (z: number) => (shape: Shape) => {
  const t = translateCoord(x, y, z)

  return matchShape(shape)({
    Square: (topleft, bottomright) => Square(t(topleft))(t(bottomright)),
    Circle: (center, radius) => Circle(t(center))(radius)
  })
}

export const matchShape = (shape: Shape) => <R>(matchers: {
  Square: (topleft: Coord, bottomright: Coord) => R
  Circle: (center: Coord, radius: number) => R
}): R => {
  switch (shape._tag) {
    case 'Square': return matchers.Square(shape.topleft, shape.bottomright);
    case 'Circle': return matchers.Circle(shape.center, shape.radius);
    default: return absurd(shape)
  }
}

