import { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Default Emotion Wheel Data (based on typical feeling wheels, 3 tiers deep)
interface EmotionNode {
  id: string;
  name: string;
  color?: string;
  textColor?: string;
  isBold?: boolean;
  isItalic?: boolean;
  children?: EmotionNode[];
}

const defaultData: EmotionNode = {
  id: 'root',
  name: 'Emotions',
  children: [
    {
      id: generateId(), name: 'ANGER', color: '#f87171', textColor: '#000000',
      children: [
        { id: generateId(), name: 'THREATENED', color: '#fca5a5', textColor: '#000000', children: [{ id: generateId(), name: 'JEALOUS', color: '#fecaca', textColor: '#000000' }, { id: generateId(), name: 'INSECURE', color: '#fecaca', textColor: '#000000' }] },
        { id: generateId(), name: 'HATEFUL', color: '#fca5a5', textColor: '#000000', children: [{ id: generateId(), name: 'RESENTFUL', color: '#fecaca', textColor: '#000000' }, { id: generateId(), name: 'VIOLATED', color: '#fecaca', textColor: '#000000' }] },
        { id: generateId(), name: 'MAD', color: '#fca5a5', textColor: '#000000', children: [{ id: generateId(), name: 'FURIOUS', color: '#fecaca', textColor: '#000000' }, { id: generateId(), name: 'ENRAGED', color: '#fecaca', textColor: '#000000' }] },
        { id: generateId(), name: 'AGGRESSIVE', color: '#fca5a5', textColor: '#000000', children: [{ id: generateId(), name: 'PROVOKED', color: '#fecaca', textColor: '#000000' }, { id: generateId(), name: 'HOSTILE', color: '#fecaca', textColor: '#000000' }] },
        { id: generateId(), name: 'FRUSTRATED', color: '#fca5a5', textColor: '#000000', children: [{ id: generateId(), name: 'INFURIATED', color: '#fecaca', textColor: '#000000' }, { id: generateId(), name: 'ANNOYED', color: '#fecaca', textColor: '#000000' }] },
        { id: generateId(), name: 'DISTANT', color: '#fca5a5', textColor: '#000000', children: [{ id: generateId(), name: 'WITHDRAWN', color: '#fecaca', textColor: '#000000' }, { id: generateId(), name: 'NUMB', color: '#fecaca', textColor: '#000000' }] },
        { id: generateId(), name: 'CRITICAL', color: '#fca5a5', textColor: '#000000', children: [{ id: generateId(), name: 'SKEPTICAL', color: '#fecaca', textColor: '#000000' }, { id: generateId(), name: 'DISMISSIVE', color: '#fecaca', textColor: '#000000' }] }
      ]
    },
    {
      id: generateId(), name: 'DISGUST', color: '#a78bfa', textColor: '#000000',
      children: [
        { id: generateId(), name: 'DISAPPROVAL', color: '#c4b5fd', textColor: '#000000', children: [{ id: generateId(), name: 'JUDGMENTAL', color: '#ddd6fe', textColor: '#000000' }, { id: generateId(), name: 'LOATHING', color: '#ddd6fe', textColor: '#000000' }] },
        { id: generateId(), name: 'DISAPPOINTED', color: '#c4b5fd', textColor: '#000000', children: [{ id: generateId(), name: 'APPALLED', color: '#ddd6fe', textColor: '#000000' }, { id: generateId(), name: 'REVOLTED', color: '#ddd6fe', textColor: '#000000' }] },
        { id: generateId(), name: 'AWFUL', color: '#c4b5fd', textColor: '#000000', children: [{ id: generateId(), name: 'NAUSEATED', color: '#ddd6fe', textColor: '#000000' }, { id: generateId(), name: 'DETESTABLE', color: '#ddd6fe', textColor: '#000000' }] },
        { id: generateId(), name: 'REPELLED', color: '#c4b5fd', textColor: '#000000', children: [{ id: generateId(), name: 'HESITANT', color: '#ddd6fe', textColor: '#000000' }, { id: generateId(), name: 'HORRIFIED', color: '#ddd6fe', textColor: '#000000' }] }
      ]
    },
    {
      id: generateId(), name: 'SAD', color: '#60a5fa', textColor: '#000000',
      children: [
        { id: generateId(), name: 'GUILTY', color: '#93c5fd', textColor: '#000000', children: [{ id: generateId(), name: 'REMORSEFUL', color: '#bfdbfe', textColor: '#000000' }, { id: generateId(), name: 'ASHAMED', color: '#bfdbfe', textColor: '#000000' }] },
        { id: generateId(), name: 'VULNERABLE', color: '#93c5fd', textColor: '#000000', children: [{ id: generateId(), name: 'VICTIMIZED', color: '#bfdbfe', textColor: '#000000' }, { id: generateId(), name: 'FRAGILE', color: '#bfdbfe', textColor: '#000000' }] },
        { id: generateId(), name: 'DESPAIR', color: '#93c5fd', textColor: '#000000', children: [{ id: generateId(), name: 'POWERLESS', color: '#bfdbfe', textColor: '#000000' }, { id: generateId(), name: 'GRIEF', color: '#bfdbfe', textColor: '#000000' }] },
        { id: generateId(), name: 'DEPRESSED', color: '#93c5fd', textColor: '#000000', children: [{ id: generateId(), name: 'INFERIOR', color: '#bfdbfe', textColor: '#000000' }, { id: generateId(), name: 'EMPTY', color: '#bfdbfe', textColor: '#000000' }] },
        { id: generateId(), name: 'LONELY', color: '#93c5fd', textColor: '#000000', children: [{ id: generateId(), name: 'ABANDONED', color: '#bfdbfe', textColor: '#000000' }, { id: generateId(), name: 'ISOLATED', color: '#bfdbfe', textColor: '#000000' }] },
        { id: generateId(), name: 'HURT', color: '#93c5fd', textColor: '#000000', children: [{ id: generateId(), name: 'EMBARRASSED', color: '#bfdbfe', textColor: '#000000' }, { id: generateId(), name: 'DISAPPOINTED', color: '#bfdbfe', textColor: '#000000' }] }
      ]
    },
    {
      id: generateId(), name: 'HAPPY', color: '#fcd34d', textColor: '#000000',
      children: [
        { id: generateId(), name: 'OPTIMISTIC', color: '#fde68a', textColor: '#000000', children: [{ id: generateId(), name: 'INSPIRED', color: '#fef3c7', textColor: '#000000' }, { id: generateId(), name: 'HOPEFUL', color: '#fef3c7', textColor: '#000000' }] },
        { id: generateId(), name: 'TRUSTING', color: '#fde68a', textColor: '#000000', children: [{ id: generateId(), name: 'INTIMATE', color: '#fef3c7', textColor: '#000000' }, { id: generateId(), name: 'SENSITIVE', color: '#fef3c7', textColor: '#000000' }] },
        { id: generateId(), name: 'PEACEFUL', color: '#fde68a', textColor: '#000000', children: [{ id: generateId(), name: 'THANKFUL', color: '#fef3c7', textColor: '#000000' }, { id: generateId(), name: 'LOVING', color: '#fef3c7', textColor: '#000000' }] },
        { id: generateId(), name: 'POWERFUL', color: '#fde68a', textColor: '#000000', children: [{ id: generateId(), name: 'CREATIVE', color: '#fef3c7', textColor: '#000000' }, { id: generateId(), name: 'COURAGEOUS', color: '#fef3c7', textColor: '#000000' }] },
        { id: generateId(), name: 'ACCEPTED', color: '#fde68a', textColor: '#000000', children: [{ id: generateId(), name: 'RESPECTED', color: '#fef3c7', textColor: '#000000' }, { id: generateId(), name: 'VALUED', color: '#fef3c7', textColor: '#000000' }] },
        { id: generateId(), name: 'PROUD', color: '#fde68a', textColor: '#000000', children: [{ id: generateId(), name: 'SUCCESSFUL', color: '#fef3c7', textColor: '#000000' }, { id: generateId(), name: 'CONFIDENT', color: '#fef3c7', textColor: '#000000' }] },
        { id: generateId(), name: 'INTERESTED', color: '#fde68a', textColor: '#000000', children: [{ id: generateId(), name: 'CURIOUS', color: '#fef3c7', textColor: '#000000' }, { id: generateId(), name: 'INQUISITIVE', color: '#fef3c7', textColor: '#000000' }] },
        { id: generateId(), name: 'CONTENT', color: '#fde68a', textColor: '#000000', children: [{ id: generateId(), name: 'JOYFUL', color: '#fef3c7', textColor: '#000000' }, { id: generateId(), name: 'FREE', color: '#fef3c7', textColor: '#000000' }] },
        { id: generateId(), name: 'PLAYFUL', color: '#fde68a', textColor: '#000000', children: [{ id: generateId(), name: 'CHEEKY', color: '#fef3c7', textColor: '#000000' }, { id: generateId(), name: 'AROUSED', color: '#fef3c7', textColor: '#000000' }] }
      ]
    },
    {
      id: generateId(), name: 'SURPRISE', color: '#38bdf8', textColor: '#000000',
      children: [
        { id: generateId(), name: 'EXCITED', color: '#7dd3fc', textColor: '#000000', children: [{ id: generateId(), name: 'ENERGETIC', color: '#bae6fd', textColor: '#000000' }, { id: generateId(), name: 'EAGER', color: '#bae6fd', textColor: '#000000' }] },
        { id: generateId(), name: 'AMAZED', color: '#7dd3fc', textColor: '#000000', children: [{ id: generateId(), name: 'AWE', color: '#bae6fd', textColor: '#000000' }, { id: generateId(), name: 'ASTONISHED', color: '#bae6fd', textColor: '#000000' }] },
        { id: generateId(), name: 'CONFUSED', color: '#7dd3fc', textColor: '#000000', children: [{ id: generateId(), name: 'PERPLEXED', color: '#bae6fd', textColor: '#000000' }, { id: generateId(), name: 'DISILLUSIONED', color: '#bae6fd', textColor: '#000000' }] },
        { id: generateId(), name: 'STARTLED', color: '#7dd3fc', textColor: '#000000', children: [{ id: generateId(), name: 'DISMAYED', color: '#bae6fd', textColor: '#000000' }, { id: generateId(), name: 'SHOCKED', color: '#bae6fd', textColor: '#000000' }] }
      ]
    },
    {
      id: generateId(), name: 'FEAR', color: '#4ade80', textColor: '#000000',
      children: [
        { id: generateId(), name: 'SCARED', color: '#86efac', textColor: '#000000', children: [{ id: generateId(), name: 'TERRIFIED', color: '#bbf7d0', textColor: '#000000' }, { id: generateId(), name: 'FRIGHTENED', color: '#bbf7d0', textColor: '#000000' }] },
        { id: generateId(), name: 'ANXIOUS', color: '#86efac', textColor: '#000000', children: [{ id: generateId(), name: 'OVERWHELMED', color: '#bbf7d0', textColor: '#000000' }, { id: generateId(), name: 'WORRIED', color: '#bbf7d0', textColor: '#000000' }] },
        { id: generateId(), name: 'INSECURE', color: '#86efac', textColor: '#000000', children: [{ id: generateId(), name: 'INADEQUATE', color: '#bbf7d0', textColor: '#000000' }, { id: generateId(), name: 'INFERIOR', color: '#bbf7d0', textColor: '#000000' }] },
        { id: generateId(), name: 'SUBMISSIVE', color: '#86efac', textColor: '#000000', children: [{ id: generateId(), name: 'WORTHLESS', color: '#bbf7d0', textColor: '#000000' }, { id: generateId(), name: 'INSIGNIFICANT', color: '#bbf7d0', textColor: '#000000' }] },
        { id: generateId(), name: 'REJECTED', color: '#86efac', textColor: '#000000', children: [{ id: generateId(), name: 'EXCLUDED', color: '#bbf7d0', textColor: '#000000' }, { id: generateId(), name: 'PERSECUTED', color: '#bbf7d0', textColor: '#000000' }] },
        { id: generateId(), name: 'HUMILIATED', color: '#86efac', textColor: '#000000', children: [{ id: generateId(), name: 'DISRESPECTED', color: '#bbf7d0', textColor: '#000000' }, { id: generateId(), name: 'RIDICULED', color: '#bbf7d0', textColor: '#000000' }] }
      ]
    }
  ]
};

// Top 10 most popular Google Fonts
const top10GoogleFonts = [
  "Roboto", "Open Sans", "Montserrat", "Lato", "Poppins", 
  "Inter", "Oswald", "Raleway", "Nunito", "Playfair Display"
].sort();

interface LocalSavedState {
  data?: EmotionNode;
  rotation?: number;
  padding?: number;
  borderColor?: string;
  fontFamily?: string;
  fontSize?: number;
  exportWidth?: number;
  availableFonts?: string[];
  isDarkMode?: boolean;
}

const getInitialState = (): LocalSavedState => {
  try {
    const saved = localStorage.getItem('emotionWheelState');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to load state from localStorage", e);
  }
  return {};
};

export default function App() {
  const [initialState] = useState<LocalSavedState>(getInitialState);

  const [data, setData] = useState<EmotionNode>(initialState.data || defaultData);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // History states for Undo/Redo tracking
  const historyRef = useRef<EmotionNode[]>([initialState.data || defaultData]);
  const historyIndexRef = useRef<number>(0);
  const skipHistoryRef = useRef<boolean>(false);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  
  // Wheel Settings
  const [rotation, setRotation] = useState<number>(initialState.rotation || 0);
  const [padding, setPadding] = useState<number>(initialState.padding ?? 1);
  const [borderColor, setBorderColor] = useState<string>(initialState.borderColor || '#000000');
  const [fontFamily, setFontFamily] = useState<string>(initialState.fontFamily || 'sans-serif');
  const [fontSize, setFontSize] = useState<number>(initialState.fontSize || 11);
  const [exportWidth, setExportWidth] = useState<number>(initialState.exportWidth || 1200);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(initialState.isDarkMode || false);
  
  // Font Selection State
  const [availableFonts, setAvailableFonts] = useState<string[]>(initialState.availableFonts || top10GoogleFonts);
  const [customFontInput, setCustomFontInput] = useState<string>("");
  const [customFontError, setCustomFontError] = useState<string>("");
  const [isFontLoading, setIsFontLoading] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Track rotation in a ref for the drag handler to access the latest value without dependency loops
  const rotationRef = useRef<number>(rotation);
  useEffect(() => { rotationRef.current = rotation; }, [rotation]);

  // Save state to local storage whenever settings change
  useEffect(() => {
    const stateToSave: LocalSavedState = {
      data, rotation, padding, borderColor, fontFamily, fontSize, exportWidth, availableFonts, isDarkMode
    };
    localStorage.setItem('emotionWheelState', JSON.stringify(stateToSave));
  }, [data, rotation, padding, borderColor, fontFamily, fontSize, exportWidth, availableFonts, isDarkMode]);

  // Helper to find a node by ID in the tree
  const findNode = (node: EmotionNode, id: string): EmotionNode | null => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNode(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper to get parent of a node
  const findParent = (node: EmotionNode, id: string, parent: EmotionNode | null = null): EmotionNode | null => {
    if (node.id === id) return parent;
    if (node.children) {
      for (const child of node.children) {
        const found = findParent(child, id, node);
        if (found) return found;
      }
    }
    return null;
  };

  // Update a specific node's data
  const updateNode = (id: string, updates: Partial<EmotionNode>) => {
    const newData = JSON.parse(JSON.stringify(data)); // Deep clone
    const node = findNode(newData, id);
    if (node) {
      Object.assign(node, updates);
      setData(newData);
    }
  };

  const applyToSiblings = (id: string, prop: keyof EmotionNode, value: any) => {
    const newData = JSON.parse(JSON.stringify(data));
    const parent = findParent(newData, id);
    if (parent && parent.children) {
      parent.children.forEach(child => {
        (child as any)[prop] = value;
      });
      setData(newData);
    }
  };

  const addSegment = (parentId: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    const parent = findNode(newData, parentId);
    
    if (parent) {
      if (!parent.children) parent.children = [];
      
      // Determine depth to set a default color based on parent
      let defaultColor = '#cccccc';
      if (parent.color) defaultColor = parent.color;

      parent.children.push({
        id: generateId(),
        name: 'NEW',
        color: defaultColor,
        textColor: '#000000'
      });
      setData(newData);
    }
  };

  const removeSegment = (id: string) => {
    if (id === 'root') return; // Cannot remove root

    const newData = JSON.parse(JSON.stringify(data));
    const parent = findParent(newData, id);
    
    if (parent && parent.children) {
      parent.children = parent.children.filter(child => child.id !== id);
      // Remove empty children arrays
      if (parent.children.length === 0) {
          delete parent.children;
      }
      setData(newData);
      if (selectedNodeId === id) setSelectedNodeId(null);
    }
  };

  useEffect(() => {
    if (skipHistoryRef.current) {
      skipHistoryRef.current = false;
      return;
    }
    
    // 500ms debounce ensures color picker drags aren't all saved individually
    const timer = setTimeout(() => {
      const latestSaved = historyRef.current[historyIndexRef.current];
      if (JSON.stringify(latestSaved) !== JSON.stringify(data)) {
        const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
        newHistory.push(data);
        
        // Keep history memory reasonable (max 50 steps)
        if (newHistory.length > 50) newHistory.shift();
        
        historyRef.current = newHistory;
        historyIndexRef.current = newHistory.length - 1;
        setCanUndo(historyIndexRef.current > 0);
        setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [data]);

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      skipHistoryRef.current = true;
      historyIndexRef.current -= 1;
      setData(historyRef.current[historyIndexRef.current]);
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      skipHistoryRef.current = true;
      historyIndexRef.current += 1;
      setData(historyRef.current[historyIndexRef.current]);
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }
  };

  const handleReset = () => {
    setData(defaultData);
    setSelectedNodeId(null);
    setRotation(0);
    setPadding(1);
    setBorderColor('#000000');
    setFontFamily('sans-serif');
    setFontSize(11);
    setExportWidth(1200);
    setIsDarkMode(false);
    setAvailableFonts(top10GoogleFonts);
    
    // Clear local storage
    localStorage.removeItem('emotionWheelState');
    
    // Reset undo/redo history
    historyRef.current = [defaultData];
    historyIndexRef.current = 0;
    setCanUndo(false);
    setCanRedo(false);
  };

  const handleAddCustomFont = () => {
    const fontName = customFontInput.trim();
    if (!fontName) return;

    // Check if already in list (case-insensitive)
    const existing = availableFonts.find(f => f.toLowerCase() === fontName.toLowerCase());
    if (existing) {
      setFontFamily(`'${existing}', sans-serif`);
      setCustomFontInput("");
      setCustomFontError("");
      return;
    }

    setIsFontLoading(true);
    setCustomFontError("");

    // Format user input for URL
    const formattedFontName = fontName.replace(/ /g, '+');
    const url = `https://fonts.googleapis.com/css2?family=${formattedFontName}:wght@400;600;700&display=swap`;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;

    link.onload = () => {
      setAvailableFonts(prev => [...prev, fontName].sort());
      setFontFamily(`'${fontName}', sans-serif`);
      setIsFontLoading(false);
      setCustomFontInput("");
    };

    link.onerror = () => {
      setCustomFontError(`Could not load "${fontName}". Please check the exact spelling on Google Fonts.`);
      setIsFontLoading(false);
      document.head.removeChild(link);
    };

    document.head.appendChild(link);
  };

  // Dynamically load Google Font when changed
  useEffect(() => {
    if (fontFamily === 'sans-serif' || fontFamily === 'serif' || fontFamily === 'monospace') return;
    
    const fontName = fontFamily.replace(/['"]/g, ''); // Remove quotes if any
    const formattedFontName = fontName.split(',')[0].trim().replace(/ /g, '+');
    const url = `https://fonts.googleapis.com/css2?family=${formattedFontName}:wght@400;600;700&display=swap`;
    
    // Check if link already exists
    if (!document.querySelector(`link[href="${url}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
    }
  }, [fontFamily]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Dimensions
    const width = 800; // Render width in UI, export can be higher
    const height = 800;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const g = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%")
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2}) rotate(${rotation})`);

    // Create D3 Hierarchy
    // We assign an equal value to leaf nodes so segments take up equal angular space proportionally
    // Removed `.sort()` to strictly enforce our custom clockwise array structure
    const root = d3.hierarchy<EmotionNode>(data)
      .sum(d => d.children ? 0 : 1);

    // Determine max depth to calculate radii correctly
    const maxDepth = root.height;
    
    // Create Partition layout
    const partition = d3.partition<EmotionNode>()
      .size([2 * Math.PI, radius]); // size: [angle, radius]

    partition(root);

    // Filter out root from rendering if you want a hole in the middle, 
    // or keep it. Emotion wheels usually don't show the root "Emotions" as a slice.
    const nodesToRender = root.descendants().filter(d => d.depth > 0) as d3.HierarchyRectangularNode<EmotionNode>[];

    // Arc generator
    // Calculate inner/outer radius based on depth.
    // Adjusted to evenly divide the radius and start from the exact center (0)
    const radiusStep = radius / maxDepth;

    const arc = d3.arc<d3.HierarchyRectangularNode<EmotionNode>>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padRadius(radius / 2)
      .innerRadius(d => (d.depth - 1) * radiusStep) 
      .outerRadius(d => d.depth * radiusStep);

    const dragBehavior = d3.drag<SVGSVGElement, unknown>()
      .on("start", function(event) {
        const [x, y] = d3.pointer(event, svgRef.current);
        const cx = width / 2;
        const cy = height / 2;
        const angle = Math.atan2(y - cy, x - cx) * 180 / Math.PI;
        
        d3.select(this)
          .attr("data-start-angle", angle)
          .attr("data-start-rotation", rotationRef.current)
          .attr("data-dragged", "false")
          .attr("data-dragging-active", "true")
          .style("cursor", "grabbing");
      })
      .on("drag", function(event) {
        const [x, y] = d3.pointer(event, svgRef.current);
        const cx = width / 2;
        const cy = height / 2;
        const angle = Math.atan2(y - cy, x - cx) * 180 / Math.PI;
        
        const startAngle = parseFloat(d3.select(this).attr("data-start-angle") || "0");
        const startRotation = parseFloat(d3.select(this).attr("data-start-rotation") || "0");
        
        let delta = angle - startAngle;
        
        // Handle wrapping around the atan2 seam (-180 to 180)
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        
        const newRotation = (startRotation + delta + 360) % 360;
        
        // Only register as a drag if moved more than a tiny threshold to preserve click events
        if (Math.abs(delta) > 1) {
            d3.select(this).attr("data-dragged", "true");
        }
        
        setRotation(newRotation);
      })
      .on("end", function() {
        d3.select(this).attr("data-dragging-active", "false").style("cursor", "grab");
        // Briefly delay clearing the dragged state so the onClick handler can catch it
        setTimeout(() => {
            d3.select(svgRef.current).attr("data-dragged", "false");
        }, 50);
      });

    // Apply drag to SVG and restore cursor if actively dragging across re-renders
    const isActivelyDragging = svg.attr("data-dragging-active") === "true";
    svg.call(dragBehavior).style("cursor", isActivelyDragging ? "grabbing" : "grab");

    // Draw Paths
    g.selectAll("path")
      .data(nodesToRender)
      .join("path")
      .attr("d", arc as any)
      .attr("fill", d => d.data.color || '#eee')
      .attr("stroke", borderColor)
      .attr("stroke-width", padding)
      .attr("class", "segment-path")
      .style("transition", "fill 0.2s ease")
      .on("click", (_, d) => {
        // Prevent selection if the user was dragging to rotate
        const wasDragged = d3.select(svgRef.current).attr("data-dragged");
        if (wasDragged === "true") return; 
        
        setSelectedNodeId(d.data.id);
      });

    // Add Text Labels
    g.selectAll("text")
      .data(nodesToRender)
      .join("text")
      .attr("transform", function(d) {
        // Calculate center of arc
        const x = ((d.x0 + d.x1) / 2) * 180 / Math.PI;
        // Position text precisely in the middle of the radius step for this depth
        const y = (d.depth - 0.5) * radiusStep;
        
        // Determine the actual angle on screen taking global rotation into account
        let globalAngle = (x + rotation) % 360;
        if (globalAngle < 0) globalAngle += 360;
        
        // If text falls on the left side of the wheel, flip it 180 degrees so it's always readable
        const isLeftHemisphere = globalAngle > 180 && globalAngle < 360;
        
        const rot = x - 90;
        return `rotate(${rot}) translate(${y},0) rotate(${isLeftHemisphere ? 180 : 0})`;
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .style("fill", d => d.data.textColor || '#000')
      .style("font-family", fontFamily)
      .style("font-size", `${fontSize}px`)
      .style("font-weight", d => {
        if (d.data.isBold !== undefined) return d.data.isBold ? "bold" : "normal";
        return d.depth === 1 ? "bold" : "normal";
      })
      .style("font-style", d => d.data.isItalic ? "italic" : "normal")
      .style("pointer-events", "none") // Let clicks pass through to path
      .text(d => d.data.name);

  }, [data, rotation, padding, borderColor, fontFamily, fontSize, selectedNodeId]);

  const exportSVG = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;
    
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);
    
    // Add namespaces if missing
    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "emotion-wheel.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportPNG = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Use the user-defined export width
    canvas.width = exportWidth;
    canvas.height = exportWidth; // Keep square

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    
    // Create an Image object
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Draw transparent background (it's transparent by default on canvas)
      // ctx.clearRect(0, 0, canvas.width, canvas.height); // Optional explicit clear
      
      // Draw image onto canvas, scaled to requested width
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `emotion-wheel-${exportWidth}px.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const selectedNode = selectedNodeId ? findNode(data, selectedNodeId) : null;
  const selectedParent = selectedNodeId ? findParent(data, selectedNodeId) : null;
  const isTier1 = selectedParent && selectedParent.id === 'root';
  const isCurrentlyBold = selectedNode ? (selectedNode.isBold !== undefined ? selectedNode.isBold : isTier1) : false;
  const isCurrentlyItalic = selectedNode ? (selectedNode.isItalic !== undefined ? selectedNode.isItalic : false) : false;

  return (
    <div className={`flex flex-col md:flex-row h-screen font-sans ${isDarkMode ? 'bg-neutral-900 text-neutral-100' : 'bg-neutral-100 text-neutral-800'}`}>
      
      {/* LEFT: Editor Panel */}
      <div className={`w-full md:w-80 lg:w-96 border-r overflow-y-auto flex flex-col shadow-sm z-10 ${isDarkMode ? 'bg-neutral-850 border-neutral-700 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'}`}>
        <div className={`p-6 border-b sticky top-0 z-20 flex justify-between items-start ${isDarkMode ? 'bg-neutral-850 border-neutral-700' : 'bg-neutral-50 border-neutral-100'}`}>
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Emotion Wheel</h1>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Customize and export your wheel.</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="flex space-x-1">
              <button 
                onClick={handleUndo} 
                disabled={!canUndo} 
                className={`p-1.5 border rounded disabled:opacity-40 transition-colors ${isDarkMode ? 'bg-neutral-700 border-neutral-600 text-neutral-300 hover:bg-neutral-600' : 'bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50'}`}
                title="Undo"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
              </button>
              <button 
                onClick={handleRedo} 
                disabled={!canRedo} 
                className={`p-1.5 border rounded disabled:opacity-40 transition-colors ${isDarkMode ? 'bg-neutral-700 border-neutral-600 text-neutral-300 hover:bg-neutral-600' : 'bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50'}`}
                title="Redo"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"></path></svg>
              </button>
            </div>
            <button 
              onClick={handleReset} 
              className={`text-xs px-2 py-1 rounded transition-colors ${isDarkMode ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'}`}
            >
              Reset Default
            </button>
          </div>
        </div>

        {/* Global Settings */}
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Global Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rotation ({Math.round(rotation)}°)</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="range" min="0" max="360" value={Math.round(rotation)} 
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <input 
                  type="number" min="0" max="360" value={Math.round(rotation)}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className={`w-16 p-1 border rounded text-sm text-center ${isDarkMode ? 'bg-neutral-700 border-neutral-600 text-white' : 'border-neutral-300'}`}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Segment Padding ({padding}px)</label>
              <input 
                type="range" min="0" max="10" step="0.5" value={padding} 
                onChange={(e) => setPadding(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium w-42">Segment Border Color</label>
              <input 
                type="color" value={borderColor} 
                onChange={(e) => setBorderColor(e.target.value)}
                className="h-8 w-14 cursor-pointer rounded border border-neutral-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Font Size ({fontSize}px)</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="range" min="6" max="36" value={fontSize} 
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <input 
                  type="number" min="6" max="36" value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className={`w-16 p-1 border rounded text-sm text-center ${isDarkMode ? 'bg-neutral-700 border-neutral-600 text-white' : 'border-neutral-300'}`}
                />
              </div>
            </div>

            <div>
               <label className="block text-sm font-medium mb-1">Font Family</label>
               <select
                 value={fontFamily === 'sans-serif' || fontFamily === 'serif' ? fontFamily : fontFamily.replace(/['"]/g, '').split(',')[0].trim()}
                 onChange={(e) => {
                     if (e.target.value === 'sans-serif' || e.target.value === 'serif') {
                         setFontFamily(e.target.value);
                     } else {
                         setFontFamily(`'${e.target.value}', sans-serif`);
                     }
                 }}
                 className={`w-full p-2 border rounded bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3 ${isDarkMode ? 'bg-neutral-700 border-neutral-600 text-white' : 'bg-white border-neutral-300'}`}
               >
                 <option value="sans-serif">System Sans-Serif</option>
                 <option value="serif">System Serif</option>
                 <optgroup label="Available Fonts">
                   {availableFonts.map(font => (
                     <option key={font} value={font}>{font}</option>
                   ))}
                 </optgroup>
               </select>

               <div className={`p-3 rounded border ${isDarkMode ? 'bg-neutral-900 border-neutral-700' : 'bg-neutral-100 border-neutral-200'}`}>
                 <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>Add Custom Google Font</label>
                 <div className="flex space-x-2">
                     <input
                         type="text"
                         placeholder="e.g., Space Mono"
                         value={customFontInput}
                         onChange={(e) => setCustomFontInput(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && handleAddCustomFont()}
                         className={`flex-grow p-1.5 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${isDarkMode ? 'bg-neutral-700 border-neutral-600 text-white' : 'border-neutral-300'}`}
                     />
                     <button
                         onClick={handleAddCustomFont}
                         disabled={isFontLoading || !customFontInput.trim()}
                         className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium disabled:opacity-50 transition-colors"
                     >
                         {isFontLoading ? '...' : 'Add'}
                     </button>
                 </div>
                 {customFontError && <p className="text-xs text-red-500 mt-2 leading-tight">{customFontError}</p>}
               </div>
            </div>
          </div>
        </div>

        {/* Segment Editor */}
        <div className="p-6 flex-grow border-b border-neutral-200">
          <h2 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Segment Editor</h2>
          
          {!selectedNode ? (
            <div className={`text-sm p-4 rounded-lg border border-dashed text-center ${isDarkMode ? 'text-neutral-500 bg-neutral-900 border-neutral-700' : 'text-neutral-500 bg-neutral-50 border-neutral-300'}`}>
              Click on any segment in the wheel to edit its properties, add sub-emotions, or remove it.
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in slide-in-from-left-2 duration-200">
              <div className={`flex justify-between items-center p-3 rounded-md border ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-100'}`}>
                 <span className={`font-semibold truncate mr-2 ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>Editing: {selectedNode.name}</span>
                 <button 
                    onClick={() => setSelectedNodeId(null)}
                    className={`text-xs px-2 py-1 rounded border ${isDarkMode ? 'text-blue-300 bg-blue-900/40 border-blue-800' : 'text-blue-500 hover:text-blue-700 bg-white border-blue-200'}`}
                  >
                    Deselect
                  </button>
              </div>

              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-medium">Text / Label</label>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => updateNode(selectedNode.id, { isBold: !isCurrentlyBold })}
                      className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold border transition-colors ${isCurrentlyBold ? (isDarkMode ? 'bg-blue-800 border-blue-600 text-blue-100' : 'bg-blue-100 border-blue-300 text-blue-800') : (isDarkMode ? 'bg-neutral-700 border-neutral-600 text-neutral-300' : 'bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50')}`}
                      title="Toggle Bold"
                    >
                      B
                    </button>
                    <button 
                      onClick={() => updateNode(selectedNode.id, { isItalic: !isCurrentlyItalic })}
                      className={`w-6 h-6 flex items-center justify-center rounded text-xs italic font-serif border transition-colors ${isCurrentlyItalic ? (isDarkMode ? 'bg-blue-800 border-blue-600 text-blue-100' : 'bg-blue-100 border-blue-300 text-blue-800') : (isDarkMode ? 'bg-neutral-700 border-neutral-600 text-neutral-300' : 'bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50')}`}
                      title="Toggle Italic"
                    >
                      I
                    </button>
                  </div>
                </div>
                <input 
                  type="text" 
                  value={selectedNode.name} 
                  onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase ${isDarkMode ? 'bg-neutral-700 border-neutral-600 text-white' : 'border-neutral-300'}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Background</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      value={selectedNode.color} 
                      onChange={(e) => updateNode(selectedNode.id, { color: e.target.value })}
                      className="h-10 w-full cursor-pointer rounded border border-neutral-300"
                    />
                  </div>
                  <button 
                    onClick={() => applyToSiblings(selectedNode.id, 'color', selectedNode.color)}
                    className="mt-1 text-[10px] uppercase font-semibold text-neutral-500 hover:text-blue-600 transition-colors"
                  >
                    Apply to Siblings
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Text Color</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      value={selectedNode.textColor} 
                      onChange={(e) => updateNode(selectedNode.id, { textColor: e.target.value })}
                      className="h-10 w-full cursor-pointer rounded border border-neutral-300"
                    />
                  </div>
                  <button 
                    onClick={() => applyToSiblings(selectedNode.id, 'textColor', selectedNode.textColor)}
                    className="mt-1 text-[10px] uppercase font-semibold text-neutral-500 hover:text-blue-600 transition-colors"
                  >
                    Apply to Siblings
                  </button>
                </div>
              </div>

              <hr className={`border ${isDarkMode ? 'border-neutral-700' : 'border-neutral-200'}`} />

              <div className="space-y-2">
                <button 
                  onClick={() => addSegment(selectedNode.id)}
                  className={`w-full py-2 rounded text-sm font-medium transition-colors flex justify-center items-center ${isDarkMode ? 'bg-neutral-700 hover:bg-neutral-600 text-neutral-200' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'}`}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  Add Child Segment
                </button>
                
                <button 
                  onClick={() => removeSegment(selectedNode.id)}
                  className={`w-full py-2 rounded text-sm font-medium transition-colors border flex justify-center items-center ${isDarkMode ? 'bg-red-900/20 hover:bg-red-900/40 text-red-400 border-red-900' : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-100'}`}
                >
                   <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  Delete Segment
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="p-6 border-b border-neutral-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <label className="text-sm font-medium">Dark Mode</label>
               <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-neutral-300'}`}
               >
                 <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`}></div>
               </button>
            </div>
          </div>
        </div>

        {/* Export Panel */}
        <div className={`p-6 border-t mt-auto ${isDarkMode ? 'bg-neutral-900 border-neutral-700' : 'bg-neutral-50 border-neutral-200'}`}>
           <h2 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Export</h2>
           
           <div className="mb-4">
              <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>PNG Resolution (px)</label>
              <input 
                type="number" 
                value={exportWidth} 
                onChange={(e) => setExportWidth(Number(e.target.value))}
                className={`w-full p-2 border rounded text-sm ${isDarkMode ? 'bg-neutral-800 border-neutral-600' : 'border-neutral-300'}`}
                step="100" min="400" max="4000"
              />
           </div>

           <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={exportPNG}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium shadow-sm transition-colors flex justify-center items-center"
              >
                Export PNG
              </button>
              <button 
                onClick={exportSVG}
                className={`px-4 py-2 border rounded text-sm font-medium shadow-sm transition-colors flex justify-center items-center ${isDarkMode ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-600 text-neutral-300' : 'bg-white hover:bg-neutral-50 border-neutral-300 text-neutral-700'}`}
              >
                Export SVG
              </button>
           </div>
        </div>
      </div>

      {/* RIGHT: Visualizer */}
      <div className="flex-grow flex flex-col relative" ref={containerRef}>
        
        {/* Top bar over visualizer for title */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-center pointer-events-none z-10">
             <h2 className={`text-4xl font-serif tracking-wide ${isDarkMode ? 'text-neutral-100' : 'text-neutral-800'}`} style={{ fontFamily: fontFamily }}>Wheel of Emotions</h2>
        </div>

        <div className="flex-grow flex items-center justify-center p-8 mt-12">
            <div className={`w-full max-w-4xl aspect-square relative shadow-2xl rounded-full overflow-hidden ${isDarkMode ? 'bg-neutral-800' : 'bg-white'}`} 
                 style={{
                   boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                 }}>
              {/* SVG D3 Container */}
              <svg ref={svgRef} className="w-full h-full"></svg>
            </div>
        </div>
      </div>

    </div>
  );
}
