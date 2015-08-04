'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Show = mongoose.model('Show');
var ObjectId = mongoose.Types.ObjectId;

var MediaSchema  = new Schema({
    name: { type: String, required: true },
    path: { type: String },
    show: { type: Schema.Types.ObjectId, ref: 'Show' },
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
