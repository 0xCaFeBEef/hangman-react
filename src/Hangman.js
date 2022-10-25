import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import "./Hangman.css";
import img0 from "./0.jpg";
import img1 from "./1.jpg";
import img2 from "./2.jpg";
import img3 from "./3.jpg";
import img4 from "./4.jpg";
import img5 from "./5.jpg";
import img6 from "./6.jpg";

class Hangman extends Component {
  /** by default, allow 6 guesses and use provided gallows images. */
  static defaultProps = {
    maxWrong: 6,
    images: [img0, img1, img2, img3, img4, img5, img6]
  };
  constructor(props) {
    super(props);
    this.state = { nWrong: 0, guessed: new Set(), answer: "apple", word: "" };
    this.handleGuess = this.handleGuess.bind(this);
    this.rest = this.reset.bind(this);
    this.hideImg = this.hideImg.bind(this);
    this.showImg = this.showImg.bind(this);
  }

  /** guessedWord: show current-state of word:
    if guessed letters are {a,p,e}, show "app_e" for "apple"
  */
  guessedWord() {
    return this.state.answer
      .split("")
      .map((ltr) => (this.state.guessed.has(ltr) ? ltr : "_"));
  }

  reset = () => {
    fetch("https://random-word-api.herokuapp.com/word")
      .then((res) => res.json())
      .then((answer) => {
        this.setState({ answer: answer[0] });
      })
      .then(console.log(this.state.word));
    // setTimeout(()=>console.log(this.state.answer),5000);
    console.log(
      "Button pressed aggressively. Punish them by marking the next word more difficult"
    );
    this.setState((st) => ({ nWrong: 0, guessed: new Set() }));
  };

  hideImg() {
    try {
      console.log("hideImg");
      let ele = document.getElementById("Man");
      ele.classList.add("Hangman-hidden");
      ele.classList.remove("Hangman-man");
    } catch (err) {
      console.log(err);
    }
  }
  showImg() {
    try {
      console.log("showImg");
      let ele = document.getElementById("Man");
      ele.classList.remove("Hangman-hidden");
      ele.classList.add("Hangman-man");
    } catch (err) {
      console.log(err);
    }
  }

  /** handleGuest: handle a guessed letter:
    - add to guessed letters
    - if not in answer, increase number-wrong guesses
  */
  handleGuess(evt) {
    let ltr = evt.target.value;
    this.setState((st) => ({
      guessed: st.guessed.add(ltr),
      nWrong: st.nWrong + (st.answer.includes(ltr) ? 0 : 1)
    }));
  }

  /** generateButtons: return array of letter buttons to render */
  generateButtons() {
    return "abcdefghijklmnopqrstuvwxyz".split("").map((ltr) => (
      <button
        value={ltr}
        onClick={this.handleGuess}
        disabled={this.state.guessed.has(ltr)}
        key={uuidv4()}
      >
        {ltr}
      </button>
    ));
  }

  /** render: render game */
  render() {
    let showImg = () => this.showImg();
    let hideImg = () => this.hideImg();
    let winner = this.guessedWord().join("") === this.state.answer;
    let nWrong = this.state.nWrong;
    let winImg = this.props.images[nWrong];
    let loseImg = "./Empty_Noose.jpg";
    let maxWrong = this.props.maxWrong;
    let loseText = "You lose, ya big dummy";
    let winText = "You win!";
    return (
      <div className="Hangman">
        <h1>Hangman</h1>
        <img
          className="Hangman-img"
          alt={nWrong}
          src={winner ? loseImg : winImg}
        />
        <img
          id="Man"
          className="Hangman-hidden"
          src="./Man_Smiling.png"
          alt="Free bird"
          onAnimationEnd={hideImg}
        />
        <p>
          Number wrong: {nWrong} out of {maxWrong}
        </p>
        <p>{winner && winText}</p>
        <p className="Hangman-word">{this.guessedWord()}</p>
        <p className="Hangman-btns">
          {nWrong < maxWrong && this.generateButtons()}
        </p>
        <p>{nWrong >= maxWrong && loseText}</p>
        <button className="Hangman-reset" onClick={this.reset}>
          Press to reset game
        </button>
        <p>
          {winner ? showImg() : hideImg()}
          {}
        </p>
      </div>
    );
  }
}

export default Hangman;
