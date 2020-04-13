export async function BadKey(model: string) {
    throw "Bad " + model + "key";
}

export async function BadKeyFor(model: string, submodel: string) {
    throw "Bad " + model + "key for " + submodel;
}

async function  SingleKeyResult(result: any[])  {
    return result.length > 0;
}

export async function CheckKeyResult(result: any[], model: string) {
    if (result.length > 0)
        return result[0];
    else
        BadKey(model);
}

export async function CheckKeyResultFor(result: any[], model: string, submodel: string) {
    if (result.length > 0)
        return result[0];
    else
        BadKeyFor(model, submodel);
}