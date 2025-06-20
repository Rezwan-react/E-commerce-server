const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dyieie1xf',
    api_key: '745355543811473',
    api_secret: 'S73pnFO43lT9QH256t1AyDbFHYs'
});

module.exports = cloudinary;