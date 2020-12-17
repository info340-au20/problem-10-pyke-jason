import React, { useState, useEffect } from "react"; //import React Component
import Moment from "react-moment";
import "./Chirper.css"; //load module-specific CSS
import firebase from "firebase/app";
//A list of chirps that have been posted
export default function ChirpList(props) {
  const [chirps, setChirps] = useState([]); //an array!

  useEffect(() => {
    const chirpsRef = firebase.database().ref("chirps");
    const chirpsListener = chirpsRef.on("value", (snapshot) => {
      const chirpData = snapshot.val();
      let chirpArray = Object.keys(chirpData)
        .map((x) => {
          let res = { ...chirpData[x] };
          res.key = x;
          return res;
        })
        .sort((x) => -x.time);
      setChirps(chirpArray);
    });
    return function cleanup() {
      chirpsRef.off();
    }
  }, []);

  if (chirps.length === 0) return null; //if no chirps, don't display

  /* TODO: produce a list of `<ChirpItems>` to render */
  let chirpItems = chirps.map((x) => (
    <ChirpItem key={x.key} chirp={x} currentUser={props.currentUser} />
  )); //REPLACE THIS with an array of actual values!

  return <div className="container">{chirpItems}</div>;
}

//A single Chirp
function ChirpItem(props) {
  const likeChirp = () => {
    let newLikes = props.chirp.likes ?? {};
    const uid = props.currentUser.uid;
    if(newLikes.hasOwnProperty(uid)){
      delete newLikes[uid];
    }
    else{
      newLikes[uid] = true;
    }
    firebase
      .database()
      .ref(`chirps/${props.chirp.key}/likes`)
      .set(newLikes)
      .catch((x) => console.log(x.message));
  };

  let chirp = props.chirp; //current chirp (convenience)

  //counting likes
  let likeCount = 0; //count likes
  let userLikes = false; //current user has liked
  if (chirp.likes) {
    likeCount = Object.keys(chirp.likes).length;
    if (chirp.likes[props.currentUser.uid])
      //if user id is listed
      userLikes = true; //user liked!
  }

  return (
    <div className="row py-4 bg-white border">
      <div className="col-1">
        <img
          className="avatar"
          src={chirp.userPhoto}
          alt={chirp.userName + " avatar"}
        />
      </div>
      <div className="col pl-4 pl-lg-1">
        <span className="handle">
          {chirp.userName} {/*space*/}
        </span>

        <span className="time">
          <Moment date={chirp.time} fromNow />
        </span>

        <div className="chirp">{chirp.text}</div>

        {/* A section for showing chirp likes */}
        <div className="likes">
          <i
            className={"fa fa-heart " + (userLikes ? "user-liked" : "")}
            aria-label="like"
            onClick={likeChirp}
          ></i>
          <span>
            {/*space*/} {likeCount}
          </span>
        </div>
      </div>
    </div>
  );
}
