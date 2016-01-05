'use strict';
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

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
    console.log('Saving ' + user.name );

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
    var user = this;
    user.queue.push(queue_array);
    user.save(err);
};

// Remove from Queue
UserSchema.methods.delete_queue = function( id_array, err ){
    var user = this;
    user.queue.pull(id_array);
    user.save(err);
};

/**
 * Show History Methods
 */
// Add to Show History
UserSchema.methods.push_shows = function( show_array, err ){
    var user = this;
    var hist = user.show_history.toObject();
    var index;

    show_array = [].concat(show_array);

    for( var i = 0; i < show_array.length; i++ ){
        index = hist.map(function(e) { return e.show.toString(); }).indexOf(show_array[i].show);

        //upsert
        if( index != -1 ){
            user.show_history.set(index, show_array[i]);
        }
        else user.show_history.push(show_array[i]);
    }

    user.save(err);
};

// Remove from Show History
UserSchema.methods.delete_shows = function( show_array, err ){
    var user = this;
    user.show_history.pull({ show: { name: show_array } });
    user.save(err);
};

/**
 * Media History Methods
 */
// Add to Media History
UserSchema.methods.push_media = function( media_array, err ){
    var user = this;
    var hist = user.media_history.toObject();
    var index;

    media_array = [].concat(media_array);

    for( var i = 0; i < media_array.length; i++ ){
        index = hist.map(function(e) { return e.show.toString(); }).indexOf(media_array[i].show);

        //upsert
        if( index != -1 ) user.media_history.set(index, media_array[i]);
        else              user.media_history.push(media_array[i]);
    }

    user.save(err);
};

// Remove from Media History
UserSchema.methods.delete_media = function( media_array, err ){
    var user = this;
    user.show_history.pull(media_array);
    user.save(err);
};

module.exports = mongoose.model('User', UserSchema);
