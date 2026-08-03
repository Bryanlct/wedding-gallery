"use client";

import {
  createContext,
  createElement,
  forwardRef,
  useContext,
  useMemo,
  useRef,
} from "react";

const motionProps = new Set([
  "initial",
  "animate",
  "exit",
  "transition",
  "whileTap",
  "whileHover",
  "layout",
  "layoutId",
]);

function animationStyles(animate) {
  if (!animate || typeof animate !== "object") return {};
  const styles = {};
  const transforms = [];
  for (const [key, value] of Object.entries(animate)) {
    if (key === "x") transforms.push(`translateX(${typeof value === "number" ? `${value}px` : value})`);
    else if (key === "y") transforms.push(`translateY(${typeof value === "number" ? `${value}px` : value})`);
    else if (key === "scale") transforms.push(`scale(${value})`);
    else if (key === "rotate") transforms.push(`rotate(${typeof value === "number" ? `${value}deg` : value})`);
    else styles[key] = value;
  }
  if (transforms.length) styles.transform = transforms.join(" ");
  return styles;
}

function createMotionElement(tag) {
  return forwardRef(function MotionElement({ children, className = "", style, animate, ...props }, ref) {
    const domProps = {};
    for (const [key, value] of Object.entries(props)) {
      if (!motionProps.has(key)) domProps[key] = value;
    }
    return createElement(
      tag,
      {
        ...domProps,
        ref,
        className: `${className} motion-element`,
        style: { ...style, ...animationStyles(animate) },
      },
      children
    );
  });
}

export const motion = {
  div: createMotionElement("div"),
  section: createMotionElement("section"),
  header: createMotionElement("header"),
  button: createMotionElement("button"),
  p: createMotionElement("p"),
  span: createMotionElement("span"),
};

export function AnimatePresence({ children }) {
  return children;
}

const ReorderContext = createContext(null);

function ReorderGroup({ values, onReorder, children, className = "", ...props }) {
  const dragging = useRef(null);
  const value = useMemo(() => ({ values, onReorder, dragging }), [onReorder, values]);
  return (
    <ReorderContext.Provider value={value}>
      <div className={className} {...props}>{children}</div>
    </ReorderContext.Provider>
  );
}

function ReorderItem({ value, children, className = "", ...props }) {
  const context = useContext(ReorderContext);
  const index = context?.values.indexOf(value) ?? -1;

  function drop() {
    if (!context || context.dragging.current === null) return;
    const from = context.dragging.current;
    if (from === index || from < 0 || index < 0) return;
    const next = [...context.values];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    context.onReorder(next);
    context.dragging.current = null;
  }

  return (
    <div
      draggable
      className={className}
      onDragStart={() => {
        if (context) context.dragging.current = index;
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={drop}
      {...props}
    >
      {children}
    </div>
  );
}

export const Reorder = { Group: ReorderGroup, Item: ReorderItem };
