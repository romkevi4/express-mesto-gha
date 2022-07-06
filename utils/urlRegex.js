// Регулярное выражение URL
// module.exports.urlRegex = /(http|https):\/\/?(w{3}\.)((\w+[-._~:?#\[\]@!$&'()*+,;=\/])?#)/;
module.exports.urlRegex = /http[s]?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
