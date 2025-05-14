const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('./models/Service');

dotenv.config();
mongoose.set('strictQuery', true);

const services = [
  {
    name: 'Restaurant',
    description: 'Enjoy world-class dining with local and international dishes at the best hotel in Owerri.',
    images: [{ url: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/restaurant.jpg' }],
    mainImage: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/restaurant.jpg',
    showOnHomepage: true,
    visibleOnServicesPage: true
  },
  {
    name: 'Coffee Bar',
    description: 'Relax and unwind with premium coffee blends at the most luxurious hotel in Owerri.',
    images: [{ url: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/coffee-bar.jpg' }],
    mainImage: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/coffee-bar.jpg',
    showOnHomepage: true,
    visibleOnServicesPage: true
  },
  {
    name: 'Casino',
    description: 'Experience thrilling entertainment and games at our in-house casino.',
    images: [{ url: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/casino.jpg' }],
    mainImage: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/casino.jpg',
    showOnHomepage: true,
    visibleOnServicesPage: true
  },
  {
    name: 'Conference & Meeting',
    description: 'Host sophisticated events and meetings in our modern halls.',
    images: [{ url: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/conference.jpg' }],
    mainImage: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/conference.jpg',
    showOnHomepage: true,
    visibleOnServicesPage: true
  },
  {
    name: 'Gym',
    description: 'Stay active and fit with 24/7 access to our fitness center.',
    images: [{ url: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/gym.jpg' }],
    mainImage: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/gym.jpg',
    showOnHomepage: true,
    visibleOnServicesPage: true
  },
  {
    name: 'City Cruise',
    description: 'Explore the beauty of Owerri with our guided city tours.',
    images: [{ url: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/city-cruise.jpg' }],
    mainImage: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/city-cruise.jpg',
    showOnHomepage: true,
    visibleOnServicesPage: true
  },
  {
    name: 'Pickup and Drop-off',
    description: 'Enjoy convenient airport transfers and smooth transportation services.',
    images: [{ url: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/pickup.jpg' }],
    mainImage: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/pickup.jpg',
    showOnHomepage: true,
    visibleOnServicesPage: true
  },
  {
    name: 'Pool Bar',
    description: 'Sip refreshing cocktails by the poolside at the best hotel in Owerri.',
    images: [{ url: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/poolbar.jpg' }],
    mainImage: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/poolbar.jpg',
    showOnHomepage: true,
    visibleOnServicesPage: true
  },
];

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await Service.deleteMany({});
    await Service.insertMany(services);
    console.log('✅ Services seeded!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Failed to seed services:', err);
    mongoose.disconnect();
  });
