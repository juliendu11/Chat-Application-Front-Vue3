const parseEnvToBoolean = (val: string | undefined): boolean => {
  if (val !== null && val !== undefined) {
    return (val === 'true')
  }

  return false
}

const parseEnvToNumber = (val: string |undefined, defaultVal: number): number => {
  if (val !== null && val !== undefined) {
    return parseInt(val)
  }

  return defaultVal
}

export {
  parseEnvToBoolean,
  parseEnvToNumber
}
