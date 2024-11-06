"use client"
import Cookies from 'js-cookie';
const setCookie = (name: string, value: string) => {
    Cookies.set(name, value, { expires: 1, sameSite: 'strict' });
}

export default setCookie;