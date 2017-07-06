/**
 * CategoryController
 *
 * @description :: Server-side logic for managing categories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    delete: function(req, res) {
        API(CategoryService.delete, req, res);
    },

    getAllCategory: function(req, res, next) {

        var search = req.param('search');
        var sortBy = req.param('sortBy');
        var page = req.param('page');
        var count = req.param('count');
        var skipNo = (page - 1) * count;
        var query = {};

        if (sortBy) {
            sortBy = sortBy.toString();
        } else {
            sortBy = 'createdAt desc';
        }

        query.isDeleted = 'false';

        if (search) {
            query.$or = [{
                    name: {
                        'like': '%' + search + '%'
                    }
                }, {
                    type: {
                        'like': '%' + search + '%'
                    }
                }

            ]
        }
       

        Category.count(query).exec(function(err, total) {
            if (err) {
                return res.status(400).jsonx({
                    success: false,
                    error: err
                });
            } else {
                Category.find(query).sort(sortBy).skip(skipNo).limit(count).exec(function(err, category) {
                    if (err) {
                        return res.status(400).jsonx({
                            success: false,
                            error: err
                        });
                    } else {
                        return res.jsonx({
                            success: true,
                            data: {
                                category: category,
                                total: total
                            },
                        });
                    }
                })
            }
        })
    }
};

