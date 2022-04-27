import { absurd } from "fp-ts/lib/function"

export type List<A> = Cons<A, List<A>> | Nil

interface Cons<Head, Tail> {
  _tag: 'Cons'
  head: Head,
  tail: Tail
}

interface Nil {
  _tag: 'Nil'
}

// data constructors
export const Cons = <A>(head: A, tail: List<A>): List<A> => ({ _tag: 'Cons', head, tail })
export const Nil: List<never> = ({ _tag: 'Nil' })

export const matchList = <A>(l: List<A>) => <R>(matchers: {
  Cons: (head: A, tail: List<A>) => R,
  Nil: R
}): R => {
  switch (l._tag) {
    case 'Cons': return matchers.Cons(l.head, l.tail)
    case 'Nil': return matchers.Nil
    default: return absurd(l)
  }
}

export const map = <A>(l: List<A>) => <B>(f: (a: A) => B): List<B> =>
  matchList(l)({
    Cons: (head: A, tail: List<A>) => Cons(f(head), map(tail)(f)),
    Nil: Nil
  })

export const from = <A>(xs: A[]): List<A> =>
  xs.reduceRight(
    (acc: List<A>, x: A) => Cons(x, acc),
    Nil
  )

export const toArray = <A>(l: List<A>): A[] =>
  matchList(l)({
    Cons: (x: A, acc: List<A>) => [x, ...toArray(acc)],
    Nil: []
  })

