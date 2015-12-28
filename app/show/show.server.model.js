'use strict';
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var chalk    = require('chalk');

var ShowSchema  = new Schema({
    //display
    name:            { type: String, required: true, index: { unique: true }},
    alt_name:        { type: String },
    tags:            [{ type: String }],
    path:            { type: String },
    cover_image:     { type: String },

    //contains
    media:           [{ type: Schema.Types.ObjectId, ref: 'Media'}],
    subShow:         [{ type: Schema.Types.ObjectId, ref: 'Show'}],

    //metadata
    mal_id:          { type: Number },
    status:          { type: String },
    episode_count:   { type: Number },
    episode_length:  { type: Number }, //minutes
    synopsis:        { type: String },
    started_airing:  { type: String },
    finished_airing: { type: String },
    rating:          { type: Number },
    age_rating:      { type: String },
    genres:          [{ type: String }],

    //book-keeping
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

ShowSchema.pre('save', function(next) {
    var show = this;
    console.log( chalk.yellow('Saving ' + show.name) );
    this.updated_at = Date.now();
    next();
});

ShowSchema.pre('remove', function(next) {
    var show = this;
    console.log(chalk.yellow('Deleting ' + show.name + ' and its media' ));
    show.constructor.findOne({'_id' : show._id}).populate("media").exec(function(err, show){
        for( var i = 0; i < show.media.length; i++ ){
            show.media[i].remove();
        }
        next();
    });
});

ShowSchema.methods.addMediaId = function( id ){
    var show = this;
    show.media.push(id);
    show.save()
};

ShowSchema.methods.removeMediaId = function( id ){
    var show = this;
    show.media.pop(id);
    show.save()
};

module.exports = mongoose.model('Show', ShowSchema);
