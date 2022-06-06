module.exports = {
    notes: async (parent, args, {models}) => {
        return await models.Note.find({})
    },
    note: async (parent, args, {models}) => {
        return await models.Note.findById(args.id)
    },
    users: async(parent, args, {models}) => {
        return await models.User.find({});
    },
    user: async (parent, {username}, {models, user}) => {
        return await models.User.findOne({ username })
    },
    me: async (parent, args, {models, user}) => {
        return await models.User.findById(user.id);
    },
    noteFeed: async (parent, {cursor}, {models}) => {
        // limit of datas
        const limit = 10;
        // set the default nextPage
        let hasNextPage = false;
        let cursorQuery = {};

        if(cursor) {
            cursorQuery = {_id: {$lt: cursor}};
        }

        // notes within curson && limit
        let notes = await models.Note.find(cursorQuery)
        .sort({_id: - 1})
        .limit(limit + 1);

        // if Total notes exceed the limit set hasNextPage to true
        if(notes.length > limit ){
            hasNextPage = true;
            notes = notes.slice(0, -1);
        }

        // set newCursor : the last objectId
        newCursor = notes[notes.length - 1]._id;

        return {
            notes: notes,
            cursor: newCursor,
            hasNextPage
        }
    }
};