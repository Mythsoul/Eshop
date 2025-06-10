import React from 'react';
import Image from 'next/image';

// Define image paths
const logo = {
  src: '/logo.png',
  width: 150,
  height: 50
};
const search_icon = {
  src: '/search_icon.svg',
  width: 24,
  height: 24
};
const user_icon = {
  src: '/user_icon.svg',
  width: 24,
  height: 24
};
const cart_icon = {
  src: '/cart_icon.svg',
  width: 24,
  height: 24
};
const add_icon = {
  src: '/add_icon.svg',
  width: 24,
  height: 24
};
const order_icon = {
  src: '/order_icon.svg',
  width: 24,
  height: 24
};
const instagram_icon = {
  src: '/assets/instagram_icon.svg',
  width: 24,
  height: 24
};
const facebook_icon = {
  src: '/assets/facebook_icon.svg',
  width: 24,
  height: 24
};
const twitter_icon = {
  src: '/assets/twitter_icon.svg',
  width: 24,
  height: 24
};
const box_icon = {
  src: '/assets/box_icon.svg',
  width: 24,
  height: 24
};
const product_list_icon = {
  src: '/assets/product_list_icon.svg',
  width: 24,
  height: 24
};
const menu_icon = {
  src: '/assets/menu_icon.svg',
  width: 24,
  height: 24
};
const arrow_icon = {
  src: '/assets/arrow_icon.svg',
  width: 24,
  height: 24
};
const increase_arrow = {
  src: '/assets/increase_arrow.svg',
  width: 24,
  height: 24
};
const decrease_arrow = {
  src: '/assets/decrease_arrow.svg',
  width: 24,
  height: 24
};
const arrow_right_icon_colored = {
  src: '/assets/arrow_right_icon_colored.svg',
  width: 24,
  height: 24
};
const my_location_image = {
  src: '/assets/my_location_image.svg',
  width: 24,
  height: 24
};
const arrow_icon_white = {
  src: '/assets/arrow_icon_white.svg',
  width: 24,
  height: 24
};
const heart_icon = {
  src: '/assets/heart_icon.svg',
  width: 24,
  height: 24
};
const star_icon = {
  src: '/assets/star_icon.svg',
  width: 24,
  height: 24
};
const redirect_icon = {
  src: '/assets/redirect_icon.svg',
  width: 24,
  height: 24
};
const star_dull_icon = {
  src: '/assets/star_dull_icon.svg',
  width: 24,
  height: 24
};
const header_headphone_image = {
  src: '/assets/header_headphone_image.png',
  width: 150,
  height: 50
};
const header_playstation_image = {
  src: '/assets/header_playstation_image.png',
  width: 150,
  height: 50
};
const header_macbook_image = {
  src: '/assets/header_macbook_image.png',
  width: 150,
  height: 50
};
const macbook_image = {
  src: '/assets/macbook_image.png',
  width: 150,
  height: 50
};
const bose_headphone_image = {
  src: '/assets/bose_headphone_image.png',
  width: 150,
  height: 50
};
const apple_earphone_image = {
  src: '/assets/apple_earphone_image.png',
  width: 150,
  height: 50
};
const samsung_s23phone_image = {
  src: '/assets/samsung_s23phone_image.png',
  width: 150,
  height: 50
};
const venu_watch_image = {
  src: '/assets/venu_watch_image.png',
  width: 150,
  height: 50
};
const upload_area = {
  src: '/assets/upload_area.png',
  width: 150,
  height: 50
};
const cannon_camera_image = {
  src: '/assets/cannon_camera_image.png',
  width: 150,
  height: 50
};
const sony_airbuds_image = {
  src: '/assets/sony_airbuds_image.png',
  width: 150,
  height: 50
};
const asus_laptop_image = {
  src: '/assets/asus_laptop_image.png',
  width: 150,
  height: 50
};
const projector_image = {
  src: '/assets/projector_image.png',
  width: 150,
  height: 50
};
const playstation_image = {
  src: '/assets/playstation_image.png',
  width: 150,
  height: 50
};
const girl_with_headphone_image = {
  src: '/assets/girl_with_headphone_image.png',
  width: 150,
  height: 50
};
const girl_with_earphone_image = {
  src: '/assets/girl_with_earphone_image.png',
  width: 150,
  height: 50
};
const md_controller_image = {
  src: '/assets/md_controller_image.png',
  width: 150,
  height: 50
};
const sm_controller_image = {
  src: '/assets/sm_controller_image.png',
  width: 150,
  height: 50
};
const jbl_soundbox_image = {
  src: '/assets/jbl_soundbox_image.png',
  width: 150,
  height: 50
};
const boy_with_laptop_image = {
  src: '/assets/boy_with_laptop_image.png',
  width: 150,
  height: 50
};
const checkmark = {
  src: '/assets/checkmark.png',
  width: 24,
  height: 24
};
const product_details_page_apple_earphone_image1 = {
  src: '/assets/product_details_page_apple_earphone_image1.png',
  width: 150,
  height: 50
};
const product_details_page_apple_earphone_image2 = {
  src: '/assets/product_details_page_apple_earphone_image2.png',
  width: 150,
  height: 50
};
const product_details_page_apple_earphone_image3 = {
  src: '/assets/product_details_page_apple_earphone_image3.png',
  width: 150,
  height: 50
};
const product_details_page_apple_earphone_image4 = {
  src: '/assets/product_details_page_apple_earphone_image4.png',
  width: 150,
  height: 50
};
const product_details_page_apple_earphone_image5 = {
  src: '/assets/product_details_page_apple_earphone_image5.png',
  width: 150,
  height: 50
};
const esewa = {
  src: '/assets/esewa.png',
  width: 150,
  height: 50
};
const khalti = {
  src: '/assets/khalti.jpg',
  width: 150,
  height: 50
};
const home_icon = '/assets/home_icon.svg';

