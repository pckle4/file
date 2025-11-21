
import React, { useState } from 'react';
import { X, FileCode, Send, Code, Download } from 'lucide-react';
import { Button } from './Button';

interface CreateFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (file: File) => void;
}

const FILE_TYPES = [
  { name: 'Text File', ext: 'txt', mime: 'text/plain', template: 'Hello World!' },
  { name: 'Markdown', ext: 'md', mime: 'text/markdown', template: '# Hello World\n\nThis is a markdown file.' },
  { name: 'HTML', ext: 'html', mime: 'text/html', template: '<!DOCTYPE html>\n<html>\n<body>\n  <h1>Hello</h1>\n</body>\n</html>' },
  { name: 'CSS', ext: 'css', mime: 'text/css', template: 'body { background: #fff; color: #000; }' },
  { name: 'JavaScript', ext: 'js', mime: 'text/javascript', template: 'console.log("Hello World");' },
  { name: 'JSON', ext: 'json', mime: 'application/json', template: '{\n  "key": "value"\n}' },
  { name: 'Python', ext: 'py', mime: 'text/x-python', template: 'print("Hello World")' },
  { name: 'Java', ext: 'java', mime: 'text/x-java-source', template: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}' },
  { name: 'C++', ext: 'cpp', mime: 'text/x-c', template: '#include <iostream>\n\nint main() {\n    std::cout << "Hello World";\n    return 0;\n}' },
  { name: 'Go', ext: 'go', mime: 'text/x-go', template: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello World")\n}' },
  { name: 'SQL', ext: 'sql', mime: 'application/sql', template: 'SELECT * FROM users;' },
  { name: 'XML', ext: 'xml', mime: 'application/xml', template: '<?xml version="1.0"?>\n<root>\n  <item>Hello</item>\n</root>' },
  { name: 'YAML', ext: 'yaml', mime: 'text/yaml', template: 'key: value\nlist:\n  - item1\n  - item2' },
  { name: 'CSV', ext: 'csv', mime: 'text/csv', template: 'id,name,email\n1,John Doe,john@example.com' },
  { name: 'PHP', ext: 'php', mime: 'text/x-php', template: '<?php\necho "Hello World";\n?>' }
];

const getCommentSyntax = (ext: string) => {
  if (['js', 'ts', 'java', 'c', 'cpp', 'cs', 'php', 'go', 'css'].includes(ext)) return '//';
  if (['py', 'rb', 'sh', 'yaml', 'yml'].includes(ext)) return '#';
  if (['html', 'xml'].includes(ext)) return '<!-- -->';
  if (['sql'].includes(ext)) return '--';
  return null; 
};

export const CreateFileModal: React.FC<CreateFileModalProps> = ({ isOpen, onClose, onSend }) => {
  const [fileName, setFileName] = useState('untitled');
  const [selectedType, setSelectedType] = useState(FILE_TYPES[0]);
  const [content, setContent] = useState(FILE_TYPES[0].template);

  if (!isOpen) return null;

  const prepareFileContent = () => {
    // Don't append comments to strict formats like JSON or CSV to avoid corruption
    if (['json', 'csv'].includes(selectedType.ext)) {
       return content;
    }
    
    const commentStyle = getCommentSyntax(selectedType.ext);
    const timestamp = new Date().toLocaleString();
    const signatureText = `Created with nowhile at ${timestamp}`;
    
    if (commentStyle === '//' || commentStyle === '#' || commentStyle === '--') {
       return `${content}\n\n${commentStyle} ${signatureText}`;
    } else if (commentStyle === '<!-- -->') {
       return `${content}\n\n<!-- ${signatureText} -->`;
    }
    
    // Default for text/markdown
    return `${content}\n\n${signatureText}`;
  };

  const handleSend = () => {
    const finalContent = prepareFileContent();
    const fullFileName = `${fileName}.${selectedType.ext}`;
    const file = new File([finalContent], fullFileName, { type: selectedType.mime });
    onSend(file);
    onClose();
  };

  const handleDownload = () => {
    const finalContent = prepareFileContent();
    const fullFileName = `${fileName}.${selectedType.ext}`;
    const blob = new Blob([finalContent], { type: selectedType.mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fullFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTypeChange = (type: typeof FILE_TYPES[0]) => {
    setSelectedType(type);
    // Only change content if it matches the previous template to avoid overwriting user work
    const prevType = FILE_TYPES.find(t => t.mime === selectedType.mime);
    if (prevType && content === prevType.template) {
      setContent(type.template);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Create File</h3>
              <p className="text-xs text-slate-500">Write code or text and send instantly</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs uppercase text-slate-500 font-medium mb-1 block">Filename</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500">
                <input 
                  type="text" 
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="flex-1 bg-transparent border-none px-3 py-2.5 text-sm text-slate-900 focus:ring-0 placeholder:text-slate-400"
                  placeholder="filename"
                />
                <div className="px-3 py-2.5 bg-slate-100 text-slate-500 text-sm border-l border-slate-200">
                  .{selectedType.ext}
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-xs uppercase text-slate-500 font-medium mb-1 block">Type</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:ring-1 focus:ring-indigo-500 outline-none"
                value={selectedType.name}
                onChange={(e) => handleTypeChange(FILE_TYPES.find(t => t.name === e.target.value)!)}
              >
                {FILE_TYPES.map(t => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-[300px]">
            <label className="text-xs uppercase text-slate-500 font-medium mb-1 block">Content</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-sm text-slate-700 leading-relaxed focus:ring-1 focus:ring-indigo-500 outline-none resize-none shadow-inner"
              spellCheck={false}
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="secondary" onClick={handleDownload}>
             <Download className="w-4 h-4" /> Download
          </Button>
          <Button onClick={handleSend}>
            <Send className="w-4 h-4" />
            Create & Queue
          </Button>
        </div>
      </div>
    </div>
  );
};
