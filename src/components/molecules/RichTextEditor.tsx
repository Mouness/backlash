import React from 'react';
import { useEditor, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import ItemStack from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuDivider,
  MenuButtonOrderedList,
  MenuButtonBulletedList,
  MenuButtonBlockquote,
  MenuButtonUndo,
  MenuButtonRedo,
  MenuControlsContainer,
  MenuSelectHeading,
  RichTextEditorProvider,
  RichTextField,
  MenuButton,
} from 'mui-tiptap';
import { Box, useTheme, type Theme } from '@mui/material';
import TableViewIcon from '@mui/icons-material/TableView';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

// ... (props interface)
interface RichTextEditorProps {
  value: string | JSONContent;
  onChange: (value: JSONContent) => void;
  placeholder?: string;
  minHeight?: number | string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  minHeight = 200,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const extensions = React.useMemo(
    () => [
      StarterKit,
      Image,
      ItemStack.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: placeholder || '',
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    [placeholder],
  );

  const editor = useEditor({
    extensions,
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        style: `min-height: ${typeof minHeight === 'number' ? `${minHeight}px` : minHeight}; outline: none; padding: 16px;`,
      },
    },
  });

  // Ensure content updates if value prop changes externally
  React.useEffect(() => {
    if (!editor || !value) return;

    if (editor.isFocused) return;

    const currentContent = editor.getJSON();
    const valueIsString = typeof value === 'string';

    if (!valueIsString && JSON.stringify(value) === JSON.stringify(currentContent)) {
      return;
    }

    editor.commands.setContent(value);
  }, [value, editor]);

  const tableStyles = (theme: Theme, minHeight: number | string) => ({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 1,
    overflow: 'hidden',
    bgcolor: 'background.paper',
    '& .ProseMirror': {
      minHeight: minHeight,
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
      '& .selectedCell:after': {
        zIndex: 2,
        position: 'absolute',
        content: '""',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        background: 'rgba(200, 200, 255, 0.4)',
        pointerEvents: 'none',
      },
      '& .column-resize-handle': {
        position: 'absolute',
        right: -2,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: '#adf',
        pointerEvents: 'none',
      },
    },
  });

  return (
    <Box sx={tableStyles(theme, minHeight)}>
      <RichTextEditorProvider editor={editor}>
        <MenuControlsContainer>
          <MenuSelectHeading />
          <MenuDivider />
          <MenuButtonBold />
          <MenuButtonItalic />
          <MenuDivider />
          <MenuButtonOrderedList />
          <MenuButtonBulletedList />
          <MenuDivider />
          <MenuButtonBlockquote />
          <MenuDivider />
          <MenuButton
            tooltipLabel={t('admin.common.insert_table')}
            IconComponent={TableViewIcon}
            onClick={() =>
              editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
          />
          <MenuButton
            tooltipLabel={t('admin.common.delete_table')}
            IconComponent={DeleteIcon}
            onClick={() => editor?.chain().focus().deleteTable().run()}
            disabled={!editor?.can().deleteTable()}
          />
          <MenuDivider />
          <MenuButtonUndo />
          <MenuButtonRedo />
        </MenuControlsContainer>
        <RichTextField variant="standard" />
      </RichTextEditorProvider>
    </Box>
  );
};

export default RichTextEditor;
