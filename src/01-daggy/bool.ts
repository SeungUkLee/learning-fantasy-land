import { absurd } from "fp-ts/lib/function"

export type Bool = True | False

interface True {
  readonly _tag: 'True',
  readonly value: boolean
}

interface False {
  readonly _tag: 'False',
  readonly value: boolean
}

// data constructors
export const True: Bool = ({ _tag: 'True', value: true }) as Bool
export const False: Bool = ({ _tag: 'False', value: false }) as Bool

export const matchBool = <A>(matchers: {
  True: A,
  False: A
}) => (bool: Bool): A => {
  switch (bool._tag) {
    case 'True': return matchers.True
    case 'False': return matchers.False
    default: return absurd(bool)
  }
}

export const invert = matchBool({
  True: False,
  False: True
})

export const thenElse = <R>(then: () => R, or: () => R) => {
  return matchBool({
    True: then,
    False: or
  })
}

