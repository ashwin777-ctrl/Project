import User from '../models/User.js';
import Item from '../models/Item.js';

export const getUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
};

export const getAllItemsAdmin = async (req, res) => {
  const items = await Item.find().populate('user', 'name email role').sort({ createdAt: -1 });
  res.json(items);
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};
