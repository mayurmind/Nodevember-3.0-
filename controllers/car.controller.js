import Car from '../models/carmodel.js';

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
const getCars = async (req, res) => {
  try {
    const cars = await Car.find({}).sort({ createdAt: -1 });
    
    res.json({
      message: "Cars retrieved successfully",
      cars,
      count: cars.length
    });
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json({
      message: "Car retrieved successfully",
      car
    });
  } catch (error) {
    console.error('Get car error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a car
// @route   POST /api/cars
// @access  Private/Admin
const createCar = async (req, res) => {
  try {
    const { make, model, year, price, mileage, fuelType, transmission, color, description } = req.body;

    const car = new Car({
      make,
      model,
      year,
      price,
      mileage: mileage || 0,
      fuelType: fuelType || 'Petrol',
      transmission: transmission || 'Manual',
      color: color || 'White',
      description,
      user: req.user.id
    });

    const createdCar = await car.save();
    
    res.status(201).json({
      message: "Car created successfully",
      car: createdCar
    });
  } catch (error) {
    console.error('Create car error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private/Admin
const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Update fields
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      car[key] = updates[key];
    });

    const updatedCar = await car.save();
    
    res.json({
      message: "Car updated successfully",
      car: updatedCar
    });
  } catch (error) {
    console.error('Update car error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    await Car.deleteOne({ _id: req.params.id });
    
    res.json({ message: "Car removed successfully" });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { getCars, getCarById, createCar, updateCar, deleteCar };