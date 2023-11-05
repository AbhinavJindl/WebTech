const express = require('express');

const router = express.Router();
const Item = require('../models/Item');
const _  = require('lodash');

router.post('/', async (req, res) => {
    try {
        const { itemId } = req.body;
        let item = await Item.findOne({ itemId: itemId }).exec();
        if (!item) {
            item = new Item({itemId: itemId, data: req.body});
            await item.save();
        } else {
            item.data = req.body;
            await item.save();
        }
        res.status(200).send(req.body);
    } catch (error) {
        console.error("Could not update item", error);
        res.status(400).send(error);
    }
});

// all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find({}).exec();
        res.send(_.map(items, item=>item.data));
    } catch (error) {
        console.error("Could not get all items", error);
        res.status(500).send(error);
    }
});

router.get('/:ids', async (req, res) => {
    try {
        const ids = req.params.ids.split(",");
        const items = await Item.find({
            itemId: { $in: ids }
        }).exec();
        res.send(_.map(items, item=>item.data));
    } catch (error) {
        console.error("Could not get all items", error);
        res.status(500).send(error);
    }
});



// single item
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findOne({id: req.params.id}).exec();
        if (!item) {
            return res.status(404).send();
        }
        res.send(item);
    } catch (error) {
        console.error("Could not get single item", error);
        res.status(500).send(error);
    }
});

module.exports = router;