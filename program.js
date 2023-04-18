(async () => {
  const fetch = await import('node-fetch').then((module) => module.default);

  async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  async function createCategoryData(products) {

    const categories = {};
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (!categories[product.category]) {
        categories[product.category] = 0;
      }
      categories[product.category] += product.price;
    }
    return categories;    
  }

  async function findHighestCartValue(carts, users, products) {

    let cartValue = 0;
    let maxCartValue = 0;
    let cartOwner = "";
    let maxCartOwner = "";

    for (let i = 0; i < carts.length; i++) {
      const cartProducts = carts[i].products;
      cartOwner = users.find((u) => u.id === carts[i].id);
      for (let j = 0; j < cartProducts.length; j++) {
        const productId = cartProducts[j].productId;
        const quantity = cartProducts[j].quantity;
        const product = products.find((p) => p.id === productId);
        cartValue += product.price * quantity;
      }
      if(maxCartValue < cartValue){ 
        maxCartValue = cartValue; 
        maxCartOwner = cartOwner;
      }
    }

    maxCart = ["Owner : " + maxCartOwner.name.firstname + " " + maxCartOwner.name.lastname, "Value : " + maxCartValue];
    return maxCart;
  }

  async function findFarthestUsers(users) {

    let maxDistance = 0;
    let farthestUsers = [];
    for (let i = 0; i < users.length - 1; i++) {
      for (let j = i + 1; j < users.length; j++) {
        const lat1 = users[i].address.geolocation.lat;
        const long1 = users[i].address.geolocation.long;
        const lat2 = users[j].address.geolocation.lat;
        const long2 = users[j].address.geolocation.long;

        if (lat1 && long1 && lat2 && long2) {
          const distance = Math.acos(Math.sin(lat1)*Math.sin(lat2)+Math.cos(lat1)*Math.cos(lat2)*Math.cos(long2-long1))*6371
          if (maxDistance < distance) {
            maxDistance = distance;
            farthestUsers = ["User 1 : " + users[i].name.firstname + " " + users[i].name.lastname, 
            "User 2 : " + users[j].name.firstname + " " + users[j].name.lastname];
          }
        }  
      }
    }

    return farthestUsers;
  }

  const carts = await fetchData("https://fakestoreapi.com/carts/?startdate=2000-01-01&enddate=2023-04-07");
  const users = await fetchData("https://fakestoreapi.com/users");
  const products = await fetchData("https://fakestoreapi.com/products");

  const categories = await createCategoryData(products);
  console.log("Categories:", categories);

  const highestCartValue = await findHighestCartValue(carts, users, products);
  console.log("Highest Cart Value:", highestCartValue);

  const farthestUsers = await findFarthestUsers(users);
  console.log("Farthest Users:", farthestUsers);
})();