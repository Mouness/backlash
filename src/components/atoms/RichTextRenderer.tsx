import React from 'react';
import { useEditor, EditorContent, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
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
        '& a': { color: 'primary.main' },
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  );
};

export default RichTextRenderer;
