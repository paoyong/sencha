# Pyramus
## About
Reddit clone using React components and PostgresQL database.

*Special thanks to the `#postgresql` irc group for the immense help in my SQL!*

## Non-NPM Requirements
* PostgresQL
* iojs

## Installation
1. `npm update`
2. `psql -U postgres -a -f server/psql_scripts.sql` to build PostgresQL schema
3. `npm run build` to build \*.bundle.js files.
4. `npm start`

## Todo

* Caching queries to improve website load times.
* Reducing size of webpack bundles.

## React Components

This is an overview of what coding in React is like. This is not a tutorial, you won't get everything I say, but hopefully you will read this and sort of get what the philosophy behind React components is.

React is a Javascript view library that pushes for a component based workflow based on immutable data. Immutable data is easy to reason about, which is important in a big project because you want to reduce as much complexity as you can.

React uses two types of data types:

* State - mutable data
* Props - immutable data

The way I do React components is to keep everything in props, meaning that all the data passed onto the component is immutable. React will not allow a prop value to be changed. I was able to use the `<UpvoteButton />` component in both the `<Post />` component and the `<Comment />` component, just by passing different properties to it. The component's only job is to render the component from the data passed to it. Let's look at the `<UpvoteButton />` component:

First I use the React createClass factory, and I pass in propTypes options to declare what the props are going to be passed in. I declare that these props are required, so that React can throw an error if they are not passed into the upvote button component.

    var UpvoteButton = React.createClass({
        propTypes: {
            upvoted            : React.PropTypes.bool.isRequired,
            onUpvote           : React.PropTypes.func.isRequired,
            onRemoveUpvote     : React.PropTypes.func.isRequired,
            targetId           : React.PropTypes.string.isRequired,
            upvoteImageURL     : React.PropTypes.string.isRequired,
            upvotedImageURL    : React.PropTypes.string.isRequired,
            defaultClassName   : React.PropTypes.string.isRequired
        },

Let's look at the `upvoted` prop. This prop can either be true or false, but it can never be changed inside the component. When `upvoted` is true, I tell the UpvoteButton to render with my `upvotedImageURL` to show the image of an upvoted button. If false, I pick the `upvoteImageURL`, which is gray:

        if (this.props.upvoted) {
            return this.props.upvotedImageURL;
        } else {
            return this.props.upvoteImageURL;
        }


Also, if `upvoted` is true, I make the UpvoteButton component call the `onRemoveUpvote` function on click, and make the className to identify it as upvoted. Otherwise, the className identifies it as not upvoted. This makes me able to easily select upvoted and not upvoted components in CSS. Here is the code:

        if (this.props.upvoted) {
            upvoteFunction = this.props.onRemoveUpvote;
            upvoteButtonClassName += " " + this.props.defaultClassName + "-upvoted";
        } else {
            upvoteFunction = this.props.onUpvote;
            upvoteButtonClassName += " " + this.props.defaultClassName + "-not-upvoted";
        }

Notice that in all these code snippets I never change the `upvoted` prop. The parent of the `<UpvoteButton />` component is responsible for handling what gets passed into the `<UpvoteButton />` component. The `<UpvoteButton />` component is only responsible for rendering the correct image based on whatever is passed on to it.

By defining all the data that an `<UpvoteButton />` component would need, I was able to use the same `<UpvoteButton />` component in both my posts and comments.

So the way I do my reddit clone, for example take my `PostsApp.jsx` structure:

    <PostsApp />                <-- Only place with mutable state. React automatically re-renders necessary child components based on state change.
        <Post />                <-- Immutable props only. Gets data from <PostsApp />
            <UpvoteButton />    <-- Immutable props
            <PointsBanner />    <-- Immutable props

I also have all of my components in [a single folder](https://github.com/keithyong/pyramus/tree/master/client), which cleans up the workflow. I use webpack so that I can `require` components into my apps.

In the end, the only state I ever use is in my `<App />` component, and all that state is passed down to my props-only components. I would say this covers about most of what the Flux architecture is about. If you are interested in learning more, I highly recommend [Facebook's React tutorial](http://facebook.github.io/react/docs/tutorial.html), as it gets you comfortable using props and states which are the bread and butter of React.
