'use strict';
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var Show     = require('../show/show.server.model.js');
var chalk    = require('chalk');

var MediaSchema  = new Schema({
    //display
    name:       { type: String, required: true, index: { unique: true }},
    tags:       [{type: String}],
    //location
    path:       { type: String },
    show:       { type: Schema.Types.ObjectId, ref: 'Show' },
    //file metadata
    filetype:   { type: String },
    size:       { type: Number }, //Kilobytes
    length:     { type: Number }, //Seconds
    seq:        { type: Number },
    lang:       { type: String },
    subgroup:   { type: String },
    //book-keeping
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },

});


//Activated before saving to database
MediaSchema.pre('save', function(next) {
    var media = this;
    console.log(chalk.yellow('Saving ' + media.name));
    this.updated_at = Date.now();
    next();
});

//Activated before removing from database
MediaSchema.pre('remove', function(next) {
    console.log(chalk.yellow('Removing ' + this.name));
    next();
});

//Sets the show id for media
MediaSchema.methods.setShow = function( show_name, callback ){
    var media = this;

    //We don't want media to be present in two different shows
    if ( media.show ){
        Show.findOne({'name': show_name }).exec(function(err, show){
            if(!err) show.removeMediaId( media._id );
        });
    }

    Show.findOne({'name': show_name }).exec(function(err, show){
        if (!show) {
            var error = new Error('The Show ' + show_name  + ' does not exist');
            return callback( error );
        }
        show.addMediaId( media._id );
        media.show = show;

        return callback( err, media );
    });

}

//Returns a callback containing the populated media
MediaSchema.methods.selfPopulate = function(callback){
    var media = this;

    media.constructor.findOne({'_id' : media._id})
         .populate("show")
         .exec(function(err, media){

        callback(media);
    });
}

module.exports = mongoose.model('Media', MediaSchema);
