'use strict';
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var UserSchema  = new Schema({
    name:       { type: String },
    username:   { type: String, required: true, index: { unique: true }},
    password:   { type: String, required: true, select: false },
    admin:      { type: Boolean, default: false},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },

    // Data: 'Show Object'  Date: 'Last Watched' Seq:  'What Episode Sequence'
    shows_watched: [{ data:{type: Schema.Types.ObjectId, ref: 'Show' }, date: Date, seq:  Number }],

    // Data: 'Media Object' Date: 'Last Watched' Prog: 'What Far Into The Episode'
    media_watched: [{ data:{type: Schema.Types.ObjectId, ref: 'Media'}, date: Date, prog: Number }]
});

UserSchema.pre('save', function(next) {
    var user = this;

    console.log('Saving ' + user.name );

    // update the time for every change
    user.updated_at = Date.now();

    // hash the password only if the password has been changed or user is new
    if (!user.isModified('password')) return next();

    // generate the hash
    bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) return next(err);
        user.password = hash;
        next();
    });

});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

// return the model
module.exports = mongoose.model('User', UserSchema);
