export function flatten<T>(arr : T[][]) : T[]{
    return arr.reduce((acc,val) => acc.concat(val),[]);
}

const debugging = false;

// Log only when debugging
export function AUDebug(str : string) : void{
    if(debugging) console.log(str);
}