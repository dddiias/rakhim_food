const User = require('../models/User');

const loadUser = async (req, res, next) => {
    try {
        if (req.session.user && req.session.user.id) {
            const userId = req.session.user.id;

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            req.user = user;
        }

        next(); 

    } catch (error) {
        console.error('Ошибка при загрузке пользователя:', error);
        res.status(500).json({ error: 'Ошибка при загрузке пользователя' });
    }
};

module.exports = { loadUser };
