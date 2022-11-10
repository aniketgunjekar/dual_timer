//React import
import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState } from 'react';
import { useEffect } from 'react';

//import styles
import './index.scss';

//import audios
import alarm_beep from './alarm_beep.mp3';

//import icons
import dropdown from './icons/drop-down.png';
import upsquared from './icons/up-squared.png';
import playbutton from './icons/play-button.png';
import pausebutton from './icons/pause-button.png';
import resetbutton from './icons/reset-button.png';

//React app
//rendering api [needed to change as per the react version]
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

//child component1
function BreakLength({breakl, setBreakl, setTime, timeLab, isPlaying}) {
  //manupulating time in terms of seconds and displaying time in terms of minutes;
  function handleUpClick() {
    if(breakl >= 3600) { //3600s = 60m
      return;
    } else {
      if(!(isPlaying)) {
        setBreakl(breakl + 60);
        if(timeLab === "Break") {
          setTime(breakl + 60);
        }
      }
    }
  }

  function handleDnClick() {
    if(breakl <= 60) { //60s = 1m
      return;
    } else {
      if(!(isPlaying)) {
        setBreakl(breakl - 60);
        if(timeLab === "Break") {
          setTime(breakl - 60);
        }
      }
    }
  }

  return(
    <div>
      <div className="period">
        <p id="break-label">Break Length</p>
        <div id="break-controls">
          <button id="break-increment" onClick={handleUpClick}><img src={upsquared} alt="increase" className="controller"></img></button>
            <p id="break-length">{breakl / 60}</p>
          <button id="break-decrement" onClick={handleDnClick}><img src={dropdown} alt="decrease" className="controller"></img></button>
        </div>
      </div>
    </div>
  );
}

//child component1
function SessionLength({session, setSession, setTime, timeLab, isPlaying}) {
  //manupulating time in terms of seconds and displaying time in terms of minutes;
  function handleUpClick() {
    if(session >= 3600) {  //3600s = 60m
      return;
    } else {
      if(!(isPlaying)) {
        setSession(session + 60);
        if(timeLab === "Session") {
          setTime(session + 60);
        }
      }
    }
  }
  
  function handleDnClick() {
    if(session <= 60) {  //60s = 1m
      return;
    } else {
      if(!(isPlaying)) {
        setSession(session - 60);
        if(timeLab === "Session") {
          setTime(session - 60);
        }
      }
    }
  }

  return(
    <div>
      <div className="period">
        <p id="session-label">Session length</p>
        <div id="session-controls">
          <button id="session-increment" onClick={handleUpClick}><img src={upsquared} alt="increase" className="controller"></img></button>
            <p id="session-length">{session / 60}</p>
          <button id="session-decrement" onClick={handleDnClick}><img src={dropdown} alt="decrease" className="controller"></img></button>
        </div>
      </div>
    </div>
  );
}

