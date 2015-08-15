'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Show = mongoose.model('Show');
var ObjectId = mongoose.Types.ObjectId;

var MediaSchema  = new Schema({
    //display
    name:       { type: String, required: true, index: { unique: true }},
    tags:       [{type: String}],
    //location
    path:       { type: String },
    show:       { type: Schema.Types.ObjectId, ref: 'Show' },
    //file metadata
    filetype:   { type: String },
    size:       { type: Number }, //megabytes
    length:     { type: Number }, //minutes
    seq:        { type: Number },
    lang:       { type: String },
    subgroup:   { type: String },
    //book-keeping
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
