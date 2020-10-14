export const remove = <T>(element: T, arr: T[]): void => {
    // if (typeof element === 'object') {
    //     array.forEach(element => {

    //     });
    // }
    const index = arr.indexOf(element)

    arr.splice(index, 1)

}