import { Eq } from "fp-ts/lib/Eq";
import { Bool } from "../01-daggy/bool";
import { List, matchList } from "../01-daggy/list"
import { Coord, Line } from "../01-daggy/shape";


// equals :: Setoid a => a -> a -> Bool

const coordEq: Eq<Coord> = {
  // equals :: Coord -> Coord -> Bool
  equals: (a, b) => a.x === b.x && a.y === b.y && a.z === b.z
}

const lineEq: Eq<Line> = {
  // equals :: Line -> Line -> Bool
  equals: (a, b) => coordEq.equals(a.from, b.from) && coordEq.equals(a.to, b.to)
}

const boolEq: Eq<Bool> = {
  // equals :: Bool -> Bool -> Bool
  equals: (a, b) => a._tag === b._tag
}

/**
 * @using fp-ts 
 * import { getEq } from "fp-ts/lib/Array";
 * const arrayEq = <A>(E: Eq<A>): Eq<A[]> => getEq(E)
 *
 * Check the lists' heads, then their tails
 * equals :: Setoid a => [a] -> [a] -> Bool
 *
 * @see https://gcanti.github.io/fp-ts/guides/purescript.html#type-constraints
 * the constraint is implemented as an additional parameter
 */
const listEq = <A>(E: Eq<A>): Eq<List<A>> => ({
  equals: (a, b) => {
    return matchList(a)({
      Cons: (head, tail) => matchList(b)({
        // Note the two different Setoid uses:
        Cons: (head2, tail2) => E.equals(head, head2)  // a
          && listEq(E).equals(tail, tail2),  // [a]
        Nil: b._tag === 'Nil'
      }),
      Nil: a._tag === 'Nil'
    })
  }
})


const numberEq: Eq<number> = { equals: (a, b) => a === b }
// listEq(numberEq).equals(Cons(1, Cons(2, Nil)), Cons(1, Cons(2, Nil)))

// indexOf :: Setoid a => [a] -> a -> Int
export const indexOf = <A>(E: Eq<A>) => (xs: A[]) => (x: A) => {
  for (let i = 0; i < xs.length; i++) {
    if (E.equals(xs[i], x)) return i
  }
  return -1
}

// const nub = <A>(xs: A[]) => xs.filter(
//   (x, i) => xs.indexOf(x) === i)

// nub_ :: Setoid a => [a] -> [a]
const nub = <A>(E: Eq<A>) => (xs: A[]) => xs.filter(
  (x, i) => indexOf(E)(xs)(x) === i)

