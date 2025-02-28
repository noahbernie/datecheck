export const getBaseUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://127.0.0.1:5000'
    }
    let host = window.location.host
    let protocol = window.location.protocol

    if (host.startsWith('www.')) {
        let newHost = host.replace('www.', '')
        return `${protocol}//www.api.${newHost}`
    } else {
        return `${protocol}//api.${host}`
    }
}
