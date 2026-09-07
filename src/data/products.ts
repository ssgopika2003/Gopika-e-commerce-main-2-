import { OptionType, type Product } from "@/types/product";

export const ALL_PRODUCTS: Product[] = [
  {
    _id: "1",
    name: "PAHLI BAARISH (PETRICHOR) SCENTED CANDLE",
    slug: "pahli-baarish",
    visible: true,
    description: `<div style="font-family: 'Lato', sans-serif; color: #333; line-height: 1.6;">
        <p style="margin-bottom: 15px;">
            Bottled directly from the first monsoon shower. Designed with a blend of pure Petrichor and Evening Rain oils, this candle captures that exact moment when cool water hits dry earth.
        </p>
        <p style="margin-bottom: 15px;">
            Perfect for your study desk during late-night sessions, a quiet evening with adrak chai, or simply to add an earthy, nostalgic texture to your room.
        </p>
        <p style="margin-bottom: 20px;">
            It is the perfect blend of memory and calm. Hand-poured in small batches by engineering students, it brings the smell of home wherever you are.
        </p>
    </div>`,
    additionalInfoSections: [
      {
        title: "Details",
        description: `<ul>
            <li><strong>Net Weight:</strong> 100g (Approx 25-30 hours burn time)</li>
            <li><strong>Wax:</strong> 100% Natural Soy Wax (Non-Toxic)</li>
            <li><strong>Wick:</strong> Crackling Wooden Wick (Sounds like rain)</li>
            <li><strong>Fragrance:</strong> Petrichor, Wet Soil, Ozone</li>
            <li><strong>Origin:</strong> Made in India (Handcrafted in Kalyani)</li>
        </ul>`,
      },
      {
        title: "Care Instructions",
        description: `<ul>
            <li>Trim the wooden wick to 5mm before every burn.</li>
            <li>Let the wax melt to the edges on the first burn to avoid tunneling.</li>
            <li>Do not burn for more than 4 hours at a time.</li>
            <li>Keep away from drafts, curtains, and vibrations.</li>
        </ul>`,
      },
      {
        title: "Shipping & Returns",
        description: `<ul>
            <li><strong>Shipping:</strong> Ships within 2 working days.</li>
            <li><strong>Returns:</strong> No returns or exchanges are allowed for this product.</li>
            <li><strong>Damages:</strong> If the product arrives damaged, please contact us within 24 hours.</li>
        </ul>`,
      },
    ],
    media: {
      items: [
        {
          _id: "s1",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/pahli-baarish/pahli-baarish-s1.jpeg",
            altText: "Pahli Baarish Candle",
          },
        },
        {
          _id: "s2",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/pahli-baarish/pahli-baarish-s2.jpeg",
            altText: "Pahli Baarish Candle S2",
          },
        },
        {
          _id: "s3",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/pahli-baarish/pahli-baarish-s3.jpeg",
            altText: "Pahli Baarish Candle S3",
          },
        },
        {
          _id: "s4",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/pahli-baarish/pahli-baarish-s4.jpeg",
            altText: "Pahli Baarish Candle S4",
          },
        },
      ],
    },
    priceData: {
      price: 259.0,
      discountedPrice: 207.0,
      currency: "INR",
    },
    productOptions: [
      {
        name: "Wick",
        optionType: OptionType.drop_down,
        choices: [
          {
            description: "Cotton",
            value: "cotton",
            inStock: true,
            visible: true,
          },
          {
            description: "Wooden",
            value: "wooden",
            inStock: true,
            visible: true,
          },
        ],
      },
    ],
    stock: {
      inStock: true,
      quantity: 5,
    },
  },
  {
    _id: "2",
    name: "WAADI (MOUNTAIN MIST) SCENTED CANDLE",
    slug: "waadi",
    visible: true,
    description: `<div style="font-family: 'Lato', sans-serif; color: #333; line-height: 1.6;">
        <p style="margin-bottom: 15px;">
            A direct ticket to the Himalayas. Infused with the sharp freshness of Pine needles and the cooling scent of Mountain Mist, this candle recreates the absolute silence of a deep valley.
        </p>
        <p style="margin-bottom: 15px;">
            Perfect for those overwhelming days when you need to escape the city noise. Light this up, grab a book, close your eyes, and breathe in the cold mountain air.
        </p>
        <p style="margin-bottom: 20px;">
            It isn't just a candle; it’s a breath of fresh air. Hand-poured in small batches by engineering students, it brings the calm of the hills to your hostel or home.
        </p>
    </div>`,
    additionalInfoSections: [
      {
        title: "Details",
        description: `<ul>
            <li><strong>Net Weight:</strong> 100g (Approx 25-30 hours burn time)</li>
            <li><strong>Wax:</strong> 100% Natural Soy Wax (Non-Toxic)</li>
            <li><strong>Wick:</strong> Crackling Wooden Wick (Sounds like a forest campfire)</li>
            <li><strong>Fragrance:</strong> Pine, Cedarwood, Cool Mist</li>
            <li><strong>Origin:</strong> Made in India (Handcrafted in Kalyani)</li>
        </ul>`,
      },
      {
        title: "Care Instructions",
        description: `<ul>
            <li>Trim the wooden wick to 5mm before every burn.</li>
            <li>Let the wax melt to the edges on the first burn to avoid tunneling.</li>
            <li>Do not burn for more than 4 hours at a time.</li>
            <li>Keep away from drafts, curtains, and vibrations.</li>
        </ul>`,
      },
      {
        title: "Shipping & Returns",
        description: `<ul>
            <li><strong>Shipping:</strong> Ships within 2 working days.</li>
            <li><strong>Returns:</strong> No returns or exchanges are allowed for this product.</li>
            <li><strong>Damages:</strong> If the product arrives damaged, please contact us within 24 hours.</li>
        </ul>`,
      },
    ],
    media: {
      items: [
        {
          _id: "s1",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/waadi/waadi-s1.jpeg",
            altText: "Waadi Candle S1",
          },
        },
        {
          _id: "s2",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/waadi/waadi-s2.jpeg",
            altText: "Waadi Candle S2",
          },
        },
        {
          _id: "s3",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/waadi/waadi-s3.jpeg",
            altText: "Waadi Candle S3",
          },
        },
        {
          _id: "s4",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/waadi/waadi-s4.jpeg",
            altText: "Waadi Candle S4",
          },
        },
      ],
    },
    priceData: {
      price: 269.0,
      discountedPrice: 215.0,
      currency: "INR",
    },
    productOptions: [
      {
        name: "Wick",
        optionType: OptionType.drop_down,
        choices: [
          {
            description: "Cotton",
            value: "cotton",
            inStock: true,
            visible: true,
          },
          {
            description: "Wooden",
            value: "wooden",
            inStock: true,
            visible: true,
          },
        ],
      },
    ],
    stock: {
      inStock: true,
      quantity: 10,
    },
  },
  {
    _id: "3",
    name: "LAVENDER (SLEEP LULLABY) SCENTED CANDLE",
    slug: "lavender",
    visible: true,
    description: `<div style="font-family: 'Lato', sans-serif; color: #333; line-height: 1.6;">
        <p style="margin-bottom: 15px;">
            Your personal "Off" button. Infused with pure French Lavender essential oils, this candle is designed to help you unwind, de-stress, and drift into a deep, peaceful sleep.
        </p>
        <p style="margin-bottom: 15px;">
            Perfect for the bedside table after a long day of lectures and labs. Light it an hour before sleep to turn your room into a sanctuary of calm.
        </p>
        <p style="margin-bottom: 20px;">
            It is peace, poured into a jar. Hand-poured in small batches by engineering students who understand the value of a good night's rest.
        </p>
    </div>`,
    additionalInfoSections: [
      {
        title: "Details",
        description: `<ul>
            <li><strong>Net Weight:</strong> 100g (Approx 25-30 hours burn time)</li>
            <li><strong>Wax:</strong> 100% Natural Soy Wax (Non-Toxic)</li>
            <li><strong>Wick:</strong> Crackling Wooden Wick (Sounds like a quiet night)</li>
            <li><strong>Fragrance:</strong> French Lavender, Herbal, Mild Camphor</li>
            <li><strong>Origin:</strong> Made in India (Handcrafted in Kalyani)</li>
        </ul>`,
      },
      {
        title: "Care Instructions",
        description: `<ul>
            <li>Trim the wooden wick to 5mm before every burn.</li>
            <li>Let the wax melt to the edges on the first burn to avoid tunneling.</li>
            <li>Do not burn for more than 4 hours at a time.</li>
            <li>Keep away from drafts, curtains, and vibrations.</li>
        </ul>`,
      },
      {
        title: "Shipping & Returns",
        description: `<ul>
            <li><strong>Shipping:</strong> Ships within 2 working days.</li>
            <li><strong>Returns:</strong> No returns or exchanges are allowed for this product.</li>
            <li><strong>Damages:</strong> If the product arrives damaged, please contact us within 24 hours.</li>
        </ul>`,
      },
    ],
    media: {
      items: [
        {
          _id: "s1",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/lavender/lavender-s1.jpeg",
            altText: "Lavender Candle S1",
          },
        },
        {
          _id: "s2",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/lavender/lavender-s2.jpeg",
            altText: "Lavender Candle S2",
          },
        },
        {
          _id: "s3",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/lavender/lavender-s3.jpeg",
            altText: "Lavender Candle S3",
          },
        },
      ],
    },
    priceData: {
      price: 399.0,
      discountedPrice: 239.0,
      currency: "INR",
    },
    productOptions: [
      {
        name: "Wick",
        optionType: OptionType.drop_down,
        choices: [
          {
            description: "Cotton",
            value: "cotton",
            inStock: true,
            visible: true,
          },
          {
            description: "Wooden",
            value: "wooden",
            inStock: true,
            visible: true,
          },
        ],
      },
    ],
    stock: {
      inStock: true,
      quantity: 50,
    },
  },
  {
    _id: "4",
    name: "MOGRA (EVENING BLOOM) SCENTED CANDLE",
    slug: "mogra",
    visible: true,
    description: `<div style="font-family: 'Lato', sans-serif; color: #333; line-height: 1.6;">
        <p style="margin-bottom: 15px;">
            The classic scent of an Indian summer evening. Capturing the heady, intoxicating fragrance of fresh Jasmine flowers blooming at dusk, this candle feels like a warm hug or a traditional celebration.
        </p>
        <p style="margin-bottom: 15px;">
            Perfect for festive nights, family gatherings, or simply when you need that familiar, heavy sweetness that makes a hostel room feel like home.
        </p>
        <p style="margin-bottom: 20px;">
            It is tradition, poured into a jar. Hand-poured in small batches by engineering students to bring you the warmth of memories you can't forget.
        </p>
    </div>`,
    additionalInfoSections: [
      {
        title: "Details",
        description: `<ul>
            <li><strong>Net Weight:</strong> 100g (Approx 25-30 hours burn time)</li>
            <li><strong>Wax:</strong> 100% Natural Soy Wax (Non-Toxic)</li>
            <li><strong>Wick:</strong> Crackling Wooden Wick (Sounds like a quiet evening)</li>
            <li><strong>Fragrance:</strong> Fresh Jasmine, White Floral, Green Stem</li>
            <li><strong>Origin:</strong> Made in India (Handcrafted in Kalyani)</li>
        </ul>`,
      },
      {
        title: "Care Instructions",
        description: `<ul>
            <li>Trim the wooden wick to 5mm before every burn.</li>
            <li>Let the wax melt to the edges on the first burn to avoid tunneling.</li>
            <li>Do not burn for more than 4 hours at a time.</li>
            <li>Keep away from drafts, curtains, and vibrations.</li>
        </ul>`,
      },
      {
        title: "Shipping & Returns",
        description: `<ul>
            <li><strong>Shipping:</strong> Ships within 2 working days.</li>
            <li><strong>Returns:</strong> No returns or exchanges are allowed for this product.</li>
            <li><strong>Damages:</strong> If the product arrives damaged, please contact us within 24 hours.</li>
        </ul>`,
      },
    ],
    media: {
      items: [
        {
          _id: "s1",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/mogra/mogra-s1.jpeg",
            altText: "Mogra Candle S1",
          },
        },
        {
          _id: "s2",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/mogra/mogra-s2.jpeg",
            altText: "Mogra Candle S2",
          },
        },
        {
          _id: "s3",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/mogra/mogra-s3.jpeg",
            altText: "Mogra Candle S3",
          },
        },

        {
          _id: "s4",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/mogra/mogra-s4.jpeg",
            altText: "Mogra Candle S4",
          },
        },
      ],
    },
    priceData: {
      price: 399.0,
      discountedPrice: 239.0,
      currency: "INR",
    },
    productOptions: [
      {
        name: "Wick",
        optionType: OptionType.drop_down,
        choices: [
          {
            description: "Cotton",
            value: "cotton",
            inStock: true,
            visible: true,
          },
          {
            description: "Wooden",
            value: "wooden",
            inStock: true,
            visible: true,
          },
        ],
      },
    ],
    stock: {
      inStock: true,
      quantity: 50,
    },
  },
  {
    _id: "5",
    name: "PARIJAAT (AUTUMN NOSTALGIA) SCENTED CANDLE",
    slug: "parijaat",
    visible: true,
    description: `<div style="font-family: 'Lato', sans-serif; color: #333; line-height: 1.6;">
        <p style="margin-bottom: 15px;">
            The fleeting magic of October mornings. Capturing the delicate, honey-sweet scent of Night-Flowering Jasmine (Shiuli), this candle evokes memories of crisp air, dew-covered grass, and the arrival of Durga Puja.
        </p>
        <p style="margin-bottom: 15px;">
            Perfect for those moments when you miss the festivities of home. Light this to fill your room with that specific, spiritual aroma that signals celebration and change.
        </p>
        <p style="margin-bottom: 20px;">
            It is a season, captured in wax. Hand-poured in small batches by engineering students to keep the spirit of autumn alive all year round.
        </p>
    </div>`,
    additionalInfoSections: [
      {
        title: "Details",
        description: `<ul>
            <li><strong>Net Weight:</strong> 100g (Approx 25-30 hours burn time)</li>
            <li><strong>Wax:</strong> 100% Natural Soy Wax (Non-Toxic)</li>
            <li><strong>Wick:</strong> Crackling Wooden Wick (Sounds like fallen leaves)</li>
            <li><strong>Fragrance:</strong> Shiuli, Night Jasmine, Mild Honey</li>
            <li><strong>Origin:</strong> Made in India (Handcrafted in Kalyani)</li>
        </ul>`,
      },
      {
        title: "Care Instructions",
        description: `<ul>
            <li>Trim the wooden wick to 5mm before every burn.</li>
            <li>Let the wax melt to the edges on the first burn to avoid tunneling.</li>
            <li>Do not burn for more than 4 hours at a time.</li>
            <li>Keep away from drafts, curtains, and vibrations.</li>
        </ul>`,
      },
      {
        title: "Shipping & Returns",
        description: `<ul>
            <li><strong>Shipping:</strong> Ships within 2 working days.</li>
            <li><strong>Returns:</strong> No returns or exchanges are allowed for this product.</li>
            <li><strong>Damages:</strong> If the product arrives damaged, please contact us within 24 hours.</li>
        </ul>`,
      },
    ],
    media: {
      items: [
        {
          _id: "s1",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/parijaat/parijaat-s1.jpeg",
            altText: "Parijaat Candle S1",
          },
        },
        {
          _id: "s2",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/parijaat/parijaat-s2.jpeg",
            altText: "Parijaat Candle S2",
          },
        },
        {
          _id: "s3",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/parijaat/parijaat-s3.jpeg",
            altText: "Parijaat Candle S3",
          },
        },
      ],
    },
    priceData: {
      price: 399.0,
      discountedPrice: 249.0,

      currency: "INR",
    },
    productOptions: [
      {
        name: "Wick",
        optionType: OptionType.drop_down,
        choices: [
          {
            description: "Cotton",
            value: "cotton",
            inStock: true,
            visible: true,
          },
          {
            description: "Wooden",
            value: "wooden",
            inStock: true,
            visible: true,
          },
        ],
      },
    ],
    stock: {
      inStock: true,
      quantity: 50,
    },
  },
  {
    _id: "6",
    name: "SAADA (UNSCENTED) CUSTOM CANDLE",
    slug: "saada",
    visible: true,
    description: `<div style="font-family: 'Lato', sans-serif; color: #333; line-height: 1.6;">
        <p style="margin-bottom: 15px;">
            <b>Saada</b> means Simple. Sometimes, you don't need a scent; you just need the light. This is our purest creation—completely fragrance-free, designed to add a warm glow without overpowering your space.
        </p>
        <p style="margin-bottom: 15px;">
            Perfect for dinner tables (so it doesn't clash with the aroma of food), for those sensitive to strong smells, or simply for reading by a quiet flame.
        </p>
        <p style="margin-bottom: 20px;">
            <b>Your Vibe, Your Color.</b> While the scent is invisible, the look is up to you. Choose from our palette—Classic White, Soft Pink, Sky Blue, or Leaf Green—to match your room's aesthetic perfectly.
        </p>
    </div>`,
    additionalInfoSections: [
      {
        title: "Details",
        description: `<ul>
            <li><strong>Net Weight:</strong> 100g (Approx 25-30 hours burn time)</li>
            <li><strong>Wax:</strong> 100% Natural Soy Wax (Non-Toxic)</li>
            <li><strong>Wick:</strong> Crackling Wooden Wick (Sounds like a quiet fireplace)</li>
            <li><strong>Fragrance:</strong> None (Unscented / Pure Soy)</li>
            <li><strong>Options:</strong> Available in 4 Custom Colors</li>
            <li><strong>Origin:</strong> Made in India (Handcrafted in Kalyani)</li>
        </ul>`,
      },
      {
        title: "Care Instructions",
        description: `<ul>
            <li>Trim the wooden wick to 5mm before every burn.</li>
            <li>Let the wax melt to the edges on the first burn to avoid tunneling.</li>
            <li>Do not burn for more than 4 hours at a time.</li>
            <li>Keep away from drafts, curtains, and vibrations.</li>
        </ul>`,
      },
      {
        title: "Shipping & Returns",
        description: `<ul>
            <li><strong>Shipping:</strong> Ships within 2 working days.</li>
            <li><strong>Returns:</strong> No returns or exchanges are allowed for this product.</li>
            <li><strong>Damages:</strong> If the product arrives damaged, please contact us within 24 hours.</li>
        </ul>`,
      },
    ],
    media: {
      items: [
        {
          _id: "s1",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/saada/saada-s1.jpeg",
            altText: "Saada Candle S1",
          },
        },
        {
          _id: "s2",
          image: {
            url: "https://ik.imagekit.io/codernandan/product/saada/saada-s2.jpeg",
            altText: "Saada Candle S2",
          },
        },
      ],
    },
    priceData: {
      price: 260.0,
      discountedPrice: 199.0,
      currency: "INR",
    },
    productOptions: [
      {
        name: "Wick",
        optionType: OptionType.drop_down,
        choices: [
          {
            description: "Cotton",
            value: "cotton",
            inStock: true,
            visible: true,
          },
          {
            description: "Wooden",
            value: "wooden",
            inStock: true,
            visible: true,
          },
        ],
      },
      {
        name: "Color Options",
        optionType: OptionType.color,
        choices: [
          {
            description: "Ivory White",
            value: "#FFFFF0",
            inStock: true,
            visible: true,
          },
          {
            description: "Cococa Brown",
            value: "#D2691E",
            inStock: true,
            visible: true,
          },
          {
            description: "Coral Read",
            value: "#F86F65",
            inStock: true,
            visible: true,
          },
          {
            description: "Diya Orange",
            value: "#F6C394",
            inStock: true,
            visible: true,
          },
          {
            description: "Holllow Purple",
            value: "#AA9698",
            inStock: true,
            visible: true,
          },
          {
            description: "Olive Green",
            value: "#858D68",
            inStock: true,
            visible: true,
          },
        ],
      },
    ],
    stock: {
      inStock: true,
      quantity: 5,
    },
  },
];
