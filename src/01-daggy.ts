// @see [Fantas, Eel, and Specification 1: Daggy](http://www.tomharding.me/2017/03/03/fantas-eel-and-specification/)
import { pipe } from 'fp-ts/function';

type Cord = {
  x: number,
  y: number,
  z: number
};

type Line = {
  from: Cord,
  to: Cord
}

const cord = (x: number, y: number, z: number): Cord => ({ x, y , z});
const line = (from: Cord, to: Cord): Line => ({ from, to });

const translateCord = (x: number, y: number, z: number) => (c: Cord) => cord(c.x + x, c.y + y, c.z + z);
const origin = cord(0, 0, 0);

const myLine = line(origin, pipe(origin, translateCord(2, 4, 6)));

// Sum Type
interface True {
  readonly _tag: 'True',
  readonly value: boolean
}

interface False {
  readonly _tag: 'False',
  readonly value: boolean
}

export type Bool = True | False

export const True = (value: Bool) => ({ value })
export const False = (value: Bool) => ({ value })


interface Square {
  readonly _tag: 'Square',
  readonly topleft: Cord,
  readonly bottomright: Cord
}

interface Circle {
  readonly _tag: 'Circle',
  readonly center: Cord,
  readonly radius: number 
}

export type Shape = Square | Circle

export const Square = (topleft: Cord) => (bottomright: Cord): Square => ({
  _tag: 'Square',
  topleft,
  bottomright
})

export const Circle = (center: Cord) => (radius: number): Circle => ({
  _tag: 'Circle',
  center: center,
  radius
})

// TODO:
const translateShape = (x: number) => (y: number) => (z: number) => (shape: Shape) => {
  const t = translateCord(x, y, z)
  
  return matchShape({
    Square: (topleft, bottomright) => Square(t(topleft))(t(bottomright)),
    Circle: (center, radius) => Circle(t(center))(radius)
  })(shape)
}

// TODO:
const matchShape = <R = unknown>(matchers: {
  Square: (topleft: Cord, bottomright: Cord) => R
  Circle: (center: Cord, radius: number) => R
}) => (shape: Shape): R => {
  if (shape._tag === 'Square') {
    return matchers.Square(shape.topleft, shape.bottomright)
  }

  return matchers.Circle(shape.center, shape.radius)
}


