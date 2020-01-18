const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    async index(requrest, response) {
        const devs = await Dev.find();
        
        return response.json(devs);
    },
    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;
    
        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            //if name does not exists it will get login/username
            let { name, avatar_url, bio, login } = apiResponse.data;
            name = name == null ? login : name;

            const techsArray = parseStringAsArray(techs);
        
            const location =  {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });

            const sendSocketMessageTo = findConnections(
                { latitude, longitude }
                , techsArray)
            
            sendMessage(sendSocketMessageTo, 'new-dev', dev);

        }

        return response.json(dev); 
    },
    async update() {
        // atualizar dev
    },
    async destroy() {
        //deletar dev
    }
}