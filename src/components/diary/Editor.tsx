'use client';

interface EditorProps {
  content: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function Editor({ content, onChange, placeholder }: EditorProps) {
  return (
    <div className="editor-lines flex-1">
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Write something..."}
        className="w-full min-h-[60vh] resize-none bg-transparent font-serif text-lg text-stone-800 placeholder:text-stone-300 focus:outline-none"
        style={{ lineHeight: '32px', paddingTop: '4px' }}
      />
    </div>
  );
}
