const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

mongoose.plugin(slug)

const Device = new Schema({
  id: {type: String},
  name: {type: String},
  action: {type: Boolean, default: false }
},{
  timestamps: true,
});

Device.plugin(mongooseDelete,{
  overrideMethods: 'all',
  deletedAt: true,
})

module.exports = mongoose.model('Device',Device);