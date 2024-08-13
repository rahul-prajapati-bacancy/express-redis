const { default: axios } = require("axios");

const UserController = {
    getUsers: async (req, res) => {
        await new Promise((resolve) => setTimeout(resolve, 250));
        const apiUrl = 'https://swapi.dev/api/people/';
        const axiosResponse = await axios.get(apiUrl)
            .then(response => {
                return response.data;
            })
            .catch(err => {
                console.error('Error:', err);
            });
        res.json({
            users: axiosResponse,
        });
    },
};

module.exports = { UserController }; 