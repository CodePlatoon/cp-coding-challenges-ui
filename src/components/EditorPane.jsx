import Editor from '@monaco-editor/react';

export default function EditorPane({ value, onChange }) {
  return (
    <Editor
      height="100%"
      language="python"
      theme="vs-dark"
      value={value}
      onChange={onChange}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        tabSize: 4,
        automaticLayout: true,
      }}
    />
  );
}
