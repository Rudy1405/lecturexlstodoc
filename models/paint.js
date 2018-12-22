const mongoose = require('mongoose')
const Schema = mongoose.Schema

const elementSchema = new Schema({
    ink: { type: String, required: true },
    ounce: { type: Number },
    ouncePart: { type: Number }
})

const presentationSchema = new Schema({
  name: { type: String, enum: ['1L', '4L', '19L'] },
  elements: [elementSchema]
})

const paintSchema = new Schema({
    color: { type: String, required: true },
    category: { type: String, enum: ['Base agua', 'Esmaltes'], required: true},
    presentations: [presentationSchema],
    base: { type: String},
    line: { type: String, required: true },
    range: { type: String, required: true , default: 'R-1'},
    enable: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Paint', paintSchema)