export const assets = {
  logo,
  search_icon,
  user_icon,
  cart_icon,
  add_icon,
  order_icon,
  instagram_icon,
  facebook_icon,
  twitter_icon,
  box_icon,
  product_list_icon,
  menu_icon,
  arrow_icon,
  increase_arrow,
  decrease_arrow,
  arrow_right_icon_colored,
  my_location_image,
  arrow_icon_white,
  heart_icon,
  star_icon,
  redirect_icon,
  star_dull_icon,
  header_headphone_image,
  header_playstation_image,
  header_macbook_image,
  macbook_image,
  bose_headphone_image,
  apple_earphone_image,
  samsung_s23phone_image,
  venu_watch_image,
  upload_area,
  cannon_camera_image,
  sony_airbuds_image,
  asus_laptop_image,
  projector_image,
  playstation_image,
  girl_with_headphone_image,
  girl_with_earphone_image,
  md_controller_image,
  sm_controller_image,
  jbl_soundbox_image,
  boy_with_laptop_image,
  product_details_page_apple_earphone_image1,
  product_details_page_apple_earphone_image2,
  product_details_page_apple_earphone_image3,
  product_details_page_apple_earphone_image4,
  product_details_page_apple_earphone_image5,
  checkmark,
  esewa,
  khalti
};

export const BagIcon = () => (
  <Image src={cart_icon} alt="Bag" width={24} height={24} />
);

export const CartIcon = () => (
  <div className="relative">
    <Image src={cart_icon} alt="Cart" width={24} height={24} />
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full p-1">2</span>
  </div>
);

export const BoxIcon = () => (
  <Image src={box_icon} alt="Box" width={24} height={24} />
);

export const HomeIcon = () => (
  <Image src={home_icon} alt="Home" width={24} height={24} />
);

