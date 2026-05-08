"use client";

import { useState } from "react";
import styles from "./comments.module.css";
import { formatDate } from "../../utils";

import {
  addCommentApi,
  updateCommentApi,
  deleteCommentApi,
} from "../../lib/api";

export default function CommentItem({
  comment,
  ticketId,
  refresh,
  level,
  currentUser,
}: any) {
  const [showReply, setShowReply] = useState(false);
  const [text, setText] = useState("");

  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  const canModify =
    currentUser?.role !== "user" ||
    currentUser?.id === comment.user_id;

  const handleReply = async () => {
    if (!text.trim()) return;

    await addCommentApi(ticketId, {
      content: text,
      parent_id: comment.id,
    });

    setText("");
    setShowReply(false);
    refresh();
  };

  const handleEdit = async () => {
    if (!editText.trim()) return;

    await updateCommentApi(comment.id, {
      content: editText,
    });

    setEditing(false);
    refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return;

    await deleteCommentApi(comment.id);
    refresh();
  };

  return (
    <div
      className={styles.commentWrapper}
      style={{ marginLeft: level * 18 }}
    >
      <div className={styles.commentBox}>

        {/* AVATAR */}
        <div className={styles.avatar}>
          {(comment.username || "U")[0].toUpperCase()}
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.commentBody}>

          {/* TOP */}
          <div className={styles.commentTop}>
            <span className={styles.username}>
              {comment.username || "Unknown"}
            </span>

            <span className={styles.time}>
              {formatDate(comment.created_at)}
            </span>
          </div>

          {/* CONTENT */}
          {editing ? (
            <div className={styles.replyBox}>
              <input
                className={styles.input}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />

              <button
                className={styles.btn}
                onClick={handleEdit}
              >
                Save
              </button>
            </div>
          ) : comment.content === "[deleted]" ? (
            <div className={styles.deleted}>
              Comment deleted
            </div>
          ) : (
            <div className={styles.commentContent}>
              {comment.content}
            </div>
          )}

          {/* ACTIONS */}
          <div className={styles.commentActions}>
            <button
              className={styles.actionBtn}
              onClick={() =>
                setShowReply(!showReply)
              }
            >
              Reply
            </button>

            {canModify && (
              <>
                <button
                  className={styles.actionBtn}
                  onClick={() =>
                    setEditing(!editing)
                  }
                >
                  Edit
                </button>

                <button
                  className={styles.actionBtn}
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </>
            )}
          </div>

          {/* REPLY BOX */}
          {showReply && (
            <div className={styles.replyBox}>
              <input
                className={styles.input}
                value={text}
                onChange={(e) =>
                  setText(e.target.value)
                }
                placeholder="Reply..."
              />

              <button
                className={styles.btn}
                onClick={handleReply}
              >
                Send
              </button>

              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setText("");
                  setShowReply(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* REPLIES */}
      {comment.replies?.length > 0 && (
        <div className={styles.replies}>
          {comment.replies.map((r: any) => (
            <CommentItem
              key={r.id}
              comment={r}
              ticketId={ticketId}
              refresh={refresh}
              level={level + 1}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}
    </div>
  );
}