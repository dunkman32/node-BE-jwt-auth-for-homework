const bcrypt = require('bcrypt-nodejs');

module.exports = {
    hashPassword: password => bcrypt.hashSync(password),
    checkPassword: (password, hash) => bcrypt.compareSync(password, hash)
};
