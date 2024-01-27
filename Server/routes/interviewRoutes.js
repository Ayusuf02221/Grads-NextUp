const express = require('express');
const router = express.Router();
const axios = require('axios');

const apiGatewayBaseUrl = 'https://ze6z9njn1d.execute-api.eu-west-2.amazonaws.com/default'; 

router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`https://ze6z9njn1d.execute-api.eu-west-2.amazonaws.com/default/listUserInterviewsByType`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const response = await axios.post(`https://ze6z9njn1d.execute-api.eu-west-2.amazonaws.com/default}/addInterviewExperience`, req.body);
        res.status(201).json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/:interviewId', async (req, res) => {
    try {
        const response = await axios.put(`https://ze6z9njn1d.execute-api.eu-west-2.amazonaws.com/default/updateInterviewExperience/${req.params.interviewId}`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;

