import { useState } from "react";
import { replyToContact } from "../services/contactService";
import { getApiErrorMessage } from "../utils/apiError";
import { notifyError, notifySuccess } from "../utils/toast";

function ContactCard({ contact, viewerRole, onDelete, onReply }) {
  const agent = contact.property_details?.agent;
  const isAgentView = viewerRole === "AGENT" || viewerRole === "ADMIN";
  const [replyBody, setReplyBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyBody.trim()) return;

    setSubmitting(true);
    try {
      const response = await replyToContact(contact.id, { body: replyBody });
      setReplyBody("");
      notifySuccess("Reply sent");
      if (onReply) {
        onReply(contact.id, response.data);
      }
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Failed to send reply"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="contact-card glass-card">
      <div className="contact-header">
        <h3>{contact.property_details?.title}</h3>
        <time>
          {new Date(contact.created_at).toLocaleDateString(undefined, {
            dateStyle: "medium",
          })}
        </time>
      </div>

      <p className="contact-message">{contact.message}</p>

      <div className="contact-footer">
        {isAgentView ? (
          <>
            <p>
              <b>Buyer:</b> {contact.user_username}
            </p>
            <p>{contact.user_email}</p>
            {contact.user_phone && <p>{contact.user_phone}</p>}
          </>
        ) : (
          <>
            <p>
              <b>Agent:</b> {agent?.username}
            </p>
            <p>{agent?.email}</p>
            {agent?.phone && <p>{agent?.phone}</p>}
          </>
        )}
      </div>

      {contact.replies?.length > 0 && (
        <div className="reply-thread">
          {contact.replies.map((reply) => {
            const isOwnReply =
              reply.sender_username === contact.user_username ||
              reply.sender_role === viewerRole;

            return (
              <div
                key={reply.id}
                className={`reply-bubble ${isOwnReply ? "reply-self" : "reply-other"}`}
              >
                <div className="reply-meta">
                  <strong>{reply.sender_username}</strong>
                  <time>
                    {new Date(reply.created_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                </div>
                <p>{reply.body}</p>
              </div>
            );
          })}
        </div>
      )}

      <form className="contact-reply-form" onSubmit={handleReply}>
        <textarea
          placeholder={
            isAgentView ? "Reply to the buyer..." : "Reply to the agent..."
          }
          value={replyBody}
          onChange={(e) => setReplyBody(e.target.value)}
          required
          rows={3}
        />
        <div className="contact-reply-actions">
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={submitting}
          >
            {submitting ? "Sending..." : "Send reply"}
          </button>
        </div>
      </form>

      <button
        type="button"
        className="btn btn-danger btn-sm"
        onClick={() => onDelete(contact.id)}
      >
        Delete
      </button>
    </article>
  );
}

export default ContactCard;
