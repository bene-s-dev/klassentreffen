import React, { useState, useEffect, useMemo } from 'react';

export default function AiTitle({ text, className = '', as = 'h2', speed = 200 }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const words = useMemo(() => text.split(' ').filter(Boolean), [text]);

  useEffect(() => {
    setVisibleCount(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= words.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [words, speed]);

  const Tag = as;

  return (
    <Tag className={className}>
      {words.map((word, idx) => (
        <span
          key={`${word}-${idx}`}
          className={`inline-block mr-1.5 transition-all duration-350 ease-out ${
            idx < visibleCount
              ? 'opacity-100 translate-y-0 filter-none'
              : 'opacity-0 translate-y-2 blur-[3px]'
          }`}
        >
          {word}
        </span>
      ))}
      {visibleCount < words.length && (
        <span className="inline-block w-1.5 h-5 bg-fuchsia-400 animate-pulse align-middle ml-0.5 rounded-xs" />
      )}
    </Tag>
  );
}
