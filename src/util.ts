export function flatten<T>(arr : T[][]) : T[]{
    return arr.reduce((acc,val) => acc.concat(val),[]);
}

const debugging = false;

export function AUDebug(str : string){
    if(debugging) console.log(str);
}