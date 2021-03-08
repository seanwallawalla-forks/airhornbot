import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import * as ResponsiveActions from "../actions/ResponsiveActions";
import Constants from "../Constants";

class ResponsiveStore extends EventEmitter {
  constructor() {
    super();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", ResponsiveActions.resize);
    }
  }

  onResize() {
    this.emit("change");
  }

  isMobile() {
    if (typeof window !== "undefined") {
      return window.matchMedia(`(max-width: ${Constants.MediaQuery.PHONE}px)`).matches;
    }
  }

  handle({type}) {
    switch (type) {
      case Constants.Event.RESPONSIVE_RESIZE: {
        this.onResize();
        break;
      }
    }
  }
}

const responsiveStore = new ResponsiveStore();

dispatcher.register(responsiveStore.handle.bind(responsiveStore));

export default responsiveStore;
