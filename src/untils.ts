export const remove = <T>(element: T, arr: T[]): void => {
    // if (typeof element === 'object') {
    //     array.forEach(element => {

    //     });
    // }
    const index = arr.indexOf(element)

    arr.splice(index, 1)

}

/**
 * 生成随机数
 * @param N 位数
 */

export const generateRandomNumbers = (N: number): number => {
    return Math.floor(Math.random() * Math.pow(10, N))
}
