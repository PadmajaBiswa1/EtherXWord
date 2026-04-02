# EtherX — Microsoft Word Clone

A fully functional web-based word processor that replicates Microsoft Word's UI and features using React.

![EtherX Logo](https://img.shields.io/badge/EtherX-Word%20Processor-2b579a)

## Features

### Complete Microsoft Word UI
- **Title Bar** - App name, editable document title, window controls
- **Menu Bar** - File menu with New, Open, Save, Print, Page Setup
- **Ribbon Interface** - Tab-based toolbar (File, Home, Insert, Design, Layout, References, Review, View, Help)
- **Ruler** - Horizontal ruler with margin indicators
- **Document Canvas** - White A4 pages with realistic shadows on gray background
- **Status Bar** - Page count, word count, language, zoom controls, view mode buttons

### Home Tab Features
- **Clipboard**: Paste, Cut, Copy, Format Painter
- **Font**: 
  - Font family dropdown (14+ fonts)
  - Font size selector
  - Grow/Shrink font buttons
  - Bold, Italic, Underline, Strikethrough
  - Subscript, Superscript
  - Text highlight color picker
  - Font color picker
- **Paragraph**:
  - Bullets (unordered lists)
  - Numbering (ordered lists)
  - Decrease/Increase indent
  - Alignment: Left, Center, Right, Justify
  - Line spacing (1.0, 1.15, 1.5, 2.0, 2.5, 3.0)
- **Styles Gallery**: Normal, No Spacing, Heading 1-3, Title, Subtitle, Quote
- **Editing**: Find & Replace, Select All

### Insert Tab Features
- **Pages**: Cover Page, Blank Page, Page Break
- **Tables**: Insert tables (3x3 default with customizable rows/columns)
- **Illustrations**: Picture upload, Shapes
- **Links**: Hyperlinks, Bookmarks
- **Comments**: Add comments
- **Header & Footer**: Header, Footer, Page Numbers
- **Text**: Text Box, WordArt
- **Symbols**: Symbol picker with common symbols (©, ®, ™, °, ±, etc.)

### Design Tab Features
- **Document Formatting**: Theme gallery (Office, Colorful, Dark)
- **Page Background**: Watermark, Page Color, Page Borders

### Layout Tab Features
- **Page Setup**: Margins (Normal, Narrow, Wide, Moderate), Orientation, Size, Columns
- **Paragraph**: Indent, Spacing
- **Arrange**: Position, Wrap Text, Bring Forward, Send Backward

### References Tab Features
- Table of Contents
- Footnotes & Endnotes
- Citations & Bibliography
- Captions
- Index

### Review Tab Features
- **Proofing**: Spelling & Grammar, Word Count dialog
- **Comments**: New Comment, Delete, Previous, Next
- **Tracking**: Track Changes, Show Markup
- **Changes**: Accept, Reject
- **Compare**: Compare documents, Combine
- **Protect**: Protect Document

### View Tab Features
- **Views**: Print Layout, Read Mode, Web Layout
- **Show**: Ruler toggle, Gridlines toggle, Navigation Pane toggle
- **Zoom**: Zoom controls, 100%, One Page, Multiple Pages
- **Window**: New Window, Arrange All, Split

### Document Features
- **ContentEditable** - Rich text editing with full formatting support
- **Real-time Statistics** - Word count, character count, page count in status bar
- **Multi-page Support** - Automatic page breaks when content overflows
- **Header & Footer** - Editable header and footer areas
- **Navigation Pane** - Outline view of document headings (H1-H6)
- **Comments Panel** - Side panel showing all comments with resolve/delete actions
- **Find & Replace** - Search and replace text in document
- **Page Setup** - Customize margins, paper size, orientation

### Keyboard Shortcuts
- `Ctrl+B` - Bold
- `Ctrl+I` - Italic
- `Ctrl+U` - Underline
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Ctrl+S` - Save
- `Ctrl+P` - Print
- `Ctrl+A` - Select All
- `Ctrl+F` - Find
- `Ctrl+H` - Replace

### File Operations
- **New Document** - Start with blank document
- **Open** - Upload and open .txt or .html files
- **Save As** - Download document as .html file
- **Print** - Trigger browser print dialog with print-optimized stylesheet
- **Recent Files** - Track recently opened files in localStorage

### Startup Screen
Beautiful template selection screen with:
- Blank document option
- Template cards (Resume, Letter, Report)
- Recent files list
- Open from computer option

### Styling
- **Pixel-perfect Microsoft Word styling**
- Office blue accent color (#2b579a)
- Segoe UI font for interface
- Professional color scheme matching MS Office
- Responsive design with clean modern UI
- Print-optimized CSS for accurate printing

## Tech Stack

- **React 19** with hooks (useState, useRef, useEffect, useCallback)
- **Lucide React** - Beautiful icon library
- **Vite** - Fast build tool and dev server
- **contenteditable** - Native browser rich text editing
- **execCommand API** - Text formatting commands
- **localStorage** - Persistent recent files

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── EtherX.jsx      # Main application component
│   │   └── EtherX.css      # Complete styling
│   ├── App.jsx             # Root component
│   └── main.jsx            # Entry point
├── index.html
└── package.json
```

## Installation

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

1. **Start the application**
   ```bash
   npm run dev
   ```

2. **Access in browser**
   - Open http://localhost:5174
   - You'll see the startup screen with template options

3. **Create a new document**
   - Click "Blank document" to start editing
   - Use the ribbon tabs to access all features
   - Type in the white document canvas

4. **Format your text**
   - Select text and use Home tab for formatting
   - Change fonts, sizes, colors, alignment
   - Apply styles from the styles gallery

5. **Insert content**
   - Use Insert tab to add tables, images, links
   - Upload images from your computer
   - Insert symbols and special characters

6. **Save your work**
   - Use File > Save As or Ctrl+S
   - Document downloads as .html file
   - Open saved files with File > Open

7. **Print your document**
   - Use File > Print or Ctrl+P
   - Browser print dialog opens
   - Print stylesheet ensures clean output

## Component Architecture

### Main Components

- **EtherX** - Root component managing all state
- **TitleBar** - App name, document title, window controls
- **MenuBar** - File menu with dropdown
- **RibbonBar** - Tabbed interface with all ribbon tabs
- **DocumentCanvas** - Editable document area with ruler
- **StatusBar** - Bottom bar with stats and zoom controls
- **StartupScreen** - Template selection screen

### Ribbon Components

- **RibbonHome** - Font, paragraph, styles controls
- **RibbonInsert** - Insert tables, images, links, symbols
- **RibbonDesign** - Themes and page background
- **RibbonLayout** - Page setup and arrangement
- **RibbonReferences** - TOC, citations, captions
- **RibbonReview** - Proofing, comments, tracking
- **RibbonView** - View modes, zoom, window

### Dialog Components

- **FindReplaceDialog** - Search and replace text
- **WordCountDialog** - Document statistics
- **PageSetupDialog** - Margin and page settings
- **SymbolDialog** - Insert special characters

### Panel Components

- **NavigationPane** - Document outline (left sidebar)
- **CommentsPanel** - Comments list (right sidebar)

### Custom Hooks

- **useDocumentStats** - Track word/character/page count
- **useFormatState** - Monitor current formatting state
- **useDialogs** - Manage dialog open/close state
- **useComments** - Comments CRUD operations
- **useRecentFiles** - localStorage for recent files

## State Management

All state is managed in the root `EtherX` component using React hooks:

- `screen` - 'startup' or 'editor'
- `activeTab` - Current ribbon tab
- `zoom` - Zoom level (10-500%)
- `viewMode` - 'print', 'read', or 'web'
- `pageSize` - 'A4', 'Letter', or 'Legal'
- `margins` - Top, right, bottom, left margins
- `showRuler` - Toggle ruler visibility
- `showNavPane` - Toggle navigation pane
- `showComments` - Toggle comments panel
- `docTitle` - Document title

## Keyboard Shortcuts

All standard Microsoft Word shortcuts are implemented and work exactly as expected.

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires support for:
- contenteditable
- execCommand
- localStorage
- CSS Grid & Flexbox

## Future Enhancements

- [ ] Cloud storage integration
- [ ] Real-time collaboration
- [ ] Export to PDF (native)
- [ ] Export to DOCX
- [ ] Spell check with dictionary
- [ ] Grammar checking
- [ ] Advanced table editing
- [ ] Image editing tools
- [ ] Drawing tools
- [ ] Mail merge
- [ ] Macros support

## License

MIT License - Feel free to use for any purpose

## Credits

Built with ❤️ using React and modern web technologies.

Inspired by Microsoft Word's excellent user interface.

## Development

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## Support

For issues or questions, please open an issue on GitHub.

---

**EtherX** - A professional word processor for the modern web.
