const apiName = "iotquickstartrest";
export const verb = {
    delete: 'delete',
    post: 'post',
    get: 'get',
}

export const endpoint = {
    devices: '/devices',
    deviceData: '/deviceData',
    register: '/register',
    shadow: '/thingshadow'
}
export const apiCall = async (config) => {
    const { api, endpoint, param } = config;
    if (config.verb === verb.post) {
        return api.post(apiName, endpoint, param);
    }
    return api.get(apiName, endpoint, param);
}