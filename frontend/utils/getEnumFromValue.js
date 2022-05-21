function getEnumValue(enumObj, value) {
    const index = Object.values(enumObj).findIndex((i) => i === value)
    return Object.keys(enumObj)[index]
}

export default getEnumValue
