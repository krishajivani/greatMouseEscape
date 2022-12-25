export type Constructor<T> = new (...args: any[]) => T;
export type CallbackType = (...args: any[]) => any;
export type GenericDict = { [name: string]: any };

export interface ClassInterface<InstanceClass> extends Function {
  new (...args: any[]): InstanceClass;
}

export function TextureKeyForName(name: string) {
  return name + "Map";
}
export function TextureProvidedKeyForName(name: string) {
  return name + "MapProvided";
}
export function TextureSizeKeyForName(name: string) {
  return name + "Size";
}

export const ANIGRAPH_DEBUG_MODE = false;

export enum AniGraphEnums {
  BackgroundElementName = "BackgroundElement",
  OccludesInteractions = "OccludesInteractions",
  CreateShapeInteractionName = "CreateShape",
  LightBoxSize = 25,
  //   CONTEXT_ASPECT_HOW = 0.75,
  //   CONTEXT_ASPECT_HOW = 1.33333333333,
  CONTEXT_ASPECT_HOW = 1.66666666667,
  //   CONTEXT_ASPECT_HOW = 1.0 / 0.6,
  // CONTEXT_ASPECT_HOW = 0.6,
  DefaultZNear = 0.5,
  DefaultZFar = 1000,
  DefaultMovementSpeed = 3,
}
