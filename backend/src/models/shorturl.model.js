import mongoose from 'mongoose';

const shortUrlSchema = new mongoose.Schema({
    fullUrl : {
        type : String,
        required : true,
    },
    shortUrl : {
        type : String,
        required : true,
        index : true,
        unique : true,
    },
    clicks : {
        type : Number,
        required : true,
        default : 0,
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        index : true,
    }
}, { timestamps: true })

// Compound index for efficient cursor pagination
shortUrlSchema.index({ userId: 1, createdAt: -1 });

const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

export default ShortUrl;