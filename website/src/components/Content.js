import React from "react";
import createClass from "create-react-class";
import ResponsiveStore from "../stores/ResponsiveStore";
import Constants from "../Constants";

const Content = createClass({
  getInitialState() {
    return {
      isMobile: ResponsiveStore.isMobile(),
      showVideo: false
    };
  },

  componentWillMount() {
    ResponsiveStore.on("change", this.setSize);
  },

  checkToPlayVideo() {
  },

  playVideo() {
    this.refs.video.currentTime = 0;
    this.refs.audio.currentTime = 0;
    this.refs.video.play();
    this.refs.audio.play();
    //setTimeout(OAuthActions.playedVideo, Constants.VIDEO_LENGTH);
  },

  setSize() {
    this.setState({
      isMobile: ResponsiveStore.isMobile()
    });
  },

  getCenter() {
    if (this.state.isMobile) {
      return <img className="video-airhorn" src={Constants.Image.ISLAND_AIRHORN_MOBILE} />;
    } else {
      return (
        <video
          preload
          className="video-airhorn"
          ref="video"
          onClick={this.playVideo}>
          <source src={Constants.Video.AIRHORN} type="video/mp4" />
          <source src={Constants.Video.AIRHORN_WEBM} type="video/webm; codecs=vp8, vorbis" />
          <audio preload src={Constants.Audio.AIRHORN} type="audio/wav" ref="audio" />
        </video>
      );
    }
  },

  render() {
    return (
      <div className="content">
        <div className="shadow">
          <h1 className="title">/airhorn</h1>
          <p className="message">
            The only bot for <a href={Constants.DISCORD_URL}>Discord</a> you'll ever need
          </p>
        </div>
        {this.getCenter()}
        <a className="add-btn" href={Constants.OAUTH2_ADD_URL} target="_blank">Add to Discord</a>
      </div>
    );
  }
});

export default Content;
