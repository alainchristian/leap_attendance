
// src/middleware/validators/index.js
module.exports = {
    ...require('./user.validator'),
    ...require('./auth.validator'),
    ...require('./family.validator'),
    ...require('./student.validator')
};