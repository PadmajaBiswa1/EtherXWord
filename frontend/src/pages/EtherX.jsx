import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Copy, Scissors, Clipboard, Paintbrush, ChevronDown, Search, RotateCcw, Type,
  FileText, Image, Table, Link2, MessageSquare, FileImage, Shapes, Plus, Minus,
  Eye, EyeOff, Grid, Printer, ZoomIn, ZoomOut, Save, FolderOpen, FileDown,
  List, ListOrdered, IndentDecrease, IndentIncrease, Highlighter, Palette, X, Minimize2, Maximize2,
  BookOpen, Layout, Mail, Check, Globe, Monitor, Book, Subscript, Superscript
} from 'lucide-react';

console.log('✅ EtherX.jsx loaded successfully');

// ============================================================
// ETHERX — Microsoft Word Clone
// ============================================================

// === CONSTANTS ===

const FONTS = [
  'Arial', 'Times New Roman', 'Calibri', 'Georgia', 'Verdana', 
  'Courier New', 'Trebuchet MS', 'Comic Sans MS', 'Garamond', 
  'Palatino', 'Tahoma', 'Cambria', 'Consolas', 'Segoe UI'
];

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

const LINE_SPACINGS = [
  { label: '1.0', value: '1' },
  { label: '1.15', value: '1.15' },
  { label: '1.5', value: '1.5' },
  { label: '2.0', value: '2' },
  { label: '2.5', value: '2.5' },
  { label: '3.0', value: '3' }
];

const ALIGNMENTS = ['left', 'center', 'right', 'justify'];

const VIEW_MODES = { PRINT: 'print', READ: 'read', WEB: 'web' };

const RIBBON_TABS = [
  'File', 'Home', 'Insert', 'Design', 'Layout', 'References', 'Review', 'View', 'Help'
];

const PAGE_SIZES = {
  A4: { width: 794, height: 1123 },
  Letter: { width: 816, height: 1056 },
  Legal: { width: 816, height: 1344 }
};

const MARGIN_PRESETS = {
  Normal: { top: 96, right: 96, bottom: 96, left: 96 },
  Narrow: { top: 48, right: 48, bottom: 48, left: 48 },
  Wide: { top: 96, right: 144, bottom: 96, left: 144 },
  Moderate: { top: 72, right: 72, bottom: 72, left: 72 }
};

const COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#2B579A', '#C55A11', '#1D6F42', '#7030A0', '#BF9000',
  '#808080', '#C0C0C0', '#800000', '#008000', '#000080'
];

const STYLES_GALLERY = [
  { name: 'Normal', css: { fontSize: '11pt', fontFamily: 'Calibri' } },
  { name: 'No Spacing', css: { fontSize: '11pt', lineHeight: '1', margin: '0' } },
  { name: 'Heading 1', css: { fontSize: '16pt', fontWeight: 'bold', color: '#2B579A' } },
  { name: 'Heading 2', css: { fontSize: '13pt', fontWeight: 'bold', color: '#2B579A' } },
  { name: 'Heading 3', css: { fontSize: '11pt', fontWeight: 'bold', color: '#1F4D78' } },
  { name: 'Title', css: { fontSize: '28pt', fontWeight: 'bold' } },
  { name: 'Subtitle', css: { fontSize: '14pt', fontStyle: 'italic', color: '#666' } },
  { name: 'Quote', css: { fontSize: '11pt', fontStyle: 'italic', borderLeft: '4px solid #ccc', paddingLeft: '10px' } }
];

// === HELPER FUNCTIONS ===

function countWords(text) {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

function countChars(text) {
  return text.length;
}

function countCharsNoSpaces(text) {
  return text.replace(/\s/g, '').length;
}

function applyFormat(command, value = null) {
  document.execCommand(command, false, value);
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function uid() {
  return Math.random().toString(36).slice(2, 11);
}

// === CUSTOM HOOKS ===

function useDocumentStats(editorRef) {
  const [stats, setStats] = useState({ words: 0, chars: 0, charsNoSpaces: 0, pages: 1, paragraphs: 0 });

  const update = useCallback(
    debounce(() => {
      if (!editorRef.current) return;
      const text = editorRef.current.innerText || '';
      const words = countWords(text);
      const chars = countChars(text);
      const charsNoSpaces = countCharsNoSpaces(text);
      const paragraphs = text.split(/\n+/).filter(p => p.trim()).length;
      const h = editorRef.current.scrollHeight;
      const pages = Math.max(1, Math.ceil(h / PAGE_SIZES.A4.height));
      setStats({ words, chars, charsNoSpaces, pages, paragraphs });
    }, 300),
    [editorRef]
  );

  return { stats, update };
}

function useFormatState() {
  const [fmt, setFmt] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    align: 'left',
    fontFamily: 'Calibri',
    fontSize: '11'
  });

  const refresh = useCallback(() => {
    try {
      setFmt({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikethrough: document.queryCommandState('strikeThrough'),
        align: ALIGNMENTS.find(a => 
          document.queryCommandState('justify' + a[0].toUpperCase() + a.slice(1))
        ) || 'left',
        fontFamily: document.queryCommandValue('fontName') || 'Calibri',
        fontSize: document.queryCommandValue('fontSize') || '3'
      });
    } catch (e) {
      // Ignore errors from queryCommand
    }
  }, []);

  return { fmt, refresh };
}

