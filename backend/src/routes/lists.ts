import { Router } from 'express';
import List from '../models/list.model';

const router = Router();

// Get lists
router.get('/', (req, res) => {
    List.find()
        .sort({
            isFixed: 'desc',
            createdAt: 'asc',
        })
        .then(lists => res.json(lists))
        .catch(err => res.status(400).json(err));
});

// Get list by ID
router.get('/:id', (req, res) => {
    List.findById(req.params.id)
        .then(list => res.json(list))
        .catch(err => res.status(400).json(err));
});

// Create list
router.post('/create', (req, res) => {
    const { title, isFixed } = req.body;
    const list = new List({ title, isFixed });
    list.save()
        .then(() => res.status(200).send('List created.'))
        .catch(err => res.status(400).json(err));
});

// Delete list
router.delete('/delete/:id', (req, res) => {
    List.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).send('List deleted.'))
        .catch(err => res.status(400).json(err));
});

export default router;
