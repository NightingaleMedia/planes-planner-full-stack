import { HSLS } from "src/constants"

export const randomWhole = max => {
    return Math.floor(Math.random(max))
}

export function randomHSL() {
    return `hsl(${HSLS[randomWhole(HSLS.length)]}, 100%, 60%)`
}
