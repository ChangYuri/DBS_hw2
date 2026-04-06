'use client';

interface EditorProps {
  content: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function Editor({ content, onChange, placeholder }: EditorProps) {
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "What's on your mind today?"}
      className="w-full flex-1 min-h-[60vh] resize-none bg-transparent font-serif text-lg leading-8 text-stone-800 placeholder:text-stone-300 focus:outline-none"
    />
  );
}
