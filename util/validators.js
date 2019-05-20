export const required = function (value, message) {
    return !!value || message
}

export const email = function(value, message) {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || message
}
export const phone = function(value, message) {
    const pattern = /^([0-9]{1,9})$/
    return pattern.test(value) || message
}
export const maxLength = function(value, message, maxLength) { 
    return (value || '').length <= maxLength || message
}
// import { required } from 'validators'