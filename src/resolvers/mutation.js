const bcrypt = require('bcrypt');
const gravadar = require('../util/gravatar');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { AuthenticationError, ForbiddenError} = require('apollo-server-express');
const mongoose = require('mongoose');

module.exports = {
    newNote: async (parent, args, {models, user}) => {
        // Test if user exist to assign note
        if(!user) {
            throw new AuthenticationError('You must be signed in to create note')
        }

        return await models.Note.create({
            content: args.content,
            // Reference mongo db author
            author: mongoose.Types.ObjectId(user.id)
        });
    },
    deleteNote: async (parent, {id}, {models, user}) => {
        // if not user, throw an Authentification error
        if(!user) {
            throw new AuthenticationError('You must be signed in to delete note');
        }
        const note = await models.Note.findById(id);
        
        // Check if current user match with note owner
        if(note && String(note.author) !== user.id) {
            throw new ForbiddenError("You don't have permissions to delete note")
        }

        try {
            await note.remove();
            return true;
        }
        catch (err) {
            return false;
        }
    },
    updateNote: async (parent, {id, content}, {models, user}) => {
        // if not user, authentification error
        if(!user) {
            throw new AuthenticationError('You must be signed in to update note');
        }

        // Verify current user is the own user to update
        let note = await models.Note.findById(id);

        if(note && String(note.author) !== user.id){
            throw new ForbiddenError("You don't have permissions to update note");
        } 
         
        return await models.Note.findOneAndUpdate(
            {_id: id},
            {
                $set: {
                    content
                }
            },
            {new: true}
        )
    },
    signUp: async (parent, {email, username, password}, {models}) => {
        // crypt password
        email = email.trim().toLowerCase();
        username = username.trim().toLowerCase();
        // hashed password with bcrypt
        let hashed = await bcrypt.hash(password, 10);

        // test if user already exist
        const userExist = await models.User.findOne({
            $or: [{email}, {username}]
        });
        if(userExist) {
            throw new ForbiddenError('User already exist');
        }

        try {
            const user = await models.User.create({
                email,
                username,
                password: hashed,
                avatar: gravadar(email)
            });
            // return token when singUp succesffull
            return jwt.sign({id : user._id}, process.env.JWT_SECRET);
        } catch (err) {
            throw new Error("Creating Error");
        }
    },
    signIn: async (parent, {email, username, password}, {models}) => {
        if(email) {
            email = email.trim().toLowerCase();
        }
        // Get user by email or password
        const user = await models.User.findOne({
            $or : [{email}, {username}]
        });

        if(!user){
            throw new AuthenticationError("Error signing in")
        } 
        // compare password
        const valid = await bcrypt.compare(password, user.password);
        if(!valid) {
            throw new AuthenticationError('Error signinng In');
        }
        
        // create and return jsonwebtoken
        return jwt.sign({id : user._id}, process.env.JWT_SECRET);
    },
    deleteUser: async (parent, {id}, {models}) => {
        try{
            await models.User.findOneAndRemove({_id : id});
            return true;
        } catch(err) {
            return false;
        }
    },
    toogleFavorite : async (parent, {id}, {models, user}) => {
        // if user context is passed
        if(!user) {
            throw new AuthenticationError("You must be signed to toggle Note.");
        }
        let noteCheck = await models.Note.findById(id);
        return await models.Note.findOneAndUpdate(id, 
            (noteCheck.favoriteBy && noteCheck.favoriteBy.indexOf(user.id) >= 0) ?
            {
                $pull: {
                    favoriteBy: mongoose.Types.ObjectId(user.id)
                },
                $inc: {
                    favoriteCount: -1
                }
            } : {
                $push: {
                    favoriteBy: mongoose.Types.ObjectId(user.id)
                },
                $inc: {
                    favoriteCount: 1
                }
            },
            {
                new: true
            }
        )
    }
};