export const getBaseUrl = () => {
    if (window.location.hostname === 'localhost') {
        return 'http://localhost:5000'
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