'use client';

import { useState, type FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import styles from './SpotDiscussion.module.css';

type Reaction = 'like' | 'dislike' | null;
type CommentReaction = Exclude<Reaction, null>;

type SpotComment = {
  id: number;
  author: string;
  timeLabel: string;
  text: string;
  likes: number;
  dislikes: number;
  reaction: Reaction;
  isOwn: boolean;
};

const initialComments: SpotComment[] = [
  {
    id: 1,
    author: 'Nohea L.',
    timeLabel: '2 hours ago',
    text: 'Lots of outlets along the wall, and the printer is close. It gets busier around noon.',
    likes: 3,
    dislikes: 0,
    reaction: null,
    isOwn: false,
  },
];

export default function SpotDiscussion() {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [draft, setDraft] = useState('');
  const isAuthenticated = status === 'authenticated' && Boolean(session?.user?.email);

  function addComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();

    if (!isAuthenticated || !text) return;

    setComments((currentComments) => [
      {
        id: Math.max(0, ...currentComments.map((comment) => comment.id)) + 1,
        author: session.user.name || 'You',
        timeLabel: 'Just now',
        text,
        likes: 0,
        dislikes: 0,
        reaction: null,
        isOwn: true,
      },
      ...currentComments,
    ]);
    setDraft('');
  }

  function setReaction(commentId: number, reaction: CommentReaction) {
    if (!isAuthenticated) return;

    setComments((currentComments) =>
      currentComments.map((comment) => {
        if (comment.id !== commentId || comment.isOwn) return comment;

        const nextReaction = comment.reaction === reaction ? null : reaction;
        return {
          ...comment,
          likes:
            comment.likes +
            Number(nextReaction === 'like') -
            Number(comment.reaction === 'like'),
          dislikes:
            comment.dislikes +
            Number(nextReaction === 'dislike') -
            Number(comment.reaction === 'dislike'),
          reaction: nextReaction,
        };
      }),
    );
  }

  return (
    <section className={styles.discussion} aria-labelledby="spot-comments-title">
      <header className={styles.heading}>
        <p className={styles.eyebrow}>Campus notes</p>
        <h2 id="spot-comments-title">Comments</h2>
        <p>Share a quick update about studying here.</p>
      </header>

      {isAuthenticated ? (
        <form className={styles.form} onSubmit={addComment}>
          <label htmlFor="spot-comment">Leave a comment</label>
          <textarea
            id="spot-comment"
            className={styles.textarea}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={500}
            rows={4}
            placeholder="How is this spot today?"
          />
          <div className={styles.formFooter}>
            <span className={styles.note}>{draft.length}/500 characters</span>
            <button className={styles.submit} type="submit" disabled={!draft.trim()}>
              Post comment
            </button>
          </div>
        </form>
      ) : (
        <p className={styles.signInNotice} role="status">
          {status === 'loading' ? (
            'Checking sign-in status...'
          ) : (
            <>
              <Link href="/auth/signin">Sign in</Link> to leave a comment or react to one.
            </>
          )}
        </p>
      )}

      <div className={styles.comments}>
        {comments.map((comment) => (
          <article className={styles.comment} key={comment.id}>
            <header className={styles.commentHeader}>
              <strong>{comment.author}</strong>
              <time>{comment.timeLabel}</time>
            </header>
            <p className={styles.commentText}>{comment.text}</p>
            <div className={styles.reactions} aria-label={`Reactions to ${comment.author}'s comment`}>
              {comment.isOwn ? (
                <span className={styles.ownComment}>Your comment</span>
              ) : (
                <>
                  <button
                    className={styles.reactionButton}
                    type="button"
                    aria-label={`Like comment (${comment.likes})`}
                    aria-pressed={comment.reaction === 'like'}
                    disabled={!isAuthenticated}
                    onClick={() => setReaction(comment.id, 'like')}
                  >
                    <ThumbsUp size={16} aria-hidden="true" />
                    <span>{comment.likes}</span>
                  </button>
                  <button
                    className={styles.reactionButton}
                    type="button"
                    aria-label={`Dislike comment (${comment.dislikes})`}
                    aria-pressed={comment.reaction === 'dislike'}
                    disabled={!isAuthenticated}
                    onClick={() => setReaction(comment.id, 'dislike')}
                  >
                    <ThumbsDown size={16} aria-hidden="true" />
                    <span>{comment.dislikes}</span>
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
      <p className={styles.mockupNote}>Mockup only: comments and reactions are not saved.</p>
    </section>
  );
}
