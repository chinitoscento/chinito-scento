// Edit your brand text here. Nothing else needs to change.
export const SITE = {
  brand: 'Chinito Scento',
  tagline: 'Scents that leave an impression.',
  intro: 'Small-batch scents, macerated and bottled by us. Pick your perfumes and send a request. We will message you to arrange delivery and payment.',
  about: [
    'Chinito Scento is owned by Edson Tan II. The idea of starting a perfume business began in 2019 and took off in 2026.',
    'Today, we macerate perfumes inspired by well-known fragrances, made in small batches, bottled and packed by our own team.',
    'Something new is coming: Chinito Scento will soon launch its own original perfume collection. Stay tuned.',
  ],
  steps: [
    'Add the perfumes you want to your order.',
    'Fill in your name, mobile number and delivery address, then send the request.',
    'We contact you to confirm the order, delivery fee and how to pay.',
    'You pay as agreed and we deliver.',
  ],
  contact: {
    mobile: '0917 657 0115',
    email: 'chinitoscento@gmail.com',
    // Paste your full page links here. An empty link hides that icon.
    facebook: 'https://www.facebook.com/profile.php?id=61593853720473',
    instagram: 'https://www.instagram.com/chinitoscento/',
    tiktok: '',
  },
  // Optional one-line scent notes. Key = perfume name exactly as in the database.
  notes: {
    // Taglines taken from the bottle labels. Replace with scent notes when you like.
    DWIGHT: 'The art of quiet luxury',
    GAB: 'Elegance after dark',
    AURELIUS: 'Elegance after dark',
    ANTONITO: 'Elegance after dark',
    'REINE DE NUIT': 'Crowned in midnight',
    KITTY: 'Sweet with a spark',
    EMILY: 'A memory in bloom',
    CUCAMELLA: 'Endless summer',
    BLANCHE: 'Beautiful in simplicity',
  },
  // Scent notes (top / heart / base). Key = perfume name (capitals do not matter).
  // Edit freely: the card shows whatever is written here.
  scentNotes: {
    ANTONITO: { top: ['Bergamot', 'Pepper'], heart: ['Lavender', 'Pink pepper', 'Vetiver', 'Geranium'], base: ['Ambroxan', 'Cedar', 'Labdanum'] },
    AURELIUS: { top: ['Blood mandarin', 'Grapefruit', 'Mint'], heart: ['Cinnamon', 'Spices', 'Rose'], base: ['Leather', 'Amber', 'Woods', 'Patchouli'] },
    DWIGHT: { top: ['Apple', 'Ginger', 'Bergamot'], heart: ['Sage', 'Juniper berries', 'Geranium'], base: ['Amberwood', 'Tonka bean', 'Cedar', 'Vetiver', 'Olibanum'] },
    GAB: { top: ['Mint', 'Green apple', 'Lemon'], heart: ['Tonka bean', 'Ambroxan', 'Geranium'], base: ['Vanilla', 'Vetiver', 'Oakmoss', 'Cedar'] },
    'REINE DE NUIT': { top: ['Saffron', 'Jasmine'], heart: ['Amberwood', 'Ambergris'], base: ['Fir resin', 'Cedar'] },
    BLANCHE: { top: ['Bergamot', 'Mandarin', 'White peach'], heart: ['Orange flower', 'Nympheal', 'Vetiver'], base: ['Akigalawood', 'Ambrofix', 'Musk'] },
    CUCAMELLA: { top: ['Cucumber', 'Honeydew melon'], heart: ['Cantaloupe', 'Grapefruit', 'Muguet'], base: ['Sheer woods', 'Soft musk'] },
    EMILY: { top: ['Frozen apple', 'Peach', 'Muguet'], heart: ['Freesia', 'Mimosa', 'Jasmine', 'Tuberose'], base: ['Musk', 'Sandalwood', 'Ylang-ylang', 'Oakmoss'] },
    KITTY: { top: ['Tangerine', 'Pear', 'Gardenia'], heart: ['Honeysuckle', 'Lily of the valley', 'Orange blossom'], base: ['Vanilla', 'Musk', 'Amber', 'Sandalwood'] },
    VELOURA: { top: ['Lavender', 'Mandarin', 'Black currant', 'Petitgrain'], heart: ['Orange blossom', 'Jasmine', 'Lavender'], base: ['Vanilla', 'Tonka bean', 'Musk', 'Cedar', 'Ambergris'] },
  },
  scentNotesNote: 'Notes describe the fragrance style each perfume is inspired by. Chinito Scento perfumes are inspired creations and may smell slightly different.',
  // "Find your scent" filter. Edit the list of families and which perfume belongs to which.
  // Key = perfume name (capitals do not matter). A perfume can have several families.
  familyList: ['Floral', 'Powdery', 'Woody', 'Fresh', 'Sweet', 'Bold'],
  families: {
    ANTONITO: ['Fresh', 'Woody'],
    AURELIUS: ['Sweet', 'Bold'],
    DWIGHT: ['Woody', 'Fresh'],
    GAB: ['Sweet', 'Bold'],
    'REINE DE NUIT': ['Woody', 'Sweet', 'Bold'],
    BLANCHE: ['Floral', 'Powdery'],
    CUCAMELLA: ['Fresh'],
    EMILY: ['Floral', 'Fresh'],
    KITTY: ['Powdery', 'Sweet'],
    VELOURA: ['Floral', 'Sweet'],
  },
  // Shown under "Our collection". Leave empty ('') to hide.
  concentration: 'All our perfumes are Eau de Parfum, made with 20% fragrance oil.',
  // Three bottles shown at the top of the page (best sellers). Use the file names in public/bottles, without .jpg.
  featured: ['cucamella', 'kitty', 'gab'],
  refDays: 30,
}
