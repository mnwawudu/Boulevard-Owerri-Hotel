const mongoose = require('mongoose');
const PageContent = require('./models/PageContent'); // Adjust path if needed
require('dotenv').config(); // ✅ Load MONGO_URI from .env

const seedPromo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    await PageContent.deleteOne({ slug: 'promo' });

    await PageContent.create({
      slug: 'promo',
      title: 'Special Offers & Promotions',
      subtitle: 'Enjoy limited-time discounts and exclusive packages!',
      bannerImage: 'https://res.cloudinary.com/your-cloud/image/upload/v1710000000/promo-banner.jpg',
      body: 'Welcome to our promo page. Take advantage of exclusive deals on rooms and services.',
      sections: [
        {
          heading: '50% Off Executive Suite',
          body: 'Enjoy comfort and luxury at half price for bookings this month.',
        },
        {
          heading: 'Complimentary Breakfast',
          body: 'Stay 2 nights or more and enjoy a free breakfast each morning.',
        }
      ],
    });

    console.log('✅ Promo page seeded successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Failed to seed promo page:', err);
    process.exit(1);
  }
};

seedPromo();
