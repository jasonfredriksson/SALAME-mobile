// Define the product type to include all properties
export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  location: string;
  postedTime: string;
  fastShipping: boolean;
  securePayment: boolean;
  sellerId: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    totalSales: number;
    reputationBadge?: string;
  };
  isNew: boolean;
  minOfferPrice?: number;
  condition?: string;
}

export const mockUser = {
  id: 'user-1',
  name: 'Lucía Fernández',
  email: 'lucia@example.com',
  avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=600',
  location: 'Capital Federal, Buenos Aires',
  rating: 4.8,
  soldItems: 24,
  boughtItems: 15,
  favorites: ['product-2', 'product-5'],
  totalSales: 24,
  reputationBadge: 'Gran Salame',
};

export const mockProducts = [
  {
    id: 'product-1',
    title: 'Campera de Cuero Vintage',
    price: 45000,
    description: 'Campera de cuero genuino en excelente estado. Talle M, levemente usada pero sin daños. Perfecta para el otoño. Solo entrego en zona Palermo.',
    images: [
      'https://images.pexels.com/photos/2887766/pexels-photo-2887766.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/6770027/pexels-photo-6770027.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/6046220/pexels-photo-6046220.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'clothing',
    location: 'Palermo, Buenos Aires',
    postedTime: 'hace 2 días',
    fastShipping: true,  // Envío 24h
    securePayment: true, // Pago seguro por MercadoPago
    sellerId: 'user-2',
    seller: {
      id: 'user-2',
      name: 'Martín Rodríguez',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.6,
      totalSales: 17,
      reputationBadge: 'Picado Fino'
    },
    isNew: true
  },
  {
    id: 'product-2',
    title: 'iPhone 13 Pro - 256GB',
    price: 550000,
    description: 'iPhone 13 Pro color grafito con 256GB de almacenamiento. Comprado el año pasado, en perfecto estado sin rayones. Salud de batería al 92%. Viene con cargador y caja originales.',
    images: [
      'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'electronics',
    location: 'Córdoba Capital, Córdoba',
    postedTime: 'hace 1 semana',
    fastShipping: true,   // Envío 24h
    securePayment: true,  // Pago seguro por MercadoPago
    sellerId: 'user-3',
    seller: {
      id: 'user-3',
      name: 'Ana Gómez',
      avatar: 'https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.9,
      totalSales: 32,
      reputationBadge: 'Gran Salame'
    }
  },
  {
    id: 'product-3',
    title: 'Mesa de Comedor con 4 Sillas',
    price: 120000,
    description: 'Mesa de comedor de madera maciza con 4 sillas a juego. Dimensiones de la mesa: 150cm x 90cm. Algunos rasguños menores en la superficie, pero en general en buen estado. Se debe retirar por domicilio, no hacemos envíos.',
    images: [
      'https://images.pexels.com/photos/6207809/pexels-photo-6207809.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/6207827/pexels-photo-6207827.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/6207759/pexels-photo-6207759.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'home',
    location: 'Rosario, Santa Fe',
    postedTime: 'hace 3 días',
    fastShipping: false,  // No disponible para este producto
    securePayment: true,  // Pago seguro por MercadoPago
    sellerId: 'user-4',
    seller: {
      id: 'user-4',
      name: 'Gabriel López',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.7,
      totalSales: 8,
      reputationBadge: 'Picado Fino'
    }
  },
  {
    id: 'product-4',
    title: 'Bicicleta Montaña - Venzo',
    price: 190000,
    description: 'Bicicleta de montaña Venzo, modelo 2022. Rodado 29, 24 velocidades, frenos a disco hidráulicos. Recientemente se cambió cadena y pastillas de freno. Excelente estado general con algo de desgaste normal.',
    images: [
      'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2158963/pexels-photo-2158963.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'sports',
    location: 'Mendoza Capital, Mendoza',
    postedTime: 'hace 5 días',
    sellerId: 'user-5',
    seller: {
      id: 'user-5',
      name: 'Carolina Vázquez',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.5,
      totalSales: 11
    },
    isNew: true
  },
  {
    id: 'product-5',
    title: 'Nintendo Switch con Juegos',
    price: 220000,
    description: 'Consola Nintendo Switch (modelo más reciente) con base de carga, todos los cables y dos controles Joy-Con. También incluye 3 juegos: Mario Kart 8, Zelda BOTW y Animal Crossing. Todo funciona perfectamente.',
    images: [
      'https://images.pexels.com/photos/371924/pexels-photo-371924.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'electronics',
    location: 'Mar del Plata, Buenos Aires',
    postedTime: 'hace 1 día',
    sellerId: 'user-6',
    seller: {
      id: 'user-6',
      name: 'Alejandro Martínez',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 5.0,
      totalSales: 21
    },
    minOfferPrice: 200000,
    condition: 'Excelente'
  },
  {
    id: 'product-6',
    title: 'Colección de Discos de Vinilo Clásicos',
    price: 75000,
    description: 'Colección de 25 discos de vinilo clásicos de los años 70 y 80. Incluye álbumes de Soda Stereo, Charly García, Luis Alberto Spinetta, Queen y más. Todos en buenas condiciones con mínimas marcas de uso.',
    images: [
      'https://images.pexels.com/photos/3104587/pexels-photo-3104587.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3972359/pexels-photo-3972359.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'other',
    location: 'Palermo, Buenos Aires',
    postedTime: 'hace 4 días',
    sellerId: 'user-1',
    seller: {
      id: 'user-1',
      name: 'Lucía Fernández',
      avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.8,
      totalSales: 24
    },
    minOfferPrice: 65000,
    condition: 'Usado'
  },
  // Productos adicionales por categoría - Electrónica
  {
    id: 'product-7',
    title: 'Laptop Lenovo ThinkPad X1',
    price: 480000,
    description: 'Laptop Lenovo ThinkPad X1 Carbon, Intel Core i7, 16GB RAM, 512GB SSD. Excelente estado. La batería dura 6+ horas. Incluye cargador original.',
    images: [
      'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/129208/pexels-photo-129208.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/705164/computer-laptop-work-place-camera-705164.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'electronics',
    location: 'Recoleta, Buenos Aires',
    postedTime: 'hace 5 días',
    fastShipping: true,
    securePayment: true,
    sellerId: 'user-4',
    seller: {
      id: 'user-4',
      name: 'Gabriel López',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.7,
      totalSales: 8,
      reputationBadge: 'Picado Fino'
    }
  },
  
  // Productos adicionales por categoría - Moda
  {
    id: 'product-8',
    title: 'Zapatillas Nike Air Max',
    price: 85000,
    description: 'Zapatillas Nike Air Max originales, talle 42, color negro con detalles blancos. Nuevas en caja, sin uso.',
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'clothing',
    location: 'Belgrano, Buenos Aires',
    postedTime: 'hace 1 día',
    fastShipping: true,
    securePayment: true,
    sellerId: 'user-5',
    seller: {
      id: 'user-5',
      name: 'Carolina Vázquez',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.5,
      totalSales: 11,
      reputationBadge: 'Gran Salame'
    },
    isNew: true
  },
  
  // Productos adicionales por categoría - Hogar
  {
    id: 'product-9',
    title: 'Lámpara de Pie Moderna',
    price: 42000,
    description: 'Lámpara de pie moderna estilo nórdico. Base de madera y pantalla de tela beige. Altura 1.65m. Perfecta para sala de estar o dormitorio.',
    images: [
      'https://images.pexels.com/photos/2082090/pexels-photo-2082090.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'home',
    location: 'Palermo, Buenos Aires',
    postedTime: 'hace 6 días',
    fastShipping: false,
    securePayment: true,
    sellerId: 'user-3',
    seller: {
      id: 'user-3',
      name: 'Ana Gómez',
      avatar: 'https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.9,
      totalSales: 32,
      reputationBadge: 'Gran Salame'
    }
  },
  
  // Productos adicionales por categoría - Deporte
  {
    id: 'product-10',
    title: 'Raqueta de Tenis Wilson',
    price: 65000,
    description: 'Raqueta de tenis Wilson Pro Staff 97, empuñadura L3. Usada 5 veces, como nueva. Incluye funda original.',
    images: [
      'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2553533/pexels-photo-2553533.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'sports',
    location: 'Vicente López, Buenos Aires',
    postedTime: 'hace 2 días',
    fastShipping: true,
    securePayment: true,
    sellerId: 'user-6',
    seller: {
      id: 'user-6',
      name: 'Alejandro Martínez',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 5.0,
      totalSales: 21,
      reputationBadge: 'Gran Salame'
    }
  }
];

// Mock notifications for the user
export const mockNotifications = [
  {
    id: 'notif-1',
    type: 'offer',
    title: 'Nueva oferta recibida',
    message: 'Has recibido una oferta de $40000 por tu Campera de Cuero Vintage',
    timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
    read: false,
    relatedId: 'product-1',
    relatedImage: 'https://images.pexels.com/photos/2887766/pexels-photo-2887766.jpeg?auto=compress&cs=tinysrgb&w=600',
    fromUser: {
      id: 'user-5',
      name: 'Carolina Vázquez',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  },
  {
    id: 'notif-2',
    type: 'message',
    title: 'Nuevo mensaje',
    message: 'Ana Gómez: ¡Perfecto! Nos vemos mañana a las 3pm.',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    read: true,
    relatedId: 'conv-2',
    relatedImage: 'https://images.pexels.com/photos/6770027/pexels-photo-6770027.jpeg?auto=compress&cs=tinysrgb&w=600',
    fromUser: {
      id: 'user-3',
      name: 'Ana Gómez',
      avatar: 'https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  },
  {
    id: 'notif-3',
    type: 'sale',
    title: '¡Venta completada!',
    message: 'Tu producto "iPhone 13 Pro" ha sido marcado como vendido',
    timestamp: new Date(Date.now() - 5400 * 60000).toISOString(),
    read: true,
    relatedId: 'product-2',
    relatedImage: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Promoción especial',
    message: 'Publica 3 productos esta semana y obtén un 50% de descuento en destacados',
    timestamp: new Date(Date.now() - 8640 * 60000).toISOString(),
    read: false,
    relatedId: null,
    relatedImage: 'https://images.pexels.com/photos/6770027/pexels-photo-6770027.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'notif-5',
    type: 'offer_accepted',
    title: 'Oferta aceptada',
    message: 'Martín Rodríguez ha aceptado tu oferta por la Bicicleta Montaña',
    timestamp: new Date(Date.now() - 720 * 60000).toISOString(),
    read: false,
    relatedId: 'product-4',
    relatedImage: 'https://images.pexels.com/photos/2158963/pexels-photo-2158963.jpeg?auto=compress&cs=tinysrgb&w=600',
    fromUser: {
      id: 'user-2',
      name: 'Martín Rodríguez',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  },
];

// Mock user offers (both sent and received)
export const mockOffers = [
  {
    id: 'offer-1',
    type: 'sent',
    product: {
      id: 'product-4',
      title: 'Bicicleta Montaña - Venzo',
      price: 190000,
      image: 'https://images.pexels.com/photos/2158963/pexels-photo-2158963.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    seller: {
      id: 'user-5',
      name: 'Carolina Vázquez',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    offerPrice: 170000,
    offerDate: new Date(Date.now() - 2880 * 60000).toISOString(),
    status: 'accepted',
    message: 'Me interesa la bicicleta pero necesito que me la guardes hasta el fin de semana.'
  },
  {
    id: 'offer-2',
    type: 'received',
    product: {
      id: 'product-1',
      title: 'Campera de Cuero Vintage',
      price: 45000,
      image: 'https://images.pexels.com/photos/2887766/pexels-photo-2887766.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    buyer: {
      id: 'user-3',
      name: 'Ana Gómez',
      avatar: 'https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    offerPrice: 40000,
    offerDate: new Date(Date.now() - 35 * 60000).toISOString(),
    status: 'pending',
    message: 'Hola! Te ofrezco $40000 si me la guardas hasta el viernes.'
  },
  {
    id: 'offer-3',
    type: 'sent',
    product: {
      id: 'product-10',
      title: 'Raqueta de Tenis Wilson',
      price: 65000,
      image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    seller: {
      id: 'user-6',
      name: 'Alejandro Martínez',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    offerPrice: 55000,
    offerDate: new Date(Date.now() - 1440 * 60000).toISOString(),
    status: 'rejected',
    message: 'Te ofrezco $55000 en efectivo, la puedo ir a buscar hoy mismo.'
  },
  {
    id: 'offer-4',
    type: 'received',
    product: {
      id: 'product-6',
      title: 'Colección de Discos de Vinilo Clásicos',
      price: 75000,
      image: 'https://images.pexels.com/photos/4644812/pexels-photo-4644812.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    buyer: {
      id: 'user-4',
      name: 'Gabriel López',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    offerPrice: 65000,
    offerDate: new Date(Date.now() - 500 * 60000).toISOString(),
    status: 'pending',
    message: 'Hola! Me interesa tu colección de vinilos. Te ofrezco $65000 si me los puedes enviar.'
  },
];

export const mockConversations = [
  {
    id: 'conv-1',
    user: {
      id: 'user-2',
      name: 'Martín Rodríguez',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    product: {
      id: 'product-1',
      title: 'Campera de Cuero Vintage'
    },
    lastMessage: {
      text: '¿La campera todavía está disponible?',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      senderId: 'user-2'
    },
    unread: 1,
    messages: [
      {
        id: 'msg-1',
        text: 'Hola, vi tu campera de cuero vintage. ¿Todavía está disponible?',
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
        senderId: 'user-2',
        isRead: true
      },
      {
        id: 'msg-2',
        text: '¡Sí, todavía está disponible! ¿Estás interesado?',
        timestamp: new Date(Date.now() - 110 * 60000).toISOString(),
        senderId: 'user-1',
        isRead: true
      },
      {
        id: 'msg-3',
        text: '¡Genial! ¿La dejarías en $40.000?',
        timestamp: new Date(Date.now() - 100 * 60000).toISOString(),
        senderId: 'user-2',
        isRead: true
      },
      {
        id: 'msg-4',
        text: 'Te la puedo dejar en $42.000, está en muy buen estado.',
        timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
        senderId: 'user-1',
        isRead: true
      },
      {
        id: 'msg-5',
        text: 'Dale, me sirve. ¿Cuándo y dónde nos podemos encontrar?',
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        senderId: 'user-2',
        isRead: true
      },
      {
        id: 'msg-6',
        text: '¿Qué tal en el centro cerca del café en la Avenida Principal? ¿Mañana a las 5pm?',
        timestamp: new Date(Date.now() - 55 * 60000).toISOString(),
        senderId: 'user-1',
        isRead: true
      },
      {
        id: 'msg-7',
        text: '¿La campera todavía está disponible?',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        senderId: 'user-2',
        isRead: false
      }
    ]
  },
  {
    id: 'conv-2',
    user: {
      id: 'user-3',
      name: 'Ana Gómez',
      avatar: 'https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    product: {
      id: 'product-6',
      title: 'Colección de Discos de Vinilo Clásicos'
    },
    lastMessage: {
      text: '¡Perfecto! Nos vemos mañana a las 3pm.',
      timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
      senderId: 'user-1'
    },
    unread: 0,
    messages: [
      {
        id: 'msg-1',
        text: '¡Hola! ¿Estos discos de vinilo todavía están disponibles?',
        timestamp: new Date(Date.now() - 1440 * 60000).toISOString(),
        senderId: 'user-3',
        isRead: true
      },
      {
        id: 'msg-2',
        text: '¡Sí, lo están! ¿Estás interesada en toda la colección?',
        timestamp: new Date(Date.now() - 1430 * 60000).toISOString(),
        senderId: 'user-1',
        isRead: true
      },
      {
        id: 'msg-3',
        text: '¡Definitivamente! Colecciono vinilos clásicos. ¿Puedo ver una lista de todos los álbumes?',
        timestamp: new Date(Date.now() - 1420 * 60000).toISOString(),
        senderId: 'user-3',
        isRead: true
      },
      {
        id: 'msg-4',
        text: 'Claro, te enviaré fotos de todas las portadas de los álbumes más tarde hoy.',
        timestamp: new Date(Date.now() - 1410 * 60000).toISOString(),
        senderId: 'user-1',
        isRead: true
      },
      {
        id: 'msg-5',
        text: '¿Podemos encontrarnos mañana por la tarde si te funciona?',
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        senderId: 'user-3',
        isRead: true
      },
      {
        id: 'msg-6',
        text: '¡Mañana funciona! ¿Qué tal a las 3pm en la tienda de discos del centro?',
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        senderId: 'user-1',
        isRead: true
      },
      {
        id: 'msg-7',
        text: '¡Perfecto! Nos vemos mañana a las 3pm.',
        timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
        senderId: 'user-1',
        isRead: true
      }
    ]
  },
  {
    id: 'conv-3',
    user: {
      id: 'user-5',
      name: 'Carolina Vázquez',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    product: {
      id: 'product-2',
      title: 'iPhone 13 Pro - 256GB'
    },
    lastMessage: {
      text: '¿Estarías dispuesto a enviarlo si pago extra?',
      timestamp: new Date(Date.now() - 720 * 60000).toISOString(),
      senderId: 'user-5'
    },
    unread: 2,
    messages: [
      {
        id: 'msg-1',
        text: 'Hola, ¿el iPhone todavía está disponible?',
        timestamp: new Date(Date.now() - 2880 * 60000).toISOString(),
        senderId: 'user-5',
        isRead: true
      },
      {
        id: 'msg-2',
        text: '¡Sí, lo está!',
        timestamp: new Date(Date.now() - 2870 * 60000).toISOString(),
        senderId: 'user-1',
        isRead: true
      },
      {
        id: 'msg-3',
        text: '¿Cuál es el precio más bajo que aceptarías?',
        timestamp: new Date(Date.now() - 2860 * 60000).toISOString(),
        senderId: 'user-5',
        isRead: true
      },
      {
        id: 'msg-4',
        text: 'Podría dejarlo en $530000 si puedes recogerlo esta semana.',
        timestamp: new Date(Date.now() - 2850 * 60000).toISOString(),
        senderId: 'user-1',
        isRead: true
      },
      {
        id: 'msg-5',
        text: 'Vivo fuera de la ciudad. ¿Estarías dispuesto a enviarlo si pago extra?',
        timestamp: new Date(Date.now() - 720 * 60000).toISOString(),
        senderId: 'user-5',
        isRead: false
      },
      {
        id: 'msg-6',
        text: '¿También viene con AppleCare+?',
        timestamp: new Date(Date.now() - 715 * 60000).toISOString(),
        senderId: 'user-5',
        isRead: false
      }
    ]
  }
];