const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

mongoose.plugin(slug);

const Data = new Schema({
    id: {type: String},
    temperature: {type: Number},
    humidity: {type: Number},
    light: {type: Number},
    fog: {type: Number}
},{
    timestamps: true,
});

Data.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})
module.exports = mongoose.model('Data',Data);