//child component1
function Clock({breakl, setBreakl, session, setSession, time, setTime, isPlaying, setIsPlaying, timeLab, setTimeLab}) {
  //manupulating time in terms of seconds and displaying time in terms of minutes and seconds;

  //strategy: first set the initial parameters then based on those parameters useffects run

  function handlePlayPause() {
    if(isPlaying === false) {  //this condition exe if timer is paused
      setIsPlaying(true);
    } else if(isPlaying === true) {  //this condition exe if timer is running
      setIsPlaying(false);
    }
  }

  useEffect(() => {
    let intervalId = null;  //remembers the interval id
    // when isplaying is false it does not change any state hence will not go into infinite calls to useeffect

    if(isPlaying) {
      intervalId = setInterval(() => {
        if(time <= 0) {
          if(timeLab === "Session") {
            setTimeLab("Break");
            setTime(breakl);
          } else if(timeLab === "Break") {
            setTimeLab("Session");
            setTime(session);
          }
        } else {
          setTime(time - 1);  //decrements by one second, every second
          //tests
          console.log(time - 1);
        }
      }, 1000);
    } else if(!isPlaying) { //presumably this never runs because by the time isPlaying changes on triggering #playpause the component is unmounted from DOM and it keeps running with the state snapshots.
      clearInterval(intervalId);
    };

    return(() => {  // this statement runs every time when the component is unmounted from the dom, component is unmounted and remounted every time you click #playpause, without this return statement, intervals keeps accumulating and run infinitly with their state snapshots.
      clearInterval(intervalId);
    });
  }); //no dependencies make the use effect keeps running otherwise with blank array will make the useeffect run only once and force stop anything within including intervals

  function handleReset() {
    setBreakl(300);
    setSession(1500);
    setTime(1500); //equals to session
    setIsPlaying(false);  //status is paused apparantly
    setTimeLab("Session");
    document.getElementById('beep').pause();
    document.getElementById('beep').load();
  }

  function pretify() {
    let min = "00";
    let sec = "00";
    // initilizes minutes
    if((time/60) < 10) {
      min = "0" + Math.floor(time/60);
    } else if((time/60) >= 10) {
      min = Math.floor(time/60);
    };
    // initilizes seconds
    if((time % 60) < 10) {
      sec = "0" + (time % 60);
    } else if ((time % 60) >= 10) {
      sec = (time % 60);
    };
    // returns a concatenated string in 00:00 format
    if(min == "00" && time % 60 < 10) {
      return (<h1 className="low-time">{min + ":" + sec}</h1>);
    } else {
      return (<h1 className="high-time">{min + ":" + sec}</h1>);
    }
  }

  function pausePlayRender() {
    if(isPlaying) {
      return(<img src={pausebutton} alt="Pause" className="pause"></img>);
    } else if(!isPlaying) {
      return(<img src={playbutton} alt="Play" className="pause"></img>);
    }
  }

  function infoPanelBg() {
    if(timeLab === "Break") {
      return "greenBg";
    } else return "orangeBg";
  }

  return(
    <div>
      <div id="info-panel" className={infoPanelBg()}>
        <p id="timer-label">{timeLab}</p>
        <div id="time-left">{pretify()}</div>
        <div id="clock-controls">
          <button id="start_stop" onClick={handlePlayPause}>{pausePlayRender()}</button>
          <button id="reset" onClick={handleReset}><img src={resetbutton} alt="Reset" className="reset"></img></button>
        </div>
      </div>
    </div>
  );
}

//sound Component
function Sound({time}) {
  if(time === 0) {
    document.getElementById('beep').play();
  }
  return(
    <audio src={alarm_beep} type="audio/mpeg" id="beep"></audio>
  );
}

//Parent component
function App() {
  const [breakl, setBreakl] = useState(300);  // time in seconds
  const [session, setSession] = useState(1500); // time in seconds 
  const [time, setTime] = useState(1500);  //equal to session
  const [timeLab, setTimeLab] = useState("Session");  //remembers the initial time [breakl/session] equals to initial session
  const [isPlaying, setIsPlaying] = useState(false); //means its paused

  return(
    <div id="background">
      <h1 id="heading">25 + 5 Clock</h1>
      <div>
        <BreakLength breakl={breakl} setBreakl={setBreakl} setTime={setTime} timeLab={timeLab} isPlaying={isPlaying} />
        <SessionLength session={session} setSession={setSession} setTime={setTime} timeLab={timeLab} isPlaying={isPlaying} />
        <Clock breakl={breakl} setBreakl={setBreakl} session={session} setSession={setSession} time={time} setTime={setTime} isPlaying={isPlaying} setIsPlaying={setIsPlaying} timeLab={timeLab} setTimeLab={setTimeLab} />
        <Sound time={time} />
      </div>
      <div id="footer">
        <p id="credit">Designed and Coded by</p>
        <p id="author"><a href="https://github.com/aniketgunjekar" target="_blank">Aniket Gunjekar</a></p>
      </div>
    </div>
  );
}

