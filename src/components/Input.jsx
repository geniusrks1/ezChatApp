import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const updateChats = async (message) => {
    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion(message),
    });

    const updateUserData = async (userId) => {
      await updateDoc(doc(db, "userChats", userId), {
        [data.chatId + ".lastMessage"]: { text },
        [data.chatId + ".date"]: serverTimestamp(),
      });
    };

    await Promise.all([
      updateUserData(currentUser.uid),
      updateUserData(data.user.uid),
    ]);
  };

  const handleSend = async () => {
    setLoading(true);

    try {
      if (img && img instanceof File) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        await uploadTask;

        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        const message = {
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          img: downloadURL,
        };

        await updateChats(message);
      } else {
        const message = {
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        };

        await updateChats(message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }

    setText("");
    setImg(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend} disabled={loading}>
          {loading ? "Uploading..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Input;
