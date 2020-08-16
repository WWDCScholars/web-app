/// <reference types="googlemaps" />
/// <reference types="pica" />

interface Window {
  google: typeof google
}

declare module 'pica/dist/pica' {
  export = Pica
}