function useDialogs() {
  const [open, setOpen] = useState(null);
  return {
    active: open,
    openDialog: (name) => setOpen(name),
    closeDialog: () => setOpen(null),
    isOpen: (name) => open === name
  };
}

function useComments() {
  const [comments, setComments] = useState([]);

  const addComment = (text) => setComments(c => [...c, {
    id: uid(),
    text,
    resolved: false,
    date: new Date().toLocaleDateString(),
    author: 'You'
  }]);

  const resolveComment = (id) => setComments(c => c.map(x => x.id === id ? { ...x, resolved: true } : x));
  const deleteComment = (id) => setComments(c => c.filter(x => x.id !== id));

  return { comments, addComment, resolveComment, deleteComment };
}

function useRecentFiles() {
  const [files, setFiles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('etherx_recent') || '[]');
    } catch {
      return [];
    }
  });

  const addFile = (name) => {
    const updated = [name, ...files.filter(f => f !== name)].slice(0, 10);
    setFiles(updated);
    localStorage.setItem('etherx_recent', JSON.stringify(updated));
  };

  return { files, addFile };
}

// === SMALL COMPONENTS ===

function RibbonButton({ icon: Icon, label, active, onClick, disabled, dropdown }) {
  return (
    <button
      className={`ribbon-btn ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={label}
    >
      {Icon && <Icon size={16} />}
      {label && <span className="btn-label">{label}</span>}
      {dropdown && <ChevronDown size={12} className="dropdown-icon" />}
    </button>
  );
}

function RibbonGroup({ label, children }) {
  return (
    <div className="ribbon-group">
      <div className="ribbon-group-content">{children}</div>
      <div className="ribbon-group-label">{label}</div>
    </div>
  );
}

function Dropdown({ isOpen, items, onSelect, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = () => onClose();
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="dropdown-menu">
      {items.map((item, i) => (
        <div
          key={i}
          className="dropdown-item"
          onClick={() => { onSelect(item); onClose(); }}
        >
          {item.label || item}
        </div>
      ))}
    </div>
  );
}

function ColorPicker({ isOpen, onSelect, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="color-picker">
      <div className="color-grid">
        {COLORS.map(color => (
          <div
            key={color}
            className="color-swatch"
            style={{ backgroundColor: color }}
            onClick={() => { onSelect(color); onClose(); }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}

// === RIBBON COMPONENTS ===

function RibbonHome({ fmt, onFormat, onDialog, editorRef }) {
  const [fontDropdown, setFontDropdown] = useState(false);
  const [sizeDropdown, setSizeDropdown] = useState(false);
  const [highlightPicker, setHighlightPicker] = useState(false);
  const [colorPicker, setColorPicker] = useState(false);
  const [lineSpacingDropdown, setLineSpacingDropdown] = useState(false);

  return (
    <div className="ribbon-content">
      <RibbonGroup label="Clipboard">
        <div className="btn-row">
          <RibbonButton icon={Clipboard} label="Paste" dropdown onClick={() => applyFormat('paste')} />
        </div>
        <div className="btn-row">
          <RibbonButton icon={Scissors} onClick={() => applyFormat('cut')} title="Cut" />
          <RibbonButton icon={Copy} onClick={() => applyFormat('copy')} title="Copy" />
          <RibbonButton icon={Paintbrush} title="Format Painter" />
        </div>
      </RibbonGroup>

      <RibbonGroup label="Font">
        <div className="font-controls">
          <div className="font-select-wrapper">
            <button className="font-select" onClick={() => setFontDropdown(!fontDropdown)}>
              {fmt.fontFamily} <ChevronDown size={12} />
            </button>
            {fontDropdown && (
              <div className="dropdown-menu">
                {FONTS.map(font => (
                  <div
                    key={font}
                    className="dropdown-item"
                    style={{ fontFamily: font }}
                    onClick={() => { applyFormat('fontName', font); setFontDropdown(false); }}
                  >
                    {font}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="font-size-wrapper">
            <button className="font-size-select" onClick={() => setSizeDropdown(!sizeDropdown)}>
              {fmt.fontSize} <ChevronDown size={12} />
            </button>
            {sizeDropdown && (
              <div className="dropdown-menu">
                {FONT_SIZES.map(size => (
                  <div
                    key={size}
                    className="dropdown-item"
                    onClick={() => { applyFormat('fontSize', size); setSizeDropdown(false); }}
                  >
                    {size}
                  </div>
                ))}
              </div>
            )}
          </div>

          <RibbonButton icon={Plus} onClick={() => applyFormat('increaseFontSize')} title="Grow Font" />
          <RibbonButton icon={Minus} onClick={() => applyFormat('decreaseFontSize')} title="Shrink Font" />
        </div>

        <div className="btn-row">
          <RibbonButton icon={Bold} active={fmt.bold} onClick={() => applyFormat('bold')} title="Bold" />
          <RibbonButton icon={Italic} active={fmt.italic} onClick={() => applyFormat('italic')} title="Italic" />
          <RibbonButton icon={Underline} active={fmt.underline} onClick={() => applyFormat('underline')} title="Underline" />
          <RibbonButton icon={Strikethrough} active={fmt.strikethrough} onClick={() => applyFormat('strikeThrough')} title="Strikethrough" />
          <RibbonButton icon={Subscript} onClick={() => applyFormat('subscript')} title="Subscript" />
          <RibbonButton icon={Superscript} onClick={() => applyFormat('superscript')} title="Superscript" />
          
          <div className="color-btn-wrapper">
            <button className="ribbon-btn" onClick={() => setHighlightPicker(!highlightPicker)} title="Highlight">
              <Highlighter size={16} />
            </button>
            {highlightPicker && (
              <ColorPicker
                isOpen={highlightPicker}
                onSelect={(color) => applyFormat('hiliteColor', color)}
                onClose={() => setHighlightPicker(false)}
              />
            )}
          </div>

          <div className="color-btn-wrapper">
            <button className="ribbon-btn" onClick={() => setColorPicker(!colorPicker)} title="Font Color">
              <Palette size={16} />
            </button>
            {colorPicker && (
              <ColorPicker
                isOpen={colorPicker}
                onSelect={(color) => applyFormat('foreColor', color)}
                onClose={() => setColorPicker(false)}
              />
            )}
          </div>
        </div>
      </RibbonGroup>

      <RibbonGroup label="Paragraph">
        <div className="btn-row">
          <RibbonButton icon={List} onClick={() => applyFormat('insertUnorderedList')} title="Bullets" />
          <RibbonButton icon={ListOrdered} onClick={() => applyFormat('insertOrderedList')} title="Numbering" />
          <RibbonButton icon={IndentDecrease} onClick={() => applyFormat('outdent')} title="Decrease Indent" />
          <RibbonButton icon={IndentIncrease} onClick={() => applyFormat('indent')} title="Increase Indent" />
        </div>
        <div className="btn-row">
          <RibbonButton
            icon={AlignLeft}
            active={fmt.align === 'left'}
            onClick={() => applyFormat('justifyLeft')}
            title="Align Left"
          />
          <RibbonButton
            icon={AlignCenter}
            active={fmt.align === 'center'}
            onClick={() => applyFormat('justifyCenter')}
            title="Center"
          />
          <RibbonButton
            icon={AlignRight}
            active={fmt.align === 'right'}
            onClick={() => applyFormat('justifyRight')}
            title="Align Right"
          />
          <RibbonButton
            icon={AlignJustify}
            active={fmt.align === 'justify'}
            onClick={() => applyFormat('justifyFull')}
            title="Justify"
          />

          <div className="spacing-wrapper">
            <button className="ribbon-btn" onClick={() => setLineSpacingDropdown(!lineSpacingDropdown)}>
              Line Spacing <ChevronDown size={12} />
            </button>
            {lineSpacingDropdown && (
              <div className="dropdown-menu">
                {LINE_SPACINGS.map(ls => (
                  <div
                    key={ls.value}
                    className="dropdown-item"
                    onClick={() => {
                      const sel = window.getSelection();
                      if (sel.rangeCount > 0) {
                        const range = sel.getRangeAt(0);
                        const parent = range.commonAncestorContainer.parentElement;
                        if (parent) parent.style.lineHeight = ls.value;
                      }
                      setLineSpacingDropdown(false);
                    }}
                  >
                    {ls.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </RibbonGroup>

      <RibbonGroup label="Styles">
        <div className="styles-gallery">
          {STYLES_GALLERY.slice(0, 4).map(style => (
            <div
              key={style.name}
              className="style-tile"
              onClick={() => {
                Object.entries(style.css).forEach(([prop, val]) => {
                  applyFormat(prop === 'fontSize' ? 'fontSize' : 'formatBlock', val);
                });
              }}
            >
              {style.name}
            </div>
          ))}
        </div>
      </RibbonGroup>

      <RibbonGroup label="Editing">
        <RibbonButton icon={Search} label="Find" onClick={() => onDialog('findReplace')} />
        <RibbonButton label="Replace" onClick={() => onDialog('findReplace')} />
        <RibbonButton label="Select All" onClick={() => applyFormat('selectAll')} />
      </RibbonGroup>
    </div>
  );
}

function RibbonInsert({ editorRef, onDialog }) {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      applyFormat('insertImage', ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const insertTable = (rows, cols) => {
    let html = '<table border="1" style="border-collapse: collapse; width: 100%;">';
    for (let i = 0; i < rows; i++) {
      html += '<tr>';
      for (let j = 0; j < cols; j++) {
        html += '<td style="padding: 8px; border: 1px solid #000;">&nbsp;</td>';
      }
      html += '</tr>';
    }
    html += '</table>';
    applyFormat('insertHTML', html);
  };

  return (
    <div className="ribbon-content">
      <RibbonGroup label="Pages">
        <RibbonButton label="Cover Page" dropdown />
        <RibbonButton label="Blank Page" onClick={() => applyFormat('insertHTML', '<div style="page-break-before: always;"></div>')} />
        <RibbonButton label="Page Break" onClick={() => applyFormat('insertHTML', '<hr style="page-break-after: always; border: none;">')} />
      </RibbonGroup>

      <RibbonGroup label="Tables">
        <RibbonButton
          icon={Table}
          label="Table"
          dropdown
          onClick={() => insertTable(3, 3)}
        />
      </RibbonGroup>

      <RibbonGroup label="Illustrations">
        <label className="ribbon-btn" style={{ cursor: 'pointer' }}>
          <Image size={16} />
          <span className="btn-label">Picture</span>
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
        </label>
        <RibbonButton icon={Shapes} label="Shapes" dropdown />
      </RibbonGroup>

      <RibbonGroup label="Links">
        <RibbonButton icon={Link2} label="Link" onClick={() => {
          const url = prompt('Enter URL:');
          if (url) applyFormat('createLink', url);
        }} />
        <RibbonButton label="Bookmark" />
      </RibbonGroup>

      <RibbonGroup label="Comments">
        <RibbonButton icon={MessageSquare} label="New Comment" onClick={() => {
          const text = prompt('Enter comment:');
          if (text) onDialog('addComment', text);
        }} />
      </RibbonGroup>

      <RibbonGroup label="Header & Footer">
        <RibbonButton label="Header" dropdown />
        <RibbonButton label="Footer" dropdown />
        <RibbonButton label="Page Number" dropdown />
      </RibbonGroup>

      <RibbonGroup label="Text">
        <RibbonButton icon={Type} label="Text Box" />
        <RibbonButton label="WordArt" dropdown />
      </RibbonGroup>

      <RibbonGroup label="Symbols">
        <RibbonButton label="Equation" />
        <RibbonButton label="Symbol" onClick={() => onDialog('symbol')} />
      </RibbonGroup>
    </div>
  );
}

function RibbonDesign() {
  return (
    <div className="ribbon-content">
      <RibbonGroup label="Document Formatting">
        <div className="themes-gallery">
          <div className="theme-tile">Office</div>
          <div className="theme-tile">Colorful</div>
          <div className="theme-tile">Dark</div>
        </div>
      </RibbonGroup>

      <RibbonGroup label="Page Background">
        <RibbonButton label="Watermark" dropdown />
        <RibbonButton label="Page Color" dropdown />
        <RibbonButton label="Page Borders" />
      </RibbonGroup>
    </div>
  );
}

function RibbonLayout({ onDialog }) {
  return (
    <div className="ribbon-content">
      <RibbonGroup label="Page Setup">
        <RibbonButton label="Margins" dropdown onClick={() => onDialog('pageSetup')} />
        <RibbonButton label="Orientation" dropdown />
        <RibbonButton label="Size" dropdown />
        <RibbonButton label="Columns" dropdown />
      </RibbonGroup>

      <RibbonGroup label="Paragraph">
        <RibbonButton label="Indent Left" />
        <RibbonButton label="Indent Right" />
        <RibbonButton label="Spacing Before" />
        <RibbonButton label="Spacing After" />
      </RibbonGroup>

      <RibbonGroup label="Arrange">
        <RibbonButton label="Position" dropdown />
        <RibbonButton label="Wrap Text" dropdown />
        <RibbonButton label="Bring Forward" dropdown />
        <RibbonButton label="Send Backward" dropdown />
      </RibbonGroup>
    </div>
  );
}

function RibbonReferences() {
  return (
    <div className="ribbon-content">
      <RibbonGroup label="Table of Contents">
        <RibbonButton label="Table of Contents" dropdown />
        <RibbonButton label="Add Text" dropdown />
        <RibbonButton label="Update Table" />
      </RibbonGroup>

      <RibbonGroup label="Footnotes">
        <RibbonButton label="Insert Footnote" />
        <RibbonButton label="Insert Endnote" />
      </RibbonGroup>

      <RibbonGroup label="Citations & Bibliography">
        <RibbonButton label="Insert Citation" dropdown />
        <RibbonButton label="Manage Sources" />
        <RibbonButton label="Bibliography" dropdown />
      </RibbonGroup>

      <RibbonGroup label="Captions">
        <RibbonButton label="Insert Caption" />
        <RibbonButton label="Insert Table of Figures" />
        <RibbonButton label="Update Table" />
      </RibbonGroup>
    </div>
  );
}

function RibbonReview({ onDialog }) {
  return (
    <div className="ribbon-content">
      <RibbonGroup label="Proofing">
        <RibbonButton label="Spelling & Grammar" />
        <RibbonButton label="Word Count" onClick={() => onDialog('wordCount')} />
      </RibbonGroup>

      <RibbonGroup label="Comments">
        <RibbonButton icon={MessageSquare} label="New Comment" />
        <RibbonButton label="Delete" />
        <RibbonButton label="Previous" />
        <RibbonButton label="Next" />
      </RibbonGroup>

      <RibbonGroup label="Tracking">
        <RibbonButton label="Track Changes" dropdown />
        <RibbonButton label="Show Markup" dropdown />
      </RibbonGroup>

      <RibbonGroup label="Changes">
        <RibbonButton icon={Check} label="Accept" dropdown />
        <RibbonButton icon={X} label="Reject" dropdown />
      </RibbonGroup>

      <RibbonGroup label="Compare">
        <RibbonButton label="Compare" />
        <RibbonButton label="Combine" />
      </RibbonGroup>

      <RibbonGroup label="Protect">
        <RibbonButton label="Protect Document" dropdown />
      </RibbonGroup>
    </div>
  );
}

function RibbonView({ showRuler, setShowRuler, showNavPane, setShowNavPane }) {
  return (
    <div className="ribbon-content">
      <RibbonGroup label="Views">
        <RibbonButton icon={Monitor} label="Print Layout" />
        <RibbonButton icon={BookOpen} label="Read Mode" />
        <RibbonButton icon={Globe} label="Web Layout" />
      </RibbonGroup>

      <RibbonGroup label="Show">
        <div className="checkbox-row">
          <label>
            <input type="checkbox" checked={showRuler} onChange={(e) => setShowRuler(e.target.checked)} />
            Ruler
          </label>
          <label>
            <input type="checkbox" />
            Gridlines
          </label>
          <label>
            <input type="checkbox" checked={showNavPane} onChange={(e) => setShowNavPane(e.target.checked)} />
            Navigation Pane
          </label>
        </div>
      </RibbonGroup>

      <RibbonGroup label="Zoom">
        <RibbonButton icon={ZoomIn} label="Zoom" />
        <RibbonButton label="100%" />
        <RibbonButton label="One Page" />
        <RibbonButton label="Multiple Pages" />
      </RibbonGroup>

      <RibbonGroup label="Window">
        <RibbonButton label="New Window" />
        <RibbonButton label="Arrange All" />
        <RibbonButton label="Split" />
      </RibbonGroup>
    </div>
  );
}

// === DIALOGS ===

function Modal({ isOpen, onClose, title, children, width = '500px' }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ width }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function FindReplaceDialog({ isOpen, onClose }) {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  const handleFind = () => {
    if (findText) {
      window.find(findText);
    }
  };

  const handleReplace = () => {
    if (findText && replaceText) {
      document.execCommand('insertText', false, replaceText);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Find and Replace">
      <div className="dialog-section">
        <label>Find what:</label>
        <input
          type="text"
          value={findText}
          onChange={(e) => setFindText(e.target.value)}
          className="dialog-input"
        />
      </div>
      <div className="dialog-section">
        <label>Replace with:</label>
        <input
          type="text"
          value={replaceText}
          onChange={(e) => setReplaceText(e.target.value)}
          className="dialog-input"
        />
      </div>
      <div className="dialog-actions">
        <button className="dialog-btn" onClick={handleFind}>Find Next</button>
        <button className="dialog-btn" onClick={handleReplace}>Replace</button>
        <button className="dialog-btn" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
}

function WordCountDialog({ isOpen, onClose, stats }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Word Count">
      <div className="word-count-stats">
        <div className="stat-row">
          <span>Pages:</span>
          <span>{stats.pages}</span>
        </div>
        <div className="stat-row">
          <span>Words:</span>
          <span>{stats.words}</span>
        </div>
        <div className="stat-row">
          <span>Characters (no spaces):</span>
          <span>{stats.charsNoSpaces}</span>
        </div>
        <div className="stat-row">
          <span>Characters (with spaces):</span>
          <span>{stats.chars}</span>
        </div>
        <div className="stat-row">
          <span>Paragraphs:</span>
          <span>{stats.paragraphs}</span>
        </div>
      </div>
      <div className="dialog-actions">
        <button className="dialog-btn" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
}

function PageSetupDialog({ isOpen, onClose, onApply, currentMargins }) {
  const [margins, setMargins] = useState(currentMargins || MARGIN_PRESETS.Normal);

  const applyPreset = (preset) => {
    setMargins(MARGIN_PRESETS[preset]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Page Setup" width="600px">
      <div className="dialog-section">
        <h4>Margins</h4>
        <div className="margin-presets">
          {Object.keys(MARGIN_PRESETS).map(preset => (
            <button
              key={preset}
              className="preset-btn"
              onClick={() => applyPreset(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
      <div className="dialog-section">
        <div className="margin-inputs">
          <label>
            Top: <input type="number" value={margins.top} onChange={(e) => setMargins({...margins, top: +e.target.value})} />
          </label>
          <label>
            Bottom: <input type="number" value={margins.bottom} onChange={(e) => setMargins({...margins, bottom: +e.target.value})} />
          </label>
          <label>
            Left: <input type="number" value={margins.left} onChange={(e) => setMargins({...margins, left: +e.target.value})} />
          </label>
          <label>
            Right: <input type="number" value={margins.right} onChange={(e) => setMargins({...margins, right: +e.target.value})} />
          </label>
        </div>
      </div>
      <div className="dialog-actions">
        <button className="dialog-btn primary" onClick={() => { onApply(margins); onClose(); }}>OK</button>
        <button className="dialog-btn" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function SymbolDialog({ isOpen, onClose, editorRef }) {
  const symbols = ['©', '®', '™', '°', '±', '÷', '×', '√', '∞', '≈', '≠', '≤', '≥', 'α', 'β', 'γ', 'δ', 'π', 'Σ', 'Ω'];

  const insertSymbol = (symbol) => {
    applyFormat('insertText', symbol);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Symbol">
      <div className="symbol-grid">
        {symbols.map(sym => (
          <button
            key={sym}
            className="symbol-btn"
            onClick={() => insertSymbol(sym)}
          >
            {sym}
          </button>
        ))}
      </div>
    </Modal>
  );
}

// === PANELS ===

function NavigationPane({ isVisible, editorRef }) {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    if (!isVisible || !editorRef.current) return;

    const updateHeadings = () => {
      const nodes = editorRef.current.querySelectorAll('h1,h2,h3,h4,h5,h6');
      setHeadings([...nodes].map(n => ({
        tag: n.tagName,
        text: n.innerText,
        el: n
      })));
    };

    updateHeadings();
    const observer = new MutationObserver(updateHeadings);
    observer.observe(editorRef.current, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isVisible, editorRef]);

  if (!isVisible) return null;

  return (
    <aside className="nav-pane">
      <div className="pane-title">Navigation</div>
      <div className="nav-headings">
        {headings.length === 0 ? (
          <div className="nav-empty">No headings in document</div>
        ) : (
          headings.map((h, i) => (
            <div
              key={i}
              className={`nav-heading nav-${h.tag.toLowerCase()}`}
              onClick={() => h.el.scrollIntoView({ behavior: 'smooth' })}
            >
              {h.text}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

function CommentsPanel({ isVisible, comments, onResolve, onDelete }) {
  if (!isVisible) return null;

  return (
    <aside className="comments-panel">
      <div className="pane-title">Comments</div>
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="comments-empty">No comments</div>
        ) : (
          comments.map(c => (
            <div key={c.id} className={`comment-card ${c.resolved ? 'resolved' : ''}`}>
              <div className="comment-meta">{c.author} · {c.date}</div>
              <div className="comment-text">{c.text}</div>
              <div className="comment-actions">
                {!c.resolved && (
                  <button className="comment-btn" onClick={() => onResolve(c.id)}>Resolve</button>
                )}
                <button className="comment-btn" onClick={() => onDelete(c.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

// === DOCUMENT CANVAS ===

function Ruler({ width, margins, zoom }) {
  const inches = width / 96;
  const markers = [];
  for (let i = 0; i <= inches; i++) {
    markers.push(i);
  }

  return (
    <div className="ruler">
      {markers.map(i => (
        <div key={i} className="ruler-mark" style={{ left: `${i * 96}px` }}>
          {i}
        </div>
      ))}
    </div>
  );
}

function DocumentCanvas({
  editorRef,
  headerRef,
  footerRef,
  onInput,
  onSelect,
  zoom,
  pageSize,
  margins,
  showRuler
}) {
  const scale = zoom / 100;
  const { width, height } = PAGE_SIZES[pageSize] || PAGE_SIZES.A4;

  return (
    <div className="canvas-area">
      {showRuler && <Ruler width={width} margins={margins} zoom={zoom} />}
      <div className="pages-container">
        <div
          className="page"
          style={{
            width: `${width}px`,
            minHeight: `${height}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            padding: `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`
          }}
        >
          <div
            ref={headerRef}
            className="header-area"
            contentEditable
            suppressContentEditableWarning
            placeholder="Header"
          />
          <div
            ref={editorRef}
            className="document-body"
            contentEditable
            suppressContentEditableWarning
            onInput={onInput}
            onMouseUp={onSelect}
            onKeyUp={onSelect}
          />
          <div
            ref={footerRef}
            className="footer-area"
            contentEditable
            suppressContentEditableWarning
            placeholder="Footer"
          />
        </div>
      </div>
    </div>
  );
}

