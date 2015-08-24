'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


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

ShowSchema.methods.addMediaID = function addMediaID( id ){
    this.media.push(id);
};

ShowSchema.methods.removeMediaID = function removeMediaID( id ){
    this.media.pop(id);
};

/*
ShowSchema.methods.addMedia = function addMedia( mediaName ){
    Media.findOne({'name' : mediaName}).exec( function(err, media){
        this.media.push(media.id);
    });
}
*/
ShowSchema.pre('save', function(next) {
    var show = this;
    console.log('Saving ' + show.name );
    this.updated_at = Date.now();
    next();
});

// return the model
module.exports = mongoose.model('Show', ShowSchema);
