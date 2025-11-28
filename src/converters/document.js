import mammoth from 'mammoth';
import TurndownService from 'turndown';
import { marked } from 'marked';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel,
  AlignmentType,
  UnderlineType,
  LevelFormat,
  convertInchesToTwip
} from 'docx';

/**
 * Convert .docx to .md
 */
export async function docxToMarkdown(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    });
    const markdown = turndownService.turndown(result.value);
    return new Blob([markdown], { type: 'text/markdown' });
  } catch (error) {
    throw new Error(`Failed to convert DOCX to Markdown: ${error.message}`);
  }
}

/**
 * Convert .md to .docx
 */
export async function markdownToDocx(file) {
  try {
    const text = await file.text();
    const html = await marked(text);
    
    // Parse HTML and create docx paragraphs
    const paragraphs = htmlToDocxParagraphs(html);
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs
      }]
    });
    
    const blob = await Packer.toBlob(doc);
    return blob;
  } catch (error) {
    throw new Error(`Failed to convert Markdown to DOCX: ${error.message}`);
  }
}

/**
 * Convert .txt to .md
 */
export async function txtToMarkdown(file) {
  try {
    const text = await file.text();
    // Simple conversion: wrap paragraphs
    const markdown = text
      .split('\n\n')
      .map(para => para.trim())
      .filter(para => para.length > 0)
      .join('\n\n');
    return new Blob([markdown], { type: 'text/markdown' });
  } catch (error) {
    throw new Error(`Failed to convert TXT to Markdown: ${error.message}`);
  }
}

/**
 * Convert .md to .txt
 */
export async function markdownToTxt(file) {
  try {
    const text = await file.text();
    // Remove markdown syntax
    let plainText = text
      .replace(/^#{1,6}\s+/gm, '') // Remove headers
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1') // Remove italic
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
      .replace(/`(.+?)`/g, '$1') // Remove inline code
      .replace(/^[-*+]\s+/gm, '• ') // Convert lists
      .replace(/^\d+\.\s+/gm, '• '); // Convert numbered lists
    
    return new Blob([plainText], { type: 'text/plain' });
  } catch (error) {
    throw new Error(`Failed to convert Markdown to TXT: ${error.message}`);
  }
}

/**
 * Convert .docx to .txt
 */
export async function docxToTxt(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return new Blob([result.value], { type: 'text/plain' });
  } catch (error) {
    throw new Error(`Failed to convert DOCX to TXT: ${error.message}`);
  }
}

/**
 * Convert .txt to .docx
 */
export async function txtToDocx(file) {
  try {
    const text = await file.text();
    const paragraphs = text
      .split('\n')
      .map(line => new Paragraph({
        children: [new TextRun(line || ' ')]
      }));
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs
      }]
    });
    
    const blob = await Packer.toBlob(doc);
    return blob;
  } catch (error) {
    throw new Error(`Failed to convert TXT to DOCX: ${error.message}`);
  }
}

/**
 * Helper function to convert HTML to docx paragraphs with proper formatting
 */
