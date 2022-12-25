// import objectHash from "object-hash";
// const SerializableClassNameKey: string = "ASerializableClassName";

// function GetSerializableHash(obj:any){
//     return objectHash(obj);
// }

const ASerializableClassesDict: { [name: string]: any } = {};
export interface ASerializableClass {
  // ASerialize():{[name:string]:any};
  // ADeserialize(d:{[name:string]:any},recurse_func:(...args:any[])=>any):ASerializableClass;
}
// const ASerializableRefMap:{[name:string]:ASerializableClass}

export function GETSERIALIZABLES() {
  return ASerializableClassesDict;
}

export function CHECKSERIALIZABLES() {
  console.log(GETSERIALIZABLES());
  let serializables = GETSERIALIZABLES();
  console.log(serializables);
}

/**
 * Serializable classes must either be able to safely call new() with no parameters (for assignment to serialized version)
 * or implement toJSON():serialized_form and static fromJSON(data:serialized_form), the latter of which returns a new instance
 * of the class.
 * @param constructorFunction
 * @constructor
 */

export function ASerializable(serializationName?: string) {
  return function (constructorFunction: Function) {
    // console.log(`-- decorator function invoked -- for ${constructorFunction.name}`);

    // @ts-ignore
    constructorFunction._serializationLabel = serializationName;

    let classname = serializationName
      ? serializationName
      : constructorFunction.name;
    let counter = 0;
    let cfunc = constructorFunction;
    while (classname === "" && counter < 10) {
      // @ts-ignore
      cfunc = cfunc.__proto__;
      classname = cfunc.name;
      counter = counter + 1;
      if (counter === 10) {
        throw new Error(
          `trying to make class serializable with >10 decorators??? ${constructorFunction}`
        );
      }
    }
    let incrementCounter = 1;
    while (classname in ASerializableClassesDict) {
      classname = constructorFunction.name + incrementCounter.toString();
      incrementCounter = incrementCounter + 1;
    }
    // @ts-ignore
    constructorFunction.ASerializationClassID = classname;
    ASerializableClassesDict[classname] = constructorFunction;
  };
}

export function ASerializableToJSON(obj: any) {
  return JSON.stringify(
    obj,
    function (key, value) {
      if (
        this[key] &&
        typeof this[key] === "object" &&
        this[key].constructor.ASerializationClassID !== undefined
      ) {
        return {
          _aserial_class_id: this[key].constructor.ASerializationClassID,
          data: value,
        };
      } else {
        return value;
      }
    },
    " "
  );
}

function ReviveASerializable(key: string, value: any) {
  if (typeof value !== "object" || value === null) {
    return value; // Return the value if not an object
  }
  if (value && value._aserial_class_id) {
    var ASClass: any = ASerializableClassesDict[value._aserial_class_id];
    if (typeof ASClass.fromJSON === "function") {
      return ASClass.fromJSON(value.data);
    } else {
      return Object.assign(new ASClass(), value.data);
    }
  } else {
    return value;
  }
}

export function ASerializableFromJSON(jsonText: string) {
  let obj = JSON.parse(jsonText, (key, value) => {
    return ReviveASerializable(key, value);
  });
  return obj;
}

//##################//--Recursive index copy circular--\\##################
//<editor-fold desc="Recursive intdex copy">
// export function GetIndexedCopyRecursive(obj:anym, ref_map?:{[uid:string]:any}){
//     let ohash_map = ref_map? ref_map:{};
//     //##################//--recursive function--\\##################
//     //<editor-fold desc="recursive function">
//     const deepIndexedCopy = (inObject:any) => {
//         if (typeof inObject !== "object" || inObject === null) {
//             return inObject; // Return the value if inObject is not an object
//         }
//
//         let outObject:any;
//         let value:any;
//         let key:any;
//         if(inObject.constructor.ASerializationClassID!==undefined){
//             let ohash = (inObject._ASerializationID!==undefined && typeof inObject._ASerializationID === 'function')?inObject._ASerializationID():GetSerializableHash(inObject);
//             if(ohash_map[ohash]===undefined){
//                 var data:any;
//                 if(typeof inObject.ASerialize === 'function'){
//                     // If there is a derived serialize function, use it
//                     data = inObject.ASerialize(ohash_map);
//                 }else{
//                     // otherwise, just return a dictionary of deepIndexCopy values for each key
//                     data = {};
//                     for(let key in inObject){
//                         data[key]=deepIndexedCopy(inObject[key]);
//                     }
//                 }
//                 ohash_map[ohash]={
//                     _aserial_class_id: inObject.constructor.ASerializationClassID,
//                     data: data
//                 };
//             }
//             return {
//                 _SERIALIZABLE_REF: ohash
//             };
//         }
//
//         // Create an array or object to hold the values
//         outObject = Array.isArray(inObject) ? [] : {}
//         for (key in inObject) {
//             value = inObject[key]
//             // Recursively (deep) copy for nested objects, including arrays
//             outObject[key] = deepIndexedCopy(value);
//         }
//         return outObject
//     }
//     //</editor-fold>
//     //##################\\--recursive function--//##################
//
//     return deepIndexedCopy(obj);
//
//     // return Object.assign(
//     //     Object.create(
//     //         // Set the prototype of the new object to the prototype of the instance.
//     //         // Used to allow new object behave like class instance.
//     //         Object.getPrototypeOf(obj),
//     //     ),
//     //     // Prevent shallow copies of nested structures like arrays, etc
//     //     deepIndexedCopy(obj)
//     // );
// }
//</editor-fold>
//##################\\--Recursive index copy circular--//##################

export function GetIndexedCopy(obj: any) {
  //##################//--recursive function--\\##################
  //<editor-fold desc="recursive function">
  const deepIndexedCopy = (inObject: any) => {
    if (typeof inObject !== "object" || inObject === null) {
      return inObject; // Return the value if inObject is not an object
    }

    let outObject: any;
    let value: any;
    let key: any;
    if (inObject.constructor.ASerializationClassID !== undefined) {
      if (typeof inObject.ASerialize === "function") {
        return {
          _aserial_class_id: inObject.constructor.ASerializationClassID,
          data: inObject.ASerialize(),
        };
      } else {
        return {
          _aserial_class_id: inObject.constructor.ASerializationClassID,
          data: inObject,
        };
      }
    }
    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {};
    for (key in inObject) {
      value = inObject[key];
      // Recursively (deep) copy for nested objects, including arrays
      outObject[key] = deepIndexedCopy(value);
    }
    return outObject;
  };
  return deepIndexedCopy(obj);
}

export function GetASerializableClassByName(className: string) {
  return ASerializableClassesDict[className];
}
