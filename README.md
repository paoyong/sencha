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

React is a Javascript view library that pushes for a component based workflow based on immutable data. Immutable data is easy to work with because the programmer does not have to think much about

React uses two types of data types:

State - mutable data
Props - immutable data

The way I do React components is to keep everything in props, meaning that all the data passed onto the component is immutable. React will not allow a prop value to be changed. I was able to use the <UpvoteButton /> component in both the <Post /> component and the <Comment /> component, just by passing different properties to it. The component's only job is to render the component from the data passed to it. Let's look at the <UpvoteButton /> component:

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


Also, if `upvoted` is true, I make the UpvoteButton component call the `onRemoveUpvote` function on click, and make the className to identify it as upvoted. Otherwise, the className identifies it as not upvoted. This makes me able to easily select upvoted and not upvoted components in CSS.

        if (this.props.upvoted) {
            upvoteFunction = this.props.onRemoveUpvote;
            upvoteButtonClassName += " " + this.props.defaultClassName + "-upvoted";
        } else {
            upvoteFunction = this.props.onUpvote;
            upvoteButtonClassName += " " + this.props.defaultClassName + "-not-upvoted";
        }
