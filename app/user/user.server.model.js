'use strict';
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');
var chalk    = require('chalk');

var UserSchema  = new Schema({
    name:          { type: String },
    username:      { type: String, required: true, index: { unique: true }},
    password:      { type: String, required: true, select: false },
    admin:         { type: Boolean, default: false},

    queue:         [{ show: {type: Schema.Types.ObjectId,
                      ref: 'Show', index: {unique: true} },
                      prio: Number }],

    show_history:  [{ show:  {type: Schema.Types.ObjectId,
                      ref: 'Show', index: {unique: true} },
                      date: Date, seq:  Number }],

    media_history: [{ media: {type: Schema.Types.ObjectId,
                      ref: 'Media', index: {unique: true}},
                      date: Date, prog: Number }],

    //created_at:    { type: Date, default: Date.now },
    //updated_at:    { type: Date, default: Date.now },

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'} });

UserSchema.pre('save', function(next) {
    var user = this;
    console.log(chalk.blue('Saving: ' + chalk.yellow(user.username )));

    // hash the password only if the password has been changed or user is new
    if (!user.isModified('password')) return next();

    // generate the hash
    bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) return next(err);
        user.password = hash;
        next();
    });

});

// Compares the password with the one hashed in the database
UserSchema.methods.comparePassword = function(password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

/**
 * Queue Methods
 */
// Add to Queue
UserSchema.methods.push_queue = function( queue_array, err ){
    if (!queue_array) {
        console.log( chalk.red.bold( "User Add to Queue: No Input"));
        return;
    }

    var user = this;
    user.queue.push(queue_array);
};

// Remove from Queue
UserSchema.methods.delete_queue = function( id_array, err ){
    if (!id_array) {
        console.log( chalk.red.bold( "User Delete from Queue: No Input"));
        return;
    }
    var user = this;
    user.queue.pull(id_array);
};

/**
 * Show History Methods
 */
// Add to Show History
UserSchema.methods.push_shows = function( show_array, err ){
    if (!show_array) {
        console.log( chalk.red.bold( "User Push Show: No Input"));
        return;
    }

    var user = this;
    var hist = user.show_history.toObject();
    var index;

    show_array = [].concat(show_array);
    console.log(show_array)

    for( var i = 0; i < show_array.length; i++ ){
        index = hist.map(function(e) { return e.show.toString(); })
                    .indexOf(show_array[i].show.toString());

        //upsert
        if( index != -1 ){
            user.show_history.set(index, show_array[i]);
        }
        else user.show_history.push(show_array[i]);
    }
};

// Remove from Show History
UserSchema.methods.delete_shows = function( show, err ){
    if( !show ){
        console.log( chalk.red.bold( "User Delete Show: No Input"));
        return;
    }

    var user = this;
    user.show_history.pull({ show: { name: show } });
};

/**
 * Media History Methods
 */
// Add to Media History
UserSchema.methods.push_media = function( media_array, err ){
    if (!media_array) {
        console.log( chalk.red.bold( "User Push Media: No Input"));
        return;
    }
    var user = this;
    var hist = user.media_history.toObject();
    var index;

    media_array = [].concat(media_array);

    for( var i = 0; i < media_array.length; i++ ){
        index = hist.map(function(e) { return e.media.toString(); })
                    .indexOf(media_array[i].media.toString());

        //upsert
        if( index != -1 ) user.media_history.set(index, media_array[i]);
        else              user.media_history.push(media_array[i]);
    }

};

// Remove from Media History
UserSchema.methods.delete_media = function( media, err ){
    if (!media_array) {
        console.log( chalk.red.bold( "User Delete Media: No Input"));
        return;
    }

    var user = this;
    user.show_history.pull({media: { name: media } });
};

module.exports = mongoose.model('User', UserSchema);
