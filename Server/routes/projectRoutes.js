const express = require('express');
const router = express.Router();
const axios = require('axios');

const apiGatewayBaseUrl = ': https://6qbi0f6mhi.execute-api.eu-west-2.amazonaws.com/default'; // Replace with your API Gateway URL

router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`https://6qbi0f6mhi.execute-api.eu-west-2.amazonaws.com/default/listProjects`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const response = await axios.post(`https://6qbi0f6mhi.execute-api.eu-west-2.amazonaws.com/default/createProject`, req.body);
        res.status(201).json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/:projectId', async (req, res) => {
    try {
        const response = await axios.put(`https://6qbi0f6mhi.execute-api.eu-west-2.amazonaws.com/default/updateProject/${req.params.projectId}`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/:projectId', async (req, res) => {
    try {
        const response = await axios.delete(`https://6qbi0f6mhi.execute-api.eu-west-2.amazonaws.com/default/deleteProject/${req.params.projectId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
