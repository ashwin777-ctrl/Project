import Item from '../models/Item.js';
import { haversineKm, textSimilarity } from '../utils/match.js';

export const createItem = async (req, res) => {
  const { title, description, category, status, latitude, longitude } = req.body;
  const item = await Item.create({
    user: req.user.id,
    title,
    description,
    category,
    status,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    location: { type: 'Point', coordinates: [Number(longitude), Number(latitude)] }
  });

  const io = req.app.get('io');
  if (io) {
    const oppositeStatus = item.status === 'lost' ? 'found' : 'lost';
    const potentials = await Item.find({ status: oppositeStatus, category: item.category, _id: { $ne: item._id } });
    for (const candidate of potentials) {
      const score = textSimilarity(`${item.title} ${item.description}`, `${candidate.title} ${candidate.description}`);
      const distanceKm = haversineKm(item.location.coordinates, candidate.location.coordinates);
      if (score > 0.2 && distanceKm <= 15) {
        io.to(String(candidate.user)).emit('match-found', { itemId: item._id, candidateId: candidate._id, score, distanceKm });
        io.to(String(item.user)).emit('match-found', { itemId: item._id, candidateId: candidate._id, score, distanceKm });
      }
    }
  }

  res.status(201).json(item);
};

export const getItems = async (req, res) => {
  const { keyword, category, status, lat, lng, radiusKm = 5 } = req.query;
  const query = {};

  if (keyword) query.$text = { $search: keyword };
  if (category) query.category = category;
  if (status) query.status = status;
  if (lat && lng) {
    query.location = {
      $near: {
        $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(radiusKm) * 1000
      }
    };
  }

  const items = await Item.find(query).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(items);
};

export const getMyItems = async (req, res) => {
  const items = await Item.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(items);
};

export const updateItem = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (String(item.user) !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { title, description, category, status, latitude, longitude } = req.body;
  item.title = title ?? item.title;
  item.description = description ?? item.description;
  item.category = category ?? item.category;
  item.status = status ?? item.status;
  if (latitude && longitude) item.location.coordinates = [Number(longitude), Number(latitude)];
  if (req.file) item.imageUrl = `/uploads/${req.file.filename}`;

  await item.save();
  res.json(item);
};

export const deleteItem = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (String(item.user) !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await item.deleteOne();
  res.json({ message: 'Item deleted' });
};

export const findMatches = async (req, res) => {
  const baseItem = await Item.findById(req.params.id);
  if (!baseItem) return res.status(404).json({ message: 'Item not found' });

  const oppositeStatus = baseItem.status === 'lost' ? 'found' : 'lost';
  const candidates = await Item.find({
    status: oppositeStatus,
    category: baseItem.category,
    _id: { $ne: baseItem._id }
  }).populate('user', 'name email');

  const matches = candidates
    .map((candidate) => {
      const score = textSimilarity(
        `${baseItem.title} ${baseItem.description}`,
        `${candidate.title} ${candidate.description}`
      );
      const distanceKm = haversineKm(baseItem.location.coordinates, candidate.location.coordinates);
      const totalScore = score * 0.7 + (1 / (1 + distanceKm)) * 0.3;
      return { candidate, textScore: score, distanceKm, totalScore };
    })
    .filter((match) => match.textScore >= 0.1 && match.distanceKm <= 30)
    .sort((a, b) => b.totalScore - a.totalScore);

  res.json(matches);
};
