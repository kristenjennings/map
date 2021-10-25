/**
 * This file is automatically generated by `yarn generate-classes`.
 * DO NOT MANUALLY EDIT IT OR YOUR CHANGES WILL BE LOST!
 */

import type { Axis } from "./../charts/xy/axes/Axis";
import type { AxisBullet } from "./../charts/xy/axes/AxisBullet";
import type { AxisLabel } from "./../charts/xy/axes/AxisLabel";
import type { AxisLabelRadial } from "./../charts/xy/axes/AxisLabelRadial";
import type { AxisRenderer } from "./../charts/xy/axes/AxisRenderer";
import type { AxisRendererCircular } from "./../charts/radar/AxisRendererCircular";
import type { AxisRendererRadial } from "./../charts/radar/AxisRendererRadial";
import type { AxisRendererX } from "./../charts/xy/axes/AxisRendererX";
import type { AxisRendererY } from "./../charts/xy/axes/AxisRendererY";
import type { AxisTick } from "./../charts/xy/axes/AxisTick";
import type { BaseColumnSeries } from "./../charts/xy/series/BaseColumnSeries";
import type { BreadcrumbBar } from "./../charts/hierarchy/BreadcrumbBar";
import type { Bullet } from "./render/Bullet";
import type { Button } from "./render/Button";
import type { Candlestick } from "./../charts/xy/series/Candlestick";
import type { CandlestickSeries } from "./../charts/xy/series/CandlestickSeries";
import type { CategoryAxis } from "./../charts/xy/axes/CategoryAxis";
import type { CategoryDateAxis } from "./../charts/xy/axes/CategoryDateAxis";
import type { Chart } from "./render/Chart";
import type { Chord } from "./../charts/flow/Chord";
import type { ChordDirected } from "./../charts/flow/ChordDirected";
import type { ChordLink } from "./../charts/flow/ChordLink";
import type { ChordLinkDirected } from "./../charts/flow/ChordLinkDirected";
import type { ChordNodes } from "./../charts/flow/ChordNodes";
import type { ChordNonRibbon } from "./../charts/flow/ChordNonRibbon";
import type { Circle } from "./render/Circle";
import type { CirclePattern } from "./render/patterns/CirclePattern";
import type { ClockHand } from "./../charts/radar/ClockHand";
import type { ColorSet } from "./util/ColorSet";
import type { ColumnSeries } from "./../charts/xy/series/ColumnSeries";
import type { Component } from "./render/Component";
import type { Container } from "./render/Container";
import type { DateAxis } from "./../charts/xy/axes/DateAxis";
import type { DurationAxis } from "./../charts/xy/axes/DurationAxis";
import type { Entity } from "./util/Entity";
import type { Exporting } from "./../plugins/exporting/Exporting";
import type { ExportingMenu } from "./../plugins/exporting/ExportingMenu";
import type { Flow } from "./../charts/flow/Flow";
import type { FlowLink } from "./../charts/flow/FlowLink";
import type { FlowNode } from "./../charts/flow/FlowNode";
import type { FlowNodes } from "./../charts/flow/FlowNodes";
import type { ForceDirected } from "./../charts/hierarchy/ForceDirected";
import type { FunnelSeries } from "./../charts/funnel/FunnelSeries";
import type { FunnelSlice } from "./../charts/funnel/FunnelSlice";
import type { Gradient } from "./render/gradients/Gradient";
import type { Graphics } from "./render/Graphics";
import type { GraticuleSeries } from "./../charts/map/GraticuleSeries";
import type { Grid } from "./../charts/xy/axes/Grid";
import type { GridLayout } from "./render/GridLayout";
import type { HeatLegend } from "./render/HeatLegend";
import type { Hierarchy } from "./../charts/hierarchy/Hierarchy";
import type { HierarchyLink } from "./../charts/hierarchy/HierarchyLink";
import type { HierarchyNode } from "./../charts/hierarchy/HierarchyNode";
import type { HorizontalLayout } from "./render/HorizontalLayout";
import type { InterfaceColors } from "./util/InterfaceColors";
import type { Label } from "./render/Label";
import type { Layout } from "./render/Layout";
import type { Legend } from "./render/Legend";
import type { Line } from "./render/Line";
import type { LinePattern } from "./render/patterns/LinePattern";
import type { LineSeries } from "./../charts/xy/series/LineSeries";
import type { LinearGradient } from "./render/gradients/LinearGradient";
import type { LinkedHierarchy } from "./../charts/hierarchy/LinkedHierarchy";
import type { LinkedHierarchyNode } from "./../charts/hierarchy/LinkedHierarchyNode";
import type { MapChart } from "./../charts/map/MapChart";
import type { MapLine } from "./../charts/map/MapLine";
import type { MapLineSeries } from "./../charts/map/MapLineSeries";
import type { MapPointSeries } from "./../charts/map/MapPointSeries";
import type { MapPolygon } from "./../charts/map/MapPolygon";
import type { MapPolygonSeries } from "./../charts/map/MapPolygonSeries";
import type { MapSeries } from "./../charts/map/MapSeries";
import type { OHLC } from "./../charts/xy/series/OHLC";
import type { OHLCSeries } from "./../charts/xy/series/OHLCSeries";
import type { Pack } from "./../charts/hierarchy/Pack";
import type { Partition } from "./../charts/hierarchy/Partition";
import type { Pattern } from "./render/patterns/Pattern";
import type { PercentChart } from "./../charts/percent/PercentChart";
import type { PercentSeries } from "./../charts/percent/PercentSeries";
import type { PictorialStackedSeries } from "./../charts/funnel/PictorialStackedSeries";
import type { Picture } from "./render/Picture";
import type { PieChart } from "./../charts/pie/PieChart";
import type { PieSeries } from "./../charts/pie/PieSeries";
import type { PointedRectangle } from "./render/PointedRectangle";
import type { PyramidSeries } from "./../charts/funnel/PyramidSeries";
import type { RadarChart } from "./../charts/radar/RadarChart";
import type { RadarColumnSeries } from "./../charts/radar/RadarColumnSeries";
import type { RadarCursor } from "./../charts/radar/RadarCursor";
import type { RadarLineSeries } from "./../charts/radar/RadarLineSeries";
import type { RadialGradient } from "./render/gradients/RadialGradient";
import type { RadialLabel } from "./render/RadialLabel";
import type { RadialText } from "./render/RadialText";
import type { Rectangle } from "./render/Rectangle";
import type { RectanglePattern } from "./render/patterns/RectanglePattern";
import type { RoundedRectangle } from "./render/RoundedRectangle";
import type { Sankey } from "./../charts/flow/Sankey";
import type { SankeyLink } from "./../charts/flow/SankeyLink";
import type { SankeyNodes } from "./../charts/flow/SankeyNodes";
import type { Scrollbar } from "./render/Scrollbar";
import type { SerialChart } from "./render/SerialChart";
import type { Series } from "./render/Series";
import type { Slice } from "./render/Slice";
import type { SlicedChart } from "./../charts/funnel/SlicedChart";
import type { Slider } from "./render/Slider";
import type { SmoothedRadarLineSeries } from "./../charts/radar/SmoothedRadarLineSeries";
import type { SmoothedXLineSeries } from "./../charts/xy/series/SmoothedXLineSeries";
import type { SmoothedXYLineSeries } from "./../charts/xy/series/SmoothedXYLineSeries";
import type { SmoothedYLineSeries } from "./../charts/xy/series/SmoothedYLineSeries";
import type { Sprite } from "./render/Sprite";
import type { Star } from "./render/Star";
import type { StepLineSeries } from "./../charts/xy/series/StepLineSeries";
import type { Sunburst } from "./../charts/hierarchy/Sunburst";
import type { Text } from "./render/Text";
import type { Tick } from "./render/Tick";
import type { Tooltip } from "./render/Tooltip";
import type { Tree } from "./../charts/hierarchy/Tree";
import type { Treemap } from "./../charts/hierarchy/Treemap";
import type { ValueAxis } from "./../charts/xy/axes/ValueAxis";
import type { VerticalLayout } from "./render/VerticalLayout";
import type { XYChart } from "./../charts/xy/XYChart";
import type { XYChartScrollbar } from "./../charts/xy/XYChartScrollbar";
import type { XYCursor } from "./../charts/xy/XYCursor";
import type { XYSeries } from "./../charts/xy/series/XYSeries";
import type { Venn } from "./../charts/venn/Venn";
import type { WordCloud } from "./../charts/wordcloud/WordCloud";
import type { ZoomControl } from "./../charts/map/ZoomControl";

