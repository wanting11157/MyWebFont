//import ReactDOM from react-dom;
//import React from react;


class LikeButton extends React.Component {
    render() {
        return <h1>Hello</h1>;
    }
}
const e = React.createElement;


const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(LikeButton), domContainer);