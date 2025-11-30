import Order from '../models/order.model.js';
import Car from '../models/carmodel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { carId, paymentMethod, deliveryAddress, contactInfo } = req.body;

    const car = await Car.findById(carId);
    
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    if (car.sold) {
      return res.status(400).json({ message: "Car is already sold" });
    }

    const order = new Order({
      user: req.user.id,
      car: carId,
      orderAmount: car.price,
      paymentMethod,
      deliveryAddress,
      contactInfo
    });

    const createdOrder = await order.save();
    
    // Mark car as sold
    car.sold = true;
    car.inStock = false;
    await car.save();

    res.status(201).json({
      message: "Order created successfully",
      order: createdOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('car', 'make model year price images')
      .sort({ createdAt: -1 });

    res.json({
      message: "Orders retrieved successfully",
      orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('car', 'make model year price')
      .sort({ createdAt: -1 });

    res.json({
      message: "All orders retrieved successfully",
      orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('car', 'make model year price images color fuelType transmission');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order retrieved successfully",
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrder = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = orderStatus || order.orderStatus;
    order.paymentStatus = paymentStatus || order.paymentStatus;

    const updatedOrder = await order.save();
    
    res.json({
      message: "Order updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { createOrder, getMyOrders, getOrders, getOrderById, updateOrder };