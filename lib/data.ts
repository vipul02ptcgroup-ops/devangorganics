export interface Product {
  id: number;
  name: string;
  category: string;
  categories: string;
  price: number | null;
  regular_price: number | null;
  originalPrice: number | null;
  badge?: string;
  rating: number;
  reviews: number;
  description: string;
  inStock: boolean;
  image: string;
  weight: string;
  color: string;
  attributes?: Record<string, string> | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  iconName: string;
  count: number;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\\r\\\\/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

const rawProducts = [
  {
    "id": 160,
    "name": "Wild Cordyceps",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "<h5 id=\"title\" class=\"a-size-large a-spacing-none\"><span id=\"productTitle\" class=\"a-size-large product-title-word-break\">Whole Himalyan Cordyceps Sinensis Mushroom, Genuine and Very Rare, High Grade, Boost Energy, Reduce Stress for Men and Women, 3 Grams</span></h5>",
    "description": "<ul class=\"a-unordered-list a-vertical a-spacing-mini\">\r\ \t<li class=\"a-spacing-mini\"><span class=\"a-list-item\">REV UP YOUR ENERGY - Looking for a natural boost? Wild Himalayan Cordyceps sinensis has been scientifically shown to bring a steady burst of energy to your day without the jitters, helping you naturally increase productivity, stay energized and focused, and get things done.</span></li>\r\ \t<li class=\"a-spacing-mini\"><span class=\"a-list-item\">LEGENDARY HERB - Wild Cordyceps is one of the most highly sought after herbs in history. It was once reserved only for emperors but can now be experienced by everyone. It is believed to profoundly benefit one's vitality, strength, stamina, and endurance. It is an ideal herb for those looking to greatly increase physical, mental, or spiritual prowess.</span></li>\r\ \t<li class=\"a-spacing-mini\"><span class=\"a-list-item\">BEST PRICE PERIOD - Wild Cordyceps sinensis is one of the most potent and revered herbs in the world and usually commands a price to match that reputation. We believe that everyone should get to try the benefits of Wild Cordyceps so we offer our product at the lowest possible prices!</span></li>\r\ \t<li class=\"a-spacing-mini\"><span class=\"a-list-item\">AUTHENTIC AND WILD - Our Cordyceps sinensis is gathered from remote regions in the Himalayan mountains, the only place that authentic Cordyceps sinensis grows. We have verified through laboratory testing that what we offer is in fact AUTHENTIC wild Cordyceps.</span></li>\r\</ul>",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/wild-cordyceps.webp",
    "attributes": null
  },
  {
    "id": 168,
    "name": "Shatavari/Asparagus Racemosus",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "<h4>Benefits</h4>\r\<ul>\r\ \t<li>Improves Fertility</li>\r\ \t<li>Boost Immunity</li>\r\ \t<li>Reproductive Tonic</li>\r\ \t<li>Weight Management</li>\r\ \t<li>Promotes Lactation</li>\r\ \t<li>Menstrual Cramps</li>\r\</ul>",
    "description": null,
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/herb4.webp",
    "attributes": null
  },
  {
    "id": 242,
    "name": "Lingzhi mushroom",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "<h5>Lingzhi mushrooms are prized for their potent medicinal properties, which are attributed to various bioactive compounds such as polysaccharides, triterpenoids, and peptidoglycans.</h5>",
    "description": "<h4><strong>Benefits:-</strong></h4>\r\<ul>\r\ \t<li><strong>Immune System Support</strong>: Enhances immune function by increasing the activity of white blood cells.</li>\r\ \t<li><strong>Anti-Cancer Properties</strong>: Contains compounds that may inhibit tumor growth and spread.</li>\r\ \t<li><strong>Anti-Inflammatory Effects</strong>: Reduces inflammation, which can help manage conditions like arthritis.</li>\r\ \t<li><strong>Antioxidant Effects</strong>: Protects cells from damage caused by free radicals.</li>\r\ \t<li><strong>Stress Reduction</strong>: Acts as an adaptogen, helping the body adapt to stress and normalize bodily functions.</li>\r\ \t<li><strong>Heart Health</strong>: May help lower blood pressure, cholesterol levels, and support overall cardiovascular health.</li>\r\</ul>",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/herb6.webp",
    "attributes": null
  },
  {
    "id": 245,
    "name": "Schisandra Dried Berries",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "",
    "description": "Schizandrae is considered to be one of the premier adaptogen herbs. Like Ginseng, Acanthopanax, Gynostemma, He Shou Wu, Reishi Mushrooms and many others, Schizandra increases the resistance of the body and mind against nonspecific stimuli.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/Pharmacopoeia1.webp",
    "attributes": null
  },
  {
    "id": 5969,
    "name": "Pomegranate & Red Ginseng",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "",
    "description": "Red Ginseng is a traditional medicinal herb widely used in East Asia, particularly Korea and China. When Pomegranate and Red Ginseng are combined, they work synergistically to enhance each other's benefits.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/Pharmacopoeia1.webp",
    "attributes": null
  },
  {
    "id": 5984,
    "name": "sodium hyaluronate & collagen peptide solid drink",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "",
    "description": "Collagen peptides are short chains of amino acids derived from collagen, a protein that is a major component of skin, hair, nails, bones, and joints.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_150618_911.webp",
    "attributes": null
  },
  {
    "id": 5995,
    "name": "Rhododendron Juice",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "",
    "description": "Rhododendron juice, derived from the vibrant flowers of the Rhododendron arboreum tree, is a cherished drink in the Himalayan regions of India, Nepal, and Bhutan. Known locally as 'Buransh' juice, it boasts a striking red hue, refreshing taste, and a wealth of medicinal properties.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_161155_171.webp",
    "attributes": null
  },
  {
    "id": 6000,
    "name": "Thyme Tea",
    "sku": null,
    "categories": "Herb Tea",
    "tags": null,
    "short_description": "",
    "description": "Thyme tea is a herbal infusion made from the leaves of the Thymus vulgaris plant, a Mediterranean herb known for its strong flavor and medicinal properties.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_174006_703.webp",
    "attributes": null
  },
  {
    "id": 6009,
    "name": "Peppermint Tea",
    "sku": null,
    "categories": "Herb Tea",
    "tags": null,
    "short_description": "",
    "description": "Peppermint tea is a popular herbal infusion made from the leaves of the Mentha piperita plant. Known for its refreshing flavor and aroma, peppermint tea has been used for centuries for its medicinal properties.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_174006_703.webp",
    "attributes": null
  },
  {
    "id": 6010,
    "name": "Rhododendron Tea",
    "sku": null,
    "categories": "Herb Tea",
    "tags": null,
    "short_description": "",
    "description": "Rhododendron tea is an herbal infusion made from the leaves or flowers of the Rhododendron plant, which is native to mountainous regions like the Himalayas.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_174411_475-1.webp",
    "attributes": null
  },
  {
    "id": 6021,
    "name": "Nettle Tea",
    "sku": null,
    "categories": "Herb Tea",
    "tags": null,
    "short_description": "",
    "description": "Nettle tea is an herbal infusion made from the leaves of the stinging nettle plant (Urtica dioica). Nettle tea has been used for centuries in traditional medicine due to its rich nutritional profile and numerous health benefits.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_174411_475-1.webp",
    "attributes": null
  },
  {
    "id": 6022,
    "name": "Plum Pickles",
    "sku": null,
    "categories": "Pickles",
    "tags": null,
    "short_description": "",
    "description": "Plum pickles, also known as pickled plums or umeboshi in Japanese cuisine, are plums preserved in salt, sugar, vinegar, and spices. They are a traditional delicacy in various cultures.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_174411_475-1.webp",
    "attributes": null
  },
  {
    "id": 6052,
    "name": "Cinnamon Shop",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "",
    "description": "A specialty retail outlet focusing on offering a wide range of cinnamon products and related items. Cinnamon, one of the most popular and versatile spices in the world, is known for its rich flavor, aromatic qualities, and numerous health benefits.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_174411_475-1.webp",
    "attributes": null
  },
  {
    "id": 6060,
    "name": "Vetiver Shop",
    "sku": null,
    "categories": "Natural Soaps",
    "tags": null,
    "short_description": "",
    "description": "A vetiver shop specializes in products made from the vetiver plant, known for its versatile uses in aromatherapy, natural skincare, wellness, and home decor.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_175147_980.webp",
    "attributes": null
  },
  {
    "id": 6073,
    "name": "Neem and Turmeric Soap",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "",
    "description": "Neem and Turmeric Soap is a popular skincare product known for its natural antibacterial, antifungal, and anti-inflammatory properties, making it effective for cleansing and healing the skin.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_175254_489-1.webp",
    "attributes": {
      "Acne Reduction": "The antibacterial properties of neem and turmeric make the soap highly effective for people with acne-prone skin.",
      "Natural Glow": "Turmeric is known to add a healthy glow to the skin by reducing dullness and improving skin tone.",
      "Anti-Aging": "Neem's antioxidant properties fight free radicals that cause premature aging.",
      "Hydration": "Neem and turmeric both help in maintaining skin hydration levels.",
      "Healing Properties": "The soap can be used to treat minor skin infections, cuts, and wounds."
    }
  },
  {
    "id": 6077,
    "name": "Sandalwood and Patchouli Soap",
    "sku": null,
    "categories": "Natural Soaps",
    "tags": null,
    "short_description": "",
    "description": "Sandalwood and Patchouli Soap is a luxurious natural soap known for its rich, earthy aroma and its benefits for the skin. Combining the nourishing properties of sandalwood with the grounding effects of patchouli.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_175406_753-1.webp",
    "attributes": null
  },
  {
    "id": 6082,
    "name": "Lemongrass & Nettle Soap",
    "sku": null,
    "categories": "Natural Soaps",
    "tags": null,
    "short_description": "",
    "description": "Lemongrass & Nettle Soap is a refreshing, natural soap designed to cleanse, rejuvenate, and balance the skin. Blending the uplifting citrus aroma of lemongrass with the purifying and soothing qualities of nettle.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_175501_753.webp",
    "attributes": null
  },
  {
    "id": 6101,
    "name": "Geranium Soap",
    "sku": null,
    "categories": "Natural Soaps",
    "tags": null,
    "short_description": "",
    "description": "Our luxurious Geranium Soap is crafted with natural ingredients to gently cleanse and nourish your skin. Enriched with the delicate, floral essence of geranium, this soap provides a soothing and invigorating aroma.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/grenium.webp",
    "attributes": null
  },
  {
    "id": 6102,
    "name": "Rosemary Soap",
    "sku": null,
    "categories": "Natural Soaps",
    "tags": null,
    "short_description": "",
    "description": "Our invigorating Rosemary Soap is a refreshing blend of natural ingredients and pure rosemary essential oil, designed to cleanse, energize, and rejuvenate your skin.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/rosemary.webp",
    "attributes": null
  },
  {
    "id": 6103,
    "name": "Rhododendron & Rose Soap",
    "sku": null,
    "categories": "Natural Soaps",
    "tags": null,
    "short_description": "",
    "description": "Our Rhododendron & Rose Soap combines the enchanting floral scents of rhododendron and rose with natural, skin-loving ingredients for a truly luxurious bathing experience.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/Rhododendron-rose.webp",
    "attributes": null
  },
  {
    "id": 6104,
    "name": "Orange Soap",
    "sku": null,
    "categories": "Natural Soaps",
    "tags": null,
    "short_description": "",
    "description": "Our zesty Orange Soap is a bright and refreshing addition to your skincare routine, made with natural orange essential oil and nourishing plant-based ingredients.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/orange.webp",
    "attributes": null
  },
  {
    "id": 6105,
    "name": "Jasmine & Mogra Soap",
    "sku": null,
    "categories": "Natural Soaps",
    "tags": null,
    "short_description": "",
    "description": "Our Jasmine & Mogra Soap is a luxurious blend of jasmine and mogra (Indian jasmine) essential oils, designed to pamper your skin and uplift your senses.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/jasmin.webp",
    "attributes": null
  },
  {
    "id": 6125,
    "name": "Oregano: Nature's Flavorful and Medicinal Herb",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "",
    "description": "Oregano, scientifically known as Origanum vulgare, is a popular culinary and medicinal herb that has been used for centuries. Renowned for its aromatic and flavorful properties, oregano is an essential ingredient in many cuisines.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_180738_209.webp",
    "attributes": null
  },
  {
    "id": 6129,
    "name": "Jumboo Herb",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "",
    "description": "Jumboo Herb, scientifically known as Ficus Palmata, is a medicinal plant native to certain parts of the Himalayan region. Celebrated for its powerful therapeutic properties, this herb has been a cornerstone in traditional Ayurvedic and Unani medicine.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_180738_209.webp",
    "attributes": null
  },
  {
    "id": 6133,
    "name": "Rosemary Herb",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "",
    "description": "Rosemary (Rosmarinus officinalis) is a fragrant evergreen herb native to the Mediterranean region. Known for its culinary, medicinal, and therapeutic properties, rosemary has been cherished for centuries as a versatile and powerful natural remedy.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_180917_180.webp",
    "attributes": null
  },
  {
    "id": 6141,
    "name": "Basil Herb",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "",
    "description": "Basil (Ocimum basilicum), often referred to as the 'King of Herbs,' is a fragrant and versatile plant cherished for its culinary and medicinal uses. Originating from Asia and Africa, basil is a staple in traditional medicine systems such as Ayurveda.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_181022_958.webp",
    "attributes": null
  },
  {
    "id": 6142,
    "name": "Continental Herb",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "",
    "description": "Continental Herb refers to a variety of herbs commonly used across European, Mediterranean, and Western cuisines. These herbs, including oregano, thyme, rosemary, parsley, and sage, are celebrated for their unique flavors and numerous health benefits.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_181022_958.webp",
    "attributes": null
  },
  {
    "id": 6146,
    "name": "Mixed Herbs",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "",
    "description": "Mixed herbs are a harmonious blend of various dried or fresh herbs, carefully curated to enhance the flavor of dishes while offering a wealth of health benefits. Typically containing thyme, rosemary, basil, oregano, and parsley.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_181022_958.webp",
    "attributes": null
  },
  {
    "id": 6150,
    "name": "Thyme Herb",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "",
    "description": "Thyme (scientifically known as Thymus vulgaris) is a small but mighty herb, renowned for its aromatic flavor, medicinal properties, and versatility. A staple in Mediterranean cuisine and traditional medicine.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_181313_008.webp",
    "attributes": null
  },
  {
    "id": 6154,
    "name": "Spicy Parsley",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "",
    "description": "Spicy parsley (Petroselinum crispum) is a unique variation of the well-known parsley herb, adding a zesty kick to its classic flavor profile. Known for its versatility, this herb is celebrated for its culinary uses, nutritional benefits, and medicinal properties.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_181313_008.webp",
    "attributes": null
  },
  {
    "id": 6158,
    "name": "Mint Herb",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "",
    "description": "Mint (Mentha), a vibrant and aromatic herb, is a beloved staple in cuisines, medicines, and personal care products worldwide. Known for its cooling sensation and therapeutic properties.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_181440_862.webp",
    "attributes": null
  },
  {
    "id": 6162,
    "name": "Parsley Herb",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "",
    "description": "Parsley (Petroselinum crispum) is a versatile and widely used herb, recognized for its bright green color and fresh, slightly peppery flavor. Native to the Mediterranean region, parsley has become a global favorite.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_181518_910.webp",
    "attributes": null
  },
  {
    "id": 6166,
    "name": "Mint Medley Herbs",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "",
    "description": "Mint Medley is a delightful blend of mint herbs, celebrated for their cooling properties, refreshing aroma, and numerous health benefits. This herbaceous combination typically includes peppermint and spearmint.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_181556_755.webp",
    "attributes": null
  },
  {
    "id": 6170,
    "name": "Apricot Body Cream",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "",
    "description": "Apricot Body Cream is a luxurious, nutrient-rich moisturizer designed to rejuvenate and hydrate the skin. Enriched with the goodness of apricot extracts, essential oils, and natural emollients.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_181710_307-1.webp",
    "attributes": null
  },
  {
    "id": 6177,
    "name": "Apricot Body Scrub",
    "sku": null,
    "categories": "Herb's",
    "tags": null,
    "short_description": "",
    "description": "The Apricot Body Scrub is a luxurious skincare product designed to gently exfoliate the skin, removing dead cells and impurities to reveal a softer, smoother, and more radiant complexion.",
    "regular_price": null,
    "price": null,
    "in_stock": true,
    "stock": null,
    "image": "assets/ProductsImage/IMG_20240813_181807_074-1.webp",
    "attributes": null
  }
];

const categoryMap: Record<string, string> = {
  "Herb's": "herbs",
  "Herb Tea": "herb-tea",
  "Pickles": "pickles",
  "Natural Soaps": "natural-soaps",
};

const badges = ["Bestseller", "New", "Organic", "Superfood", "Handmade", "Himalayan", "Ayurvedic", "Pure", "Traditional", "Premium"];

// Default weights by category
const weightByCategory: Record<string, string> = {
  "Herb's": "50g",
  "Herb Tea": "100g",
  "Pickles": "250g",
  "Natural Soaps": "100g",
};

export const products: Product[] = rawProducts.map((p, i) => ({
  id: p.id,
  name: stripHtml(p.name),
  category: categoryMap[p.categories] || "herbs",
  categories: p.categories,
  price: p.price ?? null,
  regular_price: p.regular_price ?? null,
  originalPrice: p.regular_price ?? null,
  badge: i % 3 === 0 ? badges[i % badges.length] : undefined,
  rating: parseFloat((4.2 + (i % 8) * 0.1).toFixed(1)),
  reviews: 15 + (i * 23) % 250,
  description: stripHtml(p.description || p.short_description || ""),
  inStock: p.in_stock,
  image: p.image,
  weight: weightByCategory[p.categories] || "50g",
  color: "Natural",
  attributes: p.attributes
    ? Object.fromEntries(
        Object.entries(p.attributes).map(([k, v]) => [
          k,
          typeof v === "string" ? v.replace(/\\,/g, ",") : v,
        ])
      )
    : null,
}));

export const categories: Category[] = [
  { id: 1, name: "Herb's", slug: "herbs", iconName: "Leaf", count: products.filter(p => p.category === "herbs").length },
  { id: 2, name: "Herb Tea", slug: "herb-tea", iconName: "Coffee", count: products.filter(p => p.category === "herb-tea").length },
  { id: 3, name: "Natural Soaps", slug: "natural-soaps", iconName: "Sparkles", count: products.filter(p => p.category === "natural-soaps").length },
  { id: 4, name: "Pickles", slug: "pickles", iconName: "Utensils", count: products.filter(p => p.category === "pickles").length },
];

export const testimonials = [
  { id: 1, name: "Priya Sharma", location: "Mumbai", text: "Devang Organics has transformed my daily routine. The herbs are absolutely pure and effective. I feel more energetic than ever!", rating: 5, avatar: "PS" },
  { id: 2, name: "Rajesh Mehta", location: "Pune", text: "The pickles remind me of my grandmother's recipe. Authentic taste with no artificial preservatives. Truly organic!", rating: 5, avatar: "RM" },
  { id: 3, name: "Anita Desai", location: "Ahmedabad", text: "The herbal teas are my morning ritual now. The quality and fragrance are unmatched. Highly recommend!", rating: 5, avatar: "AD" },
  { id: 4, name: "Vikram Patel", location: "Surat", text: "Neem soap cleared my skin issues in weeks. Natural ingredients, no harsh chemicals. Devang Organics is a gem!", rating: 4, avatar: "VP" },
];