
// @see [Fantas, Eel, and Specification 2: Type Signatures](http://www.tomharding.me/2017/03/08/fantas-eel-and-specification-2/)

// zipWith :: (a -> b -> [c]) -> [a] -> [b] 
const zipWith = <A, B, C>(f: (a: A) => (b: B) => C) => (xs: A[]) => (ys: B[]): C[] => {
  const length = Math.min(xs.length, ys.length)
  const zs = Array(length) as C[]

  for (let i = 0; i < length; i++) {
    zs[i] = f(xs[i])(ys[i])
  }

  return zs
}


const a = zipWith((x: number) => (y: number) => x + y)([1, 2])([4, 5, 6])

const b = zipWith((x: number) => (y: string) => y.length > x)([3, 5])(['Good', 'Bad'])

// filter :: (a -> Bool) -> [a] -> [a]
const filter = <A>(p: (a: A) => boolean) => (xs: A[]) => xs.filter(p)

// equals :: Setoid a => a ~> a -> Bool
// first.equals(second)

// equals :: Setoid a => a -> a -> Bool
// equals(first)(second)
