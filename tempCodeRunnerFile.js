const fetch = await import('node-fetch');

// Function to fetch data from an API endpoint
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Function to calculate distance between two coordinates in kilometers
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

async function main() {
  // Retrieve user, product, and shopping cart data
  const [users, products, carts] = await Promise.all([
    fetchData("https://fakestoreapi.com/users"),
    fetchData("https://fakestoreapi.com/products"),
    fetchData("https://fakestoreapi.com/carts/?startdate=2000-01-01&enddate=2023-04-07"),
  ]);

  // Create a data structure containing all available product categories and the total value of products of a given category
  const categories = {};
  products.forEach((product) => {
    if (!categories[product.category]) {
      categories[product.category] = 0;
    }
    categories[product.category] += product.price;
  });
  console.log("Categories:", categories);

  // Find a cart with the highest value, determine its value and full name of its owner
  let maxCartValue = 0;
  let maxCartOwner = "";
  carts.forEach((cart) => {
    const cartValue = cart.products.reduce((acc, productId) => {
      const product = products.find((p) => p.id === productId);
      return acc + product.price;
    }, 0);
    if (cartValue > maxCartValue) {
      maxCartValue = cartValue;
      const owner = users.find((user) => user.id === cart.userId);
      maxCartOwner = owner.firstName + " " + owner.lastName;
    }
  });
  console.log("Max cart value:", maxCartValue);
  console.log("Max cart owner:", maxCartOwner);

  // Find the two users living furthest away from each other
  let maxDistance = 0;
  let furthestUsers = [];
  for (let i = 0; i < users.length - 1; i++) {
    for (let j = i + 1; j < users.length; j++) {
      const distance = calculateDistance(
        users[i].address.geo.lat,
        users[i].address.geo.lng,
        users[j].address.geo.lat,
        users[j].address.geo.lng
      );
      if (distance > maxDistance) {
        maxDistance = distance;
        furthestUsers = [users[i], users[j]];
      }
    }
  }
  console.log("Furthest users:", furthestUsers);
}