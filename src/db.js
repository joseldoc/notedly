const mongoose = require('mongoose');

module.exports = {
    connect: DB_HOST => {
        // connect ton the DB
        mongoose.connect(DB_HOST, 
            {useNewUrlParser : true, useUnifiedTopology : true});

        // connect 
        mongoose.connection.on('error', err => {
            process.exit();
        });

    },
    close: () => {
        mongoose.connection.close();
    }
}