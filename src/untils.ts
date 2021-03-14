import fs from 'fs'


export const formatCookies = (cookies: string): cookies => {
    const tempCookies: cookies = {}
    const arrayCookies = cookies.split(';')
    for (const cookie of arrayCookies) {
        const tempArray = cookie.split('=')
        tempCookies[tempArray[0].trim()] = tempArray[1]
    }
    return tempCookies
}

/**
 * 生成随机数
 * @param N 位数
 */

export const generateRandomNumbers = (N: number): number => {
    return Math.floor(Math.random() * Math.pow(10, N))
}

type cookies = { [key: string]: string }


/**
 * 解析json文件
 * @param folder 
 */
export const parseJson = (folder: string) => {
    return JSON.parse(fs.readFileSync(folder).toString())
}

