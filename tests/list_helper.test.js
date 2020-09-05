const { dummy, totalLikes, favoriteBlog } = require('../utils/list_helper');
const { emptyList, listWithOneBlog, blogs } = require('./dummyData/dummyBlogData');

test('dummy returns 1', () => {
    const blogs = [];

    const result = dummy(blogs);
    expect(result).toBe(1);
})

describe('total likes', () => {
    test('expect 0 likes with empty list', () => {
        const result = totalLikes(emptyList);
        expect(result).toBe(0);
    });

    test('when list only has 1 blog, totalLikes equals the likes of that', () => {
        const result = totalLikes(listWithOneBlog);
        expect(result).toBe(listWithOneBlog[0].likes);
    });

    test('when list has multiple blogs, totalLikes equals sum of all blogs', () => {
        const result = totalLikes(blogs);
        expect(result).toBe(36);
    })
});

test('blog with most likes', () => {
    const result = favoriteBlog(blogs);
    expect(result).toEqual(blogs[2]);
});
