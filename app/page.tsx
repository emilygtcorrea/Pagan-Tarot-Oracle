"use client";

import { useRef } from "react";
import { useChat } from "ai/react";
import clsx from "clsx";
import {
  VercelIcon,
  GithubIcon,
  LoadingCircle,
  SendIcon,
  UserIcon,
} from "./icons";
import Textarea from "react-textarea-autosize";
import Image from "next/image";

const examples = [
  "What question should I ask the cards today?",
  "I pulled the Seven of Swords. What does that mean?",
  "Suggest a card to inspire me.",
];

export default function Chat() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, input, setInput, handleSubmit, isLoading } = useChat({
    onResponse: (response) => {
      if (response.status === 429) {
        window.alert("You have reached your request limit for the day.");
        return;
      }
    },
  });

  const disabled = isLoading || input.length === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Cinzel:wght@400;500&display=swap');

        :root {
          --deep: #0d0a14;
          --void: #130e1f;
          --smoke: #1e1530;
          --mist: #2a1d42;
          --purple-dark: #3d2460;
          --purple-mid: #6b3fa0;
          --purple-light: #9b6fd4;
          --lavender: #c4a8e8;
          --magenta-deep: #7a1f5e;
          --magenta: #c0366e;
          --magenta-bright: #e8518a;
          --rose: #f0a0c0;
          --mist-white: rgba(196, 168, 232, 0.08);
          --border-glow: rgba(155, 111, 212, 0.25);
          --text-body: #d4b8f0;
          --text-dim: rgba(196, 168, 232, 0.5);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background-color: var(--deep);
          font-family: 'Cormorant Garamond', Georgia, serif;
          color: var(--text-body);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* Atmospheric background */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 0%, rgba(107, 63, 160, 0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(192, 54, 110, 0.15) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(61, 36, 96, 0.3) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* Noise grain overlay */
        body::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.35;
          pointer-events: none;
          z-index: 0;
        }

        main {
          position: relative;
          z-index: 1;
        }

        /* Welcome card */
        .welcome-card {
          background: linear-gradient(145deg, rgba(30, 21, 48, 0.95) 0%, rgba(19, 14, 31, 0.98) 100%);
          border: 1px solid var(--border-glow);
          border-radius: 2px;
          box-shadow:
            0 0 40px rgba(107, 63, 160, 0.12),
            0 0 80px rgba(192, 54, 110, 0.06),
            inset 0 1px 0 rgba(196, 168, 232, 0.1);
          overflow: hidden;
        }

        .welcome-header {
          padding: 2.5rem 2.5rem 2rem;
        }

        .welcome-title {
          font-family: 'Cinzel', serif;
          font-size: 2rem;
          font-weight: 400;
          letter-spacing: 0.12em;
          background: linear-gradient(135deg, var(--lavender) 0%, var(--magenta-bright) 60%, var(--rose) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0.75rem 0 0.5rem;
        }

        .welcome-eyebrow {
          font-size: 0.75rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--text-dim);
          font-style: italic;
        }

        .welcome-tagline {
          font-size: 1.1rem;
          font-style: italic;
          color: var(--text-body);
          line-height: 1.7;
          opacity: 0.85;
        }

        /* Divider with glow */
        .welcome-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--purple-mid), var(--magenta), transparent);
          opacity: 0.4;
        }

        /* Example prompts section */
        .prompts-section {
          padding: 1.75rem 2.5rem 2.25rem;
          background: rgba(13, 10, 20, 0.4);
        }

        .prompts-label {
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--text-dim);
          margin-bottom: 1rem;
        }

        .prompt-btn {
          display: block;
          width: 100%;
          text-align: left;
          background: rgba(196, 168, 232, 0.04);
          border: 1px solid rgba(155, 111, 212, 0.18);
          border-radius: 2px;
          padding: 0.85rem 1.25rem;
          color: var(--lavender);
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.95rem;
          font-style: italic;
          cursor: pointer;
          transition: all 0.25s ease;
          margin-bottom: 0.6rem;
        }

        .prompt-btn:hover {
          background: rgba(155, 111, 212, 0.12);
          border-color: rgba(155, 111, 212, 0.45);
          color: var(--rose);
          box-shadow: 0 0 20px rgba(192, 54, 110, 0.1);
        }

        /* Message rows */
        .message-row {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 1.75rem 0;
          border-bottom: 1px solid rgba(155, 111, 212, 0.1);
        }

        .message-row.user {
          background: rgba(13, 10, 20, 0.5);
        }

        .message-row.assistant {
          background: rgba(30, 21, 48, 0.4);
        }

        .message-inner {
          display: flex;
          width: 100%;
          max-width: 680px;
          align-items: flex-start;
          gap: 1rem;
          padding: 0 1.25rem;
        }

        .avatar {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
        }

        .avatar.user {
          background: linear-gradient(135deg, var(--purple-dark), var(--magenta-deep));
          border: 1px solid rgba(155, 111, 212, 0.3);
        }

        .avatar.assistant {
          background: transparent;
          border: 1px solid var(--border-glow);
          overflow: hidden;
        }

        .message-text {
          font-size: 1.05rem;
          line-height: 1.8;
          color: var(--text-body);
          flex: 1;
          padding-top: 0.35rem;
        }

        .message-row.user .message-text {
          color: var(--lavender);
          font-style: italic;
        }

        .message-row.assistant .message-text {
          color: var(--text-body);
        }

        /* Input area */
        .input-area {
          position: fixed;
          bottom: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem 1.25rem 1rem;
          background: linear-gradient(to bottom, transparent, var(--void) 40%);
          gap: 0.75rem;
        }

        .input-form {
          position: relative;
          width: 100%;
          max-width: 680px;
          background: rgba(30, 21, 48, 0.95);
          border: 1px solid var(--border-glow);
          border-radius: 2px;
          padding: 0.85rem 3rem 0.85rem 1.25rem;
          box-shadow:
            0 0 30px rgba(107, 63, 160, 0.15),
            0 0 60px rgba(192, 54, 110, 0.08);
          backdrop-filter: blur(12px);
        }

        .input-form:focus-within {
          border-color: rgba(155, 111, 212, 0.5);
          box-shadow:
            0 0 40px rgba(107, 63, 160, 0.2),
            0 0 80px rgba(192, 54, 110, 0.1);
        }

        textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          color: var(--lavender);
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-style: italic;
          line-height: 1.6;
          caret-color: var(--magenta-bright);
        }

        textarea::placeholder {
          color: var(--text-dim);
          font-style: italic;
        }

        .send-btn {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .send-btn.active {
          background: linear-gradient(135deg, var(--purple-mid), var(--magenta));
          box-shadow: 0 0 16px rgba(192, 54, 110, 0.4);
        }

        .send-btn.active:hover {
          background: linear-gradient(135deg, var(--purple-light), var(--magenta-bright));
          box-shadow: 0 0 24px rgba(232, 81, 138, 0.5);
        }

        .send-btn.inactive {
          background: transparent;
          cursor: not-allowed;
        }

        .footer-text {
          font-size: 0.7rem;
          color: var(--text-dim);
          text-align: center;
          letter-spacing: 0.05em;
        }

        .footer-text a {
          color: rgba(196, 168, 232, 0.6);
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-text a:hover {
          color: var(--rose);
        }

        /* Decorative sigil dots */
        .sigil {
          display: inline-block;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--magenta);
          margin: 0 6px;
          vertical-align: middle;
          opacity: 0.6;
        }
      `}</style>

      <main className="flex flex-col items-center justify-between pb-40">
        {messages.length > 0 ? (
          messages.map((message, i) => (
            <div
              key={i}
              className={clsx("message-row", message.role === "user" ? "user" : "assistant")}
            >
              <div className="message-inner">
                <div className={clsx("avatar", message.role === "user" ? "user" : "assistant")}>
                  {message.role === "user" ? (
                    <UserIcon />
                  ) : (
                    <Image
                      src="/sample-image.png"
                      alt="Mab"
                      width={36}
                      height={36}
                    />
                  )}
                </div>
                <div className="message-text">
                  {message.content}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className="welcome-card mx-5 mt-20 sm:mx-0 sm:w-full"
            style={{ maxWidth: '680px', width: '100%' }}
          >
            <div className="welcome-header">
              <Image
                src="/sample-image.png"
                alt="Mab"
                width={52}
                height={52}
                style={{ borderRadius: '50%', border: '1px solid rgba(155,111,212,0.3)' }}
              />
              <p className="welcome-eyebrow" style={{ marginTop: '1.25rem' }}>
                oracle <span className="sigil" /> threshold-keeper <span className="sigil" /> dream-reader
              </p>
              <h1 className="welcome-title">Mab</h1>
              <p className="welcome-tagline">
                Something brought you here. Pull a card and let's find out what.
              </p>
            </div>

            <div className="welcome-divider" />

            <div className="prompts-section">
              <p className="prompts-label">ask the cards</p>
              {examples.map((example, i) => (
                <button
                  key={i}
                  className="prompt-btn"
                  onClick={() => {
                    setInput(example);
                    inputRef.current?.focus();
                  }}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="input-area">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="input-form"
          >
            <Textarea
              ref={inputRef}
              tabIndex={0}
              required
              rows={1}
              autoFocus
              placeholder="Ask the cards something…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  formRef.current?.requestSubmit();
                  e.preventDefault();
                }
              }}
              spellCheck={false}
            />
            <button
              className={clsx("send-btn", disabled ? "inactive" : "active")}
              disabled={disabled}
            >
              {isLoading ? (
                <LoadingCircle />
              ) : (
                <SendIcon
                  className={clsx(
                    "h-4 w-4",
                    input.length === 0 ? "text-gray-600" : "text-white",
                  )}
                />
              )}
            </button>
          </form>

          <p className="footer-text">
            Built with{" "}
            <a href="https://sdk.vercel.ai/docs" target="_blank" rel="noopener noreferrer">
              Vercel AI SDK
            </a>
            {" · "}
            <a
              href="https://openai.com/blog/gpt-3-5-turbo-fine-tuning-and-api-updates"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenAI GPT-3.5-turbo
            </a>
            {" · "}
            a course by{" "}
            <a href="https://linkin.bio/yallahalim/" target="_blank" rel="noopener noreferrer">
              Halim Madi
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
