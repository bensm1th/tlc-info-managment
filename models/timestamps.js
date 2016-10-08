var mongoose        = require('mongoose');

var timestampSchema = new mongoose.Schema({
    time: Date,
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }
});

module.exports = mongoose.model('Timestamp', timestampSchema);