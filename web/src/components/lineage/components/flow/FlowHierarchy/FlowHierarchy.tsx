import React, { useState } from 'react'
import { LineageNode } from '../../../types';
import { Zoom } from "@visx/zoom";
import { Tree, hierarchy } from "@visx/hierarchy";
import { Group } from "@visx/group";
import { localPoint } from "@visx/event";
import { Box } from '@mui/system';
import Node, { NodeType } from './Node';
import AnimatedLinks from './AnimatedLinks';
import AnimatedNodes from './AnimatedNodes';

import 'reactflow/dist/style.css'

// TODO Remove this mock data
const dataMock = {
    "name": "flare",
    "children": [
        {
            "name": "analytics",
            "children": [
                {
                    "name": "cluster",
                    "children": [
                        {
                            "name": "AgglomerativeCluster",
                            "size": 3938,
                            "id": "flare.analytics.cluster.AgglomerativeCluster"
                        },
                        {
                            "name": "CommunityStructure",
                            "size": 3812,
                            "id": "flare.analytics.cluster.CommunityStructure"
                        },
                        {
                            "name": "HierarchicalCluster",
                            "size": 6714,
                            "id": "flare.analytics.cluster.HierarchicalCluster"
                        },
                        {
                            "name": "MergeEdge",
                            "size": 743,
                            "id": "flare.analytics.cluster.MergeEdge"
                        }
                    ],
                    "id": "flare.analytics.cluster"
                },
                {
                    "name": "graph",
                    "children": [
                        {
                            "name": "BetweennessCentrality",
                            "size": 3534,
                            "id": "flare.analytics.graph.BetweennessCentrality"
                        },
                        {
                            "name": "LinkDistance",
                            "size": 5731,
                            "id": "flare.analytics.graph.LinkDistance"
                        },
                        {
                            "name": "MaxFlowMinCut",
                            "size": 7840,
                            "id": "flare.analytics.graph.MaxFlowMinCut"
                        },
                        {
                            "name": "ShortestPaths",
                            "size": 5914,
                            "id": "flare.analytics.graph.ShortestPaths"
                        },
                        {
                            "name": "SpanningTree",
                            "size": 3416,
                            "id": "flare.analytics.graph.SpanningTree"
                        }
                    ],
                    "id": "flare.analytics.graph"
                },
                {
                    "name": "optimization",
                    "children": [
                        {
                            "name": "AspectRatioBanker",
                            "size": 7074,
                            "id": "flare.analytics.optimization.AspectRatioBanker"
                        }
                    ],
                    "id": "flare.analytics.optimization"
                }
            ],
            "id": "flare.analytics"
        },
        {
            "name": "animate",
            "children": [
                {
                    "name": "Easing",
                    "size": 17010,
                    "id": "flare.animate.Easing"
                },
                {
                    "name": "FunctionSequence",
                    "size": 5842,
                    "id": "flare.animate.FunctionSequence"
                },
                {
                    "name": "interpolate",
                    "children": [
                        {
                            "name": "ArrayInterpolator",
                            "size": 1983,
                            "id": "flare.animate.interpolate.ArrayInterpolator"
                        },
                        {
                            "name": "ColorInterpolator",
                            "size": 2047,
                            "id": "flare.animate.interpolate.ColorInterpolator"
                        },
                        {
                            "name": "DateInterpolator",
                            "size": 1375,
                            "id": "flare.animate.interpolate.DateInterpolator"
                        },
                        {
                            "name": "Interpolator",
                            "size": 8746,
                            "id": "flare.animate.interpolate.Interpolator"
                        },
                        {
                            "name": "MatrixInterpolator",
                            "size": 2202,
                            "id": "flare.animate.interpolate.MatrixInterpolator"
                        },
                        {
                            "name": "NumberInterpolator",
                            "size": 1382,
                            "id": "flare.animate.interpolate.NumberInterpolator"
                        },
                        {
                            "name": "ObjectInterpolator",
                            "size": 1629,
                            "id": "flare.animate.interpolate.ObjectInterpolator"
                        },
                        {
                            "name": "PointInterpolator",
                            "size": 1675,
                            "id": "flare.animate.interpolate.PointInterpolator"
                        },
                        {
                            "name": "RectangleInterpolator",
                            "size": 2042,
                            "id": "flare.animate.interpolate.RectangleInterpolator"
                        }
                    ],
                    "id": "flare.animate.interpolate"
                },
                {
                    "name": "ISchedulable",
                    "size": 1041,
                    "id": "flare.animate.ISchedulable"
                },
                {
                    "name": "Parallel",
                    "size": 5176,
                    "id": "flare.animate.Parallel"
                },
                {
                    "name": "Pause",
                    "size": 449,
                    "id": "flare.animate.Pause"
                },
                {
                    "name": "Scheduler",
                    "size": 5593,
                    "id": "flare.animate.Scheduler"
                },
                {
                    "name": "Sequence",
                    "size": 5534,
                    "id": "flare.animate.Sequence"
                },
                {
                    "name": "Transition",
                    "size": 9201,
                    "id": "flare.animate.Transition"
                },
                {
                    "name": "Transitioner",
                    "size": 19975,
                    "id": "flare.animate.Transitioner"
                },
                {
                    "name": "TransitionEvent",
                    "size": 1116,
                    "id": "flare.animate.TransitionEvent"
                },
                {
                    "name": "Tween",
                    "size": 6006,
                    "id": "flare.animate.Tween"
                }
            ],
            "id": "flare.animate"
        },
        {
            "name": "data",
            "children": [
                {
                    "name": "converters",
                    "children": [
                        {
                            "name": "Converters",
                            "size": 721,
                            "id": "flare.data.converters.Converters"
                        },
                        {
                            "name": "DelimitedTextConverter",
                            "size": 4294,
                            "id": "flare.data.converters.DelimitedTextConverter"
                        },
                        {
                            "name": "GraphMLConverter",
                            "size": 9800,
                            "id": "flare.data.converters.GraphMLConverter"
                        },
                        {
                            "name": "IDataConverter",
                            "size": 1314,
                            "id": "flare.data.converters.IDataConverter"
                        },
                        {
                            "name": "JSONConverter",
                            "size": 2220,
                            "id": "flare.data.converters.JSONConverter"
                        }
                    ],
                    "id": "flare.data.converters"
                },
                {
                    "name": "DataField",
                    "size": 1759,
                    "id": "flare.data.DataField"
                },
                {
                    "name": "DataSchema",
                    "size": 2165,
                    "id": "flare.data.DataSchema"
                },
                {
                    "name": "DataSet",
                    "size": 586,
                    "id": "flare.data.DataSet"
                },
                {
                    "name": "DataSource",
                    "size": 3331,
                    "id": "flare.data.DataSource"
                },
                {
                    "name": "DataTable",
                    "size": 772,
                    "id": "flare.data.DataTable"
                },
                {
                    "name": "DataUtil",
                    "size": 3322,
                    "id": "flare.data.DataUtil"
                }
            ],
            "id": "flare.data"
        },
        {
            "name": "display",
            "children": [
                {
                    "name": "DirtySprite",
                    "size": 8833,
                    "id": "flare.display.DirtySprite"
                },
                {
                    "name": "LineSprite",
                    "size": 1732,
                    "id": "flare.display.LineSprite"
                },
                {
                    "name": "RectSprite",
                    "size": 3623,
                    "id": "flare.display.RectSprite"
                },
                {
                    "name": "TextSprite",
                    "size": 10066,
                    "id": "flare.display.TextSprite"
                }
            ],
            "id": "flare.display"
        },
        {
            "name": "flex",
            "children": [
                {
                    "name": "FlareVis",
                    "size": 4116,
                    "id": "flare.flex.FlareVis"
                }
            ],
            "id": "flare.flex"
        },
        {
            "name": "physics",
            "children": [
                {
                    "name": "DragForce",
                    "size": 1082,
                    "id": "flare.physics.DragForce"
                },
                {
                    "name": "GravityForce",
                    "size": 1336,
                    "id": "flare.physics.GravityForce"
                },
                {
                    "name": "IForce",
                    "size": 319,
                    "id": "flare.physics.IForce"
                },
                {
                    "name": "NBodyForce",
                    "size": 10498,
                    "id": "flare.physics.NBodyForce"
                },
                {
                    "name": "Particle",
                    "size": 2822,
                    "id": "flare.physics.Particle"
                },
                {
                    "name": "Simulation",
                    "size": 9983,
                    "id": "flare.physics.Simulation"
                },
                {
                    "name": "Spring",
                    "size": 2213,
                    "id": "flare.physics.Spring"
                },
                {
                    "name": "SpringForce",
                    "size": 1681,
                    "id": "flare.physics.SpringForce"
                }
            ],
            "id": "flare.physics"
        },
        {
            "name": "query",
            "children": [
                {
                    "name": "AggregateExpression",
                    "size": 1616,
                    "id": "flare.query.AggregateExpression"
                },
                {
                    "name": "And",
                    "size": 1027,
                    "id": "flare.query.And"
                },
                {
                    "name": "Arithmetic",
                    "size": 3891,
                    "id": "flare.query.Arithmetic"
                },
                {
                    "name": "Average",
                    "size": 891,
                    "id": "flare.query.Average"
                },
                {
                    "name": "BinaryExpression",
                    "size": 2893,
                    "id": "flare.query.BinaryExpression"
                },
                {
                    "name": "Comparison",
                    "size": 5103,
                    "id": "flare.query.Comparison"
                },
                {
                    "name": "CompositeExpression",
                    "size": 3677,
                    "id": "flare.query.CompositeExpression"
                },
                {
                    "name": "Count",
                    "size": 781,
                    "id": "flare.query.Count"
                },
                {
                    "name": "DateUtil",
                    "size": 4141,
                    "id": "flare.query.DateUtil"
                },
                {
                    "name": "Distinct",
                    "size": 933,
                    "id": "flare.query.Distinct"
                },
                {
                    "name": "Expression",
                    "size": 5130,
                    "id": "flare.query.Expression"
                },
                {
                    "name": "ExpressionIterator",
                    "size": 3617,
                    "id": "flare.query.ExpressionIterator"
                },
                {
                    "name": "Fn",
                    "size": 3240,
                    "id": "flare.query.Fn"
                },
                {
                    "name": "If",
                    "size": 2732,
                    "id": "flare.query.If"
                },
                {
                    "name": "IsA",
                    "size": 2039,
                    "id": "flare.query.IsA"
                },
                {
                    "name": "Literal",
                    "size": 1214,
                    "id": "flare.query.Literal"
                },
                {
                    "name": "Match",
                    "size": 3748,
                    "id": "flare.query.Match"
                },
                {
                    "name": "Maximum",
                    "size": 843,
                    "id": "flare.query.Maximum"
                },
                {
                    "name": "methods",
                    "children": [
                        {
                            "name": "add",
                            "size": 593,
                            "id": "flare.query.methods.add"
                        },
                        {
                            "name": "and",
                            "size": 330,
                            "id": "flare.query.methods.and"
                        },
                        {
                            "name": "average",
                            "size": 287,
                            "id": "flare.query.methods.average"
                        },
                        {
                            "name": "count",
                            "size": 277,
                            "id": "flare.query.methods.count"
                        },
                        {
                            "name": "distinct",
                            "size": 292,
                            "id": "flare.query.methods.distinct"
                        },
                        {
                            "name": "div",
                            "size": 595,
                            "id": "flare.query.methods.div"
                        },
                        {
                            "name": "eq",
                            "size": 594,
                            "id": "flare.query.methods.eq"
                        },
                        {
                            "name": "fn",
                            "size": 460,
                            "id": "flare.query.methods.fn"
                        },
                        {
                            "name": "gt",
                            "size": 603,
                            "id": "flare.query.methods.gt"
                        },
                        {
                            "name": "gte",
                            "size": 625,
                            "id": "flare.query.methods.gte"
                        },
                        {
                            "name": "iff",
                            "size": 748,
                            "id": "flare.query.methods.iff"
                        },
                        {
                            "name": "isa",
                            "size": 461,
                            "id": "flare.query.methods.isa"
                        },
                        {
                            "name": "lt",
                            "size": 597,
                            "id": "flare.query.methods.lt"
                        },
                        {
                            "name": "lte",
                            "size": 619,
                            "id": "flare.query.methods.lte"
                        },
                        {
                            "name": "max",
                            "size": 283,
                            "id": "flare.query.methods.max"
                        },
                        {
                            "name": "min",
                            "size": 283,
                            "id": "flare.query.methods.min"
                        },
                        {
                            "name": "mod",
                            "size": 591,
                            "id": "flare.query.methods.mod"
                        },
                        {
                            "name": "mul",
                            "size": 603,
                            "id": "flare.query.methods.mul"
                        },
                        {
                            "name": "neq",
                            "size": 599,
                            "id": "flare.query.methods.neq"
                        },
                        {
                            "name": "not",
                            "size": 386,
                            "id": "flare.query.methods.not"
                        },
                        {
                            "name": "or",
                            "size": 323,
                            "id": "flare.query.methods.or"
                        },
                        {
                            "name": "orderby",
                            "size": 307,
                            "id": "flare.query.methods.orderby"
                        },
                        {
                            "name": "range",
                            "size": 772,
                            "id": "flare.query.methods.range"
                        },
                        {
                            "name": "select",
                            "size": 296,
                            "id": "flare.query.methods.select"
                        },
                        {
                            "name": "stddev",
                            "size": 363,
                            "id": "flare.query.methods.stddev"
                        },
                        {
                            "name": "sub",
                            "size": 600,
                            "id": "flare.query.methods.sub"
                        },
                        {
                            "name": "sum",
                            "size": 280,
                            "id": "flare.query.methods.sum"
                        },
                        {
                            "name": "update",
                            "size": 307,
                            "id": "flare.query.methods.update"
                        },
                        {
                            "name": "variance",
                            "size": 335,
                            "id": "flare.query.methods.variance"
                        },
                        {
                            "name": "where",
                            "size": 299,
                            "id": "flare.query.methods.where"
                        },
                        {
                            "name": "xor",
                            "size": 354,
                            "id": "flare.query.methods.xor"
                        },
                        {
                            "name": "_",
                            "size": 264,
                            "id": "flare.query.methods._"
                        }
                    ],
                    "id": "flare.query.methods"
                },
                {
                    "name": "Minimum",
                    "size": 843,
                    "id": "flare.query.Minimum"
                },
                {
                    "name": "Not",
                    "size": 1554,
                    "id": "flare.query.Not"
                },
                {
                    "name": "Or",
                    "size": 970,
                    "id": "flare.query.Or"
                },
                {
                    "name": "Query",
                    "size": 13896,
                    "id": "flare.query.Query"
                },
                {
                    "name": "Range",
                    "size": 1594,
                    "id": "flare.query.Range"
                },
                {
                    "name": "StringUtil",
                    "size": 4130,
                    "id": "flare.query.StringUtil"
                },
                {
                    "name": "Sum",
                    "size": 791,
                    "id": "flare.query.Sum"
                },
                {
                    "name": "Variable",
                    "size": 1124,
                    "id": "flare.query.Variable"
                },
                {
                    "name": "Variance",
                    "size": 1876,
                    "id": "flare.query.Variance"
                },
                {
                    "name": "Xor",
                    "size": 1101,
                    "id": "flare.query.Xor"
                }
            ],
            "id": "flare.query"
        },
        {
            "name": "scale",
            "children": [
                {
                    "name": "IScaleMap",
                    "size": 2105,
                    "id": "flare.scale.IScaleMap"
                },
                {
                    "name": "LinearScale",
                    "size": 1316,
                    "id": "flare.scale.LinearScale"
                },
                {
                    "name": "LogScale",
                    "size": 3151,
                    "id": "flare.scale.LogScale"
                },
                {
                    "name": "OrdinalScale",
                    "size": 3770,
                    "id": "flare.scale.OrdinalScale"
                },
                {
                    "name": "QuantileScale",
                    "size": 2435,
                    "id": "flare.scale.QuantileScale"
                },
                {
                    "name": "QuantitativeScale",
                    "size": 4839,
                    "id": "flare.scale.QuantitativeScale"
                },
                {
                    "name": "RootScale",
                    "size": 1756,
                    "id": "flare.scale.RootScale"
                },
                {
                    "name": "Scale",
                    "size": 4268,
                    "id": "flare.scale.Scale"
                },
                {
                    "name": "ScaleType",
                    "size": 1821,
                    "id": "flare.scale.ScaleType"
                },
                {
                    "name": "TimeScale",
                    "size": 5833,
                    "id": "flare.scale.TimeScale"
                }
            ],
            "id": "flare.scale"
        },
        {
            "name": "util",
            "children": [
                {
                    "name": "Arrays",
                    "size": 8258,
                    "id": "flare.util.Arrays"
                },
                {
                    "name": "Colors",
                    "size": 10001,
                    "id": "flare.util.Colors"
                },
                {
                    "name": "Dates",
                    "size": 8217,
                    "id": "flare.util.Dates"
                },
                {
                    "name": "Displays",
                    "size": 12555,
                    "id": "flare.util.Displays"
                },
                {
                    "name": "Filter",
                    "size": 2324,
                    "id": "flare.util.Filter"
                },
                {
                    "name": "Geometry",
                    "size": 10993,
                    "id": "flare.util.Geometry"
                },
                {
                    "name": "heap",
                    "children": [
                        {
                            "name": "FibonacciHeap",
                            "size": 9354,
                            "id": "flare.util.heap.FibonacciHeap"
                        },
                        {
                            "name": "HeapNode",
                            "size": 1233,
                            "id": "flare.util.heap.HeapNode"
                        }
                    ],
                    "id": "flare.util.heap"
                },
                {
                    "name": "IEvaluable",
                    "size": 335,
                    "id": "flare.util.IEvaluable"
                },
                {
                    "name": "IPredicate",
                    "size": 383,
                    "id": "flare.util.IPredicate"
                },
                {
                    "name": "IValueProxy",
                    "size": 874,
                    "id": "flare.util.IValueProxy"
                },
                {
                    "name": "math",
                    "children": [
                        {
                            "name": "DenseMatrix",
                            "size": 3165,
                            "id": "flare.util.math.DenseMatrix"
                        },
                        {
                            "name": "IMatrix",
                            "size": 2815,
                            "id": "flare.util.math.IMatrix"
                        },
                        {
                            "name": "SparseMatrix",
                            "size": 3366,
                            "id": "flare.util.math.SparseMatrix"
                        }
                    ],
                    "id": "flare.util.math"
                },
                {
                    "name": "Maths",
                    "size": 17705,
                    "id": "flare.util.Maths"
                },
                {
                    "name": "Orientation",
                    "size": 1486,
                    "id": "flare.util.Orientation"
                },
                {
                    "name": "palette",
                    "children": [
                        {
                            "name": "ColorPalette",
                            "size": 6367,
                            "id": "flare.util.palette.ColorPalette"
                        },
                        {
                            "name": "Palette",
                            "size": 1229,
                            "id": "flare.util.palette.Palette"
                        },
                        {
                            "name": "ShapePalette",
                            "size": 2059,
                            "id": "flare.util.palette.ShapePalette"
                        },
                        {
                            "name": "SizePalette",
                            "size": 2291,
                            "id": "flare.util.palette.SizePalette"
                        }
                    ],
                    "id": "flare.util.palette"
                },
                {
                    "name": "Property",
                    "size": 5559,
                    "id": "flare.util.Property"
                },
                {
                    "name": "Shapes",
                    "size": 19118,
                    "id": "flare.util.Shapes"
                },
                {
                    "name": "Sort",
                    "size": 6887,
                    "id": "flare.util.Sort"
                },
                {
                    "name": "Stats",
                    "size": 6557,
                    "id": "flare.util.Stats"
                },
                {
                    "name": "Strings",
                    "size": 22026,
                    "id": "flare.util.Strings"
                }
            ],
            "id": "flare.util"
        },
        {
            "name": "vis",
            "children": [
                {
                    "name": "axis",
                    "children": [
                        {
                            "name": "Axes",
                            "size": 1302,
                            "id": "flare.vis.axis.Axes"
                        },
                        {
                            "name": "Axis",
                            "size": 24593,
                            "id": "flare.vis.axis.Axis"
                        },
                        {
                            "name": "AxisGridLine",
                            "size": 652,
                            "id": "flare.vis.axis.AxisGridLine"
                        },
                        {
                            "name": "AxisLabel",
                            "size": 636,
                            "id": "flare.vis.axis.AxisLabel"
                        },
                        {
                            "name": "CartesianAxes",
                            "size": 6703,
                            "id": "flare.vis.axis.CartesianAxes"
                        }
                    ],
                    "id": "flare.vis.axis"
                },
                {
                    "name": "controls",
                    "children": [
                        {
                            "name": "AnchorControl",
                            "size": 2138,
                            "id": "flare.vis.controls.AnchorControl"
                        },
                        {
                            "name": "ClickControl",
                            "size": 3824,
                            "id": "flare.vis.controls.ClickControl"
                        },
                        {
                            "name": "Control",
                            "size": 1353,
                            "id": "flare.vis.controls.Control"
                        },
                        {
                            "name": "ControlList",
                            "size": 4665,
                            "id": "flare.vis.controls.ControlList"
                        },
                        {
                            "name": "DragControl",
                            "size": 2649,
                            "id": "flare.vis.controls.DragControl"
                        },
                        {
                            "name": "ExpandControl",
                            "size": 2832,
                            "id": "flare.vis.controls.ExpandControl"
                        },
                        {
                            "name": "HoverControl",
                            "size": 4896,
                            "id": "flare.vis.controls.HoverControl"
                        },
                        {
                            "name": "IControl",
                            "size": 763,
                            "id": "flare.vis.controls.IControl"
                        },
                        {
                            "name": "PanZoomControl",
                            "size": 5222,
                            "id": "flare.vis.controls.PanZoomControl"
                        },
                        {
                            "name": "SelectionControl",
                            "size": 7862,
                            "id": "flare.vis.controls.SelectionControl"
                        },
                        {
                            "name": "TooltipControl",
                            "size": 8435,
                            "id": "flare.vis.controls.TooltipControl"
                        }
                    ],
                    "id": "flare.vis.controls"
                },
                {
                    "name": "data",
                    "children": [
                        {
                            "name": "Data",
                            "size": 20544,
                            "id": "flare.vis.data.Data"
                        },
                        {
                            "name": "DataList",
                            "size": 19788,
                            "id": "flare.vis.data.DataList"
                        },
                        {
                            "name": "DataSprite",
                            "size": 10349,
                            "id": "flare.vis.data.DataSprite"
                        },
                        {
                            "name": "EdgeSprite",
                            "size": 3301,
                            "id": "flare.vis.data.EdgeSprite"
                        },
                        {
                            "name": "NodeSprite",
                            "size": 19382,
                            "id": "flare.vis.data.NodeSprite"
                        },
                        {
                            "name": "render",
                            "children": [
                                {
                                    "name": "ArrowType",
                                    "size": 698,
                                    "id": "flare.vis.data.render.ArrowType"
                                },
                                {
                                    "name": "EdgeRenderer",
                                    "size": 5569,
                                    "id": "flare.vis.data.render.EdgeRenderer"
                                },
                                {
                                    "name": "IRenderer",
                                    "size": 353,
                                    "id": "flare.vis.data.render.IRenderer"
                                },
                                {
                                    "name": "ShapeRenderer",
                                    "size": 2247,
                                    "id": "flare.vis.data.render.ShapeRenderer"
                                }
                            ],
                            "id": "flare.vis.data.render"
                        },
                        {
                            "name": "ScaleBinding",
                            "size": 11275,
                            "id": "flare.vis.data.ScaleBinding"
                        },
                        {
                            "name": "Tree",
                            "size": 7147,
                            "id": "flare.vis.data.Tree"
                        },
                        {
                            "name": "TreeBuilder",
                            "size": 9930,
                            "id": "flare.vis.data.TreeBuilder"
                        }
                    ],
                    "id": "flare.vis.data"
                },
                {
                    "name": "events",
                    "children": [
                        {
                            "name": "DataEvent",
                            "size": 2313,
                            "id": "flare.vis.events.DataEvent"
                        },
                        {
                            "name": "SelectionEvent",
                            "size": 1880,
                            "id": "flare.vis.events.SelectionEvent"
                        },
                        {
                            "name": "TooltipEvent",
                            "size": 1701,
                            "id": "flare.vis.events.TooltipEvent"
                        },
                        {
                            "name": "VisualizationEvent",
                            "size": 1117,
                            "id": "flare.vis.events.VisualizationEvent"
                        }
                    ],
                    "id": "flare.vis.events"
                },
                {
                    "name": "legend",
                    "children": [
                        {
                            "name": "Legend",
                            "size": 20859,
                            "id": "flare.vis.legend.Legend"
                        },
                        {
                            "name": "LegendItem",
                            "size": 4614,
                            "id": "flare.vis.legend.LegendItem"
                        },
                        {
                            "name": "LegendRange",
                            "size": 10530,
                            "id": "flare.vis.legend.LegendRange"
                        }
                    ],
                    "id": "flare.vis.legend"
                },
                {
                    "name": "operator",
                    "children": [
                        {
                            "name": "distortion",
                            "children": [
                                {
                                    "name": "BifocalDistortion",
                                    "size": 4461,
                                    "id": "flare.vis.operator.distortion.BifocalDistortion"
                                },
                                {
                                    "name": "Distortion",
                                    "size": 6314,
                                    "id": "flare.vis.operator.distortion.Distortion"
                                },
                                {
                                    "name": "FisheyeDistortion",
                                    "size": 3444,
                                    "id": "flare.vis.operator.distortion.FisheyeDistortion"
                                }
                            ],
                            "id": "flare.vis.operator.distortion"
                        },
                        {
                            "name": "encoder",
                            "children": [
                                {
                                    "name": "ColorEncoder",
                                    "size": 3179,
                                    "id": "flare.vis.operator.encoder.ColorEncoder"
                                },
                                {
                                    "name": "Encoder",
                                    "size": 4060,
                                    "id": "flare.vis.operator.encoder.Encoder"
                                },
                                {
                                    "name": "PropertyEncoder",
                                    "size": 4138,
                                    "id": "flare.vis.operator.encoder.PropertyEncoder"
                                },
                                {
                                    "name": "ShapeEncoder",
                                    "size": 1690,
                                    "id": "flare.vis.operator.encoder.ShapeEncoder"
                                },
                                {
                                    "name": "SizeEncoder",
                                    "size": 1830,
                                    "id": "flare.vis.operator.encoder.SizeEncoder"
                                }
                            ],
                            "id": "flare.vis.operator.encoder"
                        },
                        {
                            "name": "filter",
                            "children": [
                                {
                                    "name": "FisheyeTreeFilter",
                                    "size": 5219,
                                    "id": "flare.vis.operator.filter.FisheyeTreeFilter"
                                },
                                {
                                    "name": "GraphDistanceFilter",
                                    "size": 3165,
                                    "id": "flare.vis.operator.filter.GraphDistanceFilter"
                                },
                                {
                                    "name": "VisibilityFilter",
                                    "size": 3509,
                                    "id": "flare.vis.operator.filter.VisibilityFilter"
                                }
                            ],
                            "id": "flare.vis.operator.filter"
                        },
                        {
                            "name": "IOperator",
                            "size": 1286,
                            "id": "flare.vis.operator.IOperator"
                        },
                        {
                            "name": "label",
                            "children": [
                                {
                                    "name": "Labeler",
                                    "size": 9956,
                                    "id": "flare.vis.operator.label.Labeler"
                                },
                                {
                                    "name": "RadialLabeler",
                                    "size": 3899,
                                    "id": "flare.vis.operator.label.RadialLabeler"
                                },
                                {
                                    "name": "StackedAreaLabeler",
                                    "size": 3202,
                                    "id": "flare.vis.operator.label.StackedAreaLabeler"
                                }
                            ],
                            "id": "flare.vis.operator.label"
                        },
                        {
                            "name": "layout",
                            "children": [
                                {
                                    "name": "AxisLayout",
                                    "size": 6725,
                                    "id": "flare.vis.operator.layout.AxisLayout"
                                },
                                {
                                    "name": "BundledEdgeRouter",
                                    "size": 3727,
                                    "id": "flare.vis.operator.layout.BundledEdgeRouter"
                                },
                                {
                                    "name": "CircleLayout",
                                    "size": 9317,
                                    "id": "flare.vis.operator.layout.CircleLayout"
                                },
                                {
                                    "name": "CirclePackingLayout",
                                    "size": 12003,
                                    "id": "flare.vis.operator.layout.CirclePackingLayout"
                                },
                                {
                                    "name": "DendrogramLayout",
                                    "size": 4853,
                                    "id": "flare.vis.operator.layout.DendrogramLayout"
                                },
                                {
                                    "name": "ForceDirectedLayout",
                                    "size": 8411,
                                    "id": "flare.vis.operator.layout.ForceDirectedLayout"
                                },
                                {
                                    "name": "IcicleTreeLayout",
                                    "size": 4864,
                                    "id": "flare.vis.operator.layout.IcicleTreeLayout"
                                },
                                {
                                    "name": "IndentedTreeLayout",
                                    "size": 3174,
                                    "id": "flare.vis.operator.layout.IndentedTreeLayout"
                                },
                                {
                                    "name": "Layout",
                                    "size": 7881,
                                    "id": "flare.vis.operator.layout.Layout"
                                },
                                {
                                    "name": "NodeLinkTreeLayout",
                                    "size": 12870,
                                    "id": "flare.vis.operator.layout.NodeLinkTreeLayout"
                                },
                                {
                                    "name": "PieLayout",
                                    "size": 2728,
                                    "id": "flare.vis.operator.layout.PieLayout"
                                },
                                {
                                    "name": "RadialTreeLayout",
                                    "size": 12348,
                                    "id": "flare.vis.operator.layout.RadialTreeLayout"
                                },
                                {
                                    "name": "RandomLayout",
                                    "size": 870,
                                    "id": "flare.vis.operator.layout.RandomLayout"
                                },
                                {
                                    "name": "StackedAreaLayout",
                                    "size": 9121,
                                    "id": "flare.vis.operator.layout.StackedAreaLayout"
                                },
                                {
                                    "name": "TreeMapLayout",
                                    "size": 9191,
                                    "id": "flare.vis.operator.layout.TreeMapLayout"
                                }
                            ],
                            "id": "flare.vis.operator.layout"
                        },
                        {
                            "name": "Operator",
                            "size": 2490,
                            "id": "flare.vis.operator.Operator"
                        },
                        {
                            "name": "OperatorList",
                            "size": 5248,
                            "id": "flare.vis.operator.OperatorList"
                        },
                        {
                            "name": "OperatorSequence",
                            "size": 4190,
                            "id": "flare.vis.operator.OperatorSequence"
                        },
                        {
                            "name": "OperatorSwitch",
                            "size": 2581,
                            "id": "flare.vis.operator.OperatorSwitch"
                        },
                        {
                            "name": "SortOperator",
                            "size": 2023,
                            "id": "flare.vis.operator.SortOperator"
                        }
                    ],
                    "id": "flare.vis.operator"
                },
                {
                    "name": "Visualization",
                    "size": 16540,
                    "id": "flare.vis.Visualization"
                }
            ],
            "id": "flare.vis"
        }
    ],
    "id": "flare"
}

