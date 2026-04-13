import Message from '../models/Message.js';
import Item from '../models/Item.js';

export const sendMessage = async (req, res) => {
  const { itemId, content } = req.body;
  const item = await Item.findById(itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  const message = await Message.create({
    from: req.user.id,
    to: item.user,
    item: item._id,
    content
  });

  const populated = await message.populate('from', 'name email');
  const io = req.app.get('io');
  if (io) io.to(String(item.user)).emit('new-message', populated);

  res.status(201).json(populated);
};

export const getMyMessages = async (req, res) => {
  const messages = await Message.find({ $or: [{ from: req.user.id }, { to: req.user.id }] })
    .populate('from', 'name email')
    .populate('to', 'name email')
    .populate('item', 'title status')
    .sort({ createdAt: -1 });
  res.json(messages);
};
