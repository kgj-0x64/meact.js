/**
 * Any JavaScript class with properties and methods can be rewritten without using class syntax,
 * using object representation and functions instead.
 *
 * This is because JavaScript classes are primarily syntactic sugar
 * over the existing prototype-based inheritance system.
 */

// Class-based syntax
class Vehicle {
  constructor(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
    this._mileage = 0;
  }

  get mileage() {
    return this._mileage;
  }

  set mileage(value) {
    if (value >= 0) {
      this._mileage = value;
    } else {
      throw new Error("Mileage cannot be negative");
    }
  }

  getInfo() {
    return `${this.year} ${this.make} ${this.model}`;
  }

  static compareVehicles(vehicle1, vehicle2) {
    if (vehicle1.year !== vehicle2.year) {
      return vehicle1.year - vehicle2.year;
    }
    return vehicle1.make.localeCompare(vehicle2.make);
  }
}

class Car extends Vehicle {
  constructor(make, model, year, numDoors) {
    super(make, model, year);
    this.numDoors = numDoors;
  }

  getInfo() {
    return `${super.getInfo()} - ${this.numDoors} doors`;
  }
}

/**
 * Instead of using a constructor method within a class,
 * we define a function (createVehicle) that creates and
 * returns an object with the desired properties and methods.
 */

// Equivalent using object representation and functions
function createVehicle(make, model, year) {
  let _mileage = 0;

  const vehicle = {
    make,
    model,
    year,

    /**
     * We can still use getter and setter syntax in the object literal.
     */

    get mileage() {
      return _mileage;
    },
    set mileage(value) {
      if (value >= 0) {
        _mileage = value;
      } else {
        throw new Error("Mileage cannot be negative");
      }
    },

    /**
     * Instead of defining methods within the class body,
     * we add them as properties of the object returned by the constructor function.
     */

    getInfo() {
      return `${this.year} ${this.make} ${this.model}`;
    },
  };

  return vehicle;
}

/**
 * Static methods like compareVehicles are simply defined as standalone functions.
 */

function compareVehicles(vehicle1, vehicle2) {
  if (vehicle1.year !== vehicle2.year) {
    return vehicle1.year - vehicle2.year;
  }
  return vehicle1.make.localeCompare(vehicle2.make);
}

/**
 * To mimic inheritance, we create a new function (createCar)
 * that calls the parent function (createVehicle)
 * and then extends or modifies the resulting object.
 * This is a form of composition rather than true inheritance.
 */

function createCar(make, model, year, numDoors) {
  const car = createVehicle(make, model, year);
  car.numDoors = numDoors;

  /**
   * To override methods, we store the parent method and define a new method
   * that calls the parent method using call to set the correct this context.
   */

  const vehicleGetInfo = car.getInfo;
  car.getInfo = function () {
    return `${vehicleGetInfo.call(this)} - ${this.numDoors} doors`;
  };

  return car;
}

// Usage
const classVehicle = new Vehicle("Toyota", "Camry", 2022);
classVehicle.mileage = 5000;
console.log(classVehicle.getInfo());
console.log(classVehicle.mileage);

const classCar = new Car("Honda", "Civic", 2023, 4);
console.log(classCar.getInfo());

const objectVehicle = createVehicle("Toyota", "Camry", 2022);
objectVehicle.mileage = 5000;
console.log(objectVehicle.getInfo());
console.log(objectVehicle.mileage);

const objectCar = createCar("Honda", "Civic", 2023, 4);
console.log(objectCar.getInfo());

console.log(Vehicle.compareVehicles(classVehicle, classCar));
console.log(compareVehicles(objectVehicle, objectCar));
