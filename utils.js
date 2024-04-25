function stringToObject(str) {
    const map = {};
    if (!str) {
      return map;
    }
    const users = str.replace(/[\s\r\n]+/g, '').split(',');
    users.forEach((user) => {
      const [github, provider] = user.split(':');
      map[github] = provider;
    });
    return map;
  }

  module.exports = {
    stringToObject
  };