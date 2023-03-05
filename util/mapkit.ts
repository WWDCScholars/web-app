import Vue from 'vue'

export function featureEnum(type: string, defaultType: string = 'adaptive') {
  switch (type.toLowerCase()) {
    case 'hidden':
    case 'visible':
      break
    default:
      type = defaultType
      break
  }

  return type
}

export function findRootNode(node: Vue): Vue | null {
  while (node && !node['deferredReadyPromise']) {
    node = node.$parent as Vue
  }
  return node
}
