export interface Product {
  id: string;          // Maps to Supabase UUID
  product_code?: string; // Business identifier (optional during migration)
  name: string;
  selling_price: number;
  original_price: number;
  stock: number;
  category: "bags" | "cushions";
  type: string;
  description: string;
  colors: {
    name: string;
    images: string[];
  }[];
  isFeatured?: boolean;
  size?: "small" | "large";
}

export const PRODUCTS: Product[] = [
  {
    id: "YDA-CC-001",
    name: "YDA Vintage Floral Cushion Cover – Heritage Bloom",
    selling_price: 499,
    original_price: 999,
    stock: 7,
    category: "cushions",
    type: "floral",
    description: "Add a touch of timeless elegance to your living space with this beautifully designed floral cushion cover by YDA. Crafted on a soft beige base, the intricate multicolor floral pattern brings a vintage charm that complements both modern and classic interiors. Made with premium-quality fabric, it offers a perfect blend of comfort and durability. Ideal for sofas, beds, or lounge areas, this cushion cover effortlessly enhances your home décor with a warm and sophisticated vibe.",
    colors: [
      {
        name: "Default",
        images: [
          "/images/cushions/floral/YDA-CC-001-red-2.jpg",
          "/images/cushions/floral/YDA-CC-001-red-2.jpg",
          "/images/cushions/floral/YDA-CC-001-red-3.jpg",
          "/images/cushions/floral/YDA-CC-001-red-4.jpg",
          "/images/cushions/floral/YDA-CC-001-red-5.jpg"
        ]
      }
    ],
    isFeatured: true
  },
  {
    id: "YDA-CC-002",
    name: "YDA Floral Bird Cushion Cover – Heritage Garden",
    selling_price: 499,
    original_price: 999,
    stock: 7,
    category: "cushions",
    type: "floral",
    description: "Bring a touch of artistic elegance to your home with this beautifully crafted floral bird cushion cover by YDA. Set on a soft beige base, the intricate design features vibrant red flowers, delicate green leaves, and a detailed bird motif that adds a unique and lively charm to any space. Made from premium-quality fabric, it offers a smooth feel along with long-lasting durability. Perfect for sofas, beds, or lounge areas, this cushion cover enhances your décor with a warm, stylish, and inviting look.",
    colors: [
      {
        name: "Default",
        images: [
          "/images/cushions/floral/YDA-CC-002-red-4.jpg",
          "/images/cushions/floral/YDA-CC-002-red-2.jpg",
          "/images/cushions/floral/YDA-CC-002-red-3.jpg",
          "/images/cushions/floral/YDA-CC-002-red-4.jpg",
          "/images/cushions/floral/YDA-CC-002-red-5.jpg"
        ]
      }
    ],
    isFeatured: true
  },
  {
    id: "YDA-CC-003",
    name: "YDA Floral Bird Cushion Cover – Heritage Garden",
    selling_price: 499,
    original_price: 999,
    stock: 7,
    category: "cushions",
    type: "floral",
    description: "Brighten up your living space with this vibrant floral cushion cover by YDA. Designed on a soft beige base, the lively mix of white, green, and orange floral patterns adds a fresh and modern touch to any interior. Crafted from premium-quality cotton fabric, it offers a soft feel along with long-lasting durability. Perfect for sofas, beds, or cozy corners, this cushion cover brings warmth, color, and a stylish charm to your home décor.",
    colors: [
      {
        name: "Default",
        images: [
          "/images/cushions/floral/YDA-CC-003-white-4.jpg",
          "/images/cushions/floral/YDA-CC-003-white-2.jpg",
          "/images/cushions/floral/YDA-CC-003-white-3.jpg",
          "/images/cushions/floral/YDA-CC-003-white-4.jpg",
          "/images/cushions/floral/YDA-CC-003-white-5.jpg"
        ]
      }
    ],
    isFeatured: true
  },
  {
    id: "YDA-TB-001",
    name: "YDA Floral Canvas Tote Bag – Bloom Carry",
    selling_price: 699,
    original_price: 1399,
    stock: 7,
    category: "bags",
    type: "tote",
    description: "Carry your essentials in style with this elegant floral tote bag by YDA. Designed on a soft beige base with vibrant floral prints, it offers a perfect blend of fashion and functionality. Made from durable, high-quality fabric, this tote bag is spacious, lightweight, and ideal for daily use, shopping, or casual outings. The sturdy handles ensure comfortable carrying, while the eye-catching design adds a fresh and stylish touch to your everyday look.",
    colors: [
      {
        name: "Default",
        images: [
          "/images/bags/tote/small/YDA-TB-001-beige-1.jpg",
          "/images/bags/tote/small/YDA-TB-001-beige-2.jpg",
          "/images/bags/tote/small/YDA-TB-001-beige-3.jpg",
          "/images/bags/tote/small/YDA-TB-001-beige-4.jpg",
          "/images/bags/tote/small/YDA-TB-001-beige-5.jpg",
          "/images/bags/tote/small/YDA-TB-001-beige-6.jpg"
        ]
      }
    ],
    isFeatured: true,
    size: "small"
  },
  {
    id: "YDA-TB-002",
    name: "YDA Floral Bird Tote Bag – Garden Carry",
    selling_price: 699,
    original_price: 1399,
    stock: 7,
    category: "bags",
    type: "tote",
    description: "Elevate your everyday style with this beautifully designed floral bird tote bag by YDA. Featuring a clean white base with vibrant floral and bird motifs, it brings a fresh and elegant look to your daily essentials. Crafted from durable, high-quality fabric, this tote bag is spacious, lightweight, and perfect for shopping, travel, or casual outings. The sturdy handles and structured design ensure comfortable carrying while adding a stylish touch to your look.",
    colors: [
      {
        name: "Default",
        images: [
          "/images/bags/tote/small/YDA-TB-002-white-1.jpg",
          "/images/bags/tote/small/YDA-TB-002-white-2.jpg",
          "/images/bags/tote/small/YDA-TB-002-white-3.jpg",
          "/images/bags/tote/small/YDA-TB-002-white-4.jpg",
          "/images/bags/tote/small/YDA-TB-002-white-5.jpg",
          "/images/bags/tote/small/YDA-TB-002-white-6.jpg"
        ]
      }
    ],
    isFeatured: true,
    size: "small"
  },
  {
    id: "YDA-TB-003",
    name: "YDA Vibrant Printed Tote Bag – Sunset Bloom",
    selling_price: 699,
    original_price: 1399,
    stock: 7,
    category: "bags",
    type: "tote",
    description: "Make a bold style statement with this vibrant printed tote bag by YDA. Featuring an eye-catching mix of floral and abstract patterns, it's designed to bring energy and charm to your everyday look. Crafted from high-quality, durable fabric, this spacious tote bag is as functional as it is fashionable. With its sturdy handles and lightweight design, it’s perfect for everything from city strolls to weekend getaways.",
    colors: [
      {
        name: "Orange",
        images: [
          "/images/bags/tote/big/YDA-TB-003-orange-1.png",
          "/images/bags/tote/big/YDA-TB-003-orange-2.jpg",
          "/images/bags/tote/big/YDA-TB-003-orange-3.jpg",
          "/images/bags/tote/big/YDA-TB-003-orange-4.jpg",
          "/images/bags/tote/big/YDA-TB-003-orange-5.jpg",
          "/images/bags/tote/big/YDA-TB-003-orange-6.jpg"
        ]
      }
    ],
    isFeatured: true,
    size: "large"
  },
  {
    id: "YDA-TB-004",
    name: "YDA Jungle Print Tote Bag – Safari Carry",
    selling_price: 699,
    original_price: 1399,
    stock: 7,
    category: "bags",
    type: "tote",
    description: "Add a bold and unique touch to your everyday style with this jungle print tote bag by YDA. Inspired by the raw beauty of nature, the intricate safari-themed pattern makes it a standout accessory for any fashion-forward individual. Spacious, lightweight, and durable, it is perfect for work, travel, or casual outings. The sturdy handles provide comfort, while the premium fabric ensures it lasts through all your daily adventures.",
    colors: [
      {
        name: "Grey",
        images: [
          "/images/bags/tote/big/YDA-TB-004-grey-1.png",
          "/images/bags/tote/big/YDA-TB-004-grey-2.jpg",
          "/images/bags/tote/big/YDA-TB-004-grey-3.jpg",
          "/images/bags/tote/big/YDA-TB-004-grey-4.jpg",
          "/images/bags/tote/big/YDA-TB-004-grey-5.jpg",
          "/images/bags/tote/big/YDA-TB-004-grey-6.jpg"
        ]
      },
      {
        name: "Green",
        images: [
          "/images/bags/tote/big/YDA-TB-004-green-1.png",
          "/images/bags/tote/big/YDA-TB-004-green-2.jpg",
          "/images/bags/tote/big/YDA-TB-004-green-3.jpg",
          "/images/bags/tote/big/YDA-TB-004-green-4.jpg",
          "/images/bags/tote/big/YDA-TB-004-green-5.jpg",
          "/images/bags/tote/big/YDA-TB-004-green-6.jpg"
        ]
      },
      {
        name: "Lime Green",
        images: [
          "/images/bags/tote/big/YDA-TB-004-lime-1.png",
          "/images/bags/tote/big/YDA-TB-004-lime-2.jpg",
          "/images/bags/tote/big/YDA-TB-004-lime-3.jpg",
          "/images/bags/tote/big/YDA-TB-004-lime-4.jpg",
          "/images/bags/tote/big/YDA-TB-004-lime-5.jpg",
          "/images/bags/tote/big/YDA-TB-004-lime-6.jpg"
        ]
      },
      {
        name: "Dark Green",
        images: [
          "/images/bags/tote/big/YDA-TB-004-dark-green-1.png",
          "/images/bags/tote/big/YDA-TB-004-dark-green-2.jpg",
          "/images/bags/tote/big/YDA-TB-004-dark-green-3.jpg",
          "/images/bags/tote/big/YDA-TB-004-dark-green-4.jpg",
          "/images/bags/tote/big/YDA-TB-004-dark-green-5.jpg"
        ]
      }
    ],
    isFeatured: true,
    size: "large"
  },
  {
    id: "YDA-TB-005",
    name: "YDA Vibrant Printed Tote Bag – Sunset Bloom (Large)",
    selling_price: 699,
    original_price: 1399,
    stock: 7,
    category: "bags",
    type: "tote",
    description: "Make a bold statement with this large-sized vibrant tote bag by YDA. Crafted for those who need extra space without sacrificing style, it combines a radiant floral design with premium utility. The lightweight yet heavy-duty canvas makes it ideal for groceries, beach trips, or office essentials. The meticulously printed patterns are designed to resist fading, keeping your bag looking as fresh as your unique style.",
    colors: [
      {
        name: "Yellow",
        images: [
          "/images/bags/tote/big/YDA-TB-005-yellow-1.png",
          "/images/bags/tote/big/YDA-TB-005-yellow-2.jpg",
          "/images/bags/tote/big/YDA-TB-005-yellow-3.jpg",
          "/images/bags/tote/big/YDA-TB-005-yellow-4.jpg",
          "/images/bags/tote/big/YDA-TB-005-yellow-5.jpg",
          "/images/bags/tote/big/YDA-TB-005-yellow-6.jpg"
        ]
      }
    ],
    isFeatured: true,
    size: "large"
  },
  {
    id: "YDA-TB-006",
    name: "YDA Tiger Stripe Tote Bag – Wild Street",
    selling_price: 699,
    original_price: 1399,
    stock: 7,
    category: "bags",
    type: "tote",
    description: "Stand out with this bold tiger stripe tote bag by YDA. A testament to urban fierce style, this bag is designed to make heads turn. The high-contrast print is perfect for adding an edge to a simple outfit. Beyond style, it offers ample space for all your essentials with a structured base that maintains its shape even when full. It's the perfect fusion of wild spirit and everyday practicality.",
    colors: [
      {
        name: "Orange",
        images: [
          "/images/bags/tote/big/YDA-TB-006-orange-1.png",
          "/images/bags/tote/big/YDA-TB-006-orange-2.jpg",
          "/images/bags/tote/big/YDA-TB-006-orange-3.jpg",
          "/images/bags/tote/big/YDA-TB-006-orange-4.jpg",
          "/images/bags/tote/big/YDA-TB-006-orange-5.jpg",
          "/images/bags/tote/big/YDA-TB-006-orange-6.jpg"
        ]
      },
      {
        name: "Grey",
        images: [
          "/images/bags/tote/big/YDA-TB-006-grey-1.png",
          "/images/bags/tote/big/YDA-TB-006-grey-2.jpg",
          "/images/bags/tote/big/YDA-TB-006-grey-3.jpg",
          "/images/bags/tote/big/YDA-TB-006-grey-4.jpg",
          "/images/bags/tote/big/YDA-TB-006-grey-5.jpg",
          "/images/bags/tote/big/YDA-TB-006-grey-6.jpg"
        ]
      }
    ],
    isFeatured: true,
    size: "large"
  }
];
