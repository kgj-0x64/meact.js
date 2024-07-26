/**
 * Prototype-based inheritance in JavaScript means that
 * objects can inherit properties and methods directly from other objects.
 *
 * Each object has an internal link to another object called its prototype.
 * Each object has a [[Prototype]]
 * (accessible via Object.getPrototypeOf() or the __proto__ property)
 * that points to its prototype object.
 *
 * When a property or method is accessed on an object,
 * JavaScript first looks on the object itself, then on its prototype,
 * then on the prototype's prototype, and so on up the chain,
 * forming what's called the prototype chain.
 */

// Vehicle constructor function
function Vehicle(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
  this._mileage = 0;
}

/**
 *  When you create a function, JavaScript automatically creates a prototype object for it
 * and sets the constructor property of that prototype to point back to the function.
 */

// Explicitly set the constructor (best practice)
Vehicle.prototype.constructor = Vehicle;

// Adding methods to Vehicle.prototype
Vehicle.prototype.getMileage = function () {
  return this._mileage;
};

Vehicle.prototype.setMileage = function (value) {
  if (value >= 0) {
    this._mileage = value;
  } else {
    throw new Error("Mileage cannot be negative");
  }
};

Vehicle.prototype.getInfo = function () {
  return `${this.year} ${this.make} ${this.model}`;
};

// Static method
Vehicle.compareVehicles = function (vehicle1, vehicle2) {
  if (vehicle1.year !== vehicle2.year) {
    return vehicle1.year - vehicle2.year;
  }
  return vehicle1.make.localeCompare(vehicle2.make);
};

// Car constructor function
function Car(make, model, year, numDoors) {
  // Call the parent constructor
  Vehicle.call(this, make, model, year);
  this.numDoors = numDoors;
}

// Set up prototype chain
// Overwrite the entire prototype object
Car.prototype = Object.create(Vehicle.prototype);
// Set the constructor
Car.prototype.constructor = Car;

/**
 * This new method will be found before the one on Vehicle.prototype
 * when called on a Car instance.
 */

// Override getInfo method
Car.prototype.getInfo = function () {
  return `${Vehicle.prototype.getInfo.call(this)} - ${this.numDoors} doors`;
};

// Usage
const vehicle = new Vehicle("Toyota", "Camry", 2022);
vehicle.setMileage(5000);
console.log(vehicle.getInfo());
console.log(vehicle.getMileage());

const car = new Car("Honda", "Civic", 2023, 4);
console.log(car.getInfo());
console.log(car.getMileage()); // Inherited from Vehicle

console.log(Vehicle.compareVehicles(vehicle, car));

/**
 * The instanceof operator works by checking the prototype chain.
 */

console.log(car instanceof Car); // true
console.log(car instanceof Vehicle); // true