function htmlToDocxParagraphs(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const paragraphs = [];
  let listLevel = 0;
  let isOrderedList = false;
  
  /**
   * Process text nodes and inline elements to create TextRuns
   */
  const processInlineContent = (node, formatting = {}) => {
    const runs = [];
    
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (text && text.trim()) {
        runs.push(new TextRun({
          text: text,
          bold: formatting.bold || false,
          italics: formatting.italics || false,
          underline: formatting.underline ? { type: UnderlineType.SINGLE } : undefined,
          strike: formatting.strike || false,
          font: formatting.code ? 'Courier New' : undefined,
          size: formatting.code ? 20 : undefined,
          shading: formatting.code ? { fill: 'F3F4F6' } : undefined
        }));
      } else if (text) {
        // Preserve spaces
        runs.push(new TextRun({ text: text, ...formatting }));
      }
      return runs;
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      const newFormatting = { ...formatting };
      
      // Apply formatting based on tags
      if (tag === 'strong' || tag === 'b') {
        newFormatting.bold = true;
      } else if (tag === 'em' || tag === 'i') {
        newFormatting.italics = true;
      } else if (tag === 'u') {
        newFormatting.underline = true;
      } else if (tag === 'del' || tag === 's' || tag === 'strike') {
        newFormatting.strike = true;
      } else if (tag === 'code') {
        newFormatting.code = true;
      } else if (tag === 'a') {
        newFormatting.underline = true;
        newFormatting.color = '0000FF';
      } else if (tag === 'br') {
        runs.push(new TextRun({ break: 1 }));
        return runs;
      }
      
      // Process children
      for (const child of node.childNodes) {
        runs.push(...processInlineContent(child, newFormatting));
      }
    }
    
    return runs;
  };
  
  /**
   * Process block-level elements
   */
  const processBlockElement = (node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }
    
    const tag = node.tagName.toLowerCase();
    
    // Headers
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
      const level = parseInt(tag[1]);
      const runs = [];
      
      for (const child of node.childNodes) {
        runs.push(...processInlineContent(child));
      }
      
      if (runs.length === 0) {
        runs.push(new TextRun(' '));
      }
      
      const headingMap = {
        1: HeadingLevel.HEADING_1,
        2: HeadingLevel.HEADING_2,
        3: HeadingLevel.HEADING_3,
        4: HeadingLevel.HEADING_4,
        5: HeadingLevel.HEADING_5,
        6: HeadingLevel.HEADING_6
      };
      
      paragraphs.push(new Paragraph({
        children: runs,
        heading: headingMap[level],
        spacing: { after: 200, before: 200 }
      }));
      return;
    }
    
    // Paragraphs
    if (tag === 'p') {
      const runs = [];
      
      for (const child of node.childNodes) {
        runs.push(...processInlineContent(child));
      }
      
      if (runs.length === 0) {
        runs.push(new TextRun(' '));
      }
      
      paragraphs.push(new Paragraph({
        children: runs,
        spacing: { after: 120 }
      }));
      return;
    }
    
    // Code blocks
    if (tag === 'pre') {
      const codeNode = node.querySelector('code') || node;
      const text = codeNode.textContent;
      
      text.split('\n').forEach(line => {
        paragraphs.push(new Paragraph({
          children: [new TextRun({
            text: line || ' ',
            font: 'Courier New',
            size: 20
          })],
          shading: { fill: 'F3F4F6' },
          spacing: { after: 0, before: 0 },
          indent: { left: convertInchesToTwip(0.5) }
        }));
      });
      
      paragraphs.push(new Paragraph({
        children: [new TextRun(' ')],
        spacing: { after: 200 }
      }));
      return;
    }
    
    // Blockquotes
    if (tag === 'blockquote') {
      for (const child of node.childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const runs = [];
          for (const innerChild of child.childNodes) {
            runs.push(...processInlineContent(innerChild));
          }
          
          if (runs.length > 0) {
            paragraphs.push(new Paragraph({
              children: runs,
              indent: { left: convertInchesToTwip(0.5) },
              border: {
                left: {
                  color: 'CCCCCC',
                  space: 1,
                  style: 'single',
                  size: 6
                }
              },
              spacing: { after: 120 }
            }));
          }
        }
      }
      return;
    }
    
    // Lists
    if (tag === 'ul' || tag === 'ol') {
      const wasOrdered = isOrderedList;
      isOrderedList = tag === 'ol';
      listLevel++;
      
      for (const child of node.childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === 'li') {
          const runs = [];
          
          for (const innerChild of child.childNodes) {
            runs.push(...processInlineContent(innerChild));
          }
          
          if (runs.length === 0) {
            runs.push(new TextRun(' '));
          }
          
          paragraphs.push(new Paragraph({
            children: runs,
            bullet: {
              level: listLevel - 1
            },
            spacing: { after: 80 }
          }));
        }
      }
      
      listLevel--;
      isOrderedList = wasOrdered;
      return;
    }
    
    // Horizontal rule
    if (tag === 'hr') {
      paragraphs.push(new Paragraph({
        children: [new TextRun('_'.repeat(50))],
        spacing: { after: 200, before: 200 }
      }));
      return;
    }
    
    // Generic divs and other containers - process children
    if (['div', 'section', 'article', 'main'].includes(tag)) {
      for (const child of node.childNodes) {
        processBlockElement(child);
      }
      return;
    }
    
    // Table (basic support)
    if (tag === 'table') {
      paragraphs.push(new Paragraph({
        children: [new TextRun('[Table content - convert manually]')],
        spacing: { after: 200 }
      }));
      return;
    }
    
    // Fallback for other elements
    if (node.childNodes.length > 0) {
      const runs = [];
      for (const child of node.childNodes) {
        runs.push(...processInlineContent(child));
      }
      
      if (runs.length > 0) {
        paragraphs.push(new Paragraph({
          children: runs,
          spacing: { after: 120 }
        }));
      }
    }
  };
  
  // Process all children of body
  for (const child of doc.body.childNodes) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      processBlockElement(child);
    } else if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent.trim();
      if (text) {
        paragraphs.push(new Paragraph({
          children: [new TextRun(text)],
          spacing: { after: 120 }
        }));
      }
    }
  }
  
  // Ensure at least one paragraph
  if (paragraphs.length === 0) {
    paragraphs.push(new Paragraph({ children: [new TextRun(' ')] }));
  }
  
  return paragraphs;
}

