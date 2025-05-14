const mongoose = require('mongoose');
const PageContent = require('./models/PageContent');
require('dotenv').config();

mongoose.set('strictQuery', true);

const pages = [
  {
    page: 'about',
    title: 'About Boulevard Hotel',
    subtitle: 'Experience true comfort and luxury in Owerri',
    bannerImage: '',
    body: 'Boulevard Hotel offers a truly luxurious hospitality experience in the heart of Owerri. Our facilities, comfort, and hospitality make us the best hotel in Owerri for both business and leisure guests.',
    sections: [
      {
        heading: 'Our Mission',
        body: 'To redefine luxury and comfort through exceptional service, innovation, and dedication to guest satisfaction.'
      },
      {
        heading: 'Why Choose Us?',
        body: 'We combine elegance, security, and convenience to ensure every guest enjoys the most secure hotel in Owerri with world-class service.'
      }
    ]
  },
  {
    page: 'faq',
    title: 'Frequently Asked Questions',
    subtitle: 'Quick answers to your common questions',
    bannerImage: '',
    body: 'Browse through our most asked questions to better understand what to expect at the most luxurious hotel in Owerri.',
    sections: [
      {
        heading: 'What time is check-in and check-out?',
        body: 'Check-in is from 2:00 PM and check-out is by 12:00 PM.'
      },
      {
        heading: 'Do you offer airport shuttle services?',
        body: 'Yes, we offer complimentary airport pickup and drop-off.'
      }
    ]
  },
  {
    page: 'contact',
    title: 'Contact Us',
    subtitle: 'We’re here to assist you',
    bannerImage: '',
    body: 'Need help or have questions? Reach out to us through any of our contact channels. Boulevard Hotel is the most secure hotel in Owerri and we’re always happy to help.',
    sections: [
      {
        heading: 'Call or Visit',
        body: 'Phone: +234(0)8100417836\nEmail: boulevardowerrihotel@gmail.com\nAddress: Area R, Pocket Layout, Plot 29/30, New Owerri, Owerri 460281, Imo'
      }
    ]
  },
  {
    page: 'rooms',
    title: 'Luxury Rooms & Suites',
    subtitle: '',
    bannerImage: '',
    body: 'Welcome to our exclusive collection of rooms and suites at the best hotel in Owerri. We offer a range of luxurious accommodations to ensure the most comfortable and secure stay for our guests.',
    sections: []
  },
  {
    page: 'promo',
    title: 'Exclusive Promo Offers',
    subtitle: 'Limited-time luxury deals at the best hotel in Owerri',
    bannerImage: '',
    body: 'Take advantage of our current hotel promotions and enjoy a luxurious stay with discounted rates, complimentary services, and unmatched comfort. Whether it\'s a weekend getaway or a business trip, our promo packages are designed to elevate your experience.',
    sections: [
      {
        heading: 'Why Book During Our Promo?',
        body: 'Enjoy up to 25% off room rates, complimentary breakfast, priority check-in, and special gift packages when you book during our limited-time offers.'
      },
      {
        heading: 'Flexible Dates',
        body: 'Our promo offers include flexible booking dates and cancellation policies to give you peace of mind when planning your trip.'
      }
    ]
  }
];

async function seedPages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    for (let data of pages) {
      const existing = await PageContent.findOne({ page: data.page });
      if (existing) {
        console.log(`⚠️ Skipped: ${data.page} (already exists)`);
        continue;
      }

      const page = new PageContent(data);
      await page.save();
      console.log(`✅ Seeded: ${data.page}`);
    }

    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedPages();
