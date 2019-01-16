

exports.dashboard = async function(req, res) {
    const animate = req.query.animate ? true : false;
    return res.render('dashboard', {animate});
};

