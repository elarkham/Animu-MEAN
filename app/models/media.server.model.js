var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MediaSchema  = new Schema({
    name: { type: String, required: true },
    show: { type: Schema.Types.ObjectId, ref: 'Show', required: true},
    tags: [{type: String}],
    seq: Number,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },

});

MediaSchema.pre('save', function(next) {
    var media = this;
    console.log('Saving ' + media.name );
    this.updated_at = Date.now();
    next();
});

// return the model
module.exports = mongoose.model('Media', MediaSchema);
