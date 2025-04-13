import { Component } from "preact";
import style from "./style.module.scss";
import { route } from "preact-router";

import lang from "./languages";

const formattedSeconds = (sec) =>
  Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);

export default class Profile extends Component {
  switchSlides = (direction) => {
    if (navigator.vibrate) navigator.vibrate(10);
    this.Socket.send(
      JSON.stringify({
        command: "notify-extension",
        data: {
          type: direction === "next" ? "next-slide" : "previous-slide",
        },
      }),
    );
  };

  jumpSlides = (slideNumber) => {
    if (navigator.vibrate) navigator.vibrate(10);
    this.Socket.send(
      JSON.stringify({
        command: "notify-extension",
        data: {
          type: "jump-slide",
          slideNumber,
        },
      }),
    );
  };

  startTimer = () => {
    if (!this.state.timerRunning) {
      this.setState({
        timerRunning: true,
      });

      if (this.state.secondsElapsed === 0) {
        this.setState({
          secondsElapsed: 1,
        });

        this.props.showSnackbar(
          lang.notifications.timer.started,
          null,
          2000,
          () => console.warn("App did big oopsie doopsie"),
        );
      } else
        this.props.showSnackbar(
          lang.notifications.timer.resumed(
            formattedSeconds(this.state.secondsElapsed),
          ),
          null,
          2000,
          () => console.warn("App did big oopsie doopsie vol. II"),
        );

      this.incrementer = setInterval(() => {
        this.setState((state) => ({
          secondsElapsed: state.secondsElapsed + 1,
        }));
      }, 1000);
    } else {
      this.setState({
        timerRunning: false,
      });

      this.props.showSnackbar(
        lang.notifications.timer.paused.msg(
          formattedSeconds(this.state.secondsElapsed),
        ),
        lang.notifications.timer.paused.action,
        3500,
        () =>
          this.setState({
            secondsElapsed: 0,
          }),
      );

      clearInterval(this.incrementer);
    }
  };

  promptSlideJump = () => {
    this.setState({
      showslideSelectionPrompt: !this.state.showslideSelectionPrompt,
    });
  };

  handleSlideJumpClick = (e) => {
    this.promptSlideJump();
    this.jumpSlides(parseInt(e.target.attributes.slidenumber.value, 10));
  };

  toggleLightMode = () => {
    let lightMode = !this.state.lightMode;
    this.lightModeToggle.innerHTML = lightMode
      ? "brightness_2"
      : "brightness_7";
    this.setState({
      lightMode,
    });
    document.body.style.background = lightMode
      ? "#fafafa"
      : "var(--background-color)";
  };

  toggleLaserpointer = () => {
    let laserPointer = !this.state.laserPointer;
    this.setState({
      laserPointer,
    });
  };

