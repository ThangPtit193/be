const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

mongoose.plugin(slug);

const User = new Schema({
    user: {type: String},
    password: {type: String},
    ten: {type: String},
    masv: {type: String},
    sdt: {type: String},
    fb: {type: String},
    insta: {type: String},
    git: {type: String}
},{
    timestamps: true,
});

User.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})
module.exports = mongoose.model('User',User);