export interface IClasses {
	"Axis": Axis<AxisRenderer>;
	"AxisBullet": AxisBullet;
	"AxisLabel": AxisLabel;
	"AxisLabelRadial": AxisLabelRadial;
	"AxisRenderer": AxisRenderer;
	"AxisRendererCircular": AxisRendererCircular;
	"AxisRendererRadial": AxisRendererRadial;
	"AxisRendererX": AxisRendererX;
	"AxisRendererY": AxisRendererY;
	"AxisTick": AxisTick;
	"BaseColumnSeries": BaseColumnSeries;
	"BreadcrumbBar": BreadcrumbBar;
	"Bullet": Bullet;
	"Button": Button;
	"Candlestick": Candlestick;
	"CandlestickSeries": CandlestickSeries;
	"CategoryAxis": CategoryAxis<AxisRenderer>;
	"CategoryDateAxis": CategoryDateAxis<AxisRenderer>;
	"Chart": Chart;
	"Chord": Chord;
	"ChordDirected": ChordDirected;
	"ChordLink": ChordLink;
	"ChordLinkDirected": ChordLinkDirected;
	"ChordNodes": ChordNodes;
	"ChordNonRibbon": ChordNonRibbon;
	"Circle": Circle;
	"CirclePattern": CirclePattern;
	"ClockHand": ClockHand;
	"ColorSet": ColorSet;
	"ColumnSeries": ColumnSeries;
	"Component": Component;
	"Container": Container;
	"DateAxis": DateAxis<AxisRenderer>;
	"DurationAxis": DurationAxis<AxisRenderer>;
	"Entity": Entity;
	"Exporting": Exporting;
	"ExportingMenu": ExportingMenu;
	"Flow": Flow;
	"FlowLink": FlowLink;
	"FlowNode": FlowNode;
	"FlowNodes": FlowNodes;
	"ForceDirected": ForceDirected;
	"FunnelSeries": FunnelSeries;
	"FunnelSlice": FunnelSlice;
	"Gradient": Gradient;
	"Graphics": Graphics;
	"GraticuleSeries": GraticuleSeries;
	"Grid": Grid;
	"GridLayout": GridLayout;
	"HeatLegend": HeatLegend;
	"Hierarchy": Hierarchy;
	"HierarchyLink": HierarchyLink;
	"HierarchyNode": HierarchyNode;
	"HorizontalLayout": HorizontalLayout;
	"InterfaceColors": InterfaceColors;
	"Label": Label;
	"Layout": Layout;
	"Legend": Legend;
	"Line": Line;
	"LinePattern": LinePattern;
	"LineSeries": LineSeries;
	"LinearGradient": LinearGradient;
	"LinkedHierarchy": LinkedHierarchy;
	"LinkedHierarchyNode": LinkedHierarchyNode;
	"MapChart": MapChart;
	"MapLine": MapLine;
	"MapLineSeries": MapLineSeries;
	"MapPointSeries": MapPointSeries;
	"MapPolygon": MapPolygon;
	"MapPolygonSeries": MapPolygonSeries;
	"MapSeries": MapSeries;
	"OHLC": OHLC;
	"OHLCSeries": OHLCSeries;
	"Pack": Pack;
	"Partition": Partition;
	"Pattern": Pattern;
	"PercentChart": PercentChart;
	"PercentSeries": PercentSeries;
	"PictorialStackedSeries": PictorialStackedSeries;
	"Picture": Picture;
	"PieChart": PieChart;
	"PieSeries": PieSeries;
	"PointedRectangle": PointedRectangle;
	"PyramidSeries": PyramidSeries;
	"RadarChart": RadarChart;
	"RadarColumnSeries": RadarColumnSeries;
	"RadarCursor": RadarCursor;
	"RadarLineSeries": RadarLineSeries;
	"RadialGradient": RadialGradient;
	"RadialLabel": RadialLabel;
	"RadialText": RadialText;
	"Rectangle": Rectangle;
	"RectanglePattern": RectanglePattern;
	"RoundedRectangle": RoundedRectangle;
	"Sankey": Sankey;
	"SankeyLink": SankeyLink;
	"SankeyNodes": SankeyNodes;
	"Scrollbar": Scrollbar;
	"SerialChart": SerialChart;
	"Series": Series;
	"Slice": Slice;
	"SlicedChart": SlicedChart;
	"Slider": Slider;
	"SmoothedRadarLineSeries": SmoothedRadarLineSeries;
	"SmoothedXLineSeries": SmoothedXLineSeries;
	"SmoothedXYLineSeries": SmoothedXYLineSeries;
	"SmoothedYLineSeries": SmoothedYLineSeries;
	"Sprite": Sprite;
	"Star": Star;
	"StepLineSeries": StepLineSeries;
	"Sunburst": Sunburst;
	"Text": Text;
	"Tick": Tick;
	"Tooltip": Tooltip;
	"Tree": Tree;
	"Treemap": Treemap;
	"ValueAxis": ValueAxis<AxisRenderer>;
	"VerticalLayout": VerticalLayout;
	"XYChart": XYChart;
	"XYChartScrollbar": XYChartScrollbar;
	"XYCursor": XYCursor;
	"XYSeries": XYSeries;
	"Venn": Venn;
	"WordCloud": WordCloud;
	"ZoomControl": ZoomControl;
}