  toggleClosedCaptions = () => {
    if (this.stream) {
      this.stream.stop();
      this.stream = null;
      this.setState({
        CC: "",
      });
      this.Socket.send(
        JSON.stringify({
          command: "notify-extension",
          data: {
            type: "show-closed-captions",
            cc: "",
          },
        }),
      );
      this.props.showSnackbar(
        lang.notifications.closedCaptions.stoped,
        null,
        3000,
        () => console.warn("lololol"),
      );
    } else {
      let url = localStorage.getItem("slidecontrol-websocket-ip");

      if (url.substring(0, 6) === "wss://")
        url = url.replace("wss://", "https://");
      else if (url.substring(0, 5) === "ws://")
        url = url.replace("ws://", "http://");

      fetch(url + "/ibm-access-token")
        .then((res) => res.text())
        .then((res) => {
          const token = JSON.parse(res).access_token;

          this.stream = window.WatsonSpeech.SpeechToText.recognizeMicrophone({
            access_token: token,
            url: "wss://stream-fra.watsonplatform.net/speech-to-text/api/v1/recognize",
            model: lang.meta.sttModel,
          });

          this.stream.on("data", (uint8array) => {
            let string = new TextDecoder("utf-8").decode(uint8array);
            this.Socket.send(
              JSON.stringify({
                command: "notify-extension",
                data: {
                  type: "show-closed-captions",
                  cc: string,
                },
              }),
            );
            this.setState({
              CC: string,
            });
          });

          this.props.showSnackbar(
            lang.notifications.closedCaptions.started,
            null,
            3000,
            () => console.warn("lololol"),
          );

          this.stream.on("error", (error) => {
            console.error("Error during streaming: ", error);
            this.props.showSnackbar(
              lang.errors.closedCaptions,
              null,
              3000,
              () => console.warn("lololol"),
            );
          });
        })
        .catch((err) => {
          console.error("Error getting access token: ", err);
          this.props.showSnackbar(lang.errors.closedCaptions, null, 3000, () =>
            console.warn("lololol"),
          );
        });
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      totalSlides: 0,
      activeSlide: 0,
      secondsElapsed: 0,
      title: null,
      timerRunning: false,
      slideLoaded: false,
      lightMode: false,
      laserPointer: false,
      CC: "",
    };

    window.WebSocket = window.WebSocket || window.MozWebSocket;
    this.Socket = null;
    this.notes = "";
    this.onKeyDown = null;
    this.onTouchStartNotes = null;
    this.onTouchEndNotes = null;
    this.onTouchStartPointer = null;
    this.onTouchMovePointer = null;
    this.onTouchEndPointer = null;
    this.incrementer = null;
    this.startTimer = this.startTimer.bind(this);
    this.promptSlideJump = this.promptSlideJump.bind(this);
    this.handleSlideJumpClick = this.handleSlideJumpClick.bind(this);
    this.toggleLightMode = this.toggleLightMode.bind(this);
    this.toggleClosedCaptions = this.toggleClosedCaptions.bind(this);
    this.toggleLaserpointer = this.toggleLaserpointer.bind(this);
    this.jumpSlides = this.jumpSlides.bind(this);
    this.nextSlide = () => this.switchSlides("next");
    this.previousSlide = () => this.switchSlides("back");
    this.goHome = () => route("/");
    this.stream = null;
  }

  componentWillMount() {
    try {
      this.Socket = new WebSocket(
        localStorage.getItem("slidecontrol-websocket-ip"),
      );
    } catch (error) {
      console.error(error);
      this.props.showSnackbar(
        lang.errors.socketClosed.msg,
        lang.errors.socketClosed.action,
        4000,
        () => route("/settings"),
      );
    }
    this.Socket.onopen = () => {
      this.Socket.send(
        JSON.stringify({
          command: "add-new-controller",
          data: {
            presentationID: this.props.id,
          },
        }),
      );
    };
    this.Socket.onclose = () => {
      route("/");
      this.props.showSnackbar(
        lang.notifications.disconnected,
        null,
        1800,
        location.reload,
      );
    };
  }

  componentDidMount() {
    // hide navigation drawer
    document
      .getElementById("drawer")
      .setAttribute("style", "display: none !important");

    // show buttons in header
    this.props.changeHeaderChildren(
      <div>
        {localStorage.getItem("slidecontrol-cc") === "true" ? (
          <i
            role="button"
            aria-label={lang.page.toggleClosedCaptions}
            onClick={this.toggleClosedCaptions}
            class="material-icons"
            style={{
              userSelect: "none",
              position: "absolute",
              right: "65px",
              left: "auto",
              cursor: "pointer",
            }}
          >
            closed_caption
          </i>
        ) : null}
        <i
          role="button"
          aria-label={lang.page.jumpSlideNumber}
          onClick={this.promptSlideJump}
          ref={(i) => (this.slideJumpButton = i)}
          class="material-icons"
          style={{
            userSelect: "none",
            position: "absolute",
            right: "36px",
            left: "auto",
            cursor: "pointer",
          }}
        >
          playlist_play
        </i>
        <i
          role="button"
          aria-label={lang.page.toggleDarkModeButton}
          onClick={this.toggleLightMode}
          ref={(i) => (this.lightModeToggle = i)}
          class="material-icons"
          style={{
            userSelect: "none",
            position: "absolute",
            right: "7px",
            left: "auto",
            cursor: "pointer",
          }}
        >
          {this.state.lightMode ? "brightness_2" : "brightness_7"}
        </i>
      </div>,
    );

    // add global toggleWEbsite() function
    window.toggleWebsite = (url) => {
      this.Socket.send(
        JSON.stringify({
          command: "notify-extension",
          data: {
            type: "toggle-webpage",
            url,
          },
        }),
      );
    };

    // make links in notes html text show website onscreen
    const urlify = (string) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      string = string.replace("href", "href_alt");
      return string.replace(
        urlRegex,
        (url) =>
          '<a href="javascript:void(0)" onclick="window.toggleWebsite(this.textContent)">' +
          url +
          "</a>",
      );
    };

