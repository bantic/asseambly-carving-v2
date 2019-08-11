function detectType(array) {
  if (array instanceof Uint8Array || array instanceof Uint8ClampedArray) {
    return 'Uint8Array';
  } else if (array instanceof Uint32Array) {
    return 'Uint32Array';
  } else {
    throw new Error(`Unexpected array ${typeof array}`);
  }
}

function getTypeId(module, type) {
  let id = module[`ID_${type}`];
  if (!id) {
    throw new Error(`No id found for type ${type}`);
  }
  return id;
}

export function allocArray(module, array, type = detectType(array)) {
  return module.__retain(module.__allocArray(getTypeId(module, type), array));
}
