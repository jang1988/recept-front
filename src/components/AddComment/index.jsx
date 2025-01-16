import React, { useState } from "react";
import axios from "../../axios";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

export const Index = ({ postId, onAddComment, imageUrl, fullName }) => {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!commentText.trim()) return alert("Комментарий не может быть пустым");

    setIsSubmitting(true);
    try {
      const { data } = await axios.post("/comments", {
        text: commentText,
        postId,
        user: {
          fullName: fullName,
          avatarUrl: imageUrl,
        },
      });

      // Вызов функции для обновления списка комментариев
      onAddComment(data);

      // Очистка поля после успешной отправки
      setCommentText("");
    } catch (err) {
      console.error(err);
      alert("Не удалось отправить комментарий");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.root}>
      <Avatar classes={{ root: styles.avatar }} src={imageUrl} />
      <div className={styles.form}>
        <TextField
          label="Написать комментарий"
          variant="outlined"
          maxRows={10}
          multiline
          fullWidth
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Отправка..." : "Отправить"}
        </Button>
      </div>
    </div>
  );
};
