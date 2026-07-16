import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
} from "@xyflow/react";
import Dagre from "@dagrejs/dagre";
import type { GraphData } from "../../types/reportDetail";
import "@xyflow/react/dist/style.css";

const NODE_W = 140;
const NODE_H = 44;

const STATUS_STYLE = {
  ok:    { bg: "#dbeafe", border: "var(--brand)", color: "#1e40af" },
  error: { bg: "#fef3c7", border: "#f59e0b",      color: "#92400e" },
  down:  { bg: "#fee2e2", border: "#ef4444",      color: "#ef4444" },
} as const;

type NodeStatus = keyof typeof STATUS_STYLE;
type ServiceNodeData = { label: string; status: NodeStatus };

function ServiceNode({ data }: { data: ServiceNodeData }) {
  const s = STATUS_STYLE[data.status] ?? STATUS_STYLE.ok;
  return (
    <div style={{ position: "relative", width: NODE_W, height: NODE_H }}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
      <div style={{
        width: "100%", height: "100%",
        background: s.bg,
        border: `1.5px solid ${s.border}`,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        fontFamily: "system-ui",
        fontSize: 11,
        fontWeight: data.status === "down" ? 700 : 400,
        color: s.color,
        boxSizing: "border-box",
      }}>
        {data.status === "down" && <span>×</span>}
        {data.label}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
    </div>
  );
}

const nodeTypes = { service: ServiceNode };

function buildFlow(graph: GraphData): { nodes: Node[]; edges: Edge[] } {
  const g = new Dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR", ranksep: 80, nodesep: 36 });
  g.setDefaultEdgeLabel(() => ({}));
  graph.nodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
  graph.edges.forEach((e) => g.setEdge(e.from, e.to));
  Dagre.layout(g);

  const nodes: Node[] = graph.nodes.map((n) => {
    const p = g.node(n.id);
    return {
      id: n.id,
      type: "service",
      position: { x: p.x - NODE_W / 2, y: p.y - NODE_H / 2 },
      data: { label: n.id, status: n.status } as ServiceNodeData,
      draggable: false,
      selectable: false,
    };
  });

  const edges: Edge[] = graph.edges.map((e, i) => ({
    id: `e${i}`,
    source: e.from,
    target: e.to,
    style: {
      stroke: e.isErrorPath ? "#ef4444" : "var(--brand)",
      strokeWidth: 1.5,
      ...(e.isErrorPath && { strokeDasharray: "5,3" }),
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 16,
      height: 16,
      color: e.isErrorPath ? "#ef4444" : "var(--brand)",
    },
    animated: e.isErrorPath,
    interactionWidth: 0,
    focusable: false,
  }));

  return { nodes, edges };
}

export default function DependencyGraph({ data }: { data: GraphData }) {
  const { nodes, edges } = useMemo(() => buildFlow(data), [data]);

  return (
    <div className="viz-graph-wrap">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--border)" gap={16} />
      </ReactFlow>
    </div>
  );
}
