"use client";

import { useEffect, useState } from 'react';

/**
 * Quiz component generates fill-in-the-blank questions from the stored notes.
 * It fetches a question from the API and allows the user to submit an answer.
 */
export default function Quiz() {
  const [quiz, setQuiz] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  async function fetchQuiz() {
    try {
      const res = await fetch('/api/quiz');
      const data = await res.json();
      setQuiz(data && data.question ? data : null);
      setAnswer('');
      setFeedback('');
    } catch (err) {
      console.error('Failed to fetch quiz', err);
    }
  }

  useEffect(() => {
    fetchQuiz();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!quiz) return;
    const normalize = s => s.trim().toLowerCase();
    if (normalize(answer) === normalize(quiz.answer)) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Incorrect. Answer: ${quiz.answer}`);
    }
  }

  return (
    <div>
      <h3>Quiz Yourself</h3>
      {!quiz && <p className="muted">Need more notes to generate questions.</p>}
      {quiz && <p style={{ fontSize: 16 }}>{quiz.question}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your answer"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
        />
        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
          <button type="submit">Submit</button>
          <button type="button" onClick={fetchQuiz}>New Question</button>
        </div>
      </form>
      {!!feedback && <p style={{ marginTop: 8 }}>{feedback}</p>}
    </div>
  );
}