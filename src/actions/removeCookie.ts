import Cookies from 'js-cookie';

const removeCookie = (name: string) => {
    Cookies.remove(name);
};

export default removeCookie;