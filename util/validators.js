export const required = function (value, message) {
  return !!value || message
}
export const referenced = function (value, message) {
  if (value) {
    const {
      id
    } = value;
    return isNaN(id) ? !id : id > 0 || message;
  }
  return true;
}
export const email = function (value, message) {
  if (value) {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || message
  }
  return true;
}
export const phone = function (value, message) {
  if (value) {
    const pattern = /^([0-9]{1,9})$/
    return pattern.test(value) || message
  }
  return true;
}
export const maxLength = function (value, message, maxLength) {
  return (value || '').length <= maxLength || message
}
// import { required } from 'validators'