export const productsDummyData = [
  {
    "_id": "67a1f4e43f34a77b6dde9144",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "name": "Apple AirPods Pro 2nd gen",
    "description": "Apple AirPods Pro (2nd Gen) with MagSafe Case (USB-C) provide excellent sound, active noise cancellation, and a comfortable fit. The USB-C case ensures quick charging, and they pair seamlessly with Apple devices for an effortless audio experience.",
    "price": 499.99,
    "offerPrice": 399.99,
    "image": [
      "https://raw.githubusercontent.com/avinashdm/gs-images/main/quickcart/k4dafzhwhgcn5tnoylrw.webp",
      "https://raw.githubusercontent.com/avinashdm/gs-images/main/quickcart/j212frakb8hdrhvhajhg.webp",
      "https://raw.githubusercontent.com/avinashdm/gs-images/main/quickcart/imwuugqxsajuwqpkegb5.webp",
      "https://raw.githubusercontent.com/avinashdm/gs-images/main/quickcart/k1oqaslw5tb3ebw01vvj.webp"
    ],
    "category": "Earphone",
    "date": 1738667236865,
    "__v": 0
  },
  {
    "_id": "67a1f52e3f34a77b6dde914a",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "name": "Bose QuietComfort 45",
    "description": "The Bose QuietComfort 45 headphones are engineered for exceptional sound quality and unparalleled noise cancellation. With a 24-hour battery life and comfortable, lightweight design, these headphones deliver premium audio for any environment. Whether on a flight, in the office, or at home, the Bose QC45 blocks out distractions, offering an immersive listening experience.",
    "price": 429.99,
    "offerPrice": 329.99,
    "image": [
      "https://raw.githubusercontent.com/avinashdm/gs-images/main/quickcart/m16coelz8ivkk9f0nwrz.webp"
    ],
    "category": "Headphone",
    "date": 1738667310300,
    "__v": 0
  },
  {
    "_id": "67a1f5663f34a77b6dde914c",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "name": "Samsung Galaxy S23",
    "description": "The Samsung Galaxy S23 offers an all-encompassing mobile experience with its advanced AMOLED display, offering vibrant visuals and smooth interactions. Equipped with top-of-the-line fitness tracking features and cutting-edge technology, this phone delivers outstanding performance. With powerful hardware, a sleek design, and long battery life, the S23 is perfect for those who demand the best in mobile innovation.",
    "price": 899.99,
    "offerPrice": 799.99,
    "image": [
      "https://raw.githubusercontent.com/avinashdm/gs-images/main/quickcart/xjd4eprpwqs7odbera1w.webp"
    ],
    "category": "Smartphone",
    "date": 1738667366224,
    "__v": 0
  },
  {
    "_id": "67a1f5993f34a77b6dde914e",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "name": "Garmin Venu 2",
    "description": "The Garmin Venu 2 smartwatch blends advanced fitness tracking with sophisticated design, offering a wealth of features such as heart rate monitoring, GPS, and sleep tracking. Built with a 24-hour battery life, this watch is ideal for fitness enthusiasts and anyone looking to enhance their daily lifestyle. With a stunning AMOLED display and customizable watch faces, the Venu 2 combines technology with style seamlessly.",
    "price": 399.99,
    "offerPrice": 349.99,
    "image": [
      "https://raw.githubusercontent.com/avinashdm/gs-images/main/quickcart/hdfi4u3fmprazpnrnaga.webp"
    ],
    "category": "Earphone",
    "date": 1738667417511,
    "__v": 0
  },
  {
    "_id": "67a1f5ef3f34a77b6dde9150",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "name": "PlayStation 5",
    "description": "The PlayStation 5 takes gaming to the next level with ultra-HD graphics, a powerful 825GB SSD, and ray tracing technology for realistic visuals. Whether you're into high-action games or immersive storytelling, the PS5 delivers fast loading times, seamless gameplay, and stunning visuals. It's a must-have for any serious gamer looking for the ultimate gaming experience.",
    "price": 599.99,
    "offerPrice": 499.99,
    "image": [
      "https://raw.githubusercontent.com/avinashdm/gs-images/main/quickcart/dd3l13vfoartrgbvkkh5.webp"
    ],
    "category": "Accessories",
    "date": 1738667503075,
    "__v": 0
  },
  {
    "_id": "67a1f70c3f34a77b6dde9156",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "name": "Canon EOS R5",
    "description": "The Canon EOS R5 is a game-changing mirrorless camera with a 45MP full-frame sensor, offering ultra-high resolution and the ability to shoot 8K video. Whether you're capturing professional-quality stills or cinematic video footage, this camera delivers exceptional clarity, speed, and color accuracy. With advanced autofocus and in-body stabilization, the R5 is ideal for photographers and videographers alike.",
    "price": 4199.99,
    "offerPrice": 3899.99,
    "image": [
      "https://raw.githubusercontent.com/avinashdm/gs-images/main/quickcart/r5h370zuujvrw461c6wy.webp"
    ],
    "category": "Camera",
    "date": 1738667788883,
    "__v": 0
  },
  {
    "_id": "67a1f7c93f34a77b6dde915a",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "name": "MacBook Pro 16",
    "description": "The MacBook Pro 16, powered by Apple's M2 Pro chip, offers outstanding performance with 16GB RAM and a 512GB SSD. Whether you're editing high-resolution video, developing software, or multitasking with ease, this laptop can handle the toughest tasks. It features a stunning Retina display with True Tone technology, making it a top choice for professionals in creative industries or anyone who demands premium performance in a portable form.",
    "price": 2799.99,
    "offerPrice": 2499.99,
    "image": [
      "https://raw.githubusercontent.com/avinashdm/gs-images/main/quickcart/rzri7kytphxalrm9rubd.webp"
    ],
    "category": "Laptop",
    "date": 1738667977644,
    "__v": 0
  },
  {
    "_id": "67a1f8363f34a77b6dde915c",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "name": "Sony WF-1000XM5",
    "description": "Sony WF-1000XM5 true wireless earbuds deliver immersive sound with Hi-Res Audio and advanced noise cancellation technology. Designed for comfort and quality, they provide a stable, snug fit for a secure listening experience. Whether you're working out or traveling, these earbuds will keep you connected with the world around you while enjoying rich, clear sound.",
    "price": 349.99,
    "offerPrice": 299.99,
    "image": [
      "https://raw.githubusercontent.com/avinashdm/gs-images/main/quickcart/e3zjaupyumdkladmytke.webp"
    ],
    "category": "Earphone",
    "date": 1738668086331,
    "__v": 0
  },
  {
    "_id": "67a1f85e3f34a77b6dde915e",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "name": "Samsung Projector 4k",
    "description": "The Samsung 4K Projector offers an immersive cinematic experience with ultra-high-definition visuals and realistic color accuracy. Equipped with a built-in speaker, it delivers rich sound quality to complement its stunning 4K resolution. Perfect for movie nights, gaming, or presentations, this projector is the ultimate choice for creating an at-home theater experience or professional setting.",
    "price": 1699.99,
    "offerPrice": 1499.99,
    "image": [
      "https://raw.githubusercontent.com/avinashdm/gs-images/main/quickcart/qqdcly8a8vkyciy9g0bw.webp"
    ],
    "category": "Accessories",
    "date": 1738668126660,
    "__v": 0
  },
  {
    "_id": "67a1fa4b3f34a77b6dde9166",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "name": "ASUS ROG Zephyrus G16",
    "description": "The ASUS ROG Zephyrus G16 gaming laptop is powered by the Intel Core i9 processor and features an RTX 4070 GPU, delivering top-tier gaming and performance. With 16GB of RAM and a 1TB SSD, this laptop is designed for gamers who demand extreme power, speed, and storage. Equipped with a stunning 16-inch display, it's built to handle the most demanding titles and applications with ease.",
    "price": 2199.99,
    "offerPrice": 1999.99,
    "image": [
      "https://raw.githubusercontent.com/avinashdm/gs-images/main/quickcart/wig1urqgnkeyp4t2rtso.webp"
    ],
    "category": "Laptop",
    "date": 1738668619198,
    "__v": 0
  }
]

