import React from 'react';
import { useEditor, EditorContent, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Highlight from '@tiptap/extension-highlight';
import Youtube from '@tiptap/extension-youtube';
import TypographyExtension from '@tiptap/extension-typography';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Box, useTheme } from '@mui/material';

interface RichTextRendererProps {
  content: JSONContent | string | null;
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content }) => {
  const theme = useTheme();
  const editor = useEditor(
    {
      editable: false,
      extensions: [
        StarterKit,
        Image,
        Underline,
        Subscript,
        Superscript,
        Highlight,
        Link.configure({ openOnClick: true, autolink: true }),
        Youtube.configure({ controls: true }),
        TypographyExtension,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
      ],
      content: content,
      editorProps: {
        attributes: {
          class: 'prose max-w-none',
        },
      },
    },
    [content],
  );

  React.useEffect(() => {
    if (editor && content) {
      if (JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <Box
      sx={{
        '& .ProseMirror': {
          outline: 'none',
          '& table': {
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
            width: '100%',
            margin: 0,
            overflow: 'hidden',
          },
          '& td, & th': {
            minWidth: '1em',
            border: `2px solid ${theme.palette.divider}`,
            padding: '3px 5px',
            verticalAlign: 'top',
            boxSizing: 'border-box',
            position: 'relative',
          },
          '& th': {
            fontWeight: 'bold',
            textAlign: 'left',
            backgroundColor: theme.palette.action.hover,
          },
        },
        '& p': { marginBottom: '1rem' },
        '& a': { color: 'primary.main', textDecoration: 'underline' },
        '& mark': {
          backgroundColor: 'rgba(255, 212, 0, 0.4)',
          borderRadius: '2px',
          padding: '0 2px',
        },
        '& div[data-youtube-video]': {
          margin: '1rem 0',
          '& iframe': {
            maxWidth: '100%',
            height: 'auto',
            aspectRatio: '16/9',
            display: 'block',
          },
        },
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  );
};

export default RichTextRenderer;