    // handle message by server
    this.Socket.onmessage = (message) => {
      message = JSON.parse(message.data);

      if (message.command === "presentation-id-unknown") {
        this.props.showSnackbar(
          lang.errors.wrongCode.msg(this.props.id),
          lang.errors.wrongCode.action,
          8000,
          () => route("/"),
        );
      }

      if (message.command === "new-controller-added") {
        this.props.showSnackbar(
          lang.notifications.synced(message.data.title, this.props.id),
          null,
          3500,
          () => console.warn("Wait, you were not supposed to read this, lol"),
        );
        this.notesContainer.innerHTML = urlify(message.data.notes);
        this.props.changeHeaderTitle(
          `${message.data.title} (${message.data.activeSlide}/${message.data.totalSlides})`,
        );

        this.setState({
          totalSlides: message.data.totalSlides,
          activeSlide: message.data.activeSlide,
          slidesTitles: message.data.slidesTitles,
          slideLoaded: true,
          title: message.data.title,
        });
      }

      if (message.command === "presentation-updated") {
        this.notesContainer.innerHTML = urlify(message.data.notes);
        this.props.changeHeaderTitle(
          `${this.state.title} (${message.data.activeSlide}/${this.state.totalSlides})`,
        );

        this.setState({
          activeSlide: message.data.activeSlide,
        });
      }
    };

    this.Socket.onerror = (error) => {
      this.props.showSnackbar(
        lang.errors.socketError.msg,
        lang.errors.socketError.action,
        5000,
        () => route("/settings"),
      );
      console.error("We fucked up big here: ", error);
    };

    // add key commands
    this.onKeyDown = (key) => {
      if (key.code === "KeyT") this.startTimer();
      if (key.code === "KeyM") this.toggleLightMode();
      if (key.code === "ArrowLeft") this.previousSlide();
      if (key.code === "ArrowRight" || key.code === "Space") this.nextSlide();
    };

    document.body.addEventListener("keydown", this.onKeyDown);

    let touchstartXnotes = 0;
    let touchstartYnotes = 0;
    let touchstartTimestamp = 0;

    this.onTouchStartNotes = (e) => {
      touchstartXnotes = e.changedTouches[0].screenX;
      touchstartYnotes = e.changedTouches[0].screenY;
      touchstartTimestamp = e.timeStamp;
    };

    // listen for finger-move event
    this.notesContainer.addEventListener("touchstart", this.onTouchStartNotes);

    this.onTouchEndNotes = (e) => {
      const touchend = e.changedTouches[0];

      // Δ's
      const deltaY = Math.abs(touchend.screenY - touchstartYnotes),
        deltaX = Math.abs(touchend.screenX - touchstartXnotes),
        deltaT = e.timeStamp - touchstartTimestamp;

      // make sure ΔY & ΔT aren't too big and ΔX not too small
      if (deltaY > 150 || deltaT > 750 || deltaX < 80) return true;

      // gesture right-to-left and left-to-right
      if (touchstartXnotes > touchend.screenX) this.nextSlide();
      else this.previousSlide();
    };

    // fire function above whenever finger is lifted from screen
    this.notesContainer.addEventListener("touchend", this.onTouchEndNotes);

    let touchstartXpointer = 0;
    let touchstartYpointer = 0;

    this.onTouchStartPointer = (e) => {
      e.preventDefault();
      (touchstartXpointer = e.changedTouches[0].clientX),
        (touchstartYpointer = e.changedTouches[0].clientY),
        this.Socket.send(
          JSON.stringify({
            command: "notify-extension",
            data: {
              type: "laserpointer-down",
            },
          }),
        );
    };

