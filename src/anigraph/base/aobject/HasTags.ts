export interface HasTags{
    addTag(tagName:string):void
    setTagValue(tagName:string, value:any):void
    hasTag(tagName:string):boolean;
    getTagValue(tagName:string):any;
    removeTag(tagName:string):void;
}
