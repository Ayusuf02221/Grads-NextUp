const express = require('express');
const router = express.Router();
const axios = require('axios');

// Define the base URL for the API Gateway
const apiGatewayBaseUrl = ': https://rzrg8bxxpl.execute-api.eu-west-2.amazonaws.com/default'; 

// Route to list resources
router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`: https://rzrg8bxxpl.execute-api.eu-west-2.amazonaws.com/default/listResources`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Route to add a resource
router.post('/', async (req, res) => {
    try {
        const response = await axios.post(`: https://rzrg8bxxpl.execute-api.eu-west-2.amazonaws.com/default/addResource`, req.body);
        res.status(201).json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Route to update a resource
router.put('/:resourceId', async (req, res) => {
    try {
        const response = await axios.put(`: https://rzrg8bxxpl.execute-api.eu-west-2.amazonaws.com/default/updateResource/${req.params.resourceId}`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Route to delete a resource
router.delete('/:resourceId', async (req, res) => {
    try {
        const response = await axios.delete(`: https://rzrg8bxxpl.execute-api.eu-west-2.amazonaws.com/default/deleteResource/${req.params.resourceId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
