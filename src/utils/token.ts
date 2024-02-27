import Cookies from "js-cookie";

export const TokenKey: string = "token";

// 我网站的域名是www.ttkwsd.top，去前面的www，改成自己的域名
const domain: string = "";

// token前缀
// export let token_prefix = "Bearer ";
export let token_prefix = "";

export function getToken() {
    //todo
    return localStorage.getItem(TokenKey);
    // return Cookies.get(TokenKey);
}

// 本地运行记得删除domain
export function setToken(token: string) {
    // 项目线上部署可以取消注释
    // return Cookies.set(TokenKey, token, { domain: domain });
    //todo token存放在localStorage
    return localStorage.setItem(TokenKey, token);
    // return Cookies.set(TokenKey, token);
}

export function removeToken() {
    // 项目线上部署可以取消注释
    // return Cookies.remove(TokenKey, { domain: domain });
    // return Cookies.remove(TokenKey);
    //todo 移除localStorage
    localStorage.removeItem(TokenKey);
}