// === STATUS BAR ===

function StatusBar({ stats, zoom, onZoom, viewMode, onViewMode }) {
  return (
    <div className="status-bar">
      <div className="status-left">
        <span>Page {stats.pages} of {stats.pages}</span>
        <span className="status-sep">|</span>
        <span>{stats.words} words</span>
        <span className="status-sep">|</span>
        <span>{stats.chars} characters</span>
      </div>
      <div className="status-center">
        <span>English (US)</span>
      </div>
      <div className="status-right">
        <div className="view-buttons">
          <button
            className={viewMode === VIEW_MODES.PRINT ? 'active' : ''}
            onClick={() => onViewMode(VIEW_MODES.PRINT)}
            title="Print Layout"
          >
            <FileText size={16} />
          </button>
          <button
            className={viewMode === VIEW_MODES.WEB ? 'active' : ''}
            onClick={() => onViewMode(VIEW_MODES.WEB)}
            title="Web Layout"
          >
            <Monitor size={16} />
          </button>
        </div>
        <div className="zoom-controls">
          <button onClick={() => onZoom(Math.max(10, zoom - 10))}><Minus size={14} /></button>
          <input
            type="range"
            min="10"
            max="500"
            value={zoom}
            onChange={(e) => onZoom(+e.target.value)}
            className="zoom-slider"
          />
          <span className="zoom-percent">{zoom}%</span>
          <button onClick={() => onZoom(Math.min(500, zoom + 10))}><Plus size={14} /></button>
        </div>
      </div>
    </div>
  );
}