export const userDummyData = {
  "_id": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
  "name": "GreatStack",
  "email": "admin@example.com",
  "imageUrl": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ycnlnUnFiUDBYT2dEZ2h1ZmRXcGlpdWV5OXoiLCJyaWQiOiJ1c2VyXzJzWkZIUzFVSUl5c0p5RFZ6Q3BRaFVoVElodyJ9",
  "cartItems": {
    // "67a1f4e43f34a77b6dde9144": 3
  },
  "__v": 0
}

export const orderDummyData = [
  {
    "_id": "67a20934b3db72db5cc77b2b",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "items": [
      {
        "product": {
          "_id": "67a1f4e43f34a77b6dde9144",
          "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
          "name": "Apple AirPods Pro",
          "description": "Apple AirPods Pro (2nd Gen) with MagSafe Case (USB-C) provide excellent sound, active noise cancellation, and a comfortable fit. The USB-C case ensures quick charging, and they pair seamlessly with Apple devices for an effortless audio experience.",
          "price": 499.99,
          "offerPrice": 399.99,
          "image": [
            "https://res.cloudinary.com/djbvf02yt/image/upload/v1738667237/lrllaprpos2pnp5c9pyy.png",
            "https://res.cloudinary.com/djbvf02yt/image/upload/v1738667238/jqotgy2rvm36vfjv6lxl.png",
            "https://res.cloudinary.com/djbvf02yt/image/upload/v1738667238/niw7tqxvjsxt7wcehxeo.png",
            "https://res.cloudinary.com/djbvf02yt/image/upload/v1738667237/h8cq4x9cfzqzwaiarvpk.png"
          ],
          "category": "Earphone",
          "date": 1738667236865,
          "__v": 0
        },
        "quantity": 1,
        "_id": "67a20934b3db72db5cc77b2c"
      }
    ],
    "amount": 406.99,
    "address": {
      "_id": "67a1e4233f34a77b6dde9055",
      "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
      "fullName": "GreatStack",
      "phoneNumber": "0123456789",
      "pincode": 654321,
      "area": "Main Road , 123 Street, G Block",
      "city": "City",
      "state": "State",
      "__v": 0
    },
    "status": "Order Placed",
    "date": 1738672426822,
    "__v": 0
  },
  {
    "_id": "67a20949b3db72db5cc77b2e",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "items": [
      {
        "product": {
          "_id": "67a1f52e3f34a77b6dde914a",
          "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
          "name": "Bose QuietComfort 45",
          "description": "The Bose QuietComfort 45 headphones are engineered for exceptional sound quality and unparalleled noise cancellation. With a 24-hour battery life and comfortable, lightweight design, these headphones deliver premium audio for any environment. Whether on a flight, in the office, or at home, the Bose QC45 blocks out distractions, offering an immersive listening experience.",
          "price": 429.99,
          "offerPrice": 329.99,
          "image": [
            "https://res.cloudinary.com/djbvf02yt/image/upload/v1738667311/m16coelz8ivkk9f0nwrz.png"
          ],
          "category": "Headphone",
          "date": 1738667310300,
          "__v": 0
        },
        "quantity": 1,
        "_id": "67a20949b3db72db5cc77b2f"
      }
    ],
    "amount": 335.99,
    "address": {
      "_id": "67a1e4233f34a77b6dde9055",
      "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
      "fullName": "GreatStack",
      "phoneNumber": "0123456789",
      "pincode": 654321,
      "area": "Main Road , 123 Street, G Block",
      "city": "City",
      "state": "State",
      "__v": 0
    },
    "status": "Order Placed",
    "date": 1738672448031,
    "__v": 0
  },
  {
    "_id": "67a209bab3db72db5cc77b34",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "items": [
      {
        "product": {
          "_id": "67a1f4e43f34a77b6dde9144",
          "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
          "name": "Apple AirPods Pro",
          "description": "Apple AirPods Pro (2nd Gen) with MagSafe Case (USB-C) provide excellent sound, active noise cancellation, and a comfortable fit. The USB-C case ensures quick charging, and they pair seamlessly with Apple devices for an effortless audio experience.",
          "price": 499.99,
          "offerPrice": 399.99,
          "image": [
            "https://res.cloudinary.com/djbvf02yt/image/upload/v1738667237/lrllaprpos2pnp5c9pyy.png",
            "https://res.cloudinary.com/djbvf02yt/image/upload/v1738667238/jqotgy2rvm36vfjv6lxl.png",
            "https://res.cloudinary.com/djbvf02yt/image/upload/v1738667238/niw7tqxvjsxt7wcehxeo.png",
            "https://res.cloudinary.com/djbvf02yt/image/upload/v1738667237/h8cq4x9cfzqzwaiarvpk.png"
          ],
          "category": "Earphone",
          "date": 1738667236865,
          "__v": 0
        },
        "quantity": 1,
        "_id": "67a209bab3db72db5cc77b35"
      }
    ],
    "amount": 406.99,
    "address": {
      "_id": "67a1e4233f34a77b6dde9055",
      "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
      "fullName": "GreatStack",
      "phoneNumber": "0123456789",
      "pincode": 654321,
      "area": "Main Road , 123 Street, G Block",
      "city": "City",
      "state": "State",
      "__v": 0
    },
    "status": "Order Placed",
    "date": 1738672560698,
    "__v": 0
  }
]

export const addressDummyData = [
  {
    "_id": "67a1e4233f34a77b6dde9055",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "fullName": "GreatStack",
    "phoneNumber": "0123456789",
    "pincode": 654321,
    "area": "Main Road , 123 Street, G Block",
    "city": "City",
    "state": "State",
    "__v": 0
  }
]