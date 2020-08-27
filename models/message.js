let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var moment = require('moment');

let MessageSchema = new Schema({
    title: { type: String, required: true, max: 70},
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date }
})

MessageSchema
.virtual('dateFormat')
.get(function() {
    return moment(this.date).format('Do of MMM \'YY, h:mm A');
});

module.exports = mongoose.model('Message', MessageSchema);