export type TreeLayout = "cartesian" | "polar";
export type TreeOrientation = "horizontal" | "vertical";
export type LinkType = "diagonal" | "step" | "curve" | "line" | "elbow";

interface FlowHierarchyProps {
    lineageNode: LineageNode[]
}

export interface sourceType {
    children: sourceType[];
    data: { name: string, children: sourceType, id: string, x0: number, y0: number };
    depth: number;
    height: number;
    parent: sourceType | null;
    x: number;
    y: number;
}

const FlowHierarchy: React.FC<FlowHierarchyProps> = ({ lineageNode }) => {
    const [expandedNodeKeys, setExpandedNodeKeys] = useState<
        Array<string | number>
    >([]);

    // TODO set it in props
    const nodeId = (d: any) => d.id;
    const renderNode = (node: NodeType, onClick: () => any) => {
        return (
            <Node node={node} onClick={onClick} width={192} height={24} />
        )
    }
    const data = dataMock;
    const margin = {
        top: 48, // do not overlap zoom controls by default
        left: 24,
        right: 24,
        bottom: 24
    }
    const nodeWidth = 192 * 1.5
    const nodeHeight = 24 + 16
    const width = 1200 // TODO check the <ParentSize> component
    const height = 800 // TODO check the <ParentSize> component
    //------------------

    const [layout, setLayout] = useState<TreeLayout>("cartesian");
    const [orientation, setOrientation] = useState<TreeOrientation>("horizontal");
    const [linkType, setLinkType] = useState<LinkType>("step");
    const [stepPercent, setStepPercent] = useState<number>(0.5);
    const [layoutSize, setLayoutSize] = useState<"node" | "layout">("node");

    const root = hierarchy(data, (d: any) =>
        expandedNodeKeys.includes(nodeId(d)) ? d.children : null
    );

    let origin: { x: number; y: number };
    let size: [number, number];
    let nodeSize: [number, number] | undefined;

    if (layout === "polar") {
        origin = {
            x: innerWidth / 2 + margin.left,
            y: innerHeight / 2 + margin.top
        };
        size = [2 * Math.PI, Math.min(innerWidth, innerHeight) / 2];
    } else {
        origin = { x: margin.left, y: margin.top };
        if (orientation === "vertical") {
            size = [innerWidth, innerHeight];
            nodeSize =
                layoutSize === "node" && nodeWidth && nodeHeight
                    ? [nodeWidth, nodeHeight]
                    : undefined;
        } else {
            size = [innerHeight, innerWidth];
            nodeSize =
                layoutSize === "node" && nodeWidth && nodeHeight
                    ? [nodeHeight, nodeWidth]
                    : undefined;
        }
    }

    const initialTransform = {
        scaleX: 1,
        scaleY: 1,
        translateX: orientation === "vertical" ? innerWidth / 2 : origin.x,
        translateY: orientation === "vertical" ? origin.y : innerHeight / 2,
        skewX: 0,
        skewY: 0
    };

    return (
        <div>
            <Box
                position="relative"
                bgcolor="rgba(0,0,0,0.05)"
                border={1}
                borderColor="rgba(0,0,0,.1)"
            >
                <Zoom
                    width={width}
                    height={height}
                    scaleXMin={1 / 4}
                    scaleXMax={4}
                    scaleYMin={1 / 4}
                    scaleYMax={4}
                    initialTransformMatrix={initialTransform}
                >
                    {(zoom: any) => (
                        <>
                            <svg
                                width={width}
                                height={height}
                                style={{ cursor: zoom.isDragging ? "grabbing" : "grab" }}
                            >
                                <Tree
                                    root={root}
                                    size={size}
                                    nodeSize={nodeSize}
                                // separation={(a: any, b: any) =>
                                //   (a.parent == b.parent ? 1 : 0.5) / a.depth
                                // }
                                >
                                    {(tree: any) => {
                                        return (
                                            <>
                                                <rect
                                                    width={width}
                                                    height={height}
                                                    fill="transparent"
                                                    onWheel={(event) => {
                                                        event.preventDefault();
                                                        // zoom.handleWheel(event);
                                                    }}
                                                    onMouseDown={zoom.dragStart}
                                                    onMouseMove={zoom.dragMove}
                                                    onMouseUp={zoom.dragEnd}
                                                    onMouseLeave={() => {
                                                        if (!zoom.isDragging) return;
                                                        zoom.dragEnd();
                                                    }}
                                                    onDoubleClick={(event) => {
                                                        if (event.altKey) {
                                                            const point = localPoint(event);
                                                            zoom.scale({ scaleX: 0.5, scaleY: 0.5, point });
                                                        } else {
                                                            const point = localPoint(event);
                                                            zoom.scale({ scaleX: 2.0, scaleY: 2.0, point });
                                                        }
                                                    }}
                                                />

                                                <Group
                                                    // top={origin.y}
                                                    // left={origin.x}
                                                    transform={zoom.toString()}
                                                >
                                                    <AnimatedLinks
                                                        links={tree.links()}
                                                        nodeId={nodeId}
                                                        linkType={linkType}
                                                        layout={layout}
                                                        orientation={orientation}
                                                        stepPercent={stepPercent}
                                                        stroke="#ccc"
                                                    />
                                                    <AnimatedNodes
                                                        nodes={tree.descendants().reverse()} // render parents on top of children
                                                        nodeId={nodeId}
                                                        layout={layout}
                                                        orientation={orientation}
                                                        renderNode={renderNode}
                                                        onNodeClick={(node) => {
                                                            const nodeKey = nodeId(node.data);
                                                            const isExpanded = expandedNodeKeys.includes(
                                                                nodeKey
                                                            );
                                                            if (isExpanded) {
                                                                setExpandedNodeKeys((prevState) =>
                                                                    prevState.filter((key) => key !== nodeKey)
                                                                );
                                                            } else {
                                                                // Probably not good to edit the node directly
                                                                node.data.x0 = node.x;
                                                                node.data.y0 = node.y;

                                                                setExpandedNodeKeys((prevState) => [
                                                                    ...prevState,
                                                                    nodeKey
                                                                ]);
                                                            }
                                                        }}
                                                    />
                                                </Group>
                                            </>
                                        )
                                    }}
                                </Tree>
                            </svg>
                        </>
                    )}
                </Zoom>
            </Box>
        </div>
    )
}

export default FlowHierarchy