// === TITLE BAR ===

function TitleBar({ title, onTitleChange }) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="title-bar">
      <div className="title-left">
        <span className="app-name">EtherX</span>
        {editing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
            className="title-input"
            autoFocus
          />
        ) : (
          <span className="doc-title" onClick={() => setEditing(true)}>{title}</span>
        )}
      </div>
      <div className="window-controls">
        <button className="window-btn"><Minimize2 size={14} /></button>
        <button className="window-btn"><Maximize2 size={14} /></button>
        <button className="window-btn close"><X size={14} /></button>
      </div>
    </div>
  );
}

// === MENU BAR ===

function MenuBar({ onFile, onOpen, onNew, dialogs }) {
  const [fileMenu, setFileMenu] = useState(false);

  return (
    <div className="menu-bar">
      <div className="menu-item" onClick={() => setFileMenu(!fileMenu)}>
        File
        {fileMenu && (
          <div className="menu-dropdown">
            <div className="menu-option" onClick={onNew}>New</div>
            <div className="menu-option">
              <label style={{ cursor: 'pointer', display: 'block' }}>
                Open
                <input type="file" accept=".html,.txt" style={{ display: 'none' }} onChange={onOpen} />
              </label>
            </div>
            <div className="menu-option" onClick={onFile}>Save As</div>
            <div className="menu-option" onClick={() => window.print()}>Print</div>
            <div className="menu-option" onClick={() => dialogs.openDialog('pageSetup')}>Page Setup</div>
          </div>
        )}
      </div>
    </div>
  );
}

