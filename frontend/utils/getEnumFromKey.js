export function getEnumFromKey(enumObj, key) {
    const index = Object.keys(enumObj).findIndex((i) => i === key)
    return Object.values(enumObj)[index]
}
