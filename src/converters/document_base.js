import mammoth from 'mammoth';
import TurndownService from 'turndown';
import { marked } from 'marked';
import { Document, Packer, Paragraph, TextRun } from 'docx';

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
 * Convert .md to .docx - BASIC VERSION
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
 * Basic HTML to DOCX conversion
 */
function htmlToDocxParagraphs(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const paragraphs = [];
  
  const processNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) {
        return new TextRun(text);
      }
      return null;
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const children = [];
      for (const child of node.childNodes) {
        const processed = processNode(child);
        if (processed) {
          if (Array.isArray(processed)) {
            children.push(...processed);
          } else {
            children.push(processed);
          }
        }
      }
      
      const tag = node.tagName.toLowerCase();
      
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
        paragraphs.push(new Paragraph({
          children: children.length > 0 ? children : [new TextRun(' ')],
          heading: tag.toUpperCase().replace('H', 'HEADING_')
        }));
        return [];
      }
      
      if (['p', 'div', 'li'].includes(tag)) {
        paragraphs.push(new Paragraph({
          children: children.length > 0 ? children : [new TextRun(' ')]
        }));
        return [];
      }
      
      if (tag === 'strong' || tag === 'b') {
        return children.map(child => 
          child instanceof TextRun 
            ? new TextRun({ text: child.text, bold: true })
            : child
        );
      }
      
      if (tag === 'em' || tag === 'i') {
        return children.map(child => 
          child instanceof TextRun 
            ? new TextRun({ text: child.text, italics: true })
            : child
        );
      }
      
      if (tag === 'br') {
        paragraphs.push(new Paragraph({ children: [new TextRun(' ')] }));
        return [];
      }
      
      return children;
    }
    
    return null;
  };
  
  for (const child of doc.body.childNodes) {
    processNode(child);
  }
  
  if (paragraphs.length === 0) {
    paragraphs.push(new Paragraph({ children: [new TextRun(' ')] }));
  }
  
  return paragraphs;
}

export async function txtToMarkdown(file) {
  try {
    const text = await file.text();
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

export async function markdownToTxt(file) {
  try {
    const text = await file.text();
    let plainText = text
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/^[-*+]\s+/gm, '• ')
      .replace(/^\d+\.\s+/gm, '• ');
    
    return new Blob([plainText], { type: 'text/plain' });
  } catch (error) {
    throw new Error(`Failed to convert Markdown to TXT: ${error.message}`);
  }
}

export async function docxToTxt(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return new Blob([result.value], { type: 'text/plain' });
  } catch (error) {
    throw new Error(`Failed to convert DOCX to TXT: ${error.message}`);
  }
}

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