// === RIBBON BAR ===

function RibbonBar({ activeTab, onTabChange, fmt, onFormat, dialogs, editorRef, showRuler, setShowRuler, showNavPane, setShowNavPane }) {
  return (
    <div className="ribbon-bar">
      <div className="ribbon-tabs">
        {RIBBON_TABS.map(tab => (
          <button
            key={tab}
            className={`ribbon-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="ribbon-panel">
        {activeTab === 'Home' && <RibbonHome fmt={fmt} onFormat={onFormat} onDialog={dialogs.openDialog} editorRef={editorRef} />}
        {activeTab === 'Insert' && <RibbonInsert editorRef={editorRef} onDialog={dialogs.openDialog} />}
        {activeTab === 'Design' && <RibbonDesign />}
        {activeTab === 'Layout' && <RibbonLayout onDialog={dialogs.openDialog} />}
        {activeTab === 'References' && <RibbonReferences />}
        {activeTab === 'Review' && <RibbonReview onDialog={dialogs.openDialog} />}
        {activeTab === 'View' && <RibbonView showRuler={showRuler} setShowRuler={setShowRuler} showNavPane={showNavPane} setShowNavPane={setShowNavPane} />}
        {activeTab === 'Help' && <div className="ribbon-content"><RibbonGroup label="Help"><RibbonButton label="Help" /></RibbonGroup></div>}
      </div>
    </div>
  );
}

// === STARTUP SCREEN ===

function StartupScreen({ onNew, onOpen, recentFiles }) {
  const templates = [
    { name: 'Blank document', desc: 'Create a new blank document' },
    { name: 'Resume', desc: 'Professional resume template' },
    { name: 'Letter', desc: 'Business letter template' },
    { name: 'Report', desc: 'Formal report template' }
  ];

  return (
    <div className="startup-screen">
      <div className="startup-header">
        <h1>EtherX</h1>
        <p>Create beautiful documents</p>
      </div>
      <div className="startup-content">
        <h2>New</h2>
        <div className="templates-grid">
          <div className="template-card blank" onClick={onNew}>
            <div className="template-preview">
              <FileText size={48} />
            </div>
            <div className="template-name">Blank document</div>
          </div>
          {templates.slice(1).map((tmpl, i) => (
            <div key={i} className="template-card" onClick={onNew}>
              <div className="template-preview">
                <FileText size={48} />
              </div>
              <div className="template-name">{tmpl.name}</div>
            </div>
          ))}
        </div>

        {recentFiles.length > 0 && (
          <>
            <h2>Recent</h2>
            <div className="recent-files">
              {recentFiles.map((file, i) => (
                <div key={i} className="recent-file">
                  <FileText size={20} />
                  <span>{file}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="startup-actions">
          <label className="startup-btn">
            <FolderOpen size={20} />
            Open from computer
            <input type="file" accept=".html,.txt" style={{ display: 'none' }} onChange={onOpen} />
          </label>
        </div>
      </div>
    </div>
  );
}

// === MAIN APP ===

export default function EtherX() {
  // State
  const [screen, setScreen] = useState('startup');
  const [activeTab, setActiveTab] = useState('Home');
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState(VIEW_MODES.PRINT);
  const [pageSize, setPageSize] = useState('A4');
  const [margins, setMargins] = useState(MARGIN_PRESETS.Normal);
  const [showRuler, setShowRuler] = useState(true);
  const [showNavPane, setShowNavPane] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [docTitle, setDocTitle] = useState('Document1');

  // Refs
  const editorRef = useRef(null);
  const headerRef = useRef(null);
  const footerRef = useRef(null);

  // Custom hooks
  const { stats, update: updateStats } = useDocumentStats(editorRef);
  const { fmt, refresh: refreshFmt } = useFormatState();
  const dialogs = useDialogs();
  const { comments, addComment, resolveComment, deleteComment } = useComments();
  const { files: recentFiles, addFile } = useRecentFiles();

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      const key = e.key.toLowerCase();
      
      if (key === 'b') { e.preventDefault(); applyFormat('bold'); }
      if (key === 'i') { e.preventDefault(); applyFormat('italic'); }
      if (key === 'u') { e.preventDefault(); applyFormat('underline'); }
      if (key === 'z') { e.preventDefault(); applyFormat('undo'); }
      if (key === 'y') { e.preventDefault(); applyFormat('redo'); }
      if (key === 's') { e.preventDefault(); handleSave(); }
      if (key === 'p') { e.preventDefault(); window.print(); }
      if (key === 'a') { e.preventDefault(); applyFormat('selectAll'); }
      if (key === 'f') { e.preventDefault(); dialogs.openDialog('findReplace'); }
      if (key === 'h') { e.preventDefault(); dialogs.openDialog('findReplace'); }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dialogs]);

  // File operations
  const handleSave = () => {
    const content = editorRef.current?.innerHTML || '';
    downloadFile(`${docTitle}.html`, content, 'text/html');
    addFile(docTitle);
  };

  const handleOpen = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (editorRef.current) {
        editorRef.current.innerHTML = ev.target.result;
      }
    };
    reader.readAsText(file);
    setDocTitle(file.name.replace(/\.[^.]+$/, ''));
    setScreen('editor');
  };

  const handleNewDoc = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
    setDocTitle('Document1');
    setScreen('editor');
  };

  // Handle comment addition from dialog
  useEffect(() => {
    if (dialogs.active?.startsWith?.('addComment')) {
      const text = dialogs.active.split('|')[1];
      if (text) {
        addComment(text);
        dialogs.closeDialog();
      }
    }
  }, [dialogs.active]);

  // Render startup screen
  if (screen === 'startup') {
    return <StartupScreen onNew={handleNewDoc} onOpen={handleOpen} recentFiles={recentFiles} />;
  }

  // Render editor
  return (
    <div className="etherx-root">
      <TitleBar title={docTitle} onTitleChange={setDocTitle} />
      <MenuBar onFile={handleSave} onOpen={handleOpen} onNew={handleNewDoc} dialogs={dialogs} />
      <RibbonBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        fmt={fmt}
        onFormat={applyFormat}
        dialogs={dialogs}
        editorRef={editorRef}
        showRuler={showRuler}
        setShowRuler={setShowRuler}
        showNavPane={showNavPane}
        setShowNavPane={setShowNavPane}
      />

      <div className="workspace">
        <NavigationPane isVisible={showNavPane} editorRef={editorRef} />
        <DocumentCanvas
          editorRef={editorRef}
          headerRef={headerRef}
          footerRef={footerRef}
          onInput={updateStats}
          onSelect={refreshFmt}
          zoom={zoom}
          pageSize={pageSize}
          margins={margins}
          showRuler={showRuler}
        />
        <CommentsPanel
          isVisible={showComments}
          comments={comments}
          onResolve={resolveComment}
          onDelete={deleteComment}
        />
      </div>

      <StatusBar
        stats={stats}
        zoom={zoom}
        onZoom={setZoom}
        viewMode={viewMode}
        onViewMode={setViewMode}
      />

      {/* Dialogs */}
      <FindReplaceDialog isOpen={dialogs.isOpen('findReplace')} onClose={dialogs.closeDialog} />
      <WordCountDialog isOpen={dialogs.isOpen('wordCount')} onClose={dialogs.closeDialog} stats={stats} />
      <PageSetupDialog isOpen={dialogs.isOpen('pageSetup')} onClose={dialogs.closeDialog} onApply={setMargins} currentMargins={margins} />
      <SymbolDialog isOpen={dialogs.isOpen('symbol')} onClose={dialogs.closeDialog} editorRef={editorRef} />
    </div>
  );
}
