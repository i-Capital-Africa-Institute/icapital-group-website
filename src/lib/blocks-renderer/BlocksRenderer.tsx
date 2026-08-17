"use client";

import * as React from "react";
import Image from "next/image";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type AnyNode = { type: string; children?: AnyNode[]; [key: string]: unknown };
type ComponentMap = Record<string, React.ComponentType<any>>;

interface ContextValue {
  blocks: ComponentMap;
  modifiers: ComponentMap;
  missingBlockTypes: string[];
  missingModifierTypes: string[];
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const defaultComponents: ContextValue = {
  blocks: {
    paragraph: ({ children }) => <p>{children}</p>,
    quote: ({ children }) => <blockquote>{children}</blockquote>,
    code: ({ plainText }: { plainText: string }) => (
      <pre><code>{plainText}</code></pre>
    ),
    heading: ({ level, children }: { level: number; children: React.ReactNode }) => {
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      return <Tag>{children}</Tag>;
    },
    link: ({ url, children }: { url: string; children: React.ReactNode }) => (
      <a href={url}>{children}</a>
    ),
    list: ({ format, children }: { format: string; children: React.ReactNode }) =>
      format === "ordered" ? <ol>{children}</ol> : <ul>{children}</ul>,
    "list-item": ({ children }) => <li>{children}</li>,
    image: ({ image }: { image: { url: string; alternativeText?: string; width?: number; height?: number } }) => (
      <span className="relative my-6 block w-full overflow-hidden rounded-xl">
        <Image
          src={image.url}
          alt={image.alternativeText ?? "Article image"}
          width={image.width ?? 800}
          height={image.height ?? 450}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
          className="h-auto w-full object-cover"
        />
      </span>
    ),
  },
  modifiers: {
    bold: ({ children }) => <strong>{children}</strong>,
    italic: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <u>{children}</u>,
    strikethrough: ({ children }) => <del>{children}</del>,
    code: ({ children }) => <code>{children}</code>,
  },
  missingBlockTypes: [],
  missingModifierTypes: [],
};

const ComponentsContext = React.createContext<ContextValue>(defaultComponents);

export function useComponentsContext() {
  return React.useContext(ComponentsContext);
}

// ---------------------------------------------------------------------------
// Text node
// ---------------------------------------------------------------------------
function TextNode({ text, ...modifiers }: { text: string; [k: string]: unknown }) {
  const { modifiers: modifierComponents, missingModifierTypes } = useComponentsContext();

  const withLineBreaks = (t: string) => {
    const parts = t.split(/\r?\n|\r/g);
    return (
      <>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {i > 0 && <br />}
            {part}
          </React.Fragment>
        ))}
      </>
    );
  };

  return Object.keys(modifiers).reduce(
    (children: React.ReactNode, name) => {
      if (!modifiers[name]) return children;
      const Mod = modifierComponents[name];
      if (!Mod) {
        if (!missingModifierTypes.includes(name)) {
          console.warn(`[blocks-renderer] No component for modifier "${name}"`);
          missingModifierTypes.push(name);
        }
        return children;
      }
      return <Mod>{children}</Mod>;
    },
    withLineBreaks(text) as React.ReactNode,
  );
}

// ---------------------------------------------------------------------------
// Block node
// ---------------------------------------------------------------------------
function BlockNode({ content }: { content: AnyNode }) {
  const { children: childNodes, type, ...props } = content;
  const { blocks, missingBlockTypes } = useComponentsContext();
  const BlockComponent = blocks[type] as React.ComponentType<any> | undefined;

  if (!BlockComponent) {
    if (!missingBlockTypes.includes(type)) {
      console.warn(`[blocks-renderer] No component for block type "${type}"`);
      missingBlockTypes.push(type);
    }
    return null;
  }

  // Void blocks (e.g. image) have no children
  if (["image"].includes(type)) {
    return <BlockComponent {...props} />;
  }

  // Empty paragraph → line break
  if (
    type === "paragraph" &&
    childNodes?.length === 1 &&
    childNodes[0].type === "text" &&
    childNodes[0].text === ""
  ) {
    return <br />;
  }

  // Code block: pass plainText instead of children
  const augmented =
    type === "code"
      ? {
          ...props,
          plainText: (childNodes ?? []).reduce((acc: string, n) => {
            if (n.type === "text") return acc + (n.text ?? "");
            if (n.type === "link")
              return (
                acc +
                (n.children ?? [])
                  .filter((c) => c.type === "text")
                  .map((c) => c.text ?? "")
                  .join("")
              );
            return acc;
          }, ""),
        }
      : props;

  return (
    <BlockComponent {...augmented}>
      {(childNodes ?? []).map((child, i) =>
        child.type === "text" ? (
          <TextNode key={i} {...(child as any)} />
        ) : (
          <BlockNode key={i} content={child} />
        ),
      )}
    </BlockComponent>
  );
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
interface BlocksRendererProps {
  content: AnyNode[];
  blocks?: Partial<ComponentMap>;
  modifiers?: Partial<ComponentMap>;
}

export function BlocksRenderer({ content, blocks, modifiers }: BlocksRendererProps) {
  const mergedBlocks = { ...defaultComponents.blocks, ...blocks };
  const mergedModifiers = { ...defaultComponents.modifiers, ...modifiers };
  const missingBlockTypes = React.useRef<string[]>([]);
  const missingModifierTypes = React.useRef<string[]>([]);

  const value: ContextValue = React.useMemo(
    () => ({
      blocks: mergedBlocks,
      modifiers: mergedModifiers,
      missingBlockTypes: missingBlockTypes.current,
      missingModifierTypes: missingModifierTypes.current,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <ComponentsContext.Provider value={value}>
      {content.map((node, i) => (
        <BlockNode key={i} content={node} />
      ))}
    </ComponentsContext.Provider>
  );
}