    this.laserPointer.addEventListener("touchstart", this.onTouchStartPointer);

    this.onTouchMovePointer = (e) => {
      e.preventDefault();
      this.Socket.send(
        JSON.stringify({
          command: "notify-extension",
          data: {
            type: "laserpointer-move",
            x: e.changedTouches[0].clientX - touchstartXpointer,
            y: e.changedTouches[0].clientY - touchstartYpointer,
          },
        }),
      );
    };

    this.laserPointer.addEventListener("touchmove", this.onTouchMovePointer);

    this.onTouchEndPointer = (e) => {
      e.preventDefault();
      this.Socket.send(
        JSON.stringify({
          command: "notify-extension",
          data: {
            type: "laserpointer-up",
          },
        }),
      );
    };

    this.laserPointer.addEventListener("touchend", this.onTouchEndPointer);
  }

  // clear some scheduled code when exiting component
  componentWillUnmount() {
    // hide closed captions on exit
    if (this.stream) this.toggleClosedCaptions();

    // show drawer again
    document.getElementById("drawer").setAttribute("style", "");

    // clear timer
    clearInterval(this.incrementer);

    // close connection to server
    this.Socket.close();

    // remove event listeners
    document.body.removeEventListener("keydown", this.onKeyDown, false);
    this.notesContainer.removeEventListener(
      "touchstart",
      this.onTouchStartNotes,
      false,
    );
    this.notesContainer.removeEventListener(
      "touchend",
      this.onTouchEndNotes,
      false,
    );
    this.laserPointer.removeEventListener(
      "touchstart",
      this.onTouchStartPointer,
      false,
    );
    this.laserPointer.removeEventListener(
      "touchmove",
      this.onTouchMovePointer,
      false,
    );
    this.laserPointer.removeEventListener(
      "touchend",
      this.onTouchEndPointer,
      false,
    );
  }

  render() {
    return (
      <div class={style.controller} ref={(div) => (this.controller = div)}>
        {/* timer */}
        {this.state.slideLoaded && (
          <span
            data-fade-in="true"
            onClick={this.startTimer}
            class={style.timer}
          >
            {this.state.secondsElapsed > 0
              ? formattedSeconds(this.state.secondsElapsed)
              : lang.page.startTimerButton}
          </span>
        )}

        {/* laserpointer button */}
        {this.state.slideLoaded && (
          <span
            style={{ left: "auto", right: "18px" }}
            data-fade-in="true"
            onClick={this.toggleLaserpointer}
            class={style.timer}
          >
            {this.state.laserPointer
              ? lang.page.showNotesButton
              : lang.page.showLaserpointerButton}
          </span>
        )}

        {/* slide Selection prompt */}
        {this.state.slideLoaded && this.state.showslideSelectionPrompt && (
          <section class={style.slideSelectionPrompt}>
            {this.state.slidesTitles.map((slideTitle, i) => (
              <div
                key={i}
                slidenumber={i + 1}
                current={this.state.activeSlide === i + 1 ? "true" : "false"}
                onClick={this.handleSlideJumpClick}
              >
                {slideTitle}
              </div>
            ))}
          </section>
        )}

        <div
          onClick={this.promptSlideJump}
          hide={this.state.showslideSelectionPrompt ? "false" : "true"}
          class={style.backgroundHidingBox}
        />

        {/* Notes */}
        <div
          data-fade-in="true"
          style={{ display: !this.state.laserPointer ? "block" : "none" }}
          class={style.notesContainer}
          data-light={this.state.lightMode}
          ref={(div) => (this.notesContainer = div)}
        />

        {/* laserpointer */}
        <div
          style={{ display: this.state.laserPointer ? "block" : "none" }}
          class={style.laserPointer}
          data-light={this.state.lightMode}
          ref={(div) => (this.laserPointer = div)}
        />

        {/* Next/Previous slide buttons */}
        {this.state.slideLoaded && (
          <div>
            <div class={style.container}>
              <div class={style.previousButton} onClick={this.previousSlide} />
              <div class={style.nextButton} onClick={this.nextSlide} />
              <span class={style.closedCaptions}>{this.state.CC}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
}
