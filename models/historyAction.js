const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

mongoose.plugin(slug);

const History = new Schema({
  deviceId: { type: String },
  deviceName: { type: String},
  action: { type: Boolean },
}, {
  timestamps: true,
});

// Thêm tính năng xóa mềm
History.plugin(mongooseDelete, {
  overrideMethods: 'all',
  deletedAt: true,
});

module.exports = mongoose.model('History', History);
