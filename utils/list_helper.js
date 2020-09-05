const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    const totalLikes = blogs.reduce((sum, { likes }) => sum + likes, 0)
    return blogs.length === 0
    ? 0
    : totalLikes;
};

const favoriteBlog = (blogs) => {
    const favoriteBlog = blogs.reduce((favorite, blog) => {
        return favorite.likes > blog.likes ? favorite : blog;
    }, 0)

    return blogs.length === 0
    ? 0
    : favoriteBlog
};


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
};