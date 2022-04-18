const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
//Add middleware and handlers for dishes to this file, then export the functions for use by the router.

function bodyDataHas(propertyName) {
  return (req, res, next) => {
    const { data = {} } = req.body;
    const value = data[propertyName]; // data[name]

    if(value) {
      return next();
    }
    next({
      status: 400,
      message: `Dish must include a ${propertyName}`,
    });
  }
}

const bodyHasNameProperty = bodyDataHas("name");
const bodyHasDescriptionProperty = bodyDataHas("description");
const bodyHasImageUrlProperty = bodyDataHas("image_url");

function bodyHasPriceProperty(req, res, next) {
  const { data: { price } = {} } = req.body;
  if (Number.isInteger(price) && price > 0 ) {
    return next();
  }
  next({
    status: 400,
    message: `Dish must have a price that is an integer greater than 0`,
  });
}
  
function doesDishIdMatchRouteId (req, res, next){
  const dishId = req.params.dishId;
  const { id } = req.body.data
  // const dishId = res.locals.dish.id
  // const {data: {id} = {} } = req.body

  if(!id || id === dishId) {
    return next();
  }
  next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
  })
  // if(id){
  //   if(id === dishId){
  //     return next()
  //   }else{
  //     return next({
  //         status: 400,
  //         message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
  //     })
  //   }
  // }else{
  //     return next()
  // }
}
  // function bodyHasNameProperty(req, res, next) {
  //   const { data: { name } = {} } = req.body;
  //   if (name && name.length > 0) {
  //     return next();
  //   }
  //   next({
  //     status: 400,
  //     message: "A 'name' property is required.",
  //   });
  // }
  
  // function bodyHasImageProperty(req, res, next) {
  //   const { data: { image_url } = {} } = req.body;
  //   if (image_url && image_url.length > 0) {
  //     return next();
  //   }
  //   next({
  //     status: 400,
  //     message: "An 'image_url' property is required.",
  //   });
  // }
  
  // function bodyHasDescriptionProperty(req, res, next) {
  //   const { data: { description } = {} } = req.body;
  //   if (description && description.length > 0) {
  //     return next();
  //   }
  //   next({
  //     status: 400,
  //     message: "A 'description' property is required.",
  //   });
  // }
  
//Handlers:
function create(req, res) {
  const dish = req.body.data;
  dish.id = nextId();
  dishes.push(dish);
  res.status(201).json({ data: dish });

  // const { data: { name, description, price, image_url } = {} } = req.body;
  // const newDish = {
  //   id: nextId(),
  //   name,
  //   description,
  //   price,
  //   image_url
  // };
}

function dishExists(req, res, next) {
  const dishId = req.params.dishId;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish does not exist: ${req.params.dishId}`,
  });
}

function list(req, res) {
  res.json({data: dishes})
}
  
function read(req, res) {
  // const dish = response.locals.dish;
  res.json({ data: res.locals.dish });
}
  
function update(req, res) {
  const { id } = res.locals.dish;
  
  Object.assign(
    res.locals.dish,
    req.body.data,
    { id }
  );

  res.json({ data: res.locals.dish });
  // const { data: { name, description, price, image_url } = {} } = req.body;

  // dish.name = name;
  // dish.description = description;
  // dish.price = price;
  // dish.image_url = image_url;
}
     
module.exports = {
    create: [
      bodyHasNameProperty, 
      bodyHasDescriptionProperty, 
      bodyHasPriceProperty, 
      bodyHasImageUrlProperty, 
      create
    ],
    list,
    read: [dishExists, read],
    update: [
      dishExists, 
      doesDishIdMatchRouteId, 
      bodyHasNameProperty, 
      bodyHasDescriptionProperty, 
      bodyHasPriceProperty, 
      bodyHasImageUrlProperty, 
      update,
    ]
  }