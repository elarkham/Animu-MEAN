var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var MediaSchema  = new Schema({
    name: String,
    created_at: { type: Date },
    updated_at: { type: Date },
    show: { type: ObjectId, ref: 'Show'},
    username: { type: String, required: true, index: { unique: true }},
    password: { type: String, required: true, select: false },
});

MediaSchema.pre('save', function(next) {
    var user = this;
});

// return the model
module.exports = mongoose.model('Media', UserSchema);
