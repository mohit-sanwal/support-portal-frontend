"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCommentsApi, addCommentApi } from "../../lib/api";
import { User } from "../../types";
import CommentItem from "./CommentItem";
import styles from "./comments.module.css";

export default function Comments({
  ticketId,
  user,
}: {
  ticketId: number;
  user: User | null;
}) {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const loadComments = async () => {
    setLoading(true);

    try {
      const data = await getCommentsApi(ticketId);
      setComments(data);
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleAdd = async () => {
    if (!text.trim()) return;

    await addCommentApi(ticketId, {
      content: text,
    });

    setText("");
    loadComments();
  };

  return (
    <div className={styles.comments}>
      <h4 className={styles.title}>Discussion</h4>

      {/* Add comment */}
      <div className={styles.commentInput}>
        <input
          className={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
        />

        <button className={styles.btn} onClick={handleAdd}>
          Comment
        </button>
      </div>

      {/* LOADER */}
      {loading && (
        <div className={styles.commentLoader}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      {/* EMPTY */}
      {!loading && comments.length === 0 && (
        <div className={styles.emptyComments}>
          No discussion yet
        </div>
      )}

      {/* COMMENTS */}
      {!loading &&
        comments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            ticketId={ticketId}
            refresh={loadComments}
            level={0}
            currentUser={user}
          />
        ))}
    </div>
  );
}