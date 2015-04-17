module.exports = {
    entry: {
        CommentThreadApp: ['./client/CommentThreadApp.jsx'],
        PostsApp: ['./client/PostsApp.jsx'],
        SubpyFiller: ['./client/SubpyFiller.jsx']
    },
    output: {
        path: './build',
        publicPath: 'http://localhost:9090/assets/',
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            { test: /\.jsx$/, loader: 'jsx-loader' }
        ]